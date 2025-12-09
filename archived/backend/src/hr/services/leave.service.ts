import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Leave, LeaveType, LeaveStatus } from '../entities/leave.entity';
import { CreateLeaveDto } from '../dto/create-leave.dto';
import { UpdateLeaveDto } from '../dto/update-leave.dto';

@Injectable()
export class LeaveService {
  constructor(
    @InjectRepository(Leave)
    private readonly leaveRepository: Repository<Leave>,
  ) {}

  async create(createLeaveDto: CreateLeaveDto): Promise<Leave> {
    const leave = this.leaveRepository.create(createLeaveDto);
    return await this.leaveRepository.save(leave);
  }

  async findAll(): Promise<Leave[]> {
    return await this.leaveRepository.find({
      relations: ['employee'],
    });
  }

  async findOne(id: string): Promise<Leave> {
    const leave = await this.leaveRepository.findOne({
      where: { id },
      relations: ['employee'],
    });

    if (!leave) {
      throw new NotFoundException(`Leave with ID ${id} not found`);
    }

    return leave;
  }

  async update(id: string, updateLeaveDto: UpdateLeaveDto): Promise<Leave> {
    const leave = await this.findOne(id);
    Object.assign(leave, updateLeaveDto);
    return await this.leaveRepository.save(leave);
  }

  async remove(id: string): Promise<void> {
    const leave = await this.findOne(id);
    await this.leaveRepository.remove(leave);
  }

  async findByEmployee(employeeId: string): Promise<Leave[]> {
    return await this.leaveRepository.find({
      where: { employee: { id: employeeId } },
      relations: ['employee'],
    });
  }

  async findByStatus(status: LeaveStatus): Promise<Leave[]> {
    return await this.leaveRepository.find({
      where: { status },
      relations: ['employee'],
    });
  }

  async findByType(type: LeaveType): Promise<Leave[]> {
    return await this.leaveRepository.find({
      where: { type },
      relations: ['employee'],
    });
  }

  async approveLeave(id: string, approverId: string, comments?: string): Promise<Leave> {
    const leave = await this.findOne(id);
    
    if (leave.status !== LeaveStatus.PENDING) {
      throw new BadRequestException('Leave request is not pending approval');
    }

    leave.status = LeaveStatus.APPROVED;
    leave.approvals = {
      ...leave.approvals,
      [approverId]: {
        status: LeaveStatus.APPROVED,
        date: new Date(),
        comments,
      },
    };

    return await this.leaveRepository.save(leave);
  }

  async rejectLeave(id: string, approverId: string, comments: string): Promise<Leave> {
    const leave = await this.findOne(id);
    
    if (leave.status !== LeaveStatus.PENDING) {
      throw new BadRequestException('Leave request is not pending approval');
    }

    leave.status = LeaveStatus.REJECTED;
    leave.approvals = {
      ...leave.approvals,
      [approverId]: {
        status: LeaveStatus.REJECTED,
        date: new Date(),
        comments,
      },
    };

    return await this.leaveRepository.save(leave);
  }

  async cancelLeave(id: string, employeeId: string): Promise<Leave> {
    const leave = await this.findOne(id);
    
    if (leave.employee.id !== employeeId) {
      throw new BadRequestException('Only the employee can cancel their own leave request');
    }

    if (leave.status === LeaveStatus.APPROVED) {
      throw new BadRequestException('Cannot cancel an approved leave request');
    }

    leave.status = LeaveStatus.CANCELLED;
    return await this.leaveRepository.save(leave);
  }

  async updateLeaveAttachments(id: string, attachments: Record<string, string>): Promise<Leave> {
    const leave = await this.findOne(id);
    leave.attachments = attachments;
    return await this.leaveRepository.save(leave);
  }
} 