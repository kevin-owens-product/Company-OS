import { IsString, IsOptional, IsUUID, IsBoolean, IsObject, IsNumber, Min } from 'class-validator';

export class CreatePositionDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  baseSalary?: number;

  @IsObject()
  @IsOptional()
  requirements?: Record<string, any>;

  @IsObject()
  @IsOptional()
  responsibilities?: Record<string, any>;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsUUID()
  tenantId: string;

  @IsUUID()
  departmentId: string;
} 