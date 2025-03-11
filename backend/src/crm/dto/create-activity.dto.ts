import { IsString, IsOptional, IsEnum, IsUUID, IsObject, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { ActivityType, ActivityStatus, ActivityPriority } from '../entities/activity.entity';

export class CreateActivityDto {
  @IsEnum(ActivityType)
  type: ActivityType;

  @IsString()
  subject: string;

  @IsString()
  @IsOptional()
  description?: string;

  @Type(() => Date)
  @IsDate()
  scheduledAt: Date;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  completedAt?: Date;

  @IsEnum(ActivityStatus)
  @IsOptional()
  status?: ActivityStatus;

  @IsEnum(ActivityPriority)
  @IsOptional()
  priority?: ActivityPriority;

  @IsString()
  @IsOptional()
  duration?: string;

  @IsObject()
  @IsOptional()
  outcome?: {
    result?: string;
    nextSteps?: string;
    feedback?: string;
  };

  @IsObject()
  @IsOptional()
  location?: {
    type?: 'physical' | 'virtual';
    address?: string;
    link?: string;
  };

  @IsString()
  @IsOptional()
  notes?: string;

  @IsUUID()
  customerId: string;

  @IsUUID()
  @IsOptional()
  contactId?: string;

  @IsUUID()
  @IsOptional()
  opportunityId?: string;

  @IsUUID()
  tenantId: string;
} 