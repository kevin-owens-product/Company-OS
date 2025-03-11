import { IsString, IsOptional, IsUUID, IsObject, IsEmail, IsPhoneNumber, IsBoolean } from 'class-validator';

export class CreateContactDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  department?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsPhoneNumber()
  @IsOptional()
  phone?: string;

  @IsPhoneNumber()
  @IsOptional()
  mobile?: string;

  @IsObject()
  @IsOptional()
  socialProfiles?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };

  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean;

  @IsObject()
  @IsOptional()
  preferences?: {
    communicationChannel?: string;
    frequency?: string;
    newsletter?: boolean;
    language?: string;
  };

  @IsString()
  @IsOptional()
  notes?: string;

  @IsObject()
  @IsOptional()
  tags?: string[];

  @IsUUID()
  customerId: string;

  @IsUUID()
  tenantId: string;
} 