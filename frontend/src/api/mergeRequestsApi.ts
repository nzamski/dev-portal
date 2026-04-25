import apiClient from '../lib/apiClient';
import type { MRColumns } from '../pages/merge-requests/types';

export const mergeRequestsApi = {
  async getOpen(): Promise<MRColumns> {
    const response = await apiClient.get<MRColumns>('/api/merge-requests');
    return response.data;
  },
};
