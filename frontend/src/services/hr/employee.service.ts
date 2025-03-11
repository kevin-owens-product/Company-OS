import axios from 'axios';
import { API_URL } from '../../config';

export interface CreateEmployeeDto {
  firstName: string;
  lastName: string;
  employeeId: string;
  dateOfBirth: Date;
  dateOfHire: Date;
  phone: string;
  address: string;
  emergencyContact: string;
  departmentId: string;
  positionId: string;
  isActive: boolean;
}

export interface UpdateEmployeeDto extends Partial<CreateEmployeeDto> {}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  employeeId: string;
  dateOfBirth: Date;
  dateOfHire: Date;
  phone: string;
  address: string;
  emergencyContact: string;
  departmentId: string;
  positionId: string;
  isActive: boolean;
  department?: any;
  position?: any;
  createdAt: Date;
  updatedAt: Date;
}

class EmployeeService {
  private baseUrl = `${API_URL}/hr/employees`;

  async findAll(): Promise<Employee[]> {
    const response = await axios.get(this.baseUrl);
    return response.data;
  }

  async findOne(id: string): Promise<Employee> {
    const response = await axios.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async create(data: CreateEmployeeDto): Promise<Employee> {
    const response = await axios.post(this.baseUrl, data);
    return response.data;
  }

  async update(id: string, data: UpdateEmployeeDto): Promise<Employee> {
    const response = await axios.patch(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await axios.delete(`${this.baseUrl}/${id}`);
  }

  async findByDepartment(departmentId: string): Promise<Employee[]> {
    const response = await axios.get(`${this.baseUrl}/department/${departmentId}`);
    return response.data;
  }

  async findByPosition(positionId: string): Promise<Employee[]> {
    const response = await axios.get(`${this.baseUrl}/position/${positionId}`);
    return response.data;
  }
}

export const employeeService = new EmployeeService(); 