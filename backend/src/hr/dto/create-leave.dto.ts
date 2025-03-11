import { IsEnum, IsDate, IsOptional, IsUUID, IsInt, IsString, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { LeaveType, LeaveStatus } from '../entities/leave.entity';

export class CreateLeaveDto {
  @IsEnum(LeaveType)
  type: LeaveType;

  @IsEnum(LeaveStatus)
  @IsOptional()
  status?: LeaveStatus;

  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @IsInt()
  duration: number;

  @IsString()
  @IsOptional()
  reason?: string;

  @IsObject()
  @IsOptional()
  attachments?: Record<string, string>;

  @IsObject()
  @IsOptional()
  approvals?: Record<string, any>;

  @IsUUID()
  employeeId: string;
} 