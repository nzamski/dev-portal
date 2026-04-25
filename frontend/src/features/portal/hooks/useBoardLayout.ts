import { useCallback, useRef, useState } from 'react';
import type { BoardItem } from '@/domain/contracts';

export function useBoardLayout() {
  const [boardItems, setBoardItemsState] = useState<BoardItem[]>([]);
  const boardItemsRef = useRef<BoardItem[]>([]);

  const setBoardItems = useCallback((items: BoardItem[]) => {
    boardItemsRef.current = items;
    setBoardItemsState(items);
  }, []);

  return { boardItems, boardItemsRef, setBoardItems, setBoardItemsState };
}
