export interface Playbook {
  id: string;
  category: 'Consolidation' | 'Security' | 'Cost' | 'DevExp' | 'Compliance';
  title: string;
  description: string;
  code: string;
}

export interface Codebase {
  id: string;
  name: string;
  source: 'GitHub' | 'GitLab' | 'Bitbucket' | 'Upload';
  status: 'Connected' | 'Analyzing' | 'Ready' | 'Error';
  lastScan: string;
  riskScore: number;
  language: string;
}

export interface Transformation {
  id: string;
  codebaseId: string;
  codebaseName: string;
  playbookId: string;
  playbookName: string;
  status: 'Planning' | 'Approval' | 'Execution' | 'Completed' | 'Failed' | 'Paused';
  currentStep: string;
  progress: number;
  startedAt: string;
  eta: string;
}

export interface Metric {
  label: string;
  value: string | number;
  trend: 'up' | 'down' | 'neutral';
  trendValue: string;
}

export interface Finding {
  id: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  type: 'Security' | 'TechDebt' | 'Reliability' | 'Compliance';
  title: string;
  description: string;
  file: string;
  line: number;
  remediation?: string;
  status: 'Open' | 'Resolved' | 'Ignored';
}

export interface ComplianceStandard {
  id: string;
  name: string;
  status: 'Compliant' | 'At Risk' | 'Non-Compliant';
  score: number;
  lastAudit: string;
  controlsPassing: number;
  controlsTotal: number;
}

export interface PageProps {
  navigateTo: (page: string) => void;
}
