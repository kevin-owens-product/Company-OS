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

export enum RepositoryProvider {
  GITHUB = 'github',
  GITLAB = 'gitlab',
  BITBUCKET = 'bitbucket',
  AZURE_DEVOPS = 'azure_devops',
  SVN = 'svn',
  TFS = 'tfs',
  PERFORCE = 'perforce',
  LOCAL = 'local',
}

export enum RepositoryStatus {
  PENDING = 'pending',
  CLONING = 'cloning',
  READY = 'ready',
  ERROR = 'error',
  STALE = 'stale',
}

@Entity('codeforge_repositories')
export class Repository {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: RepositoryProvider })
  provider: RepositoryProvider;

  @Column()
  remoteUrl: string;

  @Column({ nullable: true })
  branch: string;

  @Column({ type: 'enum', enum: RepositoryStatus, default: RepositoryStatus.PENDING })
  status: RepositoryStatus;

  @Column({ type: 'jsonb', nullable: true })
  credentials: {
    type: 'token' | 'ssh' | 'basic';
    encryptedValue: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  metadata: {
    totalFiles?: number;
    totalLines?: number;
    languages?: { [key: string]: number };
    lastCommit?: string;
    lastCommitDate?: Date;
    size?: number;
  };

  @Column({ type: 'jsonb', nullable: true })
  analysisConfig: {
    excludePatterns?: string[];
    includePaths?: string[];
    maxFileSize?: number;
  };

  @OneToMany(() => Finding, (finding) => finding.repository)
  findings: Finding[];

  @ManyToOne(() => Codebase, (codebase) => codebase.repositories)
  codebase: Codebase;

  @Column()
  codebaseId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
