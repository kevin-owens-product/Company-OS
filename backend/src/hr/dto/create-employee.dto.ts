import { IsString, IsDate, IsOptional, IsUUID, IsBoolean, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEmployeeDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  employeeId: string;

  @Type(() => Date)
  @IsDate()
  dateOfBirth: Date;

  @Type(() => Date)
  @IsDate()
  hireDate: Date;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  emergencyContact?: string;

  @IsObject()
  @IsOptional()
  documents?: Record<string, string>;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsUUID()
  userId: string;

  @IsUUID()
  departmentId: string;

  @IsUUID()
  positionId: string;
} 