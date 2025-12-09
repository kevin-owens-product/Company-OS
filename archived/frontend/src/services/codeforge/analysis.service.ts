import axios from 'axios';
import { API_URL } from '@/config';
import { Analysis, Finding } from '@/types/codeforge';

const API = `${API_URL}/v1/analyses`;

export const AnalysisService = {
  findOne: async (id: string): Promise<Analysis> => {
    const response = await axios.get(`${API}/${id}`);
    return response.data;
  },

  cancel: async (id: string): Promise<Analysis> => {
    const response = await axios.post(`${API}/${id}/cancel`);
    return response.data;
  },

  remove: async (id: string): Promise<void> => {
    await axios.delete(`${API}/${id}`);
  },

  getFindings: async (id: string): Promise<Finding[]> => {
    const response = await axios.get(`${API}/${id}/findings`);
    return response.data;
  },
};
