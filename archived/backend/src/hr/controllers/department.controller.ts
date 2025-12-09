import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DepartmentService } from '../services/department.service';
import { CreateDepartmentDto } from '../dto/create-department.dto';
import { UpdateDepartmentDto } from '../dto/update-department.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Department } from '../entities/department.entity';

@ApiTags('hr/departments')
@Controller('hr/departments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new department' })
  @ApiResponse({ status: 201, description: 'Department created successfully', type: Department })
  create(@Body() createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    return this.departmentService.create(createDepartmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all departments' })
  @ApiResponse({ status: 200, description: 'Return all departments', type: [Department] })
  findAll(): Promise<Department[]> {
    return this.departmentService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get department by id' })
  @ApiResponse({ status: 200, description: 'Return the department', type: Department })
  findOne(@Param('id') id: string): Promise<Department> {
    return this.departmentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update department' })
  @ApiResponse({ status: 200, description: 'Department updated successfully', type: Department })
  update(
    @Param('id') id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<Department> {
    return this.departmentService.update(id, updateDepartmentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete department' })
  @ApiResponse({ status: 200, description: 'Department deleted successfully' })
  remove(@Param('id') id: string): Promise<void> {
    return this.departmentService.remove(id);
  }

  @Get('tenant/:tenantId')
  @ApiOperation({ summary: 'Get departments by tenant' })
  @ApiResponse({ status: 200, description: 'Return departments for tenant', type: [Department] })
  findByTenant(@Param('tenantId') tenantId: string): Promise<Department[]> {
    return this.departmentService.findByTenant(tenantId);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update department status' })
  @ApiResponse({ status: 200, description: 'Department status updated successfully', type: Department })
  updateStatus(
    @Param('id') id: string,
    @Query('isActive') isActive: boolean,
  ): Promise<Department> {
    return this.departmentService.updateDepartmentStatus(id, isActive);
  }

  @Patch(':id/settings')
  @ApiOperation({ summary: 'Update department settings' })
  @ApiResponse({ status: 200, description: 'Department settings updated successfully', type: Department })
  updateSettings(
    @Param('id') id: string,
    @Body() settings: Record<string, any>,
  ): Promise<Department> {
    return this.departmentService.updateDepartmentSettings(id, settings);
  }

  @Patch(':id/manager')
  @ApiOperation({ summary: 'Update department manager' })
  @ApiResponse({ status: 200, description: 'Department manager updated successfully', type: Department })
  updateManager(
    @Param('id') id: string,
    @Query('managerId') managerId: string,
  ): Promise<Department> {
    return this.departmentService.updateManager(id, managerId);
  }
} 