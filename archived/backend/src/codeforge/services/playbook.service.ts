import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Playbook, PlaybookCategory, PlaybookStatus } from '../entities/playbook.entity';
import { CreatePlaybookDto } from '../dto/create-playbook.dto';
import { UpdatePlaybookDto } from '../dto/update-playbook.dto';

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
          {
            id: 'dep-001',
            name: 'Critical CVE Detection',
            description: 'Flag dependencies with critical CVEs',
            pattern: 'cve:critical',
            action: 'flag',
            priority: 1,
          },
          {
            id: 'dep-002',
            name: 'Outdated Major Versions',
            description: 'Identify major version updates available',
            pattern: 'outdated:major',
            action: 'flag',
            priority: 2,
          },
        ],
        oversightConfig: {
          level: 'review',
          approvalRequired: true,
        },
      },
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
          {
            id: 'dead-001',
            name: 'Unused Exports',
            description: 'Find exported functions/classes never imported',
            pattern: 'unused:export',
            action: 'remove',
            autoFix: false,
            priority: 1,
          },
          {
            id: 'dead-002',
            name: 'Unreachable Code',
            description: 'Find code paths that can never execute',
            pattern: 'unreachable',
            action: 'remove',
            autoFix: true,
            priority: 2,
          },
        ],
        oversightConfig: {
          level: 'review',
          approvalRequired: true,
        },
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
