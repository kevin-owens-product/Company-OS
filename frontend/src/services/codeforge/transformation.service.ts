import axios from 'axios';
import { API_URL } from '@/config';
import { Transformation, TransformationType, OversightLevel } from '@/types/codeforge';

const API = `${API_URL}/v1/transformations`;

export interface CreateTransformationDto {
  name: string;
  description?: string;
  type: TransformationType;
  oversightLevel?: OversightLevel;
  codebaseId: string;
  scope?: {
    repositories?: string[];
    files?: string[];
    findings?: string[];
    playbooks?: string[];
  };
  plan?: {
    steps: {
      id: string;
      name: string;
      description: string;
      status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
      estimatedDuration?: string;
      changes?: number;
    }[];
    totalEstimatedDuration?: string;
    totalChanges?: number;
  };
}

export interface ApprovalActionDto {
  comment?: string;
}

export interface TransformationDiff {
  transformationId: string;
  status: string;
  changes: any[];
  summary: any;
}

export const TransformationService = {
  // CRUD Operations
  create: async (data: CreateTransformationDto): Promise<Transformation> => {
    const response = await axios.post(API, data);
    return response.data;
  },

  findAll: async (codebaseId: string): Promise<Transformation[]> => {
    const response = await axios.get(API, {
      params: { codebaseId },
    });
    return response.data;
  },

  findOne: async (id: string): Promise<Transformation> => {
    const response = await axios.get(`${API}/${id}`);
    return response.data;
  },

  remove: async (id: string): Promise<void> => {
    await axios.delete(`${API}/${id}`);
  },

  // Diff
  getDiff: async (id: string): Promise<TransformationDiff> => {
    const response = await axios.get(`${API}/${id}/diff`);
    return response.data;
  },

  // Workflow Operations
  submitForApproval: async (id: string): Promise<Transformation> => {
    const response = await axios.post(`${API}/${id}/submit`);
    return response.data;
  },

  approve: async (id: string, data?: ApprovalActionDto): Promise<Transformation> => {
    const response = await axios.post(`${API}/${id}/approve`, data || {});
    return response.data;
  },

  reject: async (id: string, data: ApprovalActionDto): Promise<Transformation> => {
    const response = await axios.post(`${API}/${id}/reject`, data);
    return response.data;
  },

  execute: async (id: string): Promise<Transformation> => {
    const response = await axios.post(`${API}/${id}/execute`);
    return response.data;
  },

  pause: async (id: string): Promise<Transformation> => {
    const response = await axios.post(`${API}/${id}/pause`);
    return response.data;
  },

  resume: async (id: string): Promise<Transformation> => {
    const response = await axios.post(`${API}/${id}/resume`);
    return response.data;
  },

  cancel: async (id: string): Promise<Transformation> => {
    const response = await axios.post(`${API}/${id}/cancel`);
    return response.data;
  },

  rollback: async (id: string): Promise<Transformation> => {
    const response = await axios.post(`${API}/${id}/rollback`);
    return response.data;
  },
};
