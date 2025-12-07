import { IsString, IsOptional, IsEnum, IsObject } from 'class-validator';
import { RepositoryProvider } from '../entities/repository.entity';

export class CreateRepositoryDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(RepositoryProvider)
  provider: RepositoryProvider;

  @IsString()
  remoteUrl: string;

  @IsOptional()
  @IsString()
  branch?: string;

  @IsString()
  codebaseId: string;

  @IsOptional()
  @IsObject()
  credentials?: {
    type: 'token' | 'ssh' | 'basic';
    encryptedValue: string;
  };

  @IsOptional()
  @IsObject()
  analysisConfig?: {
    excludePatterns?: string[];
    includePaths?: string[];
    maxFileSize?: number;
  };
}

export class UpdateRepositoryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  branch?: string;

  @IsOptional()
  @IsObject()
  credentials?: {
    type: 'token' | 'ssh' | 'basic';
    encryptedValue: string;
  };

  @IsOptional()
  @IsObject()
  analysisConfig?: {
    excludePatterns?: string[];
    includePaths?: string[];
    maxFileSize?: number;
  };
}

export class ConnectGitHubDto {
  @IsString()
  owner: string;

  @IsString()
  repo: string;

  @IsOptional()
  @IsString()
  branch?: string;

  @IsString()
  token: string;
}

export class ConnectGitLabDto {
  @IsString()
  projectId: string;

  @IsOptional()
  @IsString()
  branch?: string;

  @IsString()
  token: string;
}
