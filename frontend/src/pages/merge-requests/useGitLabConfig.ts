import { useState, useCallback, useEffect } from 'react';
import { settingsApi } from '@/api/settingsApi';
import type { GitLabConfig } from './types';

const DEFAULT_CONFIG: GitLabConfig = {
  instanceUrl: 'https://gitlab.com',
  token: '',
  resourceType: 'group',
  resourceId: '',
};

export function useGitLabConfig() {
  const [config, setConfigState] = useState<GitLabConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    settingsApi
      .getGitLabConfig()
      .then((data) => {
        setConfigState({ ...DEFAULT_CONFIG, ...data });
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to load GitLab settings');
      })
      .finally(() => setLoading(false));
  }, []);

  const setConfig = useCallback(async (updates: Partial<GitLabConfig>) => {
    setError(null);
    const next = { ...config, ...updates };
    setConfigState(next);
    try {
      await settingsApi.setGitLabConfig(next);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save GitLab settings');
    }
  }, [config]);

  const isConfigured = !loading && config.token.trim().length > 0 && config.resourceId.trim().length > 0;

  return { config, setConfig, isConfigured, loading, error };
}
