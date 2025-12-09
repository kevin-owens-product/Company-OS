import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Playbook, PlaybookCategory, PlaybookStatus } from '../entities/playbook.entity';
import { CreatePlaybookDto, UpdatePlaybookDto } from '../dto/create-playbook.dto';

@Injectable()
export class PlaybookService {
  constructor(
    @InjectRepository(Playbook)
    private readonly playbookRepository: Repository<Playbook>,
  ) {}

  async create(createPlaybookDto: CreatePlaybookDto, tenantId?: string): Promise<Playbook> {
    const playbook = this.playbookRepository.create({
      ...createPlaybookDto,
      tenantId,
      status: PlaybookStatus.DRAFT,
    });
    return await this.playbookRepository.save(playbook);
  }

  async findAll(tenantId?: string): Promise<Playbook[]> {
    // Return built-in playbooks + tenant-specific playbooks
    return await this.playbookRepository.find({
      where: [
        { isBuiltIn: true },
        { tenantId },
      ],
      order: { code: 'ASC' },
    });
  }

  async findByCategory(category: PlaybookCategory, tenantId?: string): Promise<Playbook[]> {
    return await this.playbookRepository.find({
      where: [
        { category, isBuiltIn: true, status: PlaybookStatus.ACTIVE },
        { category, tenantId, status: PlaybookStatus.ACTIVE },
      ],
      order: { code: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Playbook> {
    const playbook = await this.playbookRepository.findOne({
      where: { id },
    });

    if (!playbook) {
      throw new NotFoundException(`Playbook with ID ${id} not found`);
    }

    return playbook;
  }

  async findByCode(code: string): Promise<Playbook | null> {
    return await this.playbookRepository.findOne({
      where: { code, status: PlaybookStatus.ACTIVE },
    });
  }

  async update(id: string, updatePlaybookDto: UpdatePlaybookDto): Promise<Playbook> {
    const playbook = await this.findOne(id);
    Object.assign(playbook, updatePlaybookDto);
    return await this.playbookRepository.save(playbook);
  }

  async activate(id: string): Promise<Playbook> {
    const playbook = await this.findOne(id);
    playbook.status = PlaybookStatus.ACTIVE;
    return await this.playbookRepository.save(playbook);
  }

  async deprecate(id: string): Promise<Playbook> {
    const playbook = await this.findOne(id);
    playbook.status = PlaybookStatus.DEPRECATED;
    return await this.playbookRepository.save(playbook);
  }

  async incrementExecutionCount(id: string, success: boolean): Promise<void> {
    const playbook = await this.findOne(id);
    if (!playbook.metrics) {
      playbook.metrics = { timesExecuted: 0, successRate: 0 };
    }
    playbook.metrics.timesExecuted = (playbook.metrics.timesExecuted || 0) + 1;

    if (success) {
      const totalSuccess = Math.round(
        (playbook.metrics.successRate || 0) * (playbook.metrics.timesExecuted - 1) / 100
      ) + 1;
      playbook.metrics.successRate = (totalSuccess / playbook.metrics.timesExecuted) * 100;
    }

    await this.playbookRepository.save(playbook);
  }

  async remove(id: string): Promise<void> {
    const playbook = await this.findOne(id);
    if (playbook.isBuiltIn) {
      throw new Error('Cannot delete built-in playbooks');
    }
    await this.playbookRepository.remove(playbook);
  }

  async seedBuiltInPlaybooks(): Promise<void> {
    const builtInPlaybooks: Partial<Playbook>[] = [
      // PB-100: Technology Stack Consolidation
      {
        code: 'PB-101',
        name: 'Frontend Consolidation',
        description: 'Standardize frontend to React from Angular/Vue/jQuery with component migration',
        category: PlaybookCategory.CONSOLIDATION,
        isBuiltIn: true,
        status: PlaybookStatus.ACTIVE,
        version: '1.0.0',
        config: {
          targetLanguages: ['javascript', 'typescript'],
          targetFrameworks: ['react'],
          estimatedEffort: '2-4 weeks',
          riskLevel: 'high',
        },
        rules: [
          { id: 'fe-001', name: 'Angular Detection', description: 'Identify Angular components for migration', pattern: '@angular/*', action: 'migrate', priority: 1 },
          { id: 'fe-002', name: 'Vue Detection', description: 'Identify Vue components for migration', pattern: '.vue', action: 'migrate', priority: 1 },
          { id: 'fe-003', name: 'jQuery Detection', description: 'Identify jQuery usage for modernization', pattern: 'jquery', action: 'replace', priority: 2 },
        ],
        oversightConfig: { level: 'collaborate', approvalRequired: true },
      },
      {
        code: 'PB-102',
        name: 'Backend Consolidation',
        description: 'Microservices rationalization and language standardization',
        category: PlaybookCategory.CONSOLIDATION,
        isBuiltIn: true,
        status: PlaybookStatus.ACTIVE,
        version: '1.0.0',
        config: {
          targetLanguages: ['typescript', 'go', 'python'],
          estimatedEffort: '4-8 weeks',
          riskLevel: 'high',
        },
        rules: [
          { id: 'be-001', name: 'Service Duplication', description: 'Find duplicate functionality across services', pattern: 'duplicate:service', action: 'flag', priority: 1 },
          { id: 'be-002', name: 'Language Sprawl', description: 'Identify non-standard languages', pattern: 'language:nonstandard', action: 'flag', priority: 2 },
        ],
        oversightConfig: { level: 'collaborate', approvalRequired: true },
      },
      {
        code: 'PB-103',
        name: 'Database Consolidation',
        description: 'Reduce database engine sprawl and optimize schemas',
        category: PlaybookCategory.CONSOLIDATION,
        isBuiltIn: true,
        status: PlaybookStatus.ACTIVE,
        version: '1.0.0',
        config: {
          targetLanguages: ['sql'],
          estimatedEffort: '2-6 weeks',
          riskLevel: 'high',
        },
        rules: [
          { id: 'db-001', name: 'Schema Duplication', description: 'Find duplicate tables/columns', pattern: 'duplicate:schema', action: 'flag', priority: 1 },
          { id: 'db-002', name: 'Index Optimization', description: 'Identify missing or unused indexes', pattern: 'index:optimize', action: 'flag', priority: 2 },
        ],
        oversightConfig: { level: 'review', approvalRequired: true },
      },
      {
        code: 'PB-104',
        name: 'Infrastructure Consolidation',
        description: 'Cloud standardization and Kubernetes migration',
        category: PlaybookCategory.CONSOLIDATION,
        isBuiltIn: true,
        status: PlaybookStatus.ACTIVE,
        version: '1.0.0',
        config: {
          targetLanguages: ['yaml', 'terraform'],
          estimatedEffort: '4-12 weeks',
          riskLevel: 'high',
        },
        rules: [
          { id: 'infra-001', name: 'Legacy Infrastructure', description: 'Identify non-containerized workloads', pattern: 'infra:legacy', action: 'migrate', priority: 1 },
          { id: 'infra-002', name: 'Multi-Cloud', description: 'Flag inconsistent cloud usage', pattern: 'cloud:inconsistent', action: 'flag', priority: 2 },
        ],
        oversightConfig: { level: 'collaborate', approvalRequired: true },
      },

      // PB-200: Security Hardening
      {
        code: 'PB-201',
        name: 'Dependency Audit',
        description: 'Identify and upgrade vulnerable dependencies across all repositories',
        category: PlaybookCategory.SECURITY,
        isBuiltIn: true,
        status: PlaybookStatus.ACTIVE,
        version: '1.0.0',
        config: {
          targetLanguages: ['javascript', 'typescript', 'python', 'java', 'go'],
          estimatedEffort: '1-2 days',
          riskLevel: 'low',
        },
        rules: [
          { id: 'dep-001', name: 'Critical CVE Detection', description: 'Flag dependencies with critical CVEs', pattern: 'cve:critical', action: 'flag', priority: 1 },
          { id: 'dep-002', name: 'Outdated Major Versions', description: 'Identify major version updates available', pattern: 'outdated:major', action: 'flag', priority: 2 },
        ],
        oversightConfig: { level: 'review', approvalRequired: true },
      },
      {
        code: 'PB-202',
        name: 'Secret Management',
        description: 'Remove hardcoded secrets and implement vault integration',
        category: PlaybookCategory.SECURITY,
        isBuiltIn: true,
        status: PlaybookStatus.ACTIVE,
        version: '1.0.0',
        config: {
          targetLanguages: ['javascript', 'typescript', 'python', 'java', 'go', 'yaml'],
          estimatedEffort: '1-3 days',
          riskLevel: 'medium',
        },
        rules: [
          { id: 'sec-001', name: 'Hardcoded Secrets', description: 'Find API keys, passwords, tokens in code', pattern: 'secret:hardcoded', action: 'flag', priority: 1, autoFix: false },
          { id: 'sec-002', name: 'Env File Exposure', description: 'Detect committed .env files', pattern: '.env', action: 'flag', priority: 1 },
        ],
        oversightConfig: { level: 'review', approvalRequired: true },
      },
      {
        code: 'PB-203',
        name: 'Authentication Modernization',
        description: 'Implement SSO, MFA, and OAuth2/OIDC authentication',
        category: PlaybookCategory.SECURITY,
        isBuiltIn: true,
        status: PlaybookStatus.ACTIVE,
        version: '1.0.0',
        config: {
          targetLanguages: ['javascript', 'typescript', 'python', 'java'],
          estimatedEffort: '1-2 weeks',
          riskLevel: 'medium',
        },
        rules: [
          { id: 'auth-001', name: 'Basic Auth Usage', description: 'Find basic authentication implementations', pattern: 'auth:basic', action: 'replace', priority: 1 },
          { id: 'auth-002', name: 'Session Management', description: 'Identify insecure session handling', pattern: 'session:insecure', action: 'flag', priority: 2 },
        ],
        oversightConfig: { level: 'review', approvalRequired: true },
      },
      {
        code: 'PB-204',
        name: 'API Security',
        description: 'Implement rate limiting, input validation, and CORS policies',
        category: PlaybookCategory.SECURITY,
        isBuiltIn: true,
        status: PlaybookStatus.ACTIVE,
        version: '1.0.0',
        config: {
          targetLanguages: ['javascript', 'typescript', 'python', 'java', 'go'],
          estimatedEffort: '3-5 days',
          riskLevel: 'low',
        },
        rules: [
          { id: 'api-001', name: 'Missing Rate Limiting', description: 'Endpoints without rate limiting', pattern: 'api:nolimit', action: 'flag', priority: 1 },
          { id: 'api-002', name: 'SQL Injection', description: 'Detect SQL injection vulnerabilities', pattern: 'sqli', action: 'flag', priority: 1, autoFix: false },
          { id: 'api-003', name: 'XSS Vulnerabilities', description: 'Find cross-site scripting issues', pattern: 'xss', action: 'flag', priority: 1 },
        ],
        oversightConfig: { level: 'review', approvalRequired: true },
      },

      // PB-300: Cost Optimization
      {
        code: 'PB-301',
        name: 'Dead Code Removal',
        description: 'Identify and safely remove unused code, reducing maintenance burden',
        category: PlaybookCategory.COST_OPTIMIZATION,
        isBuiltIn: true,
        status: PlaybookStatus.ACTIVE,
        version: '1.0.0',
        config: {
          targetLanguages: ['javascript', 'typescript', 'python', 'java'],
          estimatedEffort: '2-5 days',
          riskLevel: 'medium',
        },
        rules: [
          { id: 'dead-001', name: 'Unused Exports', description: 'Find exported functions/classes never imported', pattern: 'unused:export', action: 'remove', autoFix: false, priority: 1 },
          { id: 'dead-002', name: 'Unreachable Code', description: 'Find code paths that can never execute', pattern: 'unreachable', action: 'remove', autoFix: true, priority: 2 },
        ],
        oversightConfig: { level: 'review', approvalRequired: true },
      },
      {
        code: 'PB-302',
        name: 'Infrastructure Right-Sizing',
        description: 'Optimize compute, storage, and network resources',
        category: PlaybookCategory.COST_OPTIMIZATION,
        isBuiltIn: true,
        status: PlaybookStatus.ACTIVE,
        version: '1.0.0',
        config: {
          targetLanguages: ['terraform', 'yaml'],
          estimatedEffort: '1-2 weeks',
          riskLevel: 'medium',
        },
        rules: [
          { id: 'cost-001', name: 'Oversized Instances', description: 'Identify over-provisioned compute resources', pattern: 'infra:oversized', action: 'flag', priority: 1 },
          { id: 'cost-002', name: 'Unused Resources', description: 'Find orphaned or unused cloud resources', pattern: 'infra:unused', action: 'flag', priority: 1 },
        ],
        oversightConfig: { level: 'review', approvalRequired: true },
      },
      {
        code: 'PB-303',
        name: 'License Optimization',
        description: 'Identify and eliminate unnecessary software licenses',
        category: PlaybookCategory.COST_OPTIMIZATION,
        isBuiltIn: true,
        status: PlaybookStatus.ACTIVE,
        version: '1.0.0',
        config: {
          targetLanguages: ['javascript', 'typescript', 'python', 'java'],
          estimatedEffort: '2-3 days',
          riskLevel: 'low',
        },
        rules: [
          { id: 'lic-001', name: 'Unused Dependencies', description: 'Find installed but unused packages', pattern: 'dep:unused', action: 'remove', priority: 1 },
          { id: 'lic-002', name: 'License Conflicts', description: 'Identify incompatible licenses', pattern: 'license:conflict', action: 'flag', priority: 2 },
        ],
        oversightConfig: { level: 'notify', approvalRequired: false },
      },
      {
        code: 'PB-304',
        name: 'Build Optimization',
        description: 'Reduce CI/CD costs through caching and parallelization',
        category: PlaybookCategory.COST_OPTIMIZATION,
        isBuiltIn: true,
        status: PlaybookStatus.ACTIVE,
        version: '1.0.0',
        config: {
          targetLanguages: ['yaml'],
          estimatedEffort: '1-3 days',
          riskLevel: 'low',
        },
        rules: [
          { id: 'build-001', name: 'Missing Cache', description: 'CI jobs without caching configured', pattern: 'ci:nocache', action: 'flag', priority: 1 },
          { id: 'build-002', name: 'Sequential Steps', description: 'Find parallelizable build steps', pattern: 'ci:sequential', action: 'flag', priority: 2 },
        ],
        oversightConfig: { level: 'notify', approvalRequired: false },
      },

      // PB-400: Developer Experience
      {
        code: 'PB-401',
        name: 'Monorepo Migration',
        description: 'Consolidate repositories with proper tooling (Nx, Turborepo)',
        category: PlaybookCategory.DEVELOPER_EXPERIENCE,
        isBuiltIn: true,
        status: PlaybookStatus.ACTIVE,
        version: '1.0.0',
        config: {
          targetLanguages: ['javascript', 'typescript'],
          estimatedEffort: '2-4 weeks',
          riskLevel: 'high',
        },
        rules: [
          { id: 'mono-001', name: 'Shared Code Detection', description: 'Find code duplicated across repos', pattern: 'duplicate:cross-repo', action: 'flag', priority: 1 },
          { id: 'mono-002', name: 'Dependency Alignment', description: 'Identify version mismatches', pattern: 'dep:mismatch', action: 'flag', priority: 2 },
        ],
        oversightConfig: { level: 'collaborate', approvalRequired: true },
      },
      {
        code: 'PB-402',
        name: 'CI/CD Modernization',
        description: 'Implement trunk-based development and feature flags',
        category: PlaybookCategory.DEVELOPER_EXPERIENCE,
        isBuiltIn: true,
        status: PlaybookStatus.ACTIVE,
        version: '1.0.0',
        config: {
          targetLanguages: ['yaml'],
          estimatedEffort: '1-2 weeks',
          riskLevel: 'medium',
        },
        rules: [
          { id: 'cicd-001', name: 'Long-Lived Branches', description: 'Detect non-trunk branches older than 2 weeks', pattern: 'git:longbranch', action: 'flag', priority: 2 },
          { id: 'cicd-002', name: 'Missing Pipeline', description: 'Repos without CI/CD configuration', pattern: 'ci:missing', action: 'flag', priority: 1 },
        ],
        oversightConfig: { level: 'review', approvalRequired: true },
      },
      {
        code: 'PB-403',
        name: 'Documentation Generation',
        description: 'Auto-generate API docs, architecture diagrams, and ADRs',
        category: PlaybookCategory.DEVELOPER_EXPERIENCE,
        isBuiltIn: true,
        status: PlaybookStatus.ACTIVE,
        version: '1.0.0',
        config: {
          targetLanguages: ['javascript', 'typescript', 'python', 'java', 'go'],
          estimatedEffort: '2-5 days',
          riskLevel: 'low',
        },
        rules: [
          { id: 'doc-001', name: 'Missing README', description: 'Projects without documentation', pattern: 'doc:noreadme', action: 'flag', priority: 1 },
          { id: 'doc-002', name: 'Undocumented APIs', description: 'API endpoints without OpenAPI/Swagger', pattern: 'api:nodoc', action: 'flag', priority: 2 },
        ],
        oversightConfig: { level: 'autonomous', approvalRequired: false },
      },
      {
        code: 'PB-404',
        name: 'Testing Infrastructure',
        description: 'Implement unit, integration, and e2e test frameworks',
        category: PlaybookCategory.DEVELOPER_EXPERIENCE,
        isBuiltIn: true,
        status: PlaybookStatus.ACTIVE,
        version: '1.0.0',
        config: {
          targetLanguages: ['javascript', 'typescript', 'python', 'java', 'go'],
          estimatedEffort: '1-3 weeks',
          riskLevel: 'low',
        },
        rules: [
          { id: 'test-001', name: 'Low Coverage', description: 'Modules with <60% test coverage', pattern: 'test:lowcoverage', action: 'flag', priority: 1 },
          { id: 'test-002', name: 'Missing E2E Tests', description: 'Critical paths without e2e coverage', pattern: 'test:noe2e', action: 'flag', priority: 2 },
        ],
        oversightConfig: { level: 'notify', approvalRequired: false },
      },

      // PB-500: Compliance and Governance
      {
        code: 'PB-501',
        name: 'SOC2 Readiness',
        description: 'Implement logging, access controls, and audit trails for SOC2 compliance',
        category: PlaybookCategory.COMPLIANCE,
        isBuiltIn: true,
        status: PlaybookStatus.ACTIVE,
        version: '1.0.0',
        config: {
          targetLanguages: ['javascript', 'typescript', 'python', 'java', 'go'],
          estimatedEffort: '2-4 weeks',
          riskLevel: 'medium',
        },
        rules: [
          { id: 'soc-001', name: 'Missing Audit Logs', description: 'Operations without audit logging', pattern: 'audit:missing', action: 'flag', priority: 1 },
          { id: 'soc-002', name: 'Access Control Gaps', description: 'Resources without proper RBAC', pattern: 'rbac:missing', action: 'flag', priority: 1 },
        ],
        oversightConfig: { level: 'review', approvalRequired: true },
      },
      {
        code: 'PB-502',
        name: 'GDPR Compliance',
        description: 'Data mapping, consent management, and deletion workflows',
        category: PlaybookCategory.COMPLIANCE,
        isBuiltIn: true,
        status: PlaybookStatus.ACTIVE,
        version: '1.0.0',
        config: {
          targetLanguages: ['javascript', 'typescript', 'python', 'java'],
          estimatedEffort: '2-6 weeks',
          riskLevel: 'high',
        },
        rules: [
          { id: 'gdpr-001', name: 'PII Storage', description: 'Identify personally identifiable information storage', pattern: 'pii:storage', action: 'flag', priority: 1 },
          { id: 'gdpr-002', name: 'Missing Consent', description: 'Data collection without consent tracking', pattern: 'consent:missing', action: 'flag', priority: 1 },
        ],
        oversightConfig: { level: 'review', approvalRequired: true },
      },
      {
        code: 'PB-503',
        name: 'HIPAA Compliance',
        description: 'PHI identification, encryption, and access logging for healthcare',
        category: PlaybookCategory.COMPLIANCE,
        isBuiltIn: true,
        status: PlaybookStatus.ACTIVE,
        version: '1.0.0',
        config: {
          targetLanguages: ['javascript', 'typescript', 'python', 'java'],
          estimatedEffort: '4-8 weeks',
          riskLevel: 'high',
        },
        rules: [
          { id: 'hipaa-001', name: 'PHI Detection', description: 'Find protected health information', pattern: 'phi:detected', action: 'flag', priority: 1 },
          { id: 'hipaa-002', name: 'Encryption at Rest', description: 'Data storage without encryption', pattern: 'encrypt:missing', action: 'flag', priority: 1 },
        ],
        oversightConfig: { level: 'collaborate', approvalRequired: true },
      },
      {
        code: 'PB-504',
        name: 'PCI-DSS Compliance',
        description: 'Cardholder data handling and network segmentation',
        category: PlaybookCategory.COMPLIANCE,
        isBuiltIn: true,
        status: PlaybookStatus.ACTIVE,
        version: '1.0.0',
        config: {
          targetLanguages: ['javascript', 'typescript', 'python', 'java'],
          estimatedEffort: '4-8 weeks',
          riskLevel: 'high',
        },
        rules: [
          { id: 'pci-001', name: 'Card Data Storage', description: 'Find stored cardholder data', pattern: 'card:stored', action: 'flag', priority: 1 },
          { id: 'pci-002', name: 'Transmission Security', description: 'Unencrypted card data transmission', pattern: 'card:unencrypted', action: 'flag', priority: 1 },
        ],
        oversightConfig: { level: 'collaborate', approvalRequired: true },
      },
    ];

    for (const playbook of builtInPlaybooks) {
      const existing = await this.playbookRepository.findOne({
        where: { code: playbook.code, isBuiltIn: true },
      });
      if (!existing) {
        await this.playbookRepository.save(this.playbookRepository.create(playbook));
      }
    }
  }
}
