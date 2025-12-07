import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Tenant } from '../../tenants/entities/tenant.entity';

export enum PlaybookCategory {
  CONSOLIDATION = 'consolidation',      // PB-100 series
  SECURITY = 'security',                // PB-200 series
  COST_OPTIMIZATION = 'cost_optimization', // PB-300 series
  DEVELOPER_EXPERIENCE = 'developer_experience', // PB-400 series
  COMPLIANCE = 'compliance',            // PB-500 series
  CUSTOM = 'custom',
}

export enum PlaybookStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  DEPRECATED = 'deprecated',
  ARCHIVED = 'archived',
}

@Entity('codeforge_playbooks')
export class Playbook {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  code: string; // e.g., "PB-101", "PB-201"

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: PlaybookCategory })
  category: PlaybookCategory;

  @Column({ type: 'enum', enum: PlaybookStatus, default: PlaybookStatus.DRAFT })
  status: PlaybookStatus;

  @Column()
  version: string;

  @Column({ type: 'boolean', default: false })
  isBuiltIn: boolean;

  @Column({ type: 'jsonb' })
  config: {
    targetLanguages?: string[];
    targetFrameworks?: string[];
    prerequisites?: string[];
    estimatedEffort?: string;
    riskLevel?: 'low' | 'medium' | 'high';
  };

  @Column({ type: 'jsonb' })
  rules: {
    id: string;
    name: string;
    description: string;
    pattern: string;
    action: 'refactor' | 'remove' | 'replace' | 'flag' | 'migrate';
    autoFix?: boolean;
    priority?: number;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  oversightConfig: {
    level: 'autonomous' | 'notify' | 'review' | 'collaborate' | 'manual';
    approvalRequired?: boolean;
    notifyOnExecution?: boolean;
  };

  @Column({ type: 'jsonb', nullable: true })
  metrics: {
    timesExecuted?: number;
    successRate?: number;
    avgExecutionTime?: number;
    findingsResolved?: number;
  };

  @ManyToOne(() => Tenant, { nullable: true })
  tenant: Tenant;

  @Column({ nullable: true })
  tenantId: string;

  @Column({ nullable: true })
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
