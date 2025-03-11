import { IsString, IsOptional, IsEnum, IsUUID, IsObject, IsNumber, IsDate, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { OpportunityStage, OpportunityPriority } from '../entities/opportunity.entity';

export class CreateOpportunityDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  value: number;

  @IsNumber()
  @Min(0)
  @Max(1)
  probability: number;

  @IsEnum(OpportunityStage)
  @IsOptional()
  stage?: OpportunityStage;

  @IsEnum(OpportunityPriority)
  @IsOptional()
  priority?: OpportunityPriority;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  expectedCloseDate?: Date;

  @IsObject()
  @IsOptional()
  products?: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;

  @IsObject()
  @IsOptional()
  customFields?: Record<string, any>;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsUUID()
  customerId: string;

  @IsUUID()
  tenantId: string;
} 