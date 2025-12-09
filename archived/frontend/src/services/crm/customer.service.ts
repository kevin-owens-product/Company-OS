import axios from 'axios';
import { API_URL } from '@/config';
import { Customer } from '@/types/crm';

const API = `${API_URL}/crm/customers`;

export interface CreateCustomerDto {
  name: string;
  type: string;
  status: string;
  email?: string;
  phone?: string;
  address?: string;
  companyDetails?: {
    registrationNumber?: string;
    taxId?: string;
    [key: string]: any;
  };
  contactDetails?: {
    [key: string]: any;
  };
  tags?: string[];
  notes?: string;
}

export interface UpdateCustomerDto extends Partial<CreateCustomerDto> {}

export const CustomerService = {
  create: async (data: CreateCustomerDto): Promise<Customer> => {
    const response = await axios.post(API, data);
    return response.data;
  },

  findAll: async (tenantId: string): Promise<Customer[]> => {
    const response = await axios.get(API, {
      params: { tenantId },
    });
    return response.data;
  },

  findOne: async (id: string, tenantId: string): Promise<Customer> => {
    const response = await axios.get(`${API}/${id}`, {
      params: { tenantId },
    });
    return response.data;
  },

  update: async (id: string, data: UpdateCustomerDto): Promise<Customer> => {
    const response = await axios.patch(`${API}/${id}`, data);
    return response.data;
  },

  remove: async (id: string, tenantId: string): Promise<void> => {
    await axios.delete(`${API}/${id}`, {
      params: { tenantId },
    });
  },

  findByEmail: async (email: string, tenantId: string): Promise<Customer> => {
    const response = await axios.get(`${API}/email/${email}`, {
      params: { tenantId },
    });
    return response.data;
  },

  updateTags: async (id: string, tags: string[]): Promise<Customer> => {
    const response = await axios.patch(`${API}/${id}/tags`, { tags });
    return response.data;
  },

  updateLifetimeValue: async (id: string, value: number): Promise<Customer> => {
    const response = await axios.patch(`${API}/${id}/lifetime-value`, { value });
    return response.data;
  },
}; 