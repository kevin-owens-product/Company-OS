import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Customer } from './customer.entity';
import { Tenant } from '../../tenants/entities/tenant.entity';

@Entity('contacts')
export class Contact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  department: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  mobile: string;

  @Column({ type: 'jsonb', nullable: true })
  socialProfiles: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };

  @Column({ type: 'boolean', default: true })
  isPrimary: boolean;

  @Column({ type: 'jsonb', nullable: true })
  preferences: {
    communicationChannel?: string;
    frequency?: string;
    newsletter?: boolean;
    language?: string;
  };

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'jsonb', default: {} })
  tags: string[];

  @Column({ type: 'date', nullable: true })
  lastContactDate: Date;

  @ManyToOne(() => Customer)
  customer: Customer;

  @ManyToOne(() => Tenant)
  tenant: Tenant;

  // Relations for CRM module
  activities?: any[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 