import axios from 'axios';
import { API_URL } from '@/config';
import { Opportunity } from '@/types/crm';

const API = `${API_URL}/crm/opportunities`;

export interface CreateOpportunityDto {
  title: string;
  description?: string;
  value: number;
  probability: number;
  stage: string;
  priority: string;
  expectedCloseDate: Date | null;
  products?: string[];
  customFields?: {
    [key: string]: any;
  };
  notes?: string;
  customerId: string;
}

export interface UpdateOpportunityDto extends Partial<CreateOpportunityDto> {}

export const OpportunityService = {
  create: async (data: CreateOpportunityDto): Promise<Opportunity> => {
    const response = await axios.post(API, data);
    return response.data;
  },

  findAll: async (tenantId: string): Promise<Opportunity[]> => {
    const response = await axios.get(API, {
      params: { tenantId },
    });
    return response.data;
  },

  findOne: async (id: string, tenantId: string): Promise<Opportunity> => {
    const response = await axios.get(`${API}/${id}`, {
      params: { tenantId },
    });
    return response.data;
  },

  update: async (id: string, data: UpdateOpportunityDto): Promise<Opportunity> => {
    const response = await axios.patch(`${API}/${id}`, data);
    return response.data;
  },

  remove: async (id: string, tenantId: string): Promise<void> => {
    await axios.delete(`${API}/${id}`, {
      params: { tenantId },
    });
  },

  findByCustomer: async (customerId: string, tenantId: string): Promise<Opportunity[]> => {
    const response = await axios.get(`${API}/customer/${customerId}`, {
      params: { tenantId },
    });
    return response.data;
  },

  updateStage: async (id: string, stage: string): Promise<Opportunity> => {
    const response = await axios.patch(`${API}/${id}/stage`, { stage });
    return response.data;
  },

  updateProbability: async (id: string, probability: number): Promise<Opportunity> => {
    const response = await axios.patch(`${API}/${id}/probability`, { probability });
    return response.data;
  },

  updateValue: async (id: string, value: number): Promise<Opportunity> => {
    const response = await axios.patch(`${API}/${id}/value`, { value });
    return response.data;
  },
}; 