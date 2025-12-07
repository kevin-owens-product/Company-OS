import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Analysis, AnalysisStatus, AnalysisType } from '../entities/analysis.entity';
import { CreateAnalysisDto } from '../dto/create-analysis.dto';

@Injectable()
export class AnalysisService {
  constructor(
    @InjectRepository(Analysis)
    private readonly analysisRepository: Repository<Analysis>,
  ) {}

  async create(createAnalysisDto: CreateAnalysisDto): Promise<Analysis> {
    const analysis = this.analysisRepository.create({
      ...createAnalysisDto,
      status: AnalysisStatus.QUEUED,
    });
    return await this.analysisRepository.save(analysis);
  }

  async findAllByCodebase(codebaseId: string): Promise<Analysis[]> {
    return await this.analysisRepository.find({
      where: { codebaseId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Analysis> {
    const analysis = await this.analysisRepository.findOne({
      where: { id },
      relations: ['findings', 'codebase'],
    });

    if (!analysis) {
      throw new NotFoundException(`Analysis with ID ${id} not found`);
    }

    return analysis;
  }

  async start(id: string): Promise<Analysis> {
    const analysis = await this.findOne(id);
    analysis.status = AnalysisStatus.RUNNING;
    analysis.startedAt = new Date();
    return await this.analysisRepository.save(analysis);
  }

  async complete(id: string, results: Analysis['results'], summary?: Analysis['summary']): Promise<Analysis> {
    const analysis = await this.findOne(id);
    analysis.status = AnalysisStatus.COMPLETED;
    analysis.completedAt = new Date();
    analysis.results = results;
    if (summary) {
      analysis.summary = summary;
    }
    return await this.analysisRepository.save(analysis);
  }

  async fail(id: string, errorMessage: string): Promise<Analysis> {
    const analysis = await this.findOne(id);
    analysis.status = AnalysisStatus.FAILED;
    analysis.completedAt = new Date();
    analysis.errorMessage = errorMessage;
    return await this.analysisRepository.save(analysis);
  }

  async cancel(id: string): Promise<Analysis> {
    const analysis = await this.findOne(id);
    analysis.status = AnalysisStatus.CANCELLED;
    analysis.completedAt = new Date();
    return await this.analysisRepository.save(analysis);
  }

  async getLatestByCodebase(codebaseId: string, type?: AnalysisType): Promise<Analysis | null> {
    const query: any = { codebaseId, status: AnalysisStatus.COMPLETED };
    if (type) {
      query.type = type;
    }
    return await this.analysisRepository.findOne({
      where: query,
      order: { completedAt: 'DESC' },
    });
  }

  async remove(id: string): Promise<void> {
    const analysis = await this.findOne(id);
    await this.analysisRepository.remove(analysis);
  }
}
