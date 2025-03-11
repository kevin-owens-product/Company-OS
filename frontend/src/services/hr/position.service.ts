import axios from 'axios';
import { API_URL } from '../../config';

export interface CreatePositionDto {
  title: string;
  description?: string;
  baseSalary: number;
  requirements?: Record<string, string>;
  responsibilities?: Record<string, string>;
  isActive: boolean;
  departmentId: string;
}

export interface UpdatePositionDto extends Partial<CreatePositionDto> {}

export interface Position {
  id: string;
  title: string;
  description?: string;
  baseSalary: number;
  requirements?: Record<string, string>;
  responsibilities?: Record<string, string>;
  isActive: boolean;
  departmentId: string;
  department?: any;
  employees?: any[];
  createdAt: Date;
  updatedAt: Date;
}

class PositionService {
  private baseUrl = `${API_URL}/hr/positions`;

  async findAll(): Promise<Position[]> {
    const response = await axios.get(this.baseUrl);
    return response.data;
  }

  async findOne(id: string): Promise<Position> {
    const response = await axios.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async create(data: CreatePositionDto): Promise<Position> {
    const response = await axios.post(this.baseUrl, data);
    return response.data;
  }

  async update(id: string, data: UpdatePositionDto): Promise<Position> {
    const response = await axios.patch(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await axios.delete(`${this.baseUrl}/${id}`);
  }

  async findByDepartment(departmentId: string): Promise<Position[]> {
    const response = await axios.get(`${this.baseUrl}/department/${departmentId}`);
    return response.data;
  }

  async findEmployees(id: string): Promise<any[]> {
    const response = await axios.get(`${this.baseUrl}/${id}/employees`);
    return response.data;
  }
}

export const positionService = new PositionService(); 