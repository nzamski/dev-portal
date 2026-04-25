import { useCallback, useEffect, useState } from 'react';
import { boardApi } from '@/api/boardApi';
import { servicesApi } from '@/api/servicesApi';
import { settingsApi } from '@/api/settingsApi';
import { useBoardLayout } from './hooks/useBoardLayout';
import { usePortalSettings } from './hooks/usePortalSettings';
import { useServicesCatalog } from './hooks/useServicesCatalog';

export function usePortalData() {
  const { boardItems, boardItemsRef, setBoardItems, setBoardItemsState } = useBoardLayout();
  const { portalTitle, portalTitleRef, setPortalTitle, setPortalTitleState } = usePortalSettings();
  const { services, servicesRef, setServices, addService, setServicesState } = useServicesCatalog({
    boardItemsRef,
    setBoardItemsState,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [settings, fetchedServices, fetchedBoard] = await Promise.all([
        settingsApi.getSettings(),
        servicesApi.list(),
        boardApi.list(),
      ]);

      portalTitleRef.current = settings.title;
      setPortalTitleState(settings.title);

      servicesRef.current = fetchedServices;
      setServicesState(fetchedServices);

      boardItemsRef.current = fetchedBoard;
      setBoardItemsState(fetchedBoard);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load portal data');
    } finally {
      setLoading(false);
    }
  }, [
    boardItemsRef,
    portalTitleRef,
    servicesRef,
    setBoardItemsState,
    setPortalTitleState,
    setServicesState,
  ]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const saveTitle = useCallback(async (title: string) => {
    setPortalTitle(title);
    await settingsApi.setTitle(title);
  }, [setPortalTitle]);

  const flushChanges = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      await Promise.all([
        settingsApi.setTitle(portalTitleRef.current),
        servicesApi.syncAll(servicesRef.current),
        boardApi.replace(boardItemsRef.current),
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save portal changes');
      throw err;
    } finally {
      setSaving(false);
    }
  }, [boardItemsRef, portalTitleRef, servicesRef]);

  return {
    services,
    setServices,
    addService,
    portalTitle,
    setPortalTitle,
    saveTitle,
    boardItems,
    setBoardItems,
    flushChanges,
    loading,
    saving,
    error,
    reload,
  };
}
