import { useState, useCallback, useEffect } from 'react';
import { mergeRequestsApi } from '@/api/mergeRequestsApi';
import type { MRColumns } from './types';

const EMPTY_COLUMNS: MRColumns = {
  unassigned: [],
  author_action: [],
  reviewer_action: [],
  approved: [],
};

export function useGitLabMRs(isConfigured: boolean) {
  const [columns, setColumns] = useState<MRColumns>(EMPTY_COLUMNS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  const loadMRs = useCallback(async () => {
    if (!isConfigured) return;

    setLoading(true);
    setError(null);

    try {
      const result = await mergeRequestsApi.getOpen();
      setColumns(result);
      setLastFetched(new Date());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch merge requests');
      setColumns(EMPTY_COLUMNS);
    } finally {
      setLoading(false);
    }
  }, [isConfigured]);

  useEffect(() => {
    loadMRs();
  }, [loadMRs]);

  return { columns, loading, error, lastFetched, refresh: loadMRs };
}
