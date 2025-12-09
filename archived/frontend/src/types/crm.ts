export enum CustomerType {
  INDIVIDUAL = 'INDIVIDUAL',
  COMPANY = 'COMPANY',
}

export enum CustomerStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  LEAD = 'LEAD',
  PROSPECT = 'PROSPECT',
  CUSTOMER = 'CUSTOMER',
}

export interface Customer {
  id: string;
  name: string;
  type: CustomerType;
  status: CustomerStatus;
  email?: string;
  phone?: string;
  address?: string;
  companyDetails?: {
    registrationNumber?: string;
    taxId?: string;
    industry?: string;
    size?: string;
  };
  contactDetails?: {
    website?: string;
    socialMedia?: {
      linkedin?: string;
      twitter?: string;
      facebook?: string;
    };
  };
  lifetimeValue: number;
  tags: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum OpportunityStage {
  QUALIFICATION = 'QUALIFICATION',
  NEEDS_ANALYSIS = 'NEEDS_ANALYSIS',
  PROPOSAL = 'PROPOSAL',
  NEGOTIATION = 'NEGOTIATION',
  CLOSED_WON = 'CLOSED_WON',
  CLOSED_LOST = 'CLOSED_LOST',
}

export enum OpportunityPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export interface Opportunity {
  id: string;
  title: string;
  description?: string;
  value: number;
  probability: number;
  stage: OpportunityStage;
  priority: OpportunityPriority;
  expectedCloseDate?: Date;
  products: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  customFields?: Record<string, any>;
  notes?: string;
  customerId: string;
  customer?: Customer;
  createdAt: Date;
  updatedAt: Date;
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  title?: string;
  department?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  socialProfiles?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  isPrimary: boolean;
  preferences?: {
    communicationChannel?: string;
    frequency?: string;
    newsletter?: boolean;
    language?: string;
  };
  notes?: string;
  tags: string[];
  lastContactDate?: Date;
  customerId: string;
  customer?: Customer;
  createdAt: Date;
  updatedAt: Date;
}

export enum ActivityType {
  EMAIL = 'EMAIL',
  CALL = 'CALL',
  MEETING = 'MEETING',
  TASK = 'TASK',
  NOTE = 'NOTE',
  FOLLOW_UP = 'FOLLOW_UP',
  VIDEO_CALL = 'VIDEO_CALL',
}

export enum ActivityStatus {
  PLANNED = 'PLANNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum ActivityPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export interface Activity {
  id: string;
  type: ActivityType;
  subject: string;
  description?: string;
  scheduledAt: Date;
  completedAt?: Date;
  status: ActivityStatus;
  priority: ActivityPriority;
  duration?: string;
  outcome?: {
    result?: string;
    nextSteps?: string;
    feedback?: string;
  };
  location?: {
    type?: 'physical' | 'virtual';
    address?: string;
    link?: string;
  };
  notes?: string;
  customerId: string;
  customer?: Customer;
  contactId?: string;
  contact?: Contact;
  opportunityId?: string;
  opportunity?: Opportunity;
  createdAt: Date;
  updatedAt: Date;
} 