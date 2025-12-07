import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Transformation,
  TransformationStatus,
  OversightLevel,
} from '../entities/transformation.entity';
import { CreateTransformationDto } from '../dto/create-transformation.dto';

@Injectable()
export class TransformationService {
  constructor(
    @InjectRepository(Transformation)
    private readonly transformationRepository: Repository<Transformation>,
  ) {}

  async create(createTransformationDto: CreateTransformationDto, userId: string): Promise<Transformation> {
    const transformation = this.transformationRepository.create({
      ...createTransformationDto,
      status: TransformationStatus.DRAFT,
      createdBy: userId,
      rollback: { available: false },
    });
    return await this.transformationRepository.save(transformation);
  }

  async findAllByCodebase(codebaseId: string): Promise<Transformation[]> {
    return await this.transformationRepository.find({
      where: { codebaseId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Transformation> {
    const transformation = await this.transformationRepository.findOne({
      where: { id },
      relations: ['codebase'],
    });

    if (!transformation) {
      throw new NotFoundException(`Transformation with ID ${id} not found`);
    }

    return transformation;
  }

  async submitForApproval(id: string): Promise<Transformation> {
    const transformation = await this.findOne(id);
    if (transformation.status !== TransformationStatus.DRAFT) {
      throw new BadRequestException('Only draft transformations can be submitted for approval');
    }
    transformation.status = TransformationStatus.PENDING_APPROVAL;
    return await this.transformationRepository.save(transformation);
  }

  async approve(id: string, userId: string, comment?: string): Promise<Transformation> {
    const transformation = await this.findOne(id);
    if (transformation.status !== TransformationStatus.PENDING_APPROVAL) {
      throw new BadRequestException('Transformation is not pending approval');
    }

    transformation.approvals.push({
      userId,
      action: 'approved',
      comment,
      timestamp: new Date(),
    });
    transformation.status = TransformationStatus.APPROVED;
    return await this.transformationRepository.save(transformation);
  }

  async reject(id: string, userId: string, comment: string): Promise<Transformation> {
    const transformation = await this.findOne(id);
    if (transformation.status !== TransformationStatus.PENDING_APPROVAL) {
      throw new BadRequestException('Transformation is not pending approval');
    }

    transformation.approvals.push({
      userId,
      action: 'rejected',
      comment,
      timestamp: new Date(),
    });
    transformation.status = TransformationStatus.DRAFT;
    return await this.transformationRepository.save(transformation);
  }

  async queue(id: string): Promise<Transformation> {
    const transformation = await this.findOne(id);
    const allowedStatuses = [TransformationStatus.APPROVED, TransformationStatus.DRAFT];

    if (!allowedStatuses.includes(transformation.status)) {
      throw new BadRequestException('Transformation cannot be queued in current state');
    }

    // If oversight level is autonomous, skip approval
    if (
      transformation.oversightLevel === OversightLevel.AUTONOMOUS &&
      transformation.status === TransformationStatus.DRAFT
    ) {
      transformation.status = TransformationStatus.QUEUED;
    } else if (transformation.status === TransformationStatus.APPROVED) {
      transformation.status = TransformationStatus.QUEUED;
    } else {
      throw new BadRequestException('Transformation requires approval before execution');
    }

    return await this.transformationRepository.save(transformation);
  }

  async start(id: string): Promise<Transformation> {
    const transformation = await this.findOne(id);
    if (transformation.status !== TransformationStatus.QUEUED) {
      throw new BadRequestException('Only queued transformations can be started');
    }

    transformation.status = TransformationStatus.RUNNING;
    transformation.execution = {
      ...transformation.execution,
      startedAt: new Date(),
      progress: 0,
    };
    return await this.transformationRepository.save(transformation);
  }

  async updateProgress(id: string, progress: number, currentStep?: string): Promise<Transformation> {
    const transformation = await this.findOne(id);
    transformation.execution = {
      ...transformation.execution,
      progress,
      currentStep,
    };
    return await this.transformationRepository.save(transformation);
  }

  async complete(id: string, output: Transformation['output']): Promise<Transformation> {
    const transformation = await this.findOne(id);
    transformation.status = TransformationStatus.COMPLETED;
    transformation.execution = {
      ...transformation.execution,
      completedAt: new Date(),
      progress: 100,
    };
    transformation.output = output;
    transformation.rollback = { available: true, backupRef: `backup-${id}` };
    return await this.transformationRepository.save(transformation);
  }

  async fail(id: string, errorMessage: string): Promise<Transformation> {
    const transformation = await this.findOne(id);
    transformation.status = TransformationStatus.FAILED;
    transformation.execution = {
      ...transformation.execution,
      completedAt: new Date(),
    };
    transformation.errorMessage = errorMessage;
    return await this.transformationRepository.save(transformation);
  }

  async pause(id: string): Promise<Transformation> {
    const transformation = await this.findOne(id);
    if (transformation.status !== TransformationStatus.RUNNING) {
      throw new BadRequestException('Only running transformations can be paused');
    }
    transformation.status = TransformationStatus.PAUSED;
    return await this.transformationRepository.save(transformation);
  }

  async resume(id: string): Promise<Transformation> {
    const transformation = await this.findOne(id);
    if (transformation.status !== TransformationStatus.PAUSED) {
      throw new BadRequestException('Only paused transformations can be resumed');
    }
    transformation.status = TransformationStatus.RUNNING;
    return await this.transformationRepository.save(transformation);
  }

  async cancel(id: string): Promise<Transformation> {
    const transformation = await this.findOne(id);
    const cancellableStatuses = [
      TransformationStatus.QUEUED,
      TransformationStatus.RUNNING,
      TransformationStatus.PAUSED,
    ];
    if (!cancellableStatuses.includes(transformation.status)) {
      throw new BadRequestException('Transformation cannot be cancelled in current state');
    }
    transformation.status = TransformationStatus.CANCELLED;
    return await this.transformationRepository.save(transformation);
  }

  async rollback(id: string): Promise<Transformation> {
    const transformation = await this.findOne(id);
    if (!transformation.rollback?.available) {
      throw new BadRequestException('Rollback not available for this transformation');
    }
    transformation.status = TransformationStatus.ROLLED_BACK;
    return await this.transformationRepository.save(transformation);
  }

  async remove(id: string): Promise<void> {
    const transformation = await this.findOne(id);
    await this.transformationRepository.remove(transformation);
  }
}
