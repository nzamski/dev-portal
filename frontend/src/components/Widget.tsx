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
  const isMultiLink = service.links.length > 1;

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: service.id,
    disabled: !editMode,
  });

  const style = { transform: CSS.Transform.toString(transform), transition };
  const brandColor = resolveIconColor(service.id, service.name, service.iconName);

  return (
    // Outer div: dnd anchor + mouse-leave scope (covers tile + floating panel)
    <div
      ref={setNodeRef}
      style={style}
      className="relative"
      onMouseEnter={() => !editMode && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Visual tile */}
      <div
        {...(editMode ? { ...attributes, ...listeners } : {})}
        onClick={() => { if (!editMode && !isMultiLink) window.open(service.links[0]?.url, '_blank', 'noopener'); }}
        className={[
          'aspect-square rounded-2xl select-none',
          'flex flex-col items-center justify-center gap-2',
          'transition-all duration-200',
          'bg-[#131313] border border-white/[0.055]',
          isDragging ? 'opacity-30 scale-95 z-50 shadow-2xl' : '',
          editMode
            ? 'cursor-grab active:cursor-grabbing ring-1 ring-white/[0.08]'
            : isMultiLink
            ? 'cursor-default hover:bg-[#1c1c1c] hover:border-white/10'
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
          serviceName={service.name}
          iconName={service.iconName}
          size={38}
          color={hovered && !editMode ? brandColor : 'rgba(255,255,255,0.38)'}
        />

        <span className={[
          'text-[12px] font-medium leading-none text-center px-2 transition-colors duration-200 w-full truncate',
          hovered && !editMode ? 'text-white/80' : 'text-white/35',
        ].join(' ')}>
          {service.name}
        </span>

        {/* Multi-link indicator dots */}
        {isMultiLink && !editMode && (
          <div className="absolute bottom-2 flex gap-[3px]">
            {service.links!.slice(0, 4).map((_, i) => (
              <span key={i} className="w-[3px] h-[3px] rounded-full bg-white/20" />
            ))}
          </div>
        )}
      </div>

      {/* Floating link-picker panel — appears on hover, panel is a DOM child so
          mouseleave on the outer div won't fire while the pointer is inside it */}
      {isMultiLink && !editMode && (
        <div
          className={[
            'absolute left-1/2 -translate-x-1/2 pt-1.5 z-50',
            'transition-all duration-150',
            hovered ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-1 pointer-events-none',
          ].join(' ')}
          style={{ top: '100%', minWidth: '9rem' }}
        >
          <div className="bg-[#1c1c1c] rounded-xl border border-white/[0.08] shadow-2xl overflow-hidden">
            {service.links!.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className={[
                  'flex items-center justify-between gap-3 px-3 py-2.5',
                  'text-xs text-white/50 hover:text-white/85 hover:bg-white/[0.05]',
                  'transition-colors',
                  i > 0 ? 'border-t border-white/[0.04]' : '',
                ].join(' ')}
              >
                <span className="truncate">{link.label}</span>
                <span className="text-white/20 shrink-0">↗</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
