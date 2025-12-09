import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Opportunity, OpportunityStage } from '../entities/opportunity.entity';
import { CreateOpportunityDto } from '../dto/create-opportunity.dto';

@Injectable()
export class OpportunityService {
  constructor(
    @InjectRepository(Opportunity)
    private readonly opportunityRepository: Repository<Opportunity>,
  ) {}

  async create(createOpportunityDto: CreateOpportunityDto): Promise<Opportunity> {
    const opportunity = this.opportunityRepository.create({
      ...createOpportunityDto,
      customer: { id: createOpportunityDto.customerId },
      tenant: { id: createOpportunityDto.tenantId },
    });
    return await this.opportunityRepository.save(opportunity);
  }

  async findAll(tenantId: string): Promise<Opportunity[]> {
    return await this.opportunityRepository.find({
      where: { tenant: { id: tenantId } },
      relations: ['customer'],
    });
  }

  async findOne(id: string, tenantId: string): Promise<Opportunity> {
    const opportunity = await this.opportunityRepository.findOne({
      where: { id, tenant: { id: tenantId } },
      relations: ['customer'],
    });

    if (!opportunity) {
      throw new NotFoundException(`Opportunity with ID ${id} not found`);
    }

    return opportunity;
  }

  async findByCustomer(customerId: string, tenantId: string): Promise<Opportunity[]> {
    return await this.opportunityRepository.find({
      where: { customer: { id: customerId }, tenant: { id: tenantId } },
    });
  }

  async findByStage(stage: OpportunityStage, tenantId: string): Promise<Opportunity[]> {
    return await this.opportunityRepository.find({
      where: { stage, tenant: { id: tenantId } },
      relations: ['customer'],
    });
  }

  async update(id: string, updateOpportunityDto: Partial<CreateOpportunityDto>): Promise<Opportunity> {
    const opportunity = await this.opportunityRepository.preload({
      id,
      ...updateOpportunityDto,
    });

    if (!opportunity) {
      throw new NotFoundException(`Opportunity with ID ${id} not found`);
    }

    return await this.opportunityRepository.save(opportunity);
  }

  async updateStage(id: string, stage: OpportunityStage): Promise<Opportunity> {
    const opportunity = await this.opportunityRepository.findOne({
      where: { id },
    });

    if (!opportunity) {
      throw new NotFoundException(`Opportunity with ID ${id} not found`);
    }

    opportunity.stage = stage;
    return await this.opportunityRepository.save(opportunity);
  }

  async remove(id: string, tenantId: string): Promise<void> {
    const opportunity = await this.findOne(id, tenantId);
    await this.opportunityRepository.remove(opportunity);
  }

  async calculatePipelineValue(tenantId: string): Promise<number> {
    const opportunities = await this.opportunityRepository.find({
      where: { tenant: { id: tenantId } },
    });

    return opportunities.reduce((total, opp) => {
      if (opp.stage !== OpportunityStage.CLOSED_LOST) {
        return total + Number(opp.value) * Number(opp.probability);
      }
      return total;
    }, 0);
  }
}
