import axios from 'axios';
import { API_URL } from '@/config';
import { Contact } from '@/types/crm';

const API = `${API_URL}/crm/contacts`;

export interface CreateContactDto {
  firstName: string;
  lastName: string;
  title?: string;
  department?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  isPrimary?: boolean;
  socialProfiles?: {
    linkedin?: string;
    twitter?: string;
    [key: string]: string | undefined;
  };
  preferences?: {
    [key: string]: any;
  };
  notes?: string;
  tags?: string[];
  customerId: string;
}

export interface UpdateContactDto extends Partial<CreateContactDto> {}

export const ContactService = {
  create: async (data: CreateContactDto): Promise<Contact> => {
    const response = await axios.post(API, data);
    return response.data;
  },

  findAll: async (tenantId: string): Promise<Contact[]> => {
    const response = await axios.get(API, {
      params: { tenantId },
    });
    return response.data;
  },

  findOne: async (id: string, tenantId: string): Promise<Contact> => {
    const response = await axios.get(`${API}/${id}`, {
      params: { tenantId },
    });
    return response.data;
  },

  update: async (id: string, data: UpdateContactDto): Promise<Contact> => {
    const response = await axios.patch(`${API}/${id}`, data);
    return response.data;
  },

  remove: async (id: string, tenantId: string): Promise<void> => {
    await axios.delete(`${API}/${id}`, {
      params: { tenantId },
    });
  },

  findByCustomer: async (customerId: string, tenantId: string): Promise<Contact[]> => {
    const response = await axios.get(`${API}/customer/${customerId}`, {
      params: { tenantId },
    });
    return response.data;
  },

  updateTags: async (id: string, tags: string[]): Promise<Contact> => {
    const response = await axios.patch(`${API}/${id}/tags`, { tags });
    return response.data;
  },

  setPrimary: async (id: string, customerId: string): Promise<Contact> => {
    const response = await axios.patch(`${API}/${id}/set-primary`, { customerId });
    return response.data;
  },
}; 