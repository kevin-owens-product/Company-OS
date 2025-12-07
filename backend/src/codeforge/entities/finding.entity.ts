import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Repository } from './repository.entity';
import { Analysis } from './analysis.entity';

export enum FindingSeverity {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  INFO = 'info',
}

export enum FindingCategory {
  SECURITY = 'security',
  TECHNICAL_DEBT = 'technical_debt',
  DEAD_CODE = 'dead_code',
  DEPENDENCY = 'dependency',
  ARCHITECTURE = 'architecture',
  PERFORMANCE = 'performance',
  MAINTAINABILITY = 'maintainability',
  CONSOLIDATION = 'consolidation',
  COMPLIANCE = 'compliance',
}

export enum FindingStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  IGNORED = 'ignored',
  FALSE_POSITIVE = 'false_positive',
}

@Entity('codeforge_findings')
export class Finding {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: FindingSeverity })
  severity: FindingSeverity;

  @Column({ type: 'enum', enum: FindingCategory })
  category: FindingCategory;

  @Column({ type: 'enum', enum: FindingStatus, default: FindingStatus.OPEN })
  status: FindingStatus;

  @Column({ nullable: true })
  filePath: string;

  @Column({ type: 'int', nullable: true })
  lineStart: number;

  @Column({ type: 'int', nullable: true })
  lineEnd: number;

  @Column({ type: 'text', nullable: true })
  codeSnippet: string;

  @Column({ type: 'jsonb', nullable: true })
  location: {
    file: string;
    startLine: number;
    endLine: number;
    startColumn?: number;
    endColumn?: number;
  };

  @Column({ type: 'jsonb', nullable: true })
  metadata: {
    rule?: string;
    ruleUrl?: string;
    cwe?: string[];
    cve?: string[];
    confidence?: number;
    effort?: 'trivial' | 'easy' | 'medium' | 'hard' | 'complex';
  };

  @Column({ type: 'jsonb', nullable: true })
  suggestedFix: {
    description: string;
    diff?: string;
    playbook?: string;
  };

  @Column({ type: 'jsonb', default: [] })
  tags: string[];

  @ManyToOne(() => Repository, (repo) => repo.findings)
  repository: Repository;

  @Column()
  repositoryId: string;

  @ManyToOne(() => Analysis, (analysis) => analysis.findings)
  analysis: Analysis;

  @Column()
  analysisId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
