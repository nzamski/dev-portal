import { useCallback, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { servicesApi } from '@/api/servicesApi';
import type { BoardItem, Service } from '@/domain/contracts';

interface Options {
  boardItemsRef: RefObject<BoardItem[]>;
  setBoardItemsState: (items: BoardItem[]) => void;
}

export function useServicesCatalog({ boardItemsRef, setBoardItemsState }: Options) {
  const [services, setServicesState] = useState<Service[]>([]);
  const servicesRef = useRef<Service[]>([]);

  const addService = useCallback(async (data: Omit<Service, 'id'>): Promise<Service> => {
    const created = await servicesApi.create(data);
    const updated = [...servicesRef.current, created];
    servicesRef.current = updated;
    setServicesState(updated);
    return created;
  }, []);

  const setServices = useCallback(
    (updated: Service[]) => {
      const current = servicesRef.current;
      servicesRef.current = updated;
      setServicesState(updated);

      const toDelete = current.filter((candidate) => !updated.some((next) => next.id === candidate.id));
      if (toDelete.length === 0) return;

      const deletedIds = new Set(toDelete.map((service) => service.id));
      const pruned = boardItemsRef.current.filter((item) => !deletedIds.has(item.id));
      if (pruned.length !== boardItemsRef.current.length) {
        boardItemsRef.current = pruned;
        setBoardItemsState(pruned);
      }
    },
    [boardItemsRef, setBoardItemsState],
  );

  return { services, servicesRef, setServices, addService, setServicesState };
}
