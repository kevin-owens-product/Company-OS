import axios from 'axios';
import { API_URL } from '../../config';

export interface CreateDepartmentDto {
  name: string;
  description?: string;
  managerId?: string;
  isActive: boolean;
}

export interface UpdateDepartmentDto extends Partial<CreateDepartmentDto> {}

export interface Department {
  id: string;
  name: string;
  description?: string;
  managerId?: string;
  isActive: boolean;
  manager?: any;
  employees?: any[];
  positions?: any[];
  createdAt: Date;
  updatedAt: Date;
}

class DepartmentService {
  private baseUrl = `${API_URL}/hr/departments`;

  async findAll(): Promise<Department[]> {
    const response = await axios.get(this.baseUrl);
    return response.data;
  }

  async findOne(id: string): Promise<Department> {
    const response = await axios.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async create(data: CreateDepartmentDto): Promise<Department> {
    const response = await axios.post(this.baseUrl, data);
    return response.data;
  }

  async update(id: string, data: UpdateDepartmentDto): Promise<Department> {
    const response = await axios.patch(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await axios.delete(`${this.baseUrl}/${id}`);
  }

  async findEmployees(id: string): Promise<any[]> {
    const response = await axios.get(`${this.baseUrl}/${id}/employees`);
    return response.data;
  }

  async findPositions(id: string): Promise<any[]> {
    const response = await axios.get(`${this.baseUrl}/${id}/positions`);
    return response.data;
  }
}

export const departmentService = new DepartmentService(); 