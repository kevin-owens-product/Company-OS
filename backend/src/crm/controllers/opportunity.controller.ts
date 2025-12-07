import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../../tenants/guards/tenant.guard';
import { OpportunityService } from '../services/opportunity.service';
import { Opportunity, OpportunityStage } from '../entities/opportunity.entity';
import { CreateOpportunityDto } from '../dto/create-opportunity.dto';

@ApiTags('opportunities')
@Controller('opportunities')
@UseGuards(JwtAuthGuard, TenantGuard)
@ApiBearerAuth()
export class OpportunityController {
  constructor(private readonly opportunityService: OpportunityService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new opportunity' })
  @ApiResponse({ status: 201, description: 'Opportunity created successfully', type: Opportunity })
  create(@Body() createOpportunityDto: CreateOpportunityDto): Promise<Opportunity> {
    return this.opportunityService.create(createOpportunityDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all opportunities' })
  @ApiResponse({ status: 200, description: 'Return all opportunities', type: [Opportunity] })
  findAll(@Query('tenantId') tenantId: string): Promise<Opportunity[]> {
    return this.opportunityService.findAll(tenantId);
  }

  @Get('pipeline-value')
  @ApiOperation({ summary: 'Get total pipeline value' })
  @ApiResponse({ status: 200, description: 'Return the total pipeline value' })
  getPipelineValue(@Query('tenantId') tenantId: string): Promise<number> {
    return this.opportunityService.calculatePipelineValue(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an opportunity by id' })
  @ApiResponse({ status: 200, description: 'Return the opportunity', type: Opportunity })
  findOne(@Param('id') id: string, @Query('tenantId') tenantId: string): Promise<Opportunity> {
    return this.opportunityService.findOne(id, tenantId);
  }

  @Get('customer/:customerId')
  @ApiOperation({ summary: 'Get all opportunities for a customer' })
  @ApiResponse({ status: 200, description: 'Return opportunities for the customer', type: [Opportunity] })
  findByCustomer(
    @Param('customerId') customerId: string,
    @Query('tenantId') tenantId: string,
  ): Promise<Opportunity[]> {
    return this.opportunityService.findByCustomer(customerId, tenantId);
  }

  @Get('stage/:stage')
  @ApiOperation({ summary: 'Get all opportunities by stage' })
  @ApiResponse({ status: 200, description: 'Return opportunities by stage', type: [Opportunity] })
  findByStage(
    @Param('stage') stage: OpportunityStage,
    @Query('tenantId') tenantId: string,
  ): Promise<Opportunity[]> {
    return this.opportunityService.findByStage(stage, tenantId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an opportunity' })
  @ApiResponse({ status: 200, description: 'Opportunity updated successfully', type: Opportunity })
  update(
    @Param('id') id: string,
    @Body() updateOpportunityDto: Partial<CreateOpportunityDto>,
  ): Promise<Opportunity> {
    return this.opportunityService.update(id, updateOpportunityDto);
  }

  @Patch(':id/stage')
  @ApiOperation({ summary: 'Update opportunity stage' })
  @ApiResponse({ status: 200, description: 'Opportunity stage updated successfully', type: Opportunity })
  updateStage(
    @Param('id') id: string,
    @Body('stage') stage: OpportunityStage,
  ): Promise<Opportunity> {
    return this.opportunityService.updateStage(id, stage);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an opportunity' })
  @ApiResponse({ status: 200, description: 'Opportunity deleted successfully' })
  remove(@Param('id') id: string, @Query('tenantId') tenantId: string): Promise<void> {
    return this.opportunityService.remove(id, tenantId);
  }
}
