import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import { Finding, FindingSeverity, FindingCategory } from '../entities/finding.entity';
import { Analysis, AnalysisType } from '../entities/analysis.entity';

export interface CodeFile {
  path: string;
  content: string;
  language: string;
  size: number;
}

export interface AnalysisResult {
  findings: Partial<Finding>[];
  summary: {
    overview: string;
    keyFindings: string[];
    recommendations: string[];
    estimatedEffort: string;
  };
  scores: {
    security: number;
    maintainability: number;
    techDebt: number;
  };
  languages: Record<string, number>;
}

@Injectable()
export class AiAnalysisService {
  private readonly logger = new Logger(AiAnalysisService.name);
  private anthropic: Anthropic;

  constructor(private configService: ConfigService) {
    this.anthropic = new Anthropic({
      apiKey: this.configService.get<string>('ANTHROPIC_API_KEY'),
    });
  }

  async analyzeCode(
    files: CodeFile[],
    analysisType: AnalysisType,
    repositoryId: string,
    analysisId: string,
  ): Promise<AnalysisResult> {
    const findings: Partial<Finding>[] = [];
    let totalLines = 0;
    const languageLines: Record<string, number> = {};

    // Process files in batches to avoid token limits
    const batchSize = 10;
    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      const batchFindings = await this.analyzeBatch(batch, analysisType, repositoryId, analysisId);
      findings.push(...batchFindings);

      // Track language stats
      for (const file of batch) {
        const lines = file.content.split('\n').length;
        totalLines += lines;
        languageLines[file.language] = (languageLines[file.language] || 0) + lines;
      }
    }

    // Calculate language percentages
    const languages: Record<string, number> = {};
    for (const [lang, lines] of Object.entries(languageLines)) {
      languages[lang] = Math.round((lines / totalLines) * 100);
    }

    // Generate summary
    const summary = await this.generateSummary(findings, analysisType);

    // Calculate scores
    const scores = this.calculateScores(findings);

    return {
      findings,
      summary,
      scores,
      languages,
    };
  }

  private async analyzeBatch(
    files: CodeFile[],
    analysisType: AnalysisType,
    repositoryId: string,
    analysisId: string,
  ): Promise<Partial<Finding>[]> {
    const prompt = this.buildAnalysisPrompt(files, analysisType);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        return [];
      }

      return this.parseFindings(content.text, repositoryId, analysisId);
    } catch (error) {
      this.logger.error(`AI analysis failed: ${error.message}`);
      return [];
    }
  }

  private buildAnalysisPrompt(files: CodeFile[], analysisType: AnalysisType): string {
    const fileContents = files
      .map((f) => `### File: ${f.path} (${f.language})\n\`\`\`${f.language}\n${f.content.substring(0, 5000)}\n\`\`\``)
      .join('\n\n');

    const analysisInstructions = this.getAnalysisInstructions(analysisType);

    return `You are a senior software engineer performing a code analysis. Analyze the following code files and identify issues.

${analysisInstructions}

For each finding, provide a JSON object with these fields:
- title: Brief title of the issue
- description: Detailed explanation
- severity: One of "critical", "high", "medium", "low", "info"
- category: One of "security", "technical_debt", "dead_code", "dependency", "architecture", "performance", "maintainability", "consolidation", "compliance"
- filePath: The file path where the issue was found
- lineStart: Starting line number (approximate)
- lineEnd: Ending line number (approximate)
- suggestedFix: Object with "description" field explaining how to fix it

Return your findings as a JSON array. Only return the JSON array, no other text.

${fileContents}`;
  }

  private getAnalysisInstructions(analysisType: AnalysisType): string {
    switch (analysisType) {
      case AnalysisType.SECURITY:
        return `Focus on security vulnerabilities:
- SQL injection, XSS, CSRF vulnerabilities
- Hardcoded secrets, API keys, passwords
- Insecure authentication/authorization
- Missing input validation
- Insecure dependencies (check import statements)
- Sensitive data exposure`;

      case AnalysisType.DEAD_CODE:
        return `Focus on dead code detection:
- Unused functions and methods
- Unreachable code blocks
- Unused imports and variables
- Commented-out code blocks
- Deprecated API usage`;

      case AnalysisType.DEPENDENCIES:
        return `Focus on dependency issues:
- Outdated package imports
- Potentially vulnerable dependencies
- Unnecessary dependencies
- Dependency conflicts
- Missing type definitions`;

      case AnalysisType.ARCHITECTURE:
        return `Focus on architectural issues:
- Circular dependencies
- God classes/functions (too much responsibility)
- Missing abstractions
- Tight coupling between modules
- Violation of SOLID principles
- Missing error handling patterns`;

      case AnalysisType.FULL:
      case AnalysisType.INCREMENTAL:
      default:
        return `Perform a comprehensive analysis covering:
- Security vulnerabilities
- Code quality issues
- Performance problems
- Maintainability concerns
- Best practice violations
- Technical debt`;
    }
  }

  private parseFindings(
    responseText: string,
    repositoryId: string,
    analysisId: string,
  ): Partial<Finding>[] {
    try {
      // Extract JSON array from response
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        return [];
      }

      const parsed = JSON.parse(jsonMatch[0]);
      return parsed.map((item: any) => ({
        title: item.title || 'Untitled Finding',
        description: item.description || '',
        severity: this.mapSeverity(item.severity),
        category: this.mapCategory(item.category),
        filePath: item.filePath,
        lineStart: item.lineStart,
        lineEnd: item.lineEnd,
        suggestedFix: item.suggestedFix,
        repositoryId,
        analysisId,
        tags: [],
      }));
    } catch (error) {
      this.logger.error(`Failed to parse AI response: ${error.message}`);
      return [];
    }
  }

  private mapSeverity(severity: string): FindingSeverity {
    const map: Record<string, FindingSeverity> = {
      critical: FindingSeverity.CRITICAL,
      high: FindingSeverity.HIGH,
      medium: FindingSeverity.MEDIUM,
      low: FindingSeverity.LOW,
      info: FindingSeverity.INFO,
    };
    return map[severity?.toLowerCase()] || FindingSeverity.INFO;
  }

  private mapCategory(category: string): FindingCategory {
    const map: Record<string, FindingCategory> = {
      security: FindingCategory.SECURITY,
      technical_debt: FindingCategory.TECHNICAL_DEBT,
      dead_code: FindingCategory.DEAD_CODE,
      dependency: FindingCategory.DEPENDENCY,
      architecture: FindingCategory.ARCHITECTURE,
      performance: FindingCategory.PERFORMANCE,
      maintainability: FindingCategory.MAINTAINABILITY,
      consolidation: FindingCategory.CONSOLIDATION,
      compliance: FindingCategory.COMPLIANCE,
    };
    return map[category?.toLowerCase()] || FindingCategory.TECHNICAL_DEBT;
  }

  private async generateSummary(
    findings: Partial<Finding>[],
    analysisType: AnalysisType,
  ): Promise<AnalysisResult['summary']> {
    const severityCounts = {
      critical: findings.filter((f) => f.severity === FindingSeverity.CRITICAL).length,
      high: findings.filter((f) => f.severity === FindingSeverity.HIGH).length,
      medium: findings.filter((f) => f.severity === FindingSeverity.MEDIUM).length,
      low: findings.filter((f) => f.severity === FindingSeverity.LOW).length,
    };

    const categoryCounts: Record<string, number> = {};
    findings.forEach((f) => {
      if (f.category) {
        categoryCounts[f.category] = (categoryCounts[f.category] || 0) + 1;
      }
    });

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: `Based on a code analysis that found:
- ${severityCounts.critical} critical issues
- ${severityCounts.high} high severity issues
- ${severityCounts.medium} medium severity issues
- ${severityCounts.low} low severity issues

Categories: ${JSON.stringify(categoryCounts)}

Top findings:
${findings.slice(0, 5).map((f) => `- ${f.title}: ${f.description?.substring(0, 100)}`).join('\n')}

Generate a brief executive summary as JSON with these fields:
- overview: 2-3 sentence overview
- keyFindings: Array of 3-5 key findings (strings)
- recommendations: Array of 3-5 prioritized recommendations (strings)
- estimatedEffort: Estimated remediation effort (e.g., "2-3 weeks")

Return only the JSON object.`,
          },
        ],
      });

      const content = response.content[0];
      if (content.type === 'text') {
        const jsonMatch = content.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      }
    } catch (error) {
      this.logger.error(`Failed to generate summary: ${error.message}`);
    }

    // Fallback summary
    return {
      overview: `Analysis complete. Found ${findings.length} issues across the codebase.`,
      keyFindings: findings.slice(0, 3).map((f) => f.title || 'Issue found'),
      recommendations: ['Review critical issues first', 'Address security vulnerabilities', 'Improve code quality'],
      estimatedEffort: findings.length > 50 ? '2-4 weeks' : findings.length > 20 ? '1-2 weeks' : '3-5 days',
    };
  }

  private calculateScores(findings: Partial<Finding>[]): AnalysisResult['scores'] {
    // Base score of 100, deduct based on findings
    let security = 100;
    let maintainability = 100;
    let techDebt = 100;

    findings.forEach((f) => {
      const deduction = this.getSeverityDeduction(f.severity);

      if (f.category === FindingCategory.SECURITY) {
        security -= deduction * 2;
      } else if (
        f.category === FindingCategory.MAINTAINABILITY ||
        f.category === FindingCategory.ARCHITECTURE
      ) {
        maintainability -= deduction;
      }
      techDebt -= deduction * 0.5;
    });

    return {
      security: Math.max(0, Math.min(100, security)),
      maintainability: Math.max(0, Math.min(100, maintainability)),
      techDebt: Math.max(0, Math.min(100, techDebt)),
    };
  }

  private getSeverityDeduction(severity?: FindingSeverity): number {
    switch (severity) {
      case FindingSeverity.CRITICAL:
        return 15;
      case FindingSeverity.HIGH:
        return 10;
      case FindingSeverity.MEDIUM:
        return 5;
      case FindingSeverity.LOW:
        return 2;
      default:
        return 1;
    }
  }
}
