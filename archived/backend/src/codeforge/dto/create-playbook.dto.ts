import { IsString, IsOptional, IsEnum, IsObject, IsArray, IsBoolean } from 'class-validator';
import { PlaybookCategory } from '../entities/playbook.entity';

export class CreatePlaybookDto {
  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsEnum(PlaybookCategory)
  category: PlaybookCategory;

  @IsString()
  version: string;

  @IsOptional()
  @IsBoolean()
  isBuiltIn?: boolean;

  @IsObject()
  config: {
    targetLanguages?: string[];
    targetFrameworks?: string[];
    prerequisites?: string[];
    estimatedEffort?: string;
    riskLevel?: 'low' | 'medium' | 'high';
  };

  @IsArray()
  rules: {
    id: string;
    name: string;
    description: string;
    pattern: string;
    action: 'refactor' | 'remove' | 'replace' | 'flag' | 'migrate';
    autoFix?: boolean;
    priority?: number;
  }[];

  @IsOptional()
  @IsObject()
  oversightConfig?: {
    level: 'autonomous' | 'notify' | 'review' | 'collaborate' | 'manual';
    approvalRequired?: boolean;
    notifyOnExecution?: boolean;
  };
}

export class UpdatePlaybookDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  version?: string;

  @IsOptional()
  @IsObject()
  config?: {
    targetLanguages?: string[];
    targetFrameworks?: string[];
    prerequisites?: string[];
    estimatedEffort?: string;
    riskLevel?: 'low' | 'medium' | 'high';
  };

  @IsOptional()
  @IsArray()
  rules?: {
    id: string;
    name: string;
    description: string;
    pattern: string;
    action: 'refactor' | 'remove' | 'replace' | 'flag' | 'migrate';
    autoFix?: boolean;
    priority?: number;
  }[];

  @IsOptional()
  @IsObject()
  oversightConfig?: {
    level: 'autonomous' | 'notify' | 'review' | 'collaborate' | 'manual';
    approvalRequired?: boolean;
    notifyOnExecution?: boolean;
  };
}
