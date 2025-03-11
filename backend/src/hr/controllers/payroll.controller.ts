import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PayrollService } from '../services/payroll.service';
import { CreatePayrollDto } from '../dto/create-payroll.dto';
import { UpdatePayrollDto } from '../dto/update-payroll.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Payroll, PayrollStatus } from '../entities/payroll.entity';

@ApiTags('payrolls')
@Controller('payrolls')
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new payroll record' })
  @ApiResponse({ status: 201, description: 'Payroll record created successfully', type: Payroll })
  create(@Body() createPayrollDto: CreatePayrollDto): Promise<Payroll> {
    return this.payrollService.create(createPayrollDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all payroll records' })
  @ApiResponse({ status: 200, description: 'Return all payroll records', type: [Payroll] })
  findAll(): Promise<Payroll[]> {
    return this.payrollService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payroll record by id' })
  @ApiResponse({ status: 200, description: 'Return the payroll record', type: Payroll })
  findOne(@Param('id') id: string): Promise<Payroll> {
    return this.payrollService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update payroll record' })
  @ApiResponse({ status: 200, description: 'Payroll record updated successfully', type: Payroll })
  update(
    @Param('id') id: string,
    @Body() updatePayrollDto: UpdatePayrollDto,
  ): Promise<Payroll> {
    return this.payrollService.update(id, updatePayrollDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete payroll record' })
  @ApiResponse({ status: 200, description: 'Payroll record deleted successfully' })
  remove(@Param('id') id: string): Promise<void> {
    return this.payrollService.remove(id);
  }

  @Get('employee/:employeeId')
  @ApiOperation({ summary: 'Get payroll records by employee' })
  @ApiResponse({ status: 200, description: 'Return payroll records for employee', type: [Payroll] })
  findByEmployee(@Param('employeeId') employeeId: string): Promise<Payroll[]> {
    return this.payrollService.findByEmployee(employeeId);
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Get payroll records by status' })
  @ApiResponse({ status: 200, description: 'Return payroll records by status', type: [Payroll] })
  findByStatus(@Param('status') status: PayrollStatus): Promise<Payroll[]> {
    return this.payrollService.findByStatus(status);
  }

  @Get('period')
  @ApiOperation({ summary: 'Get payroll records by pay period' })
  @ApiResponse({ status: 200, description: 'Return payroll records for pay period', type: [Payroll] })
  findByPayPeriod(
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
  ): Promise<Payroll[]> {
    return this.payrollService.findByPayPeriod(startDate, endDate);
  }

  @Patch(':id/process')
  @ApiOperation({ summary: 'Process payroll record' })
  @ApiResponse({ status: 200, description: 'Payroll record processed successfully', type: Payroll })
  processPayroll(@Param('id') id: string): Promise<Payroll> {
    return this.payrollService.processPayroll(id);
  }

  @Patch(':id/details')
  @ApiOperation({ summary: 'Update payroll record details' })
  @ApiResponse({ status: 200, description: 'Payroll record details updated successfully', type: Payroll })
  updateDetails(
    @Param('id') id: string,
    @Body() details: Record<string, any>,
  ): Promise<Payroll> {
    return this.payrollService.updatePayrollDetails(id, details);
  }

  @Patch(':id/tax-info')
  @ApiOperation({ summary: 'Update payroll record tax information' })
  @ApiResponse({ status: 200, description: 'Payroll record tax information updated successfully', type: Payroll })
  updateTaxInfo(
    @Param('id') id: string,
    @Body() taxInfo: Record<string, any>,
  ): Promise<Payroll> {
    return this.payrollService.updateTaxInfo(id, taxInfo);
  }

  @Patch(':id/benefits')
  @ApiOperation({ summary: 'Update payroll record benefits' })
  @ApiResponse({ status: 200, description: 'Payroll record benefits updated successfully', type: Payroll })
  updateBenefits(
    @Param('id') id: string,
    @Body() benefits: Record<string, any>,
  ): Promise<Payroll> {
    return this.payrollService.updateBenefits(id, benefits);
  }

  @Patch(':id/overtime')
  @ApiOperation({ summary: 'Update payroll record overtime' })
  @ApiResponse({ status: 200, description: 'Payroll record overtime updated successfully', type: Payroll })
  updateOvertime(
    @Param('id') id: string,
    @Query('overtime') overtime: number,
  ): Promise<Payroll> {
    return this.payrollService.updateOvertime(id, overtime);
  }

  @Patch(':id/bonuses')
  @ApiOperation({ summary: 'Update payroll record bonuses' })
  @ApiResponse({ status: 200, description: 'Payroll record bonuses updated successfully', type: Payroll })
  updateBonuses(
    @Param('id') id: string,
    @Query('bonuses') bonuses: number,
  ): Promise<Payroll> {
    return this.payrollService.updateBonuses(id, bonuses);
  }

  @Patch(':id/deductions')
  @ApiOperation({ summary: 'Update payroll record deductions' })
  @ApiResponse({ status: 200, description: 'Payroll record deductions updated successfully', type: Payroll })
  updateDeductions(
    @Param('id') id: string,
    @Query('deductions') deductions: number,
  ): Promise<Payroll> {
    return this.payrollService.updateDeductions(id, deductions);
  }
} 