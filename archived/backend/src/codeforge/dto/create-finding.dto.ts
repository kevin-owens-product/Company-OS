import { IsString, IsOptional, IsEnum, IsObject, IsArray, IsInt } from 'class-validator';
import { FindingSeverity, FindingCategory } from '../entities/finding.entity';

export class CreateFindingDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(FindingSeverity)
  severity: FindingSeverity;

  @IsEnum(FindingCategory)
  category: FindingCategory;

  @IsOptional()
  @IsString()
  filePath?: string;

  @IsOptional()
  @IsInt()
  lineStart?: number;

  @IsOptional()
  @IsInt()
  lineEnd?: number;

  @IsOptional()
  @IsString()
  codeSnippet?: string;

  @IsOptional()
  @IsObject()
  location?: {
    file: string;
    startLine: number;
    endLine: number;
    startColumn?: number;
    endColumn?: number;
  };

  @IsOptional()
  @IsObject()
  metadata?: {
    rule?: string;
    ruleUrl?: string;
    cwe?: string[];
    cve?: string[];
    confidence?: number;
    effort?: 'trivial' | 'easy' | 'medium' | 'hard' | 'complex';
  };

  @IsOptional()
  @IsObject()
  suggestedFix?: {
    description: string;
    diff?: string;
    playbook?: string;
  };

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsString()
  repositoryId: string;

  @IsString()
  analysisId: string;
}
