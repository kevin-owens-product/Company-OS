import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Finding, FindingSeverity, FindingCategory, FindingStatus } from '../entities/finding.entity';
import { CreateFindingDto } from '../dto/create-finding.dto';

@Injectable()
export class FindingService {
  constructor(
    @InjectRepository(Finding)
    private readonly findingRepository: Repository<Finding>,
  ) {}

  async create(createFindingDto: CreateFindingDto): Promise<Finding> {
    const finding = this.findingRepository.create({
      ...createFindingDto,
      status: FindingStatus.OPEN,
    });
    return await this.findingRepository.save(finding);
  }

  async createBatch(findings: CreateFindingDto[]): Promise<Finding[]> {
    const entities = findings.map((dto) =>
      this.findingRepository.create({
        ...dto,
        status: FindingStatus.OPEN,
      }),
    );
    return await this.findingRepository.save(entities);
  }

  async findAllByRepository(repositoryId: string): Promise<Finding[]> {
    return await this.findingRepository.find({
      where: { repositoryId },
      order: { severity: 'ASC', createdAt: 'DESC' },
    });
  }

  async findAllByAnalysis(analysisId: string): Promise<Finding[]> {
    return await this.findingRepository.find({
      where: { analysisId },
      order: { severity: 'ASC', createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Finding> {
    const finding = await this.findingRepository.findOne({
      where: { id },
      relations: ['repository', 'analysis'],
    });

    if (!finding) {
      throw new NotFoundException(`Finding with ID ${id} not found`);
    }

    return finding;
  }

  async updateStatus(id: string, status: FindingStatus): Promise<Finding> {
    const finding = await this.findOne(id);
    finding.status = status;
    return await this.findingRepository.save(finding);
  }

  async getStatsBySeverity(repositoryId: string): Promise<Record<FindingSeverity, number>> {
    const results = await this.findingRepository
      .createQueryBuilder('finding')
      .select('finding.severity', 'severity')
      .addSelect('COUNT(*)', 'count')
      .where('finding.repositoryId = :repositoryId', { repositoryId })
      .andWhere('finding.status = :status', { status: FindingStatus.OPEN })
      .groupBy('finding.severity')
      .getRawMany();

    const stats: Record<string, number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      info: 0,
    };

    results.forEach((r) => {
      stats[r.severity] = parseInt(r.count, 10);
    });

    return stats as Record<FindingSeverity, number>;
  }

  async getStatsByCategory(repositoryId: string): Promise<Record<FindingCategory, number>> {
    const results = await this.findingRepository
      .createQueryBuilder('finding')
      .select('finding.category', 'category')
      .addSelect('COUNT(*)', 'count')
      .where('finding.repositoryId = :repositoryId', { repositoryId })
      .andWhere('finding.status = :status', { status: FindingStatus.OPEN })
      .groupBy('finding.category')
      .getRawMany();

    const stats: Record<string, number> = {};
    results.forEach((r) => {
      stats[r.category] = parseInt(r.count, 10);
    });

    return stats as Record<FindingCategory, number>;
  }

  async remove(id: string): Promise<void> {
    const finding = await this.findOne(id);
    await this.findingRepository.remove(finding);
  }
}
