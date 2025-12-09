import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Codebase } from './codebase.entity';
import { Finding } from './finding.entity';

export enum AnalysisStatus {
  QUEUED = 'queued',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export enum AnalysisType {
  FULL = 'full',
  INCREMENTAL = 'incremental',
  SECURITY = 'security',
  DEPENDENCIES = 'dependencies',
  DEAD_CODE = 'dead_code',
  ARCHITECTURE = 'architecture',
}

@Entity('codeforge_analyses')
export class Analysis {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: AnalysisType })
  type: AnalysisType;

  @Column({ type: 'enum', enum: AnalysisStatus, default: AnalysisStatus.QUEUED })
  status: AnalysisStatus;

  @Column({ type: 'timestamp', nullable: true })
  startedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  config: {
    depth?: 'shallow' | 'standard' | 'deep';
    targetRepositories?: string[];
    playbooks?: string[];
  };

  @Column({ type: 'jsonb', nullable: true })
  results: {
    filesAnalyzed?: number;
    findingsCount?: number;
    findingsBySeverity?: { critical: number; high: number; medium: number; low: number; info: number };
    findingsByCategory?: { [key: string]: number };
    techDebtScore?: number;
    securityScore?: number;
    maintainabilityScore?: number;
  };

  @Column({ type: 'jsonb', nullable: true })
  summary: {
    overview?: string;
    keyFindings?: string[];
    recommendations?: string[];
    estimatedEffort?: string;
  };

  @Column({ type: 'text', nullable: true })
  errorMessage: string;

  @OneToMany(() => Finding, (finding) => finding.analysis)
  findings: Finding[];

  @ManyToOne(() => Codebase, (codebase) => codebase.analyses)
  codebase: Codebase;

  @Column()
  codebaseId: string;

  @Column({ nullable: true })
  triggeredBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
