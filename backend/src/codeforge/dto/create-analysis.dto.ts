import { IsString, IsOptional, IsEnum, IsObject, IsArray } from 'class-validator';
import { AnalysisType } from '../entities/analysis.entity';

export class CreateAnalysisDto {
  @IsEnum(AnalysisType)
  type: AnalysisType;

  @IsString()
  codebaseId: string;

  @IsOptional()
  @IsObject()
  config?: {
    depth?: 'shallow' | 'standard' | 'deep';
    targetRepositories?: string[];
    playbooks?: string[];
  };

  @IsOptional()
  @IsString()
  triggeredBy?: string;
}

export class TriggerAnalysisDto {
  @IsEnum(AnalysisType)
  type: AnalysisType;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  targetRepositories?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  playbooks?: string[];

  @IsOptional()
  @IsString()
  depth?: 'shallow' | 'standard' | 'deep';
}
