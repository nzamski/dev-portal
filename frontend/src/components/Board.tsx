import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable';
import { useState, useCallback, useMemo, memo } from 'react';
import { Widget } from './Widget';
import { AddServicePanel } from './AddServicePanel';
import { ServiceIcon } from './ServiceIcon';
import type { BoardItem, Service } from '../types';

interface Props {
  editMode: boolean;
  services: Service[];
  boardItems: BoardItem[];
  setBoardItems: (items: BoardItem[]) => void;
}

const Board = memo(function Board({ editMode, services, boardItems, setBoardItems }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const serviceMap = useMemo(
    () => Object.fromEntries(services.map((s) => [s.id, s])),
    [services]
  );

  const handleDragStart = useCallback(({ active }: DragStartEvent) => {
    setActiveId(active.id as string);
  }, []);

  const handleDragEnd = useCallback(({ active, over }: DragEndEvent) => {
    setActiveId(null);
    if (!over || active.id === over.id) return;
    const oldIndex = boardItems.findIndex((item) => item.id === active.id);
    const newIndex = boardItems.findIndex((item) => item.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) {
      setBoardItems(arrayMove(boardItems, oldIndex, newIndex));
    }
  }, [boardItems, setBoardItems]);

  const removeItem = useCallback((id: string) => {
    setBoardItems(boardItems.filter((item) => item.id !== id));
  }, [boardItems, setBoardItems]);

  const addService = useCallback((service: Service) => {
    setBoardItems([...boardItems, { type: 'service', id: service.id }]);
  }, [boardItems, setBoardItems]);

  const activeService = activeId ? serviceMap[activeId] : null;
  const boardIds = boardItems.map((i) => i.id);

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={boardIds} strategy={rectSortingStrategy}>
          <div className="grid gap-2.5" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
            {boardItems.map((item) => {
              const service = serviceMap[item.id];
              if (!service) return null;
              return (
                <Widget
                  key={service.id}
                  service={service}
                  editMode={editMode}
                  onRemove={removeItem}
                />
              );
            })}

            {editMode && (
              <button
                onClick={() => setShowAdd(true)}
                className="aspect-square rounded-2xl border border-dashed border-white/[0.08] flex flex-col items-center justify-center gap-2 text-white/20 hover:text-white/40 hover:border-white/15 transition-all duration-200"
              >
                <span className="text-lg leading-none font-light">+</span>
                <span className="text-[10px]">Add</span>
              </button>
            )}
          </div>
        </SortableContext>

        <DragOverlay dropAnimation={{ duration: 150, easing: 'ease' }}>
          {activeService && (
            <div className="aspect-square w-20 rounded-2xl bg-[#1c1c1c] border border-white/10 flex flex-col items-center justify-center gap-2 shadow-2xl ring-1 ring-white/10 scale-105">
              <ServiceIcon serviceName={activeService.name} iconName={activeService.iconName} size={26} shaded />
              <span className="text-[11px] text-white/60">{activeService.name}</span>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {showAdd && (
        <AddServicePanel
          boardIds={boardIds}
          services={services}
          onAdd={addService}
          onClose={() => setShowAdd(false)}
        />
      )}
    </>
  );
});

export { Board };
