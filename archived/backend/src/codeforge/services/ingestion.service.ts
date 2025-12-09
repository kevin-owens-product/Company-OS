import { Injectable, Logger } from '@nestjs/common';
import { RepositoryService } from './repository.service';
import { CodebaseService } from './codebase.service';
import { GitService } from './git.service';
import { Repository, RepositoryProvider, RepositoryStatus } from '../entities/repository.entity';
import { CodebaseStatus } from '../entities/codebase.entity';

export interface IngestionResult {
  success: boolean;
  repositoryId: string;
  filesCount?: number;
  linesCount?: number;
  languages?: { [key: string]: number };
  error?: string;
}

export interface GitHubIngestionConfig {
  owner: string;
  repo: string;
  branch?: string;
  token: string;
}

export interface GitLabIngestionConfig {
  projectId: string;
  branch?: string;
  token: string;
}

@Injectable()
export class IngestionService {
  private readonly logger = new Logger(IngestionService.name);

  constructor(
    private readonly repositoryService: RepositoryService,
    private readonly codebaseService: CodebaseService,
    private readonly gitService: GitService,
  ) {}

  async ingestFromGitHub(
    codebaseId: string,
    config: GitHubIngestionConfig,
  ): Promise<IngestionResult> {
    const remoteUrl = `https://github.com/${config.owner}/${config.repo}.git`;

    try {
      // Create or update repository record
      let repository = await this.repositoryService.findByRemoteUrl(remoteUrl, codebaseId);

      if (!repository) {
        repository = await this.repositoryService.create({
          name: config.repo,
          description: `GitHub repository: ${config.owner}/${config.repo}`,
          provider: RepositoryProvider.GITHUB,
          remoteUrl,
          branch: config.branch || 'main',
          codebaseId,
          credentials: {
            type: 'token',
            encryptedValue: this.encryptCredential(config.token),
          },
        });
      }

      await this.repositoryService.updateStatus(repository.id, RepositoryStatus.CLONING);
      await this.codebaseService.updateStatus(codebaseId, CodebaseStatus.INGESTING);

      // Actually clone and scan the repository
      const result = await this.performIngestion(repository);

      if (!result.success) {
        await this.repositoryService.updateStatus(repository.id, RepositoryStatus.ERROR);
        await this.codebaseService.updateStatus(codebaseId, CodebaseStatus.ERROR);
        return {
          success: false,
          repositoryId: repository.id,
          error: result.error,
        };
      }

      await this.repositoryService.updateStatus(repository.id, RepositoryStatus.READY);
      await this.repositoryService.updateMetadata(repository.id, {
        totalFiles: result.filesCount,
        totalLines: result.linesCount,
        languages: result.languages,
        lastCommit: result.commitHash,
        lastCommitDate: result.commitDate,
      });

      await this.codebaseService.updateStatus(codebaseId, CodebaseStatus.READY);
      await this.codebaseService.updateMetadata(codebaseId, {
        totalFiles: result.filesCount,
        totalLines: result.linesCount,
        languages: result.languages,
        lastIngestionAt: new Date(),
      });

      return {
        success: true,
        repositoryId: repository.id,
        filesCount: result.filesCount,
        linesCount: result.linesCount,
        languages: result.languages,
      };
    } catch (error) {
      this.logger.error(`Ingestion failed for ${remoteUrl}:`, error);
      await this.codebaseService.updateStatus(codebaseId, CodebaseStatus.ERROR);
      return {
        success: false,
        repositoryId: '',
        error: error.message,
      };
    }
  }

  async ingestFromGitLab(
    codebaseId: string,
    config: GitLabIngestionConfig,
  ): Promise<IngestionResult> {
    const remoteUrl = `https://gitlab.com/${config.projectId}.git`;

    try {
      // Create or update repository record
      let repository = await this.repositoryService.findByRemoteUrl(remoteUrl, codebaseId);

      if (!repository) {
        repository = await this.repositoryService.create({
          name: config.projectId.split('/').pop() || config.projectId,
          description: `GitLab repository: ${config.projectId}`,
          provider: RepositoryProvider.GITLAB,
          remoteUrl,
          branch: config.branch || 'main',
          codebaseId,
          credentials: {
            type: 'token',
            encryptedValue: this.encryptCredential(config.token),
          },
        });
      }

      await this.repositoryService.updateStatus(repository.id, RepositoryStatus.CLONING);
      await this.codebaseService.updateStatus(codebaseId, CodebaseStatus.INGESTING);

      // Actually clone and scan the repository
      const result = await this.performIngestion(repository);

      if (!result.success) {
        await this.repositoryService.updateStatus(repository.id, RepositoryStatus.ERROR);
        await this.codebaseService.updateStatus(codebaseId, CodebaseStatus.ERROR);
        return {
          success: false,
          repositoryId: repository.id,
          error: result.error,
        };
      }

      await this.repositoryService.updateStatus(repository.id, RepositoryStatus.READY);
      await this.repositoryService.updateMetadata(repository.id, {
        totalFiles: result.filesCount,
        totalLines: result.linesCount,
        languages: result.languages,
        lastCommit: result.commitHash,
        lastCommitDate: result.commitDate,
      });

      await this.codebaseService.updateStatus(codebaseId, CodebaseStatus.READY);

      return {
        success: true,
        repositoryId: repository.id,
        filesCount: result.filesCount,
        linesCount: result.linesCount,
        languages: result.languages,
      };
    } catch (error) {
      this.logger.error(`GitLab ingestion failed for ${config.projectId}:`, error);
      return {
        success: false,
        repositoryId: '',
        error: error.message,
      };
    }
  }

  async ingestFromLocalPath(
    codebaseId: string,
    localPath: string,
    name: string,
  ): Promise<IngestionResult> {
    try {
      const repository = await this.repositoryService.create({
        name,
        description: `Local repository from: ${localPath}`,
        provider: RepositoryProvider.LOCAL,
        remoteUrl: localPath,
        branch: 'local',
        codebaseId,
      });

      await this.repositoryService.updateStatus(repository.id, RepositoryStatus.CLONING);

      // Scan the local directory directly
      this.logger.log(`Scanning local repository at ${localPath}`);
      const scanResult = await this.gitService.scanRepository(localPath);

      await this.repositoryService.updateStatus(repository.id, RepositoryStatus.READY);
      await this.repositoryService.updateMetadata(repository.id, {
        totalFiles: scanResult.totalFiles,
        totalLines: scanResult.totalLines,
        languages: scanResult.languages,
      });

      return {
        success: true,
        repositoryId: repository.id,
        filesCount: scanResult.totalFiles,
        linesCount: scanResult.totalLines,
        languages: scanResult.languages,
      };
    } catch (error) {
      this.logger.error(`Local ingestion failed for ${localPath}:`, error);
      return {
        success: false,
        repositoryId: '',
        error: error.message,
      };
    }
  }

  async refreshRepository(repositoryId: string): Promise<IngestionResult> {
    const repository = await this.repositoryService.findOne(repositoryId);

    await this.repositoryService.updateStatus(repositoryId, RepositoryStatus.CLONING);

    const result = await this.performIngestion(repository);

    if (!result.success) {
      await this.repositoryService.updateStatus(repositoryId, RepositoryStatus.ERROR);
      return {
        success: false,
        repositoryId,
        error: result.error,
      };
    }

    await this.repositoryService.updateStatus(repositoryId, RepositoryStatus.READY);
    await this.repositoryService.updateMetadata(repositoryId, {
      totalFiles: result.filesCount,
      totalLines: result.linesCount,
      languages: result.languages,
      lastCommit: result.commitHash,
      lastCommitDate: result.commitDate,
    });

    return {
      success: true,
      repositoryId,
      filesCount: result.filesCount,
      linesCount: result.linesCount,
      languages: result.languages,
    };
  }

  private async performIngestion(repository: Repository): Promise<{
    success: boolean;
    filesCount?: number;
    linesCount?: number;
    languages?: { [key: string]: number };
    commitHash?: string;
    commitDate?: Date;
    error?: string;
  }> {
    let localPath: string | undefined;

    try {
      // Clone the repository
      this.logger.log(`Cloning repository ${repository.remoteUrl}`);
      const cloneResult = await this.gitService.cloneRepository(repository);

      if (!cloneResult.success) {
        this.logger.error(`Clone failed: ${cloneResult.error}`);
        return {
          success: false,
          error: cloneResult.error,
        };
      }

      localPath = cloneResult.localPath;
      this.logger.log(`Repository cloned to ${localPath}`);

      // Scan the repository
      this.logger.log(`Scanning repository at ${localPath}`);
      const scanResult = await this.gitService.scanRepository(localPath!);
      this.logger.log(`Scan complete: ${scanResult.totalFiles} files, ${scanResult.totalLines} lines`);

      return {
        success: true,
        filesCount: scanResult.totalFiles,
        linesCount: scanResult.totalLines,
        languages: scanResult.languages,
        commitHash: cloneResult.commitHash,
        commitDate: cloneResult.commitDate,
      };
    } catch (error) {
      this.logger.error(`Ingestion error: ${error.message}`);
      return {
        success: false,
        error: error.message,
      };
    } finally {
      // Always cleanup
      if (localPath) {
        await this.gitService.cleanup(localPath);
      }
    }
  }

  private encryptCredential(value: string): string {
    // TODO: Implement proper encryption using a secret management service
    // For now, return base64 encoded value (NOT SECURE - for demo only)
    return Buffer.from(value).toString('base64');
  }

  private decryptCredential(encrypted: string): string {
    // TODO: Implement proper decryption
    return Buffer.from(encrypted, 'base64').toString('utf-8');
  }
}
