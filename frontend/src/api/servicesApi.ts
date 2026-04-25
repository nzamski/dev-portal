import apiClient from '../lib/apiClient';
import type { Service } from '../domain/contracts';

type CreateServiceRequest = Omit<Service, 'id'>;

export const servicesApi = {
  async list(): Promise<Service[]> {
    const response = await apiClient.get<Service[]>('/api/services');
    return response.data;
  },
  async create(payload: CreateServiceRequest): Promise<Service> {
    const response = await apiClient.post<Service>('/api/services', payload);
    return response.data;
  },
  async syncAll(services: Service[]): Promise<Service[]> {
    const response = await apiClient.put<Service[]>('/api/services', services);
    return response.data;
  },
};
