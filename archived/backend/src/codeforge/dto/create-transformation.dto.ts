import { IsString, IsOptional, IsEnum, IsObject, IsArray } from 'class-validator';
import { TransformationType, OversightLevel } from '../entities/transformation.entity';

export class CreateTransformationDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(TransformationType)
  type: TransformationType;

  @IsOptional()
  @IsEnum(OversightLevel)
  oversightLevel?: OversightLevel;

  @IsString()
  codebaseId: string;

  @IsOptional()
  @IsObject()
  scope?: {
    repositories?: string[];
    files?: string[];
    findings?: string[];
    playbooks?: string[];
  };

  @IsOptional()
  @IsObject()
  plan?: {
    steps: {
      id: string;
      name: string;
      description: string;
      status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
      estimatedDuration?: string;
      changes?: number;
    }[];
    totalEstimatedDuration?: string;
    totalChanges?: number;
  };
}

export class ApprovalActionDto {
  @IsOptional()
  @IsString()
  comment?: string;
}
