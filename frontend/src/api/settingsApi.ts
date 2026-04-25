import apiClient from '../lib/apiClient';
import type { GitLabConfig } from '../domain/contracts';

export interface PortalSettingsResponse {
  title: string;
}

export const settingsApi = {
  async getSettings(): Promise<PortalSettingsResponse> {
    const response = await apiClient.get<PortalSettingsResponse>('/api/settings');
    return response.data;
  },
  async setTitle(value: string): Promise<PortalSettingsResponse> {
    const response = await apiClient.put<PortalSettingsResponse>('/api/settings/title', { value });
    return response.data;
  },
  async getGitLabConfig(): Promise<GitLabConfig> {
    const response = await apiClient.get<GitLabConfig>('/api/settings/gitlab');
    return response.data;
  },
  async setGitLabConfig(config: GitLabConfig): Promise<GitLabConfig> {
    const response = await apiClient.put<GitLabConfig>('/api/settings/gitlab', config);
    return response.data;
  },
};
