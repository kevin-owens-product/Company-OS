// CodeForge Type Definitions

// Codebase Types
export enum CodebaseStatus {
  PENDING = 'pending',
  INGESTING = 'ingesting',
  ANALYZING = 'analyzing',
  READY = 'ready',
  ERROR = 'error',
}

export interface Codebase {
  id: string;
  name: string;
  description: string;
  status: CodebaseStatus;
  metadata: {
    totalFiles?: number;
    totalLines?: number;
    languages?: { [key: string]: number };
    lastIngestionAt?: Date;
    lastAnalysisAt?: Date;
  };
  settings: {
    autoAnalyze?: boolean;
    analysisDepth?: 'shallow' | 'standard' | 'deep';
    excludePatterns?: string[];
  };
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

// Repository Types
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

export interface Repository {
  id: string;
  name: string;
  description: string;
  provider: RepositoryProvider;
  remoteUrl: string;
  branch: string;
  status: RepositoryStatus;
  metadata: {
    totalFiles?: number;
    totalLines?: number;
    languages?: { [key: string]: number };
    lastCommit?: string;
    lastCommitDate?: Date;
    size?: number;
  };
  codebaseId: string;
  createdAt: string;
  updatedAt: string;
}

// Analysis Types
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

export interface Analysis {
  id: string;
  type: AnalysisType;
  status: AnalysisStatus;
  startedAt?: string;
  completedAt?: string;
  config: {
    depth?: 'shallow' | 'standard' | 'deep';
    targetRepositories?: string[];
    playbooks?: string[];
  };
  results?: {
    filesAnalyzed?: number;
    findingsCount?: number;
    findingsBySeverity?: { critical: number; high: number; medium: number; low: number; info: number };
    findingsByCategory?: { [key: string]: number };
    techDebtScore?: number;
    securityScore?: number;
    maintainabilityScore?: number;
  };
  summary?: {
    overview?: string;
    keyFindings?: string[];
    recommendations?: string[];
    estimatedEffort?: string;
  };
  errorMessage?: string;
  codebaseId: string;
  triggeredBy?: string;
  createdAt: string;
  updatedAt: string;
}

// Finding Types
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

export interface Finding {
  id: string;
  title: string;
  description: string;
  severity: FindingSeverity;
  category: FindingCategory;
  status: FindingStatus;
  filePath?: string;
  lineStart?: number;
  lineEnd?: number;
  codeSnippet?: string;
  location?: {
    file: string;
    startLine: number;
    endLine: number;
    startColumn?: number;
    endColumn?: number;
  };
  metadata?: {
    rule?: string;
    ruleUrl?: string;
    cwe?: string[];
    cve?: string[];
    confidence?: number;
    effort?: 'trivial' | 'easy' | 'medium' | 'hard' | 'complex';
  };
  suggestedFix?: {
    description: string;
    diff?: string;
    playbook?: string;
  };
  tags: string[];
  repositoryId: string;
  analysisId: string;
  createdAt: string;
  updatedAt: string;
}

// Playbook Types
export enum PlaybookCategory {
  CONSOLIDATION = 'consolidation',
  SECURITY = 'security',
  COST_OPTIMIZATION = 'cost_optimization',
  DEVELOPER_EXPERIENCE = 'developer_experience',
  COMPLIANCE = 'compliance',
  CUSTOM = 'custom',
}

export enum PlaybookStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  DEPRECATED = 'deprecated',
  ARCHIVED = 'archived',
}

export interface PlaybookRule {
  id: string;
  name: string;
  description: string;
  pattern: string;
  action: 'refactor' | 'remove' | 'replace' | 'flag' | 'migrate';
  autoFix?: boolean;
  priority?: number;
}

export interface Playbook {
  id: string;
  code: string;
  name: string;
  description: string;
  category: PlaybookCategory;
  status: PlaybookStatus;
  version: string;
  isBuiltIn: boolean;
  config: {
    targetLanguages?: string[];
    targetFrameworks?: string[];
    prerequisites?: string[];
    estimatedEffort?: string;
    riskLevel?: 'low' | 'medium' | 'high';
  };
  rules: PlaybookRule[];
  oversightConfig?: {
    level: 'autonomous' | 'notify' | 'review' | 'collaborate' | 'manual';
    approvalRequired?: boolean;
    notifyOnExecution?: boolean;
  };
  metrics?: {
    timesExecuted?: number;
    successRate?: number;
    avgExecutionTime?: number;
    findingsResolved?: number;
  };
  tenantId?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

// Transformation Types
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

export interface TransformationStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  estimatedDuration?: string;
  changes?: number;
}

export interface Transformation {
  id: string;
  name: string;
  description: string;
  type: TransformationType;
  status: TransformationStatus;
  oversightLevel: OversightLevel;
  scope?: {
    repositories?: string[];
    files?: string[];
    findings?: string[];
    playbooks?: string[];
  };
  plan?: {
    steps: TransformationStep[];
    totalEstimatedDuration?: string;
    totalChanges?: number;
  };
  execution?: {
    startedAt?: string;
    completedAt?: string;
    currentStep?: string;
    progress?: number;
    filesModified?: number;
    linesChanged?: number;
    testsRun?: number;
    testsPassed?: number;
  };
  output?: {
    prUrl?: string;
    branchName?: string;
    commits?: string[];
    artifacts?: string[];
    documentation?: string[];
  };
  rollback?: {
    available: boolean;
    backupRef?: string;
    instructions?: string;
  };
  errorMessage?: string;
  approvals: {
    userId: string;
    action: 'approved' | 'rejected' | 'requested_changes';
    comment?: string;
    timestamp: string;
  }[];
  codebaseId: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface IngestionResult {
  success: boolean;
  repositoryId: string;
  filesCount?: number;
  linesCount?: number;
  languages?: { [key: string]: number };
  error?: string;
}

export interface CodebaseStatistics {
  repositoryCount: number;
  totalFindings: number;
  findingsBySeverity: Record<string, number>;
  analysisCount: number;
  transformationCount: number;
}
