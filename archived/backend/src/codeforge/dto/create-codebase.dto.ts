import { IsString, IsOptional, IsObject, IsBoolean, IsIn } from 'class-validator';

export class CreateCodebaseDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  settings?: {
    autoAnalyze?: boolean;
    analysisDepth?: 'shallow' | 'standard' | 'deep';
    excludePatterns?: string[];
  };
}

export class UpdateCodebaseDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  settings?: {
    autoAnalyze?: boolean;
    analysisDepth?: 'shallow' | 'standard' | 'deep';
    excludePatterns?: string[];
  };
}
