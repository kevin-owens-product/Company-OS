import axios from 'axios';
import { API_URL } from '@/config';
import {
  Codebase,
  CodebaseStatistics,
  IngestionResult,
  AnalysisType,
} from '@/types/codeforge';

const API = `${API_URL}/v1/codebases`;

export interface CreateCodebaseDto {
  name: string;
  description?: string;
  settings?: {
    autoAnalyze?: boolean;
    analysisDepth?: 'shallow' | 'standard' | 'deep';
    excludePatterns?: string[];
  };
}

export interface UpdateCodebaseDto extends Partial<CreateCodebaseDto> {}

export interface ConnectGitHubDto {
  owner: string;
  repo: string;
  branch?: string;
  token: string;
}

export interface ConnectGitLabDto {
  projectId: string;
  branch?: string;
  token: string;
}

export interface TriggerAnalysisDto {
  type: AnalysisType;
  targetRepositories?: string[];
  playbooks?: string[];
  depth?: 'shallow' | 'standard' | 'deep';
}

export const CodebaseService = {
  // CRUD Operations
  create: async (data: CreateCodebaseDto): Promise<Codebase> => {
    const response = await axios.post(API, data);
    return response.data;
  },

  findAll: async (): Promise<Codebase[]> => {
    const response = await axios.get(API);
    return response.data;
  },

  findOne: async (id: string): Promise<Codebase> => {
    const response = await axios.get(`${API}/${id}`);
    return response.data;
  },

  update: async (id: string, data: UpdateCodebaseDto): Promise<Codebase> => {
    const response = await axios.put(`${API}/${id}`, data);
    return response.data;
  },

  remove: async (id: string): Promise<void> => {
    await axios.delete(`${API}/${id}`);
  },

  // Statistics
  getStatistics: async (id: string): Promise<CodebaseStatistics> => {
    const response = await axios.get(`${API}/${id}/statistics`);
    return response.data;
  },

  // Ingestion Operations
  ingestFromGitHub: async (id: string, config: ConnectGitHubDto): Promise<IngestionResult> => {
    const response = await axios.post(`${API}/${id}/ingest/github`, config);
    return response.data;
  },

  ingestFromGitLab: async (id: string, config: ConnectGitLabDto): Promise<IngestionResult> => {
    const response = await axios.post(`${API}/${id}/ingest/gitlab`, config);
    return response.data;
  },

  // Analysis Operations
  triggerAnalysis: async (id: string, data: TriggerAnalysisDto) => {
    const response = await axios.post(`${API}/${id}/analyze`, data);
    return response.data;
  },

  getAnalyses: async (id: string) => {
    const response = await axios.get(`${API}/${id}/analysis`);
    return response.data;
  },

  getLatestAnalysis: async (id: string) => {
    const response = await axios.get(`${API}/${id}/analysis/latest`);
    return response.data;
  },
};
