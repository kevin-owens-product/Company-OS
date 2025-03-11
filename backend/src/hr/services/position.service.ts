import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Position } from '../entities/position.entity';
import { CreatePositionDto } from '../dto/create-position.dto';
import { UpdatePositionDto } from '../dto/update-position.dto';

@Injectable()
export class PositionService {
  constructor(
    @InjectRepository(Position)
    private readonly positionRepository: Repository<Position>,
  ) {}

  async create(createPositionDto: CreatePositionDto): Promise<Position> {
    const position = this.positionRepository.create(createPositionDto);
    return await this.positionRepository.save(position);
  }

  async findAll(): Promise<Position[]> {
    return await this.positionRepository.find({
      relations: ['employees', 'department', 'tenant'],
    });
  }

  async findOne(id: string): Promise<Position> {
    const position = await this.positionRepository.findOne({
      where: { id },
      relations: ['employees', 'department', 'tenant'],
    });

    if (!position) {
      throw new NotFoundException(`Position with ID ${id} not found`);
    }

    return position;
  }

  async update(id: string, updatePositionDto: UpdatePositionDto): Promise<Position> {
    const position = await this.findOne(id);
    Object.assign(position, updatePositionDto);
    return await this.positionRepository.save(position);
  }

  async remove(id: string): Promise<void> {
    const position = await this.findOne(id);
    await this.positionRepository.remove(position);
  }

  async findByDepartment(departmentId: string): Promise<Position[]> {
    return await this.positionRepository.find({
      where: { department: { id: departmentId } },
      relations: ['employees'],
    });
  }

  async findByTenant(tenantId: string): Promise<Position[]> {
    return await this.positionRepository.find({
      where: { tenant: { id: tenantId } },
      relations: ['employees', 'department'],
    });
  }

  async updatePositionStatus(id: string, isActive: boolean): Promise<Position> {
    const position = await this.findOne(id);
    position.isActive = isActive;
    return await this.positionRepository.save(position);
  }

  async updatePositionRequirements(id: string, requirements: Record<string, any>): Promise<Position> {
    const position = await this.findOne(id);
    position.requirements = requirements;
    return await this.positionRepository.save(position);
  }

  async updatePositionResponsibilities(id: string, responsibilities: Record<string, any>): Promise<Position> {
    const position = await this.findOne(id);
    position.responsibilities = responsibilities;
    return await this.positionRepository.save(position);
  }

  async updateBaseSalary(id: string, baseSalary: number): Promise<Position> {
    const position = await this.findOne(id);
    position.baseSalary = baseSalary;
    return await this.positionRepository.save(position);
  }
} 