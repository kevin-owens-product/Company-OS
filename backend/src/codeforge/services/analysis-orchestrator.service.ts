import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AnalysisService } from './analysis.service';
import { FindingService } from './finding.service';
import { RepositoryService } from './repository.service';
import { CodebaseService } from './codebase.service';
import { GitService } from './git.service';
import { AiAnalysisService } from './ai-analysis.service';
import { Analysis, AnalysisStatus, AnalysisType } from '../entities/analysis.entity';
import { CodebaseStatus } from '../entities/codebase.entity';
import { RepositoryStatus } from '../entities/repository.entity';

export interface AnalysisProgress {
  analysisId: string;
  status: AnalysisStatus;
  progress: number;
  currentStep: string;
  message?: string;
}

@Injectable()
export class AnalysisOrchestratorService {
  private readonly logger = new Logger(AnalysisOrchestratorService.name);

  constructor(
    private readonly analysisService: AnalysisService,
    private readonly findingService: FindingService,
    private readonly repositoryService: RepositoryService,
    private readonly codebaseService: CodebaseService,
    private readonly gitService: GitService,
    private readonly aiAnalysisService: AiAnalysisService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async runAnalysis(analysisId: string): Promise<void> {
    const analysis = await this.analysisService.findOne(analysisId);
    const codebaseId = analysis.codebaseId;

    try {
      // Start analysis
      await this.analysisService.start(analysisId);
      await this.codebaseService.updateStatus(codebaseId, CodebaseStatus.ANALYZING);
      this.emitProgress(analysisId, AnalysisStatus.RUNNING, 5, 'Starting analysis...');

      // Get repositories to analyze
      const repositories = await this.repositoryService.findAllByCodebase(codebaseId);
      const targetRepos = analysis.config?.targetRepositories?.length
        ? repositories.filter((r) => analysis.config.targetRepositories.includes(r.id))
        : repositories;

      if (targetRepos.length === 0) {
        throw new Error('No repositories to analyze');
      }

      let totalFindings = 0;
      let totalFiles = 0;
      const allFindingsBySeverity: Record<string, number> = {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        info: 0,
      };
      const allFindingsByCategory: Record<string, number> = {};
      let aggregatedScores = { security: 0, maintainability: 0, techDebt: 0 };

      // Process each repository
      for (let i = 0; i < targetRepos.length; i++) {
        const repo = targetRepos[i];
        const repoProgress = 10 + Math.floor((i / targetRepos.length) * 80);

        this.emitProgress(
          analysisId,
          AnalysisStatus.RUNNING,
          repoProgress,
          `Analyzing repository: ${repo.name}`,
        );

        // Clone repository
        this.logger.log(`Cloning repository ${repo.name}...`);
        await this.repositoryService.updateStatus(repo.id, RepositoryStatus.CLONING);

        const cloneResult = await this.gitService.cloneRepository(repo);
        if (!cloneResult.success) {
          this.logger.error(`Failed to clone ${repo.name}: ${cloneResult.error}`);
          await this.repositoryService.updateStatus(repo.id, RepositoryStatus.ERROR);
          continue;
        }

        await this.repositoryService.updateStatus(repo.id, RepositoryStatus.READY);
        await this.repositoryService.updateMetadata(repo.id, {
          lastCommit: cloneResult.commitHash,
          lastCommitDate: cloneResult.commitDate,
        });

        // Scan files
        this.logger.log(`Scanning files in ${repo.name}...`);
        const scanResult = await this.gitService.scanRepository(
          cloneResult.localPath!,
          repo.analysisConfig?.maxFileSize,
        );

        await this.repositoryService.updateMetadata(repo.id, {
          totalFiles: scanResult.totalFiles,
          totalLines: scanResult.totalLines,
          languages: scanResult.languages,
        });

        totalFiles += scanResult.totalFiles;

        // Run AI analysis
        this.logger.log(`Running AI analysis on ${repo.name} (${scanResult.files.length} files)...`);
        this.emitProgress(
          analysisId,
          AnalysisStatus.RUNNING,
          repoProgress + 5,
          `AI analyzing: ${repo.name}`,
        );

        const analysisResult = await this.aiAnalysisService.analyzeCode(
          scanResult.files,
          analysis.type,
          repo.id,
          analysisId,
        );

        // Save findings
        if (analysisResult.findings.length > 0) {
          await this.findingService.createBatch(analysisResult.findings as any);
          totalFindings += analysisResult.findings.length;

          // Aggregate severity counts
          for (const finding of analysisResult.findings) {
            if (finding.severity) {
              allFindingsBySeverity[finding.severity] =
                (allFindingsBySeverity[finding.severity] || 0) + 1;
            }
            if (finding.category) {
              allFindingsByCategory[finding.category] =
                (allFindingsByCategory[finding.category] || 0) + 1;
            }
          }
        }

        // Aggregate scores
        aggregatedScores.security += analysisResult.scores.security;
        aggregatedScores.maintainability += analysisResult.scores.maintainability;
        aggregatedScores.techDebt += analysisResult.scores.techDebt;

        // Cleanup
        await this.gitService.cleanup(cloneResult.localPath!);
      }

      // Calculate average scores
      const repoCount = targetRepos.length;
      const avgScores = {
        securityScore: Math.round(aggregatedScores.security / repoCount),
        maintainabilityScore: Math.round(aggregatedScores.maintainability / repoCount),
        techDebtScore: Math.round(aggregatedScores.techDebt / repoCount),
      };

      // Generate final summary
      const summaryData = await this.generateFinalSummary(
        totalFindings,
        allFindingsBySeverity,
        allFindingsByCategory,
        avgScores,
      );

      // Complete analysis
      this.emitProgress(analysisId, AnalysisStatus.RUNNING, 95, 'Finalizing results...');

      await this.analysisService.complete(
        analysisId,
        {
          filesAnalyzed: totalFiles,
          findingsCount: totalFindings,
          findingsBySeverity: allFindingsBySeverity as any,
          findingsByCategory: allFindingsByCategory,
          ...avgScores,
        },
        summaryData,
      );

      await this.codebaseService.updateStatus(codebaseId, CodebaseStatus.READY);
      await this.codebaseService.updateMetadata(codebaseId, {
        lastAnalysisAt: new Date(),
      });

      this.emitProgress(analysisId, AnalysisStatus.COMPLETED, 100, 'Analysis complete');
      this.logger.log(`Analysis ${analysisId} completed with ${totalFindings} findings`);
    } catch (error) {
      this.logger.error(`Analysis ${analysisId} failed: ${error.message}`);
      await this.analysisService.fail(analysisId, error.message);
      await this.codebaseService.updateStatus(codebaseId, CodebaseStatus.READY);
      this.emitProgress(analysisId, AnalysisStatus.FAILED, 0, error.message);
    }
  }

  private async generateFinalSummary(
    totalFindings: number,
    severityCounts: Record<string, number>,
    categoryCounts: Record<string, number>,
    scores: { securityScore: number; maintainabilityScore: number; techDebtScore: number },
  ): Promise<Analysis['summary']> {
    const criticalCount = severityCounts['critical'] || 0;
    const highCount = severityCounts['high'] || 0;

    let overview = '';
    if (criticalCount > 0) {
      overview = `Found ${criticalCount} critical and ${highCount} high severity issues requiring immediate attention. `;
    } else if (highCount > 0) {
      overview = `Found ${highCount} high severity issues that should be addressed soon. `;
    } else {
      overview = `No critical issues found. `;
    }
    overview += `Total of ${totalFindings} findings across all categories.`;

    const keyFindings: string[] = [];
    if (severityCounts['critical'] > 0) {
      keyFindings.push(`${severityCounts['critical']} critical security/code issues`);
    }
    if (categoryCounts['security'] > 0) {
      keyFindings.push(`${categoryCounts['security']} security vulnerabilities detected`);
    }
    if (categoryCounts['technical_debt'] > 0) {
      keyFindings.push(`${categoryCounts['technical_debt']} technical debt items`);
    }
    if (categoryCounts['dead_code'] > 0) {
      keyFindings.push(`${categoryCounts['dead_code']} dead code instances`);
    }
    if (scores.securityScore < 70) {
      keyFindings.push(`Security score of ${scores.securityScore}/100 needs improvement`);
    }

    const recommendations: string[] = [];
    if (severityCounts['critical'] > 0) {
      recommendations.push('Address all critical issues immediately');
    }
    if (categoryCounts['security'] > 0) {
      recommendations.push('Review and fix security vulnerabilities');
    }
    if (categoryCounts['dependency'] > 0) {
      recommendations.push('Update vulnerable dependencies');
    }
    if (categoryCounts['dead_code'] > 0) {
      recommendations.push('Remove dead code to reduce maintenance burden');
    }
    if (scores.maintainabilityScore < 70) {
      recommendations.push('Refactor to improve code maintainability');
    }

    // Estimate effort
    let estimatedEffort = '1-2 days';
    if (totalFindings > 100 || criticalCount > 10) {
      estimatedEffort = '2-4 weeks';
    } else if (totalFindings > 50 || criticalCount > 5) {
      estimatedEffort = '1-2 weeks';
    } else if (totalFindings > 20) {
      estimatedEffort = '3-5 days';
    }

    return {
      overview,
      keyFindings: keyFindings.slice(0, 5),
      recommendations: recommendations.slice(0, 5),
      estimatedEffort,
    };
  }

  private emitProgress(
    analysisId: string,
    status: AnalysisStatus,
    progress: number,
    message: string,
  ): void {
    const progressData: AnalysisProgress = {
      analysisId,
      status,
      progress,
      currentStep: message,
      message,
    };

    this.eventEmitter.emit('analysis.progress', progressData);
    this.logger.debug(`Analysis ${analysisId}: ${progress}% - ${message}`);
  }
}
