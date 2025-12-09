import axios from 'axios';
import { API_URL } from '@/config';
import { Playbook, PlaybookCategory } from '@/types/codeforge';

const API = `${API_URL}/v1/playbooks`;

export interface CreatePlaybookDto {
  code: string;
  name: string;
  description: string;
  category: PlaybookCategory;
  version: string;
  config: {
    targetLanguages?: string[];
    targetFrameworks?: string[];
    prerequisites?: string[];
    estimatedEffort?: string;
    riskLevel?: 'low' | 'medium' | 'high';
  };
  rules: {
    id: string;
    name: string;
    description: string;
    pattern: string;
    action: 'refactor' | 'remove' | 'replace' | 'flag' | 'migrate';
    autoFix?: boolean;
    priority?: number;
  }[];
  oversightConfig?: {
    level: 'autonomous' | 'notify' | 'review' | 'collaborate' | 'manual';
    approvalRequired?: boolean;
    notifyOnExecution?: boolean;
  };
}

export interface UpdatePlaybookDto extends Partial<CreatePlaybookDto> {}

export interface PlaybookCategoryInfo {
  id: string;
  name: string;
  code: string;
}

export const PlaybookService = {
  // CRUD Operations
  create: async (data: CreatePlaybookDto): Promise<Playbook> => {
    const response = await axios.post(API, data);
    return response.data;
  },

  findAll: async (category?: PlaybookCategory): Promise<Playbook[]> => {
    const response = await axios.get(API, {
      params: category ? { category } : undefined,
    });
    return response.data;
  },

  findOne: async (id: string): Promise<Playbook> => {
    const response = await axios.get(`${API}/${id}`);
    return response.data;
  },

  findByCode: async (code: string): Promise<Playbook | null> => {
    const response = await axios.get(`${API}/code/${code}`);
    return response.data;
  },

  update: async (id: string, data: UpdatePlaybookDto): Promise<Playbook> => {
    const response = await axios.put(`${API}/${id}`, data);
    return response.data;
  },

  remove: async (id: string): Promise<void> => {
    await axios.delete(`${API}/${id}`);
  },

  // Playbook Operations
  activate: async (id: string): Promise<Playbook> => {
    const response = await axios.post(`${API}/${id}/activate`);
    return response.data;
  },

  deprecate: async (id: string): Promise<Playbook> => {
    const response = await axios.post(`${API}/${id}/deprecate`);
    return response.data;
  },

  // Categories
  getCategories: async (): Promise<PlaybookCategoryInfo[]> => {
    const response = await axios.get(`${API}/categories`);
    return response.data;
  },

  // Seed built-in playbooks
  seedBuiltIn: async (): Promise<{ success: boolean; message: string }> => {
    const response = await axios.post(`${API}/seed`);
    return response.data;
  },
};
