import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import { ServiceIcon } from './ServiceIcon';
import { resolveIconColor } from '../data/icons';
import type { Service } from '../types';

interface Props {
  service: Service;
  editMode: boolean;
  onRemove: (id: string) => void;
}

export function Widget({ service, editMode, onRemove }: Props) {
  const [hovered, setHovered] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: service.id,
    disabled: !editMode,
  });

  const style = { transform: CSS.Transform.toString(transform), transition };
  const brandColor = resolveIconColor(service.id);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(editMode ? { ...attributes, ...listeners } : {})}
      onMouseEnter={() => !editMode && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => { if (!editMode) window.open(service.url, '_blank', 'noopener'); }}
      className={[
        'group relative aspect-square rounded-2xl select-none',
        'flex flex-col items-center justify-center gap-2',
        'transition-all duration-200',
        'bg-[#131313] border border-white/[0.055]',
        isDragging ? 'opacity-30 scale-95 z-50 shadow-2xl' : '',
        editMode
          ? 'cursor-grab active:cursor-grabbing ring-1 ring-white/[0.08]'
          : 'cursor-pointer hover:bg-[#1c1c1c] hover:border-white/10 active:scale-[0.96]',
      ].join(' ')}
    >
      {/* remove badge */}
      {editMode && (
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); onRemove(service.id); }}
          className="absolute top-1.5 right-1.5 z-10 w-5 h-5 rounded-full bg-[#0c0c0c] border border-white/15 text-white/35 flex items-center justify-center hover:bg-red-900/70 hover:text-red-300 hover:border-red-700/40 transition-all"
        >
          <svg width="7" height="7" viewBox="0 0 10 10" fill="none">
            <path d="M1.5 1.5L8.5 8.5M8.5 1.5L1.5 8.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </button>
      )}

      <ServiceIcon
        serviceId={service.id}
        size={38}
        color={hovered && !editMode ? brandColor : 'rgba(255,255,255,0.38)'}
      />

      <span className={[
        'text-[12px] font-medium leading-none text-center px-2 transition-colors duration-200 w-full truncate',
        hovered && !editMode ? 'text-white/80' : 'text-white/35',
      ].join(' ')}>
        {service.name}
      </span>
    </div>
  );
}
