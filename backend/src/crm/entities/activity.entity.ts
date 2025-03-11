import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Customer } from './customer.entity';
import { Contact } from './contact.entity';
import { Opportunity } from './opportunity.entity';
import { Tenant } from '../../tenants/entities/tenant.entity';

export enum ActivityType {
  EMAIL = 'email',
  CALL = 'call',
  MEETING = 'meeting',
  TASK = 'task',
  NOTE = 'note',
  FOLLOW_UP = 'follow_up',
}

export enum ActivityStatus {
  PLANNED = 'planned',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum ActivityPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

@Entity('activities')
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ActivityType })
  type: ActivityType;

  @Column()
  subject: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'timestamp' })
  scheduledAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @Column({ type: 'enum', enum: ActivityStatus, default: ActivityStatus.PLANNED })
  status: ActivityStatus;

  @Column({ type: 'enum', enum: ActivityPriority, default: ActivityPriority.MEDIUM })
  priority: ActivityPriority;

  @Column({ type: 'interval', nullable: true })
  duration: string;

  @Column({ type: 'jsonb', nullable: true })
  outcome: {
    result?: string;
    nextSteps?: string;
    feedback?: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  location: {
    type?: 'physical' | 'virtual';
    address?: string;
    link?: string;
  };

  @Column({ type: 'text', nullable: true })
  notes: string;

  @ManyToOne(() => Customer, customer => customer.activities)
  customer: Customer;

  @ManyToOne(() => Contact, contact => contact.activities, { nullable: true })
  contact: Contact;

  @ManyToOne(() => Opportunity, opportunity => opportunity.activities, { nullable: true })
  opportunity: Opportunity;

  @ManyToOne(() => Tenant, tenant => tenant.activities)
  tenant: Tenant;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 