import axios from 'axios';
import { API_URL } from '../../config';

export enum LeaveType {
  ANNUAL = 'ANNUAL',
  SICK = 'SICK',
  MATERNITY = 'MATERNITY',
  PATERNITY = 'PATERNITY',
  UNPAID = 'UNPAID',
}

export enum LeaveStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface CreateLeaveDto {
  type: LeaveType;
  startDate: Date;
  endDate: Date;
  duration: number;
  reason: string;
  attachments?: Record<string, string>;
  employeeId: string;
}

export interface UpdateLeaveDto extends Partial<CreateLeaveDto> {
  status?: LeaveStatus;
}

export interface Leave {
  id: string;
  type: LeaveType;
  status: LeaveStatus;
  startDate: Date;
  endDate: Date;
  duration: number;
  reason: string;
  attachments?: Record<string, string>;
  approvals?: Record<string, any>;
  employeeId: string;
  employee?: any;
  createdAt: Date;
  updatedAt: Date;
}

class LeaveService {
  private baseUrl = `${API_URL}/hr/leaves`;

  async findAll(): Promise<Leave[]> {
    const response = await axios.get(this.baseUrl);
    return response.data;
  }

  async findOne(id: string): Promise<Leave> {
    const response = await axios.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async create(data: CreateLeaveDto): Promise<Leave> {
    const response = await axios.post(this.baseUrl, data);
    return response.data;
  }

  async update(id: string, data: UpdateLeaveDto): Promise<Leave> {
    const response = await axios.patch(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await axios.delete(`${this.baseUrl}/${id}`);
  }

  async findByEmployee(employeeId: string): Promise<Leave[]> {
    const response = await axios.get(`${this.baseUrl}/employee/${employeeId}`);
    return response.data;
  }

  async findByStatus(status: LeaveStatus): Promise<Leave[]> {
    const response = await axios.get(`${this.baseUrl}/status/${status}`);
    return response.data;
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Leave[]> {
    const response = await axios.get(`${this.baseUrl}/range`, {
      params: { startDate, endDate },
    });
    return response.data;
  }

  async approve(id: string): Promise<Leave> {
    const response = await axios.patch(`${this.baseUrl}/${id}/approve`);
    return response.data;
  }

  async reject(id: string, reason: string): Promise<Leave> {
    const response = await axios.patch(`${this.baseUrl}/${id}/reject`, { reason });
    return response.data;
  }
}

export const leaveService = new LeaveService(); 