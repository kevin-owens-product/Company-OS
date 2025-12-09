import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { EmployeeService } from '../services/employee.service';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Employee } from '../entities/employee.entity';

@ApiTags('employees')
@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new employee' })
  @ApiResponse({ status: 201, description: 'Employee created successfully', type: Employee })
  create(@Body() createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    return this.employeeService.create(createEmployeeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all employees' })
  @ApiResponse({ status: 200, description: 'Return all employees', type: [Employee] })
  findAll(): Promise<Employee[]> {
    return this.employeeService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get employee by id' })
  @ApiResponse({ status: 200, description: 'Return the employee', type: Employee })
  findOne(@Param('id') id: string): Promise<Employee> {
    return this.employeeService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update employee' })
  @ApiResponse({ status: 200, description: 'Employee updated successfully', type: Employee })
  update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    return this.employeeService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete employee' })
  @ApiResponse({ status: 200, description: 'Employee deleted successfully' })
  remove(@Param('id') id: string): Promise<void> {
    return this.employeeService.remove(id);
  }

  @Get('department/:departmentId')
  @ApiOperation({ summary: 'Get employees by department' })
  @ApiResponse({ status: 200, description: 'Return employees in department', type: [Employee] })
  findByDepartment(@Param('departmentId') departmentId: string): Promise<Employee[]> {
    return this.employeeService.findByDepartment(departmentId);
  }

  @Get('position/:positionId')
  @ApiOperation({ summary: 'Get employees by position' })
  @ApiResponse({ status: 200, description: 'Return employees in position', type: [Employee] })
  findByPosition(@Param('positionId') positionId: string): Promise<Employee[]> {
    return this.employeeService.findByPosition(positionId);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update employee status' })
  @ApiResponse({ status: 200, description: 'Employee status updated successfully', type: Employee })
  updateStatus(
    @Param('id') id: string,
    @Query('isActive') isActive: boolean,
  ): Promise<Employee> {
    return this.employeeService.updateEmployeeStatus(id, isActive);
  }

  @Patch(':id/documents')
  @ApiOperation({ summary: 'Update employee documents' })
  @ApiResponse({ status: 200, description: 'Employee documents updated successfully', type: Employee })
  updateDocuments(
    @Param('id') id: string,
    @Body() documents: Record<string, string>,
  ): Promise<Employee> {
    return this.employeeService.updateEmployeeDocuments(id, documents);
  }
} 