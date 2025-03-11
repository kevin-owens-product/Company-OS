import axios from 'axios';
import { API_URL } from '../../config';

export enum PayrollStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface CreatePayrollDto {
  payPeriodStart: Date;
  payPeriodEnd: Date;
  baseSalary: number;
  overtime: number;
  bonuses: number;
  deductions: number;
  netSalary: number;
  status: PayrollStatus;
  details?: Record<string, any>;
  taxInfo?: Record<string, any>;
  benefits?: Record<string, any>;
  employeeId: string;
}

export interface UpdatePayrollDto extends Partial<CreatePayrollDto> {}

export interface Payroll {
  id: string;
  payPeriodStart: Date;
  payPeriodEnd: Date;
  baseSalary: number;
  overtime: number;
  bonuses: number;
  deductions: number;
  netSalary: number;
  status: PayrollStatus;
  details?: Record<string, any>;
  taxInfo?: Record<string, any>;
  benefits?: Record<string, any>;
  employeeId: string;
  employee?: any;
  createdAt: Date;
  updatedAt: Date;
}

class PayrollService {
  private baseUrl = `${API_URL}/hr/payrolls`;

  async findAll(): Promise<Payroll[]> {
    const response = await axios.get(this.baseUrl);
    return response.data;
  }

  async findOne(id: string): Promise<Payroll> {
    const response = await axios.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async create(data: CreatePayrollDto): Promise<Payroll> {
    const response = await axios.post(this.baseUrl, data);
    return response.data;
  }

  async update(id: string, data: UpdatePayrollDto): Promise<Payroll> {
    const response = await axios.patch(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await axios.delete(`${this.baseUrl}/${id}`);
  }

  async findByEmployee(employeeId: string): Promise<Payroll[]> {
    const response = await axios.get(`${this.baseUrl}/employee/${employeeId}`);
    return response.data;
  }

  async findByStatus(status: PayrollStatus): Promise<Payroll[]> {
    const response = await axios.get(`${this.baseUrl}/status/${status}`);
    return response.data;
  }

  async findByPayPeriod(startDate: Date, endDate: Date): Promise<Payroll[]> {
    const response = await axios.get(`${this.baseUrl}/period`, {
      params: { startDate, endDate },
    });
    return response.data;
  }

  async processPayroll(id: string): Promise<Payroll> {
    const response = await axios.post(`${this.baseUrl}/${id}/process`);
    return response.data;
  }

  async generatePayslip(id: string): Promise<Blob> {
    const response = await axios.get(`${this.baseUrl}/${id}/payslip`, {
      responseType: 'blob',
    });
    return response.data;
  }
}

export const payrollService = new PayrollService(); 