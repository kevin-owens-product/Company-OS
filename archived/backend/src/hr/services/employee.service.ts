import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '../entities/employee.entity';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const employee = this.employeeRepository.create(createEmployeeDto);
    return await this.employeeRepository.save(employee);
  }

  async findAll(): Promise<Employee[]> {
    return await this.employeeRepository.find({
      relations: ['department', 'position', 'user'],
    });
  }

  async findOne(id: string): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      relations: ['department', 'position', 'user', 'leaves', 'payrolls'],
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    return employee;
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<Employee> {
    const employee = await this.findOne(id);
    Object.assign(employee, updateEmployeeDto);
    return await this.employeeRepository.save(employee);
  }

  async remove(id: string): Promise<void> {
    const employee = await this.findOne(id);
    await this.employeeRepository.remove(employee);
  }

  async findByDepartment(departmentId: string): Promise<Employee[]> {
    return await this.employeeRepository.find({
      where: { department: { id: departmentId } },
      relations: ['department', 'position'],
    });
  }

  async findByPosition(positionId: string): Promise<Employee[]> {
    return await this.employeeRepository.find({
      where: { position: { id: positionId } },
      relations: ['department', 'position'],
    });
  }

  async updateEmployeeStatus(id: string, isActive: boolean): Promise<Employee> {
    const employee = await this.findOne(id);
    employee.isActive = isActive;
    return await this.employeeRepository.save(employee);
  }

  async updateEmployeeDocuments(id: string, documents: Record<string, string>): Promise<Employee> {
    const employee = await this.findOne(id);
    employee.documents = documents;
    return await this.employeeRepository.save(employee);
  }
} 