import { useState, useCallback, useEffect, useRef } from 'react';
import type { Service, BoardItem } from '@/types';
import apiClient from '@/lib/apiClient';

export function usePortalData() {
  const [services, setServicesState] = useState<Service[]>([]);
  const [portalTitle, setPortalTitleState] = useState<string>('Dev Portal');
  const [boardItems, setBoardItemsState] = useState<BoardItem[]>([]);
  const [loading, setLoading] = useState(true);

  const servicesRef = useRef<Service[]>([]);
  const boardItemsRef = useRef<BoardItem[]>([]);
  const portalTitleRef = useRef<string>('Dev Portal');

  useEffect(() => {
    Promise.all([
      apiClient.get('/api/settings').then((r) => r.data),
      apiClient.get('/api/services').then((r) => r.data),
      apiClient.get('/api/board').then((r) => r.data),
    ]).then(([settings, svcs, board]) => {
      portalTitleRef.current = settings.title;
      setPortalTitleState(settings.title);

      servicesRef.current = svcs;
      setServicesState(svcs);

      boardItemsRef.current = board;
      setBoardItemsState(board);

      setLoading(false);
    });
  }, []);

  const setPortalTitle = useCallback((title: string) => {
    portalTitleRef.current = title;
    setPortalTitleState(title);
  }, []);

  const addService = useCallback(async (data: Omit<Service, 'id'>): Promise<Service> => {
    const { data: created } = await apiClient.post<Service>('/api/services', data);
    const updated = [...servicesRef.current, created];
    servicesRef.current = updated;
    setServicesState(updated);
    return created;
  }, []);

  const setServices = useCallback((updated: Service[]) => {
    const current = servicesRef.current;
    servicesRef.current = updated;
    setServicesState(updated);

    const toDelete = current.filter((c) => !updated.some((u) => u.id === c.id));
    if (toDelete.length > 0) {
      const deletedIds = new Set(toDelete.map((s) => s.id));
      const pruned = boardItemsRef.current.filter((item) => !deletedIds.has(item.id));
      if (pruned.length !== boardItemsRef.current.length) {
        boardItemsRef.current = pruned;
        setBoardItemsState(pruned);
      }
    }
  }, []);

  const setBoardItems = useCallback((items: BoardItem[]) => {
    boardItemsRef.current = items;
    setBoardItemsState(items);
  }, []);

  // Call when the user exits manage mode — flushes all pending state in one burst.
  const flushChanges = useCallback(() => {
    apiClient.put('/api/settings/title', { value: portalTitleRef.current });
    apiClient.put('/api/services', servicesRef.current);
    apiClient.put('/api/board', boardItemsRef.current);
  }, []);

  return {
    services,
    setServices,
    addService,
    portalTitle,
    setPortalTitle,
    boardItems,
    setBoardItems,
    flushChanges,
    loading,
  };
}
