import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Codebase, CodebaseStatus } from '../entities/codebase.entity';
import { CreateCodebaseDto } from '../dto/create-codebase.dto';
import { UpdateCodebaseDto } from '../dto/update-codebase.dto';

@Injectable()
export class CodebaseService {
  constructor(
    @InjectRepository(Codebase)
    private readonly codebaseRepository: Repository<Codebase>,
  ) {}

  async create(createCodebaseDto: CreateCodebaseDto, tenantId: string): Promise<Codebase> {
    const codebase = this.codebaseRepository.create({
      ...createCodebaseDto,
      tenantId,
      status: CodebaseStatus.PENDING,
    });
    return await this.codebaseRepository.save(codebase);
  }

  async findAll(tenantId: string): Promise<Codebase[]> {
    return await this.codebaseRepository.find({
      where: { tenantId },
      relations: ['repositories'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, tenantId: string): Promise<Codebase> {
    const codebase = await this.codebaseRepository.findOne({
      where: { id, tenantId },
      relations: ['repositories', 'analyses', 'transformations'],
    });

    if (!codebase) {
      throw new NotFoundException(`Codebase with ID ${id} not found`);
    }

    return codebase;
  }

  async update(id: string, updateCodebaseDto: UpdateCodebaseDto, tenantId: string): Promise<Codebase> {
    const codebase = await this.findOne(id, tenantId);
    Object.assign(codebase, updateCodebaseDto);
    return await this.codebaseRepository.save(codebase);
  }

  async updateStatus(id: string, status: CodebaseStatus): Promise<Codebase> {
    const codebase = await this.codebaseRepository.findOne({ where: { id } });
    if (!codebase) {
      throw new NotFoundException(`Codebase with ID ${id} not found`);
    }
    codebase.status = status;
    return await this.codebaseRepository.save(codebase);
  }

  async updateMetadata(id: string, metadata: Partial<Codebase['metadata']>): Promise<Codebase> {
    const codebase = await this.codebaseRepository.findOne({ where: { id } });
    if (!codebase) {
      throw new NotFoundException(`Codebase with ID ${id} not found`);
    }
    codebase.metadata = { ...codebase.metadata, ...metadata };
    return await this.codebaseRepository.save(codebase);
  }

  async remove(id: string, tenantId: string): Promise<void> {
    const codebase = await this.findOne(id, tenantId);
    await this.codebaseRepository.remove(codebase);
  }

  async getStatistics(id: string, tenantId: string): Promise<{
    repositoryCount: number;
    totalFindings: number;
    findingsBySeverity: Record<string, number>;
    analysisCount: number;
    transformationCount: number;
  }> {
    const codebase = await this.findOne(id, tenantId);

    return {
      repositoryCount: codebase.repositories?.length || 0,
      totalFindings: 0, // TODO: Aggregate from findings
      findingsBySeverity: {},
      analysisCount: codebase.analyses?.length || 0,
      transformationCount: codebase.transformations?.length || 0,
    };
  }
}
