import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Codebase } from './codebase.entity';

export enum TransformationStatus {
  DRAFT = 'draft',
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  QUEUED = 'queued',
  RUNNING = 'running',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  FAILED = 'failed',
  ROLLED_BACK = 'rolled_back',
  CANCELLED = 'cancelled',
}

export enum TransformationType {
  REFACTOR = 'refactor',
  MIGRATE = 'migrate',
  CONSOLIDATE = 'consolidate',
  SECURITY_FIX = 'security_fix',
  DEPENDENCY_UPDATE = 'dependency_update',
  DEAD_CODE_REMOVAL = 'dead_code_removal',
  INFRASTRUCTURE = 'infrastructure',
}

export enum OversightLevel {
  AUTONOMOUS = 'autonomous',
  NOTIFY = 'notify',
  REVIEW = 'review',
  COLLABORATE = 'collaborate',
  MANUAL = 'manual',
}

@Entity('codeforge_transformations')
export class Transformation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: TransformationType })
  type: TransformationType;

  @Column({ type: 'enum', enum: TransformationStatus, default: TransformationStatus.DRAFT })
  status: TransformationStatus;

  @Column({ type: 'enum', enum: OversightLevel, default: OversightLevel.REVIEW })
  oversightLevel: OversightLevel;

  @Column({ type: 'jsonb', nullable: true })
  scope: {
    repositories?: string[];
    files?: string[];
    findings?: string[];
    playbooks?: string[];
  };

  @Column({ type: 'jsonb', nullable: true })
  plan: {
    steps: {
      id: string;
      name: string;
      description: string;
      status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
      estimatedDuration?: string;
      changes?: number;
    }[];
    totalEstimatedDuration?: string;
    totalChanges?: number;
  };

  @Column({ type: 'jsonb', nullable: true })
  execution: {
    startedAt?: Date;
    completedAt?: Date;
    currentStep?: string;
    progress?: number;
    filesModified?: number;
    linesChanged?: number;
    testsRun?: number;
    testsPassed?: number;
  };

  @Column({ type: 'jsonb', nullable: true })
  output: {
    prUrl?: string;
    branchName?: string;
    commits?: string[];
    artifacts?: string[];
    documentation?: string[];
  };

  @Column({ type: 'jsonb', nullable: true })
  rollback: {
    available: boolean;
    backupRef?: string;
    instructions?: string;
  };

  @Column({ type: 'text', nullable: true })
  errorMessage: string;

  @Column({ type: 'jsonb', default: [] })
  approvals: {
    userId: string;
    action: 'approved' | 'rejected' | 'requested_changes';
    comment?: string;
    timestamp: Date;
  }[];

  @ManyToOne(() => Codebase, (codebase) => codebase.transformations)
  codebase: Codebase;

  @Column()
  codebaseId: string;

  @Column({ nullable: true })
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
