import axios from 'axios';
import { API_URL } from '@/config';
import { Activity } from '@/types/crm';

const API = `${API_URL}/crm/activities`;

export interface CreateActivityDto {
  type: string;
  subject: string;
  description?: string;
  scheduledAt: Date | null;
  completedAt?: Date | null;
  status: string;
  priority: string;
  duration?: number;
  outcome?: string;
  location?: string;
  notes?: string;
  customerId: string;
  contactId?: string;
  opportunityId?: string;
}

export interface UpdateActivityDto extends Partial<CreateActivityDto> {}

export const ActivityService = {
  create: async (data: CreateActivityDto): Promise<Activity> => {
    const response = await axios.post(API, data);
    return response.data;
  },

  findAll: async (tenantId: string): Promise<Activity[]> => {
    const response = await axios.get(API, {
      params: { tenantId },
    });
    return response.data;
  },

  findOne: async (id: string, tenantId: string): Promise<Activity> => {
    const response = await axios.get(`${API}/${id}`, {
      params: { tenantId },
    });
    return response.data;
  },

  update: async (id: string, data: UpdateActivityDto): Promise<Activity> => {
    const response = await axios.patch(`${API}/${id}`, data);
    return response.data;
  },

  remove: async (id: string, tenantId: string): Promise<void> => {
    await axios.delete(`${API}/${id}`, {
      params: { tenantId },
    });
  },

  findByCustomer: async (customerId: string, tenantId: string): Promise<Activity[]> => {
    const response = await axios.get(`${API}/customer/${customerId}`, {
      params: { tenantId },
    });
    return response.data;
  },

  findByContact: async (contactId: string, tenantId: string): Promise<Activity[]> => {
    const response = await axios.get(`${API}/contact/${contactId}`, {
      params: { tenantId },
    });
    return response.data;
  },

  findByOpportunity: async (opportunityId: string, tenantId: string): Promise<Activity[]> => {
    const response = await axios.get(`${API}/opportunity/${opportunityId}`, {
      params: { tenantId },
    });
    return response.data;
  },

  updateStatus: async (id: string, status: string): Promise<Activity> => {
    const response = await axios.patch(`${API}/${id}/status`, { status });
    return response.data;
  },

  complete: async (id: string, outcome: string): Promise<Activity> => {
    const response = await axios.patch(`${API}/${id}/complete`, { outcome });
    return response.data;
  },

  reschedule: async (id: string, scheduledAt: Date): Promise<Activity> => {
    const response = await axios.patch(`${API}/${id}/reschedule`, { scheduledAt });
    return response.data;
  },
}; 