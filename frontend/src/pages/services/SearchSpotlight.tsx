import { useEffect, useMemo, useState } from 'react';
import { ServiceIcon } from './ServiceIcon';
import type { Service } from './types';
import { getPrimaryServiceUrl, isMultiLinkService } from './serviceLinks';

interface Props {
  query: string;
  services: Service[];
  onClose: () => void;
}

export function SearchSpotlight({ query, services, onClose }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);
  const results = useMemo(() => {
    const q = query.toLowerCase();
    return services.filter(
      (s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
    );
  }, [query, services]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const rowBase = 'flex items-center gap-3 px-4 py-3 hover:bg-ink-4 transition-colors group';
  const divider = 'border-t border-ink-3 first:border-0';

  return (
    <div className="fixed top-14 inset-x-0 bottom-0 z-[15]">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative max-w-5xl mx-auto px-8 pt-3">
        <div className="surface rounded-2xl border border-ink-8 shadow-2xl overflow-hidden">
          <div className="px-4 py-2.5 border-b border-ink-5 flex items-center justify-between">
            <span className="text-ink-30 text-xs">
              {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
            </span>
            <button
              onClick={onClose}
              className="text-ink-20 hover:text-ink-50 transition-colors p-1"
            >
              <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                <path d="M1.5 1.5L8.5 8.5M8.5 1.5L1.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto scrollbar-none">
            {results.length === 0 ? (
              <p className="text-ink-25 text-sm text-center py-10">No results for "{query}"</p>
            ) : (
              results.map((s) => {
                const isOpen = openId === s.id;
                const multiLink = isMultiLinkService(s);

                const iconEl = (
                  <div className="w-8 h-8 rounded-lg bg-ink-4 border border-ink-6 flex items-center justify-center shrink-0 group-hover:border-ink-10 transition-colors">
                    <ServiceIcon serviceName={s.name} iconName={s.iconName} size={18} />
                  </div>
                );

                const metaEl = (
                  <div className="flex-1 min-w-0">
                    <span className="text-ink-70 text-sm group-hover:text-ink-90 transition-colors">{s.name}</span>
                    <span className="text-ink-25 text-xs ml-2">{s.description}</span>
                  </div>
                );

                if (!multiLink) {
                  return (
                    <a
                      key={s.id}
                      href={getPrimaryServiceUrl(s)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={onClose}
                      className={`${rowBase} ${divider}`}
                    >
                      {iconEl}
                      {metaEl}
                      <span className="text-ink-15 group-hover:text-ink-40 text-sm transition-colors">↗</span>
                    </a>
                  );
                }

                return (
                  <div
                    key={s.id}
                    className={divider}
                    onMouseEnter={() => setOpenId(s.id)}
                    onMouseLeave={() => setOpenId(null)}
                  >
                    <div className={`flex items-center gap-3 px-4 py-3 transition-colors cursor-default group ${isOpen ? 'bg-ink-4' : 'hover:bg-ink-2'}`}>
                      <div className={`w-8 h-8 rounded-lg bg-ink-4 border flex items-center justify-center shrink-0 transition-colors ${isOpen ? 'border-ink-10' : 'border-ink-6'}`}>
                        <ServiceIcon serviceName={s.name} iconName={s.iconName} size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className={`text-sm transition-colors ${isOpen ? 'text-ink-90' : 'text-ink-70'}`}>{s.name}</span>
                        <span className="text-ink-25 text-xs ml-2">{s.description}</span>
                      </div>
                      <span className={`text-xs transition-colors ${isOpen ? 'text-ink-40' : 'text-ink-15'}`}>
                        {s.links.length} links ▾
                      </span>
                    </div>
                    <div
                      className="overflow-hidden transition-all duration-200"
                      style={{ maxHeight: isOpen ? `${s.links.length * 40}px` : '0px' }}
                    >
                      {s.links.map((link) => (
                        <a
                          key={link.url}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={onClose}
                          className="flex items-center gap-2 mx-3 pl-11 pr-3 py-2.5 hover:bg-ink-5 transition-colors group/link border-t border-ink-3"
                        >
                          <span className="text-ink-40 text-sm group-hover/link:text-ink-75 transition-colors flex-1">{link.label}</span>
                          <span className="text-ink-15 group-hover/link:text-ink-40 text-sm transition-colors">↗</span>
                        </a>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
