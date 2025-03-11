import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payroll, PayrollStatus } from '../entities/payroll.entity';
import { CreatePayrollDto } from '../dto/create-payroll.dto';
import { UpdatePayrollDto } from '../dto/update-payroll.dto';

@Injectable()
export class PayrollService {
  constructor(
    @InjectRepository(Payroll)
    private readonly payrollRepository: Repository<Payroll>,
  ) {}

  async create(createPayrollDto: CreatePayrollDto): Promise<Payroll> {
    const payroll = this.payrollRepository.create(createPayrollDto);
    return await this.payrollRepository.save(payroll);
  }

  async findAll(): Promise<Payroll[]> {
    return await this.payrollRepository.find({
      relations: ['employee'],
    });
  }

  async findOne(id: string): Promise<Payroll> {
    const payroll = await this.payrollRepository.findOne({
      where: { id },
      relations: ['employee'],
    });

    if (!payroll) {
      throw new NotFoundException(`Payroll with ID ${id} not found`);
    }

    return payroll;
  }

  async update(id: string, updatePayrollDto: UpdatePayrollDto): Promise<Payroll> {
    const payroll = await this.findOne(id);
    Object.assign(payroll, updatePayrollDto);
    return await this.payrollRepository.save(payroll);
  }

  async remove(id: string): Promise<void> {
    const payroll = await this.findOne(id);
    await this.payrollRepository.remove(payroll);
  }

  async findByEmployee(employeeId: string): Promise<Payroll[]> {
    return await this.payrollRepository.find({
      where: { employee: { id: employeeId } },
      relations: ['employee'],
    });
  }

  async findByStatus(status: PayrollStatus): Promise<Payroll[]> {
    return await this.payrollRepository.find({
      where: { status },
      relations: ['employee'],
    });
  }

  async findByPayPeriod(startDate: Date, endDate: Date): Promise<Payroll[]> {
    return await this.payrollRepository.find({
      where: {
        payPeriodStart: startDate,
        payPeriodEnd: endDate,
      },
      relations: ['employee'],
    });
  }

  async processPayroll(id: string): Promise<Payroll> {
    const payroll = await this.findOne(id);
    
    if (payroll.status !== PayrollStatus.PENDING) {
      throw new BadRequestException('Payroll is not pending processing');
    }

    payroll.status = PayrollStatus.PROCESSING;
    await this.payrollRepository.save(payroll);

    try {
      // Calculate net salary
      payroll.netSalary = payroll.baseSalary + payroll.overtime + payroll.bonuses - payroll.deductions;
      payroll.status = PayrollStatus.COMPLETED;
    } catch (error) {
      payroll.status = PayrollStatus.FAILED;
      throw new BadRequestException('Failed to process payroll');
    }

    return await this.payrollRepository.save(payroll);
  }

  async updatePayrollDetails(id: string, details: Record<string, any>): Promise<Payroll> {
    const payroll = await this.findOne(id);
    payroll.details = details;
    return await this.payrollRepository.save(payroll);
  }

  async updateTaxInfo(id: string, taxInfo: Record<string, any>): Promise<Payroll> {
    const payroll = await this.findOne(id);
    payroll.taxInfo = taxInfo;
    return await this.payrollRepository.save(payroll);
  }

  async updateBenefits(id: string, benefits: Record<string, any>): Promise<Payroll> {
    const payroll = await this.findOne(id);
    payroll.benefits = benefits;
    return await this.payrollRepository.save(payroll);
  }

  async updateOvertime(id: string, overtime: number): Promise<Payroll> {
    const payroll = await this.findOne(id);
    payroll.overtime = overtime;
    return await this.payrollRepository.save(payroll);
  }

  async updateBonuses(id: string, bonuses: number): Promise<Payroll> {
    const payroll = await this.findOne(id);
    payroll.bonuses = bonuses;
    return await this.payrollRepository.save(payroll);
  }

  async updateDeductions(id: string, deductions: number): Promise<Payroll> {
    const payroll = await this.findOne(id);
    payroll.deductions = deductions;
    return await this.payrollRepository.save(payroll);
  }
} 