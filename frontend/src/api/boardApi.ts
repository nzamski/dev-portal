import apiClient from '../lib/apiClient';
import type { BoardItem } from '../domain/contracts';

export const boardApi = {
  async list(): Promise<BoardItem[]> {
    const response = await apiClient.get<BoardItem[]>('/api/board');
    return response.data;
  },
  async replace(items: BoardItem[]): Promise<BoardItem[]> {
    const response = await apiClient.put<BoardItem[]>('/api/board', items);
    return response.data;
  },
};
