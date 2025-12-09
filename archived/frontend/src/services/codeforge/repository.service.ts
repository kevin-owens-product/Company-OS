import axios from 'axios';
import { API_URL } from '@/config';
import { Repository, RepositoryProvider, Finding } from '@/types/codeforge';

const API = `${API_URL}/v1/repositories`;

export interface CreateRepositoryDto {
  name: string;
  description?: string;
  provider: RepositoryProvider;
  remoteUrl: string;
  branch?: string;
  codebaseId: string;
  credentials?: {
    type: 'token' | 'ssh' | 'basic';
    encryptedValue: string;
  };
  analysisConfig?: {
    excludePatterns?: string[];
    includePaths?: string[];
    maxFileSize?: number;
  };
}

export interface UpdateRepositoryDto extends Partial<Omit<CreateRepositoryDto, 'codebaseId'>> {}

export const RepositoryService = {
  // CRUD Operations
  create: async (data: CreateRepositoryDto): Promise<Repository> => {
    const response = await axios.post(API, data);
    return response.data;
  },

  findAll: async (codebaseId: string): Promise<Repository[]> => {
    const response = await axios.get(API, {
      params: { codebaseId },
    });
    return response.data;
  },

  findOne: async (id: string): Promise<Repository> => {
    const response = await axios.get(`${API}/${id}`);
    return response.data;
  },

  update: async (id: string, data: UpdateRepositoryDto): Promise<Repository> => {
    const response = await axios.put(`${API}/${id}`, data);
    return response.data;
  },

  remove: async (id: string): Promise<void> => {
    await axios.delete(`${API}/${id}`);
  },

  // Repository Operations
  refresh: async (id: string): Promise<{ success: boolean; error?: string }> => {
    const response = await axios.post(`${API}/${id}/refresh`);
    return response.data;
  },

  // Findings
  getFindings: async (id: string): Promise<Finding[]> => {
    const response = await axios.get(`${API}/${id}/findings`);
    return response.data;
  },

  getFindingsBySeverity: async (id: string): Promise<Record<string, number>> => {
    const response = await axios.get(`${API}/${id}/findings/stats/severity`);
    return response.data;
  },

  getFindingsByCategory: async (id: string): Promise<Record<string, number>> => {
    const response = await axios.get(`${API}/${id}/findings/stats/category`);
    return response.data;
  },
};
