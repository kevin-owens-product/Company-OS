import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from '../entities/department.entity';
import { CreateDepartmentDto } from '../dto/create-department.dto';
import { UpdateDepartmentDto } from '../dto/update-department.dto';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  async create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    const department = this.departmentRepository.create(createDepartmentDto);
    return await this.departmentRepository.save(department);
  }

  async findAll(): Promise<Department[]> {
    return await this.departmentRepository.find({
      relations: ['employees', 'tenant'],
    });
  }

  async findOne(id: string): Promise<Department> {
    const department = await this.departmentRepository.findOne({
      where: { id },
      relations: ['employees', 'tenant', 'positions'],
    });

    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }

    return department;
  }

  async update(id: string, updateDepartmentDto: UpdateDepartmentDto): Promise<Department> {
    const department = await this.findOne(id);
    Object.assign(department, updateDepartmentDto);
    return await this.departmentRepository.save(department);
  }

  async remove(id: string): Promise<void> {
    const department = await this.findOne(id);
    await this.departmentRepository.remove(department);
  }

  async findByTenant(tenantId: string): Promise<Department[]> {
    return await this.departmentRepository.find({
      where: { tenant: { id: tenantId } },
      relations: ['employees', 'positions'],
    });
  }

  async updateDepartmentStatus(id: string, isActive: boolean): Promise<Department> {
    const department = await this.findOne(id);
    department.isActive = isActive;
    return await this.departmentRepository.save(department);
  }

  async updateDepartmentSettings(id: string, settings: Record<string, any>): Promise<Department> {
    const department = await this.findOne(id);
    department.settings = settings;
    return await this.departmentRepository.save(department);
  }

  async updateManager(id: string, managerId: string): Promise<Department> {
    const department = await this.findOne(id);
    department.managerId = managerId;
    return await this.departmentRepository.save(department);
  }
} 