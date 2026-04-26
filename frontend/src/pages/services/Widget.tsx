import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import { ServiceIcon } from './ServiceIcon';
import type { Service } from './types';
import { getPrimaryServiceUrl, isMultiLinkService } from './serviceLinks';

interface Props {
  service: Service;
  editMode: boolean;
  onRemove: (id: string) => void;
}

export function Widget({ service, editMode, onRemove }: Props) {
  const [hovered, setHovered] = useState(false);
  const isMultiLink = isMultiLinkService(service);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: service.id,
    disabled: !editMode,
  });

  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative"
      onMouseEnter={() => !editMode && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        {...(editMode ? { ...attributes, ...listeners } : {})}
        onClick={() => {
          if (!editMode && !isMultiLink) {
            window.open(getPrimaryServiceUrl(service), '_blank', 'noopener');
          }
        }}
        className={[
          'aspect-square rounded-2xl select-none',
          'flex flex-col items-center justify-center gap-2',
          'transition-all duration-200',
          'bg-widget border border-ink-6',
          isDragging ? 'opacity-30 scale-95 z-50 shadow-2xl' : '',
          editMode
            ? 'cursor-grab active:cursor-grabbing ring-1 ring-ink-8'
            : isMultiLink
            ? 'cursor-default hover:bg-hover hover:border-ink-10'
            : 'cursor-pointer hover:bg-hover hover:border-ink-10 active:scale-[0.96]',
        ].join(' ')}
      >
        {editMode && (
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onRemove(service.id); }}
            className="absolute top-1.5 right-1.5 z-10 w-5 h-5 rounded-full bg-[var(--bg)] border border-ink-15 text-ink-35 flex items-center justify-center hover:bg-red-900/70 hover:text-red-300 hover:border-red-700/40 transition-all"
          >
            <svg width="7" height="7" viewBox="0 0 10 10" fill="none">
              <path d="M1.5 1.5L8.5 8.5M8.5 1.5L1.5 8.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </button>
        )}

        <ServiceIcon
          serviceName={service.name}
          iconName={service.iconName}
          size={38}
          shaded={!hovered || editMode}
        />

        <span className={[
          'text-[12px] font-medium leading-none text-center px-2 transition-colors duration-200 w-full truncate',
          hovered && !editMode ? 'text-ink-80' : 'text-ink-35',
        ].join(' ')}>
          {service.name}
        </span>

        {isMultiLink && !editMode && (
          <div className="absolute bottom-2 flex gap-[3px]">
            {service.links!.slice(0, 4).map((_, i) => (
              <span key={i} className="w-[3px] h-[3px] rounded-full bg-ink-20" />
            ))}
          </div>
        )}
      </div>

      {isMultiLink && !editMode && (
        <div
          className={[
            'absolute left-1/2 -translate-x-1/2 pt-1.5 z-50',
            'transition-all duration-150',
            hovered ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-1 pointer-events-none',
          ].join(' ')}
          style={{ top: '100%', minWidth: '9rem' }}
        >
          <div className="bg-hover rounded-xl border border-ink-8 shadow-2xl overflow-hidden">
            {service.links!.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className={[
                  'flex items-center justify-between gap-3 px-3 py-2.5',
                  'text-xs text-ink-50 hover:text-ink-85 hover:bg-ink-5',
                  'transition-colors',
                  i > 0 ? 'border-t border-ink-4' : '',
                ].join(' ')}
              >
                <span className="truncate">{link.label}</span>
                <span className="text-ink-20 shrink-0">↗</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
