import { IsString, IsOptional, IsEnum, IsUUID, IsObject, IsEmail, IsPhoneNumber } from 'class-validator';
import { CustomerType, CustomerStatus } from '../entities/customer.entity';

export class CreateCustomerDto {
  @IsString()
  name: string;

  @IsEnum(CustomerType)
  type: CustomerType;

  @IsEnum(CustomerStatus)
  @IsOptional()
  status?: CustomerStatus;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsPhoneNumber()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsObject()
  @IsOptional()
  companyDetails?: {
    registrationNumber?: string;
    taxId?: string;
    industry?: string;
    size?: string;
  };

  @IsObject()
  @IsOptional()
  contactDetails?: {
    website?: string;
    socialMedia?: {
      linkedin?: string;
      twitter?: string;
      facebook?: string;
    };
  };

  @IsObject()
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  notes?: string;

  @IsUUID()
  tenantId: string;
} 