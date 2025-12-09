import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity, ActivityStatus, ActivityType } from '../entities/activity.entity';
import { CreateActivityDto } from '../dto/create-activity.dto';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
  ) {}

  async create(createActivityDto: CreateActivityDto): Promise<Activity> {
    const activity = this.activityRepository.create({
      ...createActivityDto,
      customer: { id: createActivityDto.customerId },
      contact: createActivityDto.contactId ? { id: createActivityDto.contactId } : undefined,
      opportunity: createActivityDto.opportunityId ? { id: createActivityDto.opportunityId } : undefined,
      tenant: { id: createActivityDto.tenantId },
    });
    return await this.activityRepository.save(activity);
  }

  async findAll(tenantId: string): Promise<Activity[]> {
    return await this.activityRepository.find({
      where: { tenant: { id: tenantId } },
      relations: ['customer', 'contact', 'opportunity'],
    });
  }

  async findOne(id: string, tenantId: string): Promise<Activity> {
    const activity = await this.activityRepository.findOne({
      where: { id, tenant: { id: tenantId } },
      relations: ['customer', 'contact', 'opportunity'],
    });

    if (!activity) {
      throw new NotFoundException(`Activity with ID ${id} not found`);
    }

    return activity;
  }

  async findByCustomer(customerId: string, tenantId: string): Promise<Activity[]> {
    return await this.activityRepository.find({
      where: { customer: { id: customerId }, tenant: { id: tenantId } },
      relations: ['contact', 'opportunity'],
    });
  }

  async findByContact(contactId: string, tenantId: string): Promise<Activity[]> {
    return await this.activityRepository.find({
      where: { contact: { id: contactId }, tenant: { id: tenantId } },
      relations: ['customer', 'opportunity'],
    });
  }

  async findByOpportunity(opportunityId: string, tenantId: string): Promise<Activity[]> {
    return await this.activityRepository.find({
      where: { opportunity: { id: opportunityId }, tenant: { id: tenantId } },
      relations: ['customer', 'contact'],
    });
  }

  async findByType(type: ActivityType, tenantId: string): Promise<Activity[]> {
    return await this.activityRepository.find({
      where: { type, tenant: { id: tenantId } },
      relations: ['customer', 'contact', 'opportunity'],
    });
  }

  async findByStatus(status: ActivityStatus, tenantId: string): Promise<Activity[]> {
    return await this.activityRepository.find({
      where: { status, tenant: { id: tenantId } },
      relations: ['customer', 'contact', 'opportunity'],
    });
  }

  async update(id: string, updateActivityDto: Partial<CreateActivityDto>): Promise<Activity> {
    const activity = await this.activityRepository.preload({
      id,
      ...updateActivityDto,
    });

    if (!activity) {
      throw new NotFoundException(`Activity with ID ${id} not found`);
    }

    return await this.activityRepository.save(activity);
  }

  async complete(id: string): Promise<Activity> {
    const activity = await this.activityRepository.findOne({
      where: { id },
    });

    if (!activity) {
      throw new NotFoundException(`Activity with ID ${id} not found`);
    }

    activity.status = ActivityStatus.COMPLETED;
    activity.completedAt = new Date();
    return await this.activityRepository.save(activity);
  }

  async remove(id: string, tenantId: string): Promise<void> {
    const activity = await this.findOne(id, tenantId);
    await this.activityRepository.remove(activity);
  }
}
