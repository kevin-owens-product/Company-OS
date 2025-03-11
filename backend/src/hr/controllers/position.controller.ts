import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PositionService } from '../services/position.service';
import { CreatePositionDto } from '../dto/create-position.dto';
import { UpdatePositionDto } from '../dto/update-position.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Position } from '../entities/position.entity';

@ApiTags('positions')
@Controller('positions')
export class PositionController {
  constructor(private readonly positionService: PositionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new position' })
  @ApiResponse({ status: 201, description: 'Position created successfully', type: Position })
  create(@Body() createPositionDto: CreatePositionDto): Promise<Position> {
    return this.positionService.create(createPositionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all positions' })
  @ApiResponse({ status: 200, description: 'Return all positions', type: [Position] })
  findAll(): Promise<Position[]> {
    return this.positionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get position by id' })
  @ApiResponse({ status: 200, description: 'Return the position', type: Position })
  findOne(@Param('id') id: string): Promise<Position> {
    return this.positionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update position' })
  @ApiResponse({ status: 200, description: 'Position updated successfully', type: Position })
  update(
    @Param('id') id: string,
    @Body() updatePositionDto: UpdatePositionDto,
  ): Promise<Position> {
    return this.positionService.update(id, updatePositionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete position' })
  @ApiResponse({ status: 200, description: 'Position deleted successfully' })
  remove(@Param('id') id: string): Promise<void> {
    return this.positionService.remove(id);
  }

  @Get('department/:departmentId')
  @ApiOperation({ summary: 'Get positions by department' })
  @ApiResponse({ status: 200, description: 'Return positions in department', type: [Position] })
  findByDepartment(@Param('departmentId') departmentId: string): Promise<Position[]> {
    return this.positionService.findByDepartment(departmentId);
  }

  @Get('tenant/:tenantId')
  @ApiOperation({ summary: 'Get positions by tenant' })
  @ApiResponse({ status: 200, description: 'Return positions for tenant', type: [Position] })
  findByTenant(@Param('tenantId') tenantId: string): Promise<Position[]> {
    return this.positionService.findByTenant(tenantId);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update position status' })
  @ApiResponse({ status: 200, description: 'Position status updated successfully', type: Position })
  updateStatus(
    @Param('id') id: string,
    @Query('isActive') isActive: boolean,
  ): Promise<Position> {
    return this.positionService.updatePositionStatus(id, isActive);
  }

  @Patch(':id/requirements')
  @ApiOperation({ summary: 'Update position requirements' })
  @ApiResponse({ status: 200, description: 'Position requirements updated successfully', type: Position })
  updateRequirements(
    @Param('id') id: string,
    @Body() requirements: Record<string, any>,
  ): Promise<Position> {
    return this.positionService.updatePositionRequirements(id, requirements);
  }

  @Patch(':id/responsibilities')
  @ApiOperation({ summary: 'Update position responsibilities' })
  @ApiResponse({ status: 200, description: 'Position responsibilities updated successfully', type: Position })
  updateResponsibilities(
    @Param('id') id: string,
    @Body() responsibilities: Record<string, any>,
  ): Promise<Position> {
    return this.positionService.updatePositionResponsibilities(id, responsibilities);
  }

  @Patch(':id/salary')
  @ApiOperation({ summary: 'Update position base salary' })
  @ApiResponse({ status: 200, description: 'Position base salary updated successfully', type: Position })
  updateBaseSalary(
    @Param('id') id: string,
    @Query('baseSalary') baseSalary: number,
  ): Promise<Position> {
    return this.positionService.updateBaseSalary(id, baseSalary);
  }
} 