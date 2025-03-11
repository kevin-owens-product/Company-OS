import { IsDate, IsOptional, IsUUID, IsEnum, IsNumber, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { PayrollStatus } from '../entities/payroll.entity';

export class CreatePayrollDto {
  @Type(() => Date)
  @IsDate()
  payPeriodStart: Date;

  @Type(() => Date)
  @IsDate()
  payPeriodEnd: Date;

  @IsNumber()
  baseSalary: number;

  @IsNumber()
  @IsOptional()
  overtime?: number;

  @IsNumber()
  @IsOptional()
  bonuses?: number;

  @IsNumber()
  @IsOptional()
  deductions?: number;

  @IsNumber()
  @IsOptional()
  netSalary?: number;

  @IsEnum(PayrollStatus)
  @IsOptional()
  status?: PayrollStatus;

  @IsObject()
  @IsOptional()
  details?: Record<string, any>;

  @IsObject()
  @IsOptional()
  taxInfo?: Record<string, any>;

  @IsObject()
  @IsOptional()
  benefits?: Record<string, any>;

  @IsUUID()
  employeeId: string;
} 