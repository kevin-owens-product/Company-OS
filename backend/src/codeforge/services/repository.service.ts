import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository as TypeOrmRepository } from 'typeorm';
import { Repository, RepositoryStatus } from '../entities/repository.entity';
import { CreateRepositoryDto } from '../dto/create-repository.dto';
import { UpdateRepositoryDto } from '../dto/update-repository.dto';

@Injectable()
export class RepositoryService {
  constructor(
    @InjectRepository(Repository)
    private readonly repositoryRepository: TypeOrmRepository<Repository>,
  ) {}

  async create(createRepositoryDto: CreateRepositoryDto): Promise<Repository> {
    const repository = this.repositoryRepository.create({
      ...createRepositoryDto,
      status: RepositoryStatus.PENDING,
    });
    return await this.repositoryRepository.save(repository);
  }

  async findAllByCodebase(codebaseId: string): Promise<Repository[]> {
    return await this.repositoryRepository.find({
      where: { codebaseId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Repository> {
    const repository = await this.repositoryRepository.findOne({
      where: { id },
      relations: ['findings', 'codebase'],
    });

    if (!repository) {
      throw new NotFoundException(`Repository with ID ${id} not found`);
    }

    return repository;
  }

  async update(id: string, updateRepositoryDto: UpdateRepositoryDto): Promise<Repository> {
    const repository = await this.findOne(id);
    Object.assign(repository, updateRepositoryDto);
    return await this.repositoryRepository.save(repository);
  }

  async updateStatus(id: string, status: RepositoryStatus): Promise<Repository> {
    const repository = await this.findOne(id);
    repository.status = status;
    return await this.repositoryRepository.save(repository);
  }

  async updateMetadata(id: string, metadata: Partial<Repository['metadata']>): Promise<Repository> {
    const repository = await this.findOne(id);
    repository.metadata = { ...repository.metadata, ...metadata };
    return await this.repositoryRepository.save(repository);
  }

  async remove(id: string): Promise<void> {
    const repository = await this.findOne(id);
    await this.repositoryRepository.remove(repository);
  }

  async findByRemoteUrl(remoteUrl: string, codebaseId: string): Promise<Repository | null> {
    return await this.repositoryRepository.findOne({
      where: { remoteUrl, codebaseId },
    });
  }
}
