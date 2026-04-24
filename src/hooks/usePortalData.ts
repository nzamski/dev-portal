import { useState, useCallback } from 'react';
import { ALL_SERVICES, DEFAULT_BOARD_IDS } from '../data/services';
import type { Service, BoardItem } from '../types';

function load<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

const DEFAULT_BOARD: BoardItem[] = DEFAULT_BOARD_IDS.map((id) => ({ type: 'service' as const, id }));

export function usePortalData() {
  const [services, setServicesRaw] = useState<Service[]>(() => load('portal-services', ALL_SERVICES));
  const [portalTitle, setPortalTitleRaw] = useState<string>(
    () => localStorage.getItem('portal-title') ?? 'Dev Portal'
  );
  const [boardItems, setBoardItemsRaw] = useState<BoardItem[]>(() => load('portal-board', DEFAULT_BOARD));

  const setServices = useCallback((updated: Service[]) => {
    setServicesRaw(updated);
    localStorage.setItem('portal-services', JSON.stringify(updated));
  }, []);

  const setPortalTitle = useCallback((title: string) => {
    setPortalTitleRaw(title);
    localStorage.setItem('portal-title', title);
  }, []);

  const setBoardItems = useCallback((items: BoardItem[]) => {
    setBoardItemsRaw(items);
    localStorage.setItem('portal-board', JSON.stringify(items));
  }, []);

  return { services, setServices, portalTitle, setPortalTitle, boardItems, setBoardItems };
}
