import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { Repository, RepositoryProvider, RepositoryStatus } from '../entities/repository.entity';
import { CodeFile } from './ai-analysis.service';

const execAsync = promisify(exec);

export interface CloneResult {
  success: boolean;
  localPath?: string;
  error?: string;
  commitHash?: string;
  commitDate?: Date;
}

export interface ScanResult {
  files: CodeFile[];
  totalFiles: number;
  totalLines: number;
  languages: Record<string, number>;
}

@Injectable()
export class GitService {
  private readonly logger = new Logger(GitService.name);
  private readonly workDir: string;

  // Language detection by file extension
  private readonly languageMap: Record<string, string> = {
    '.ts': 'typescript',
    '.tsx': 'typescript',
    '.js': 'javascript',
    '.jsx': 'javascript',
    '.py': 'python',
    '.java': 'java',
    '.kt': 'kotlin',
    '.go': 'go',
    '.rs': 'rust',
    '.rb': 'ruby',
    '.php': 'php',
    '.cs': 'csharp',
    '.cpp': 'cpp',
    '.c': 'c',
    '.h': 'c',
    '.hpp': 'cpp',
    '.swift': 'swift',
    '.scala': 'scala',
    '.sql': 'sql',
    '.sh': 'bash',
    '.bash': 'bash',
    '.yml': 'yaml',
    '.yaml': 'yaml',
    '.json': 'json',
    '.xml': 'xml',
    '.html': 'html',
    '.css': 'css',
    '.scss': 'scss',
    '.sass': 'sass',
    '.less': 'less',
    '.md': 'markdown',
    '.dockerfile': 'dockerfile',
    '.tf': 'terraform',
    '.vue': 'vue',
    '.svelte': 'svelte',
  };

  // Files/directories to skip
  private readonly skipPatterns = [
    'node_modules',
    '.git',
    'dist',
    'build',
    'out',
    '.next',
    '__pycache__',
    '.pytest_cache',
    'venv',
    '.venv',
    'vendor',
    'target',
    '.idea',
    '.vscode',
    '*.min.js',
    '*.min.css',
    '*.map',
    '*.lock',
    'package-lock.json',
    'yarn.lock',
    'pnpm-lock.yaml',
    '*.png',
    '*.jpg',
    '*.jpeg',
    '*.gif',
    '*.ico',
    '*.svg',
    '*.woff',
    '*.woff2',
    '*.ttf',
    '*.eot',
    '*.pdf',
    '*.zip',
    '*.tar',
    '*.gz',
  ];

  constructor(private configService: ConfigService) {
    this.workDir = this.configService.get<string>('GIT_WORK_DIR') || '/tmp/codeforge-repos';
  }

  async cloneRepository(repository: Repository): Promise<CloneResult> {
    const repoDir = path.join(this.workDir, repository.id);

    try {
      // Create work directory if it doesn't exist
      await fs.mkdir(this.workDir, { recursive: true });

      // Remove existing directory if present
      try {
        await fs.rm(repoDir, { recursive: true, force: true });
      } catch {
        // Directory might not exist
      }

      // Build clone command with authentication
      const cloneUrl = this.buildAuthenticatedUrl(repository);
      const branch = repository.branch || 'main';

      this.logger.log(`Cloning ${repository.remoteUrl} to ${repoDir}`);

      await execAsync(`git clone --depth 1 --branch ${branch} ${cloneUrl} ${repoDir}`, {
        timeout: 300000, // 5 minutes
      });

      // Get latest commit info
      const { stdout: commitHash } = await execAsync('git rev-parse HEAD', { cwd: repoDir });
      const { stdout: commitDateStr } = await execAsync('git log -1 --format=%ci', { cwd: repoDir });

      return {
        success: true,
        localPath: repoDir,
        commitHash: commitHash.trim(),
        commitDate: new Date(commitDateStr.trim()),
      };
    } catch (error) {
      this.logger.error(`Clone failed for ${repository.remoteUrl}: ${error.message}`);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async scanRepository(localPath: string, maxFileSize: number = 100000): Promise<ScanResult> {
    const files: CodeFile[] = [];
    let totalFiles = 0;
    let totalLines = 0;
    const languageLines: Record<string, number> = {};

    await this.scanDirectory(localPath, localPath, files, maxFileSize, languageLines);

    for (const file of files) {
      totalFiles++;
      const lines = file.content.split('\n').length;
      totalLines += lines;
    }

    // Calculate language percentages
    const languages: Record<string, number> = {};
    for (const [lang, lines] of Object.entries(languageLines)) {
      languages[lang] = Math.round((lines / totalLines) * 100);
    }

    return {
      files,
      totalFiles,
      totalLines,
      languages,
    };
  }

  private async scanDirectory(
    basePath: string,
    currentPath: string,
    files: CodeFile[],
    maxFileSize: number,
    languageLines: Record<string, number>,
  ): Promise<void> {
    const entries = await fs.readdir(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);
      const relativePath = path.relative(basePath, fullPath);

      // Skip patterns
      if (this.shouldSkip(entry.name, relativePath)) {
        continue;
      }

      if (entry.isDirectory()) {
        await this.scanDirectory(basePath, fullPath, files, maxFileSize, languageLines);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        const language = this.languageMap[ext];

        if (language) {
          try {
            const stat = await fs.stat(fullPath);
            if (stat.size <= maxFileSize) {
              const content = await fs.readFile(fullPath, 'utf-8');
              const lines = content.split('\n').length;

              files.push({
                path: relativePath,
                content,
                language,
                size: stat.size,
              });

              languageLines[language] = (languageLines[language] || 0) + lines;
            }
          } catch (error) {
            this.logger.warn(`Could not read file ${fullPath}: ${error.message}`);
          }
        }
      }
    }
  }

  private shouldSkip(name: string, relativePath: string): boolean {
    for (const pattern of this.skipPatterns) {
      if (pattern.startsWith('*')) {
        // Wildcard pattern
        const ext = pattern.substring(1);
        if (name.endsWith(ext)) return true;
      } else if (name === pattern || relativePath.includes(pattern)) {
        return true;
      }
    }
    return false;
  }

  private buildAuthenticatedUrl(repository: Repository): string {
    if (!repository.credentials) {
      return repository.remoteUrl;
    }

    const url = new URL(repository.remoteUrl);
    const token = this.decryptCredential(repository.credentials.encryptedValue);

    switch (repository.provider) {
      case RepositoryProvider.GITHUB:
      case RepositoryProvider.GITLAB:
      case RepositoryProvider.BITBUCKET:
        url.username = 'oauth2';
        url.password = token;
        break;
      case RepositoryProvider.AZURE_DEVOPS:
        url.username = '';
        url.password = token;
        break;
      default:
        // For other providers, try basic auth
        if (repository.credentials.type === 'basic') {
          const [username, password] = token.split(':');
          url.username = username;
          url.password = password;
        }
    }

    return url.toString();
  }

  private decryptCredential(encrypted: string): string {
    // TODO: Implement proper decryption with a secret management service
    // For now, decode base64
    return Buffer.from(encrypted, 'base64').toString('utf-8');
  }

  async cleanup(localPath: string): Promise<void> {
    try {
      await fs.rm(localPath, { recursive: true, force: true });
    } catch (error) {
      this.logger.warn(`Failed to cleanup ${localPath}: ${error.message}`);
    }
  }

  async pullLatest(localPath: string): Promise<CloneResult> {
    try {
      await execAsync('git fetch origin && git reset --hard origin/HEAD', {
        cwd: localPath,
        timeout: 60000,
      });

      const { stdout: commitHash } = await execAsync('git rev-parse HEAD', { cwd: localPath });
      const { stdout: commitDateStr } = await execAsync('git log -1 --format=%ci', { cwd: localPath });

      return {
        success: true,
        localPath,
        commitHash: commitHash.trim(),
        commitDate: new Date(commitDateStr.trim()),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}
