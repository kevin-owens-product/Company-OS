import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Customer } from './customer.entity';
import { Tenant } from '../../tenants/entities/tenant.entity';

export enum OpportunityStage {
  QUALIFICATION = 'qualification',
  NEEDS_ANALYSIS = 'needs_analysis',
  PROPOSAL = 'proposal',
  NEGOTIATION = 'negotiation',
  CLOSED_WON = 'closed_won',
  CLOSED_LOST = 'closed_lost',
}

export enum OpportunityPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

@Entity('opportunities')
export class Opportunity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value: number;

  @Column({ type: 'decimal', precision: 3, scale: 2 })
  probability: number;

  @Column({ type: 'enum', enum: OpportunityStage, default: OpportunityStage.QUALIFICATION })
  stage: OpportunityStage;

  @Column({ type: 'enum', enum: OpportunityPriority, default: OpportunityPriority.MEDIUM })
  priority: OpportunityPriority;

  @Column({ type: 'date', nullable: true })
  expectedCloseDate: Date;

  @Column({ type: 'jsonb', default: {} })
  products: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;

  @Column({ type: 'jsonb', nullable: true })
  customFields: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @ManyToOne(() => Customer, customer => customer.opportunities)
  customer: Customer;

  @ManyToOne(() => Tenant, tenant => tenant.opportunities)
  tenant: Tenant;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 