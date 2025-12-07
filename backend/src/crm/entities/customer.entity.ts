import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Tenant } from '../../tenants/entities/tenant.entity';

export enum CustomerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  LEAD = 'lead',
  PROSPECT = 'prospect',
  CUSTOMER = 'customer',
}

export enum CustomerType {
  INDIVIDUAL = 'individual',
  COMPANY = 'company',
}

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: CustomerType, default: CustomerType.INDIVIDUAL })
  type: CustomerType;

  @Column({ type: 'enum', enum: CustomerStatus, default: CustomerStatus.LEAD })
  status: CustomerStatus;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column({ type: 'jsonb', nullable: true })
  companyDetails?: {
    registrationNumber?: string;
    taxId?: string;
    industry?: string;
    size?: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  contactDetails?: {
    website?: string;
    socialMedia?: {
      linkedin?: string;
      twitter?: string;
      facebook?: string;
    };
  };

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  lifetimeValue: number;

  @Column({ type: 'jsonb', default: {} })
  tags: string[];

  @Column({ type: 'text', nullable: true })
  notes: string;

  @ManyToOne(() => Tenant)
  tenant: Tenant;

  // Relations for CRM module
  opportunities?: any[];
  contacts?: any[];
  activities?: any[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 