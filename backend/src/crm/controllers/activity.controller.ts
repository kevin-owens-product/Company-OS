import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../../tenants/guards/tenant.guard';
import { ActivityService } from '../services/activity.service';
import { Activity, ActivityType, ActivityStatus } from '../entities/activity.entity';
import { CreateActivityDto } from '../dto/create-activity.dto';

@ApiTags('activities')
@Controller('activities')
@UseGuards(JwtAuthGuard, TenantGuard)
@ApiBearerAuth()
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new activity' })
  @ApiResponse({ status: 201, description: 'Activity created successfully', type: Activity })
  create(@Body() createActivityDto: CreateActivityDto): Promise<Activity> {
    return this.activityService.create(createActivityDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all activities' })
  @ApiResponse({ status: 200, description: 'Return all activities', type: [Activity] })
  findAll(@Query('tenantId') tenantId: string): Promise<Activity[]> {
    return this.activityService.findAll(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an activity by id' })
  @ApiResponse({ status: 200, description: 'Return the activity', type: Activity })
  findOne(@Param('id') id: string, @Query('tenantId') tenantId: string): Promise<Activity> {
    return this.activityService.findOne(id, tenantId);
  }

  @Get('customer/:customerId')
  @ApiOperation({ summary: 'Get all activities for a customer' })
  @ApiResponse({ status: 200, description: 'Return activities for the customer', type: [Activity] })
  findByCustomer(
    @Param('customerId') customerId: string,
    @Query('tenantId') tenantId: string,
  ): Promise<Activity[]> {
    return this.activityService.findByCustomer(customerId, tenantId);
  }

  @Get('contact/:contactId')
  @ApiOperation({ summary: 'Get all activities for a contact' })
  @ApiResponse({ status: 200, description: 'Return activities for the contact', type: [Activity] })
  findByContact(
    @Param('contactId') contactId: string,
    @Query('tenantId') tenantId: string,
  ): Promise<Activity[]> {
    return this.activityService.findByContact(contactId, tenantId);
  }

  @Get('opportunity/:opportunityId')
  @ApiOperation({ summary: 'Get all activities for an opportunity' })
  @ApiResponse({ status: 200, description: 'Return activities for the opportunity', type: [Activity] })
  findByOpportunity(
    @Param('opportunityId') opportunityId: string,
    @Query('tenantId') tenantId: string,
  ): Promise<Activity[]> {
    return this.activityService.findByOpportunity(opportunityId, tenantId);
  }

  @Get('type/:type')
  @ApiOperation({ summary: 'Get all activities by type' })
  @ApiResponse({ status: 200, description: 'Return activities by type', type: [Activity] })
  findByType(
    @Param('type') type: ActivityType,
    @Query('tenantId') tenantId: string,
  ): Promise<Activity[]> {
    return this.activityService.findByType(type, tenantId);
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Get all activities by status' })
  @ApiResponse({ status: 200, description: 'Return activities by status', type: [Activity] })
  findByStatus(
    @Param('status') status: ActivityStatus,
    @Query('tenantId') tenantId: string,
  ): Promise<Activity[]> {
    return this.activityService.findByStatus(status, tenantId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an activity' })
  @ApiResponse({ status: 200, description: 'Activity updated successfully', type: Activity })
  update(
    @Param('id') id: string,
    @Body() updateActivityDto: Partial<CreateActivityDto>,
  ): Promise<Activity> {
    return this.activityService.update(id, updateActivityDto);
  }

  @Patch(':id/complete')
  @ApiOperation({ summary: 'Mark an activity as completed' })
  @ApiResponse({ status: 200, description: 'Activity marked as completed', type: Activity })
  complete(@Param('id') id: string): Promise<Activity> {
    return this.activityService.complete(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an activity' })
  @ApiResponse({ status: 200, description: 'Activity deleted successfully' })
  remove(@Param('id') id: string, @Query('tenantId') tenantId: string): Promise<void> {
    return this.activityService.remove(id, tenantId);
  }
}
