import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Tenant } from '../../tenants/entities/tenant.entity';
import { Repository } from './repository.entity';
import { Analysis } from './analysis.entity';
import { Transformation } from './transformation.entity';

export enum CodebaseStatus {
  PENDING = 'pending',
  INGESTING = 'ingesting',
  ANALYZING = 'analyzing',
  READY = 'ready',
  ERROR = 'error',
}

@Entity('codeforge_codebases')
export class Codebase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: CodebaseStatus, default: CodebaseStatus.PENDING })
  status: CodebaseStatus;

  @Column({ type: 'jsonb', nullable: true })
  metadata: {
    totalFiles?: number;
    totalLines?: number;
    languages?: { [key: string]: number };
    lastIngestionAt?: Date;
    lastAnalysisAt?: Date;
  };

  @Column({ type: 'jsonb', nullable: true })
  settings: {
    autoAnalyze?: boolean;
    analysisDepth?: 'shallow' | 'standard' | 'deep';
    excludePatterns?: string[];
  };

  @OneToMany(() => Repository, (repo) => repo.codebase)
  repositories: Repository[];

  @OneToMany(() => Analysis, (analysis) => analysis.codebase)
  analyses: Analysis[];

  @OneToMany(() => Transformation, (transformation) => transformation.codebase)
  transformations: Transformation[];

  @ManyToOne(() => Tenant)
  tenant: Tenant;

  @Column()
  tenantId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
