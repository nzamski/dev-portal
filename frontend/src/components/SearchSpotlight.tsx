import { useEffect, useMemo, useState } from 'react';
import { ServiceIcon } from './ServiceIcon';
import type { Service } from '@/types';

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

  const rowBase = 'flex items-center gap-3 px-4 py-3 hover:bg-white/[0.04] transition-colors group';
  const divider = 'border-t border-white/[0.03] first:border-0';

  return (
    <div className="fixed top-14 inset-x-0 bottom-0 z-[15]">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* results panel */}
      <div className="relative max-w-5xl mx-auto px-8 pt-3">
        <div className="bg-[#111111] rounded-2xl border border-white/[0.08] shadow-2xl overflow-hidden">
          <div className="px-4 py-2.5 border-b border-white/[0.05] flex items-center justify-between">
            <span className="text-white/30 text-xs">
              {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
            </span>
            <button
              onClick={onClose}
              className="text-white/20 hover:text-white/50 transition-colors p-1"
            >
              <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                <path d="M1.5 1.5L8.5 8.5M8.5 1.5L1.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto scrollbar-none">
            {results.length === 0 ? (
              <p className="text-white/25 text-sm text-center py-10">No results for "{query}"</p>
            ) : (
              results.map((s) => {
                const isOpen = openId === s.id;
                const multiLink = s.links.length > 1;

                const iconEl = (
                  <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0 group-hover:border-white/10 transition-colors">
                    <ServiceIcon serviceName={s.name} iconName={s.iconName} size={18}  />
                  </div>
                );

                const metaEl = (
                  <div className="flex-1 min-w-0">
                    <span className="text-white/70 text-sm group-hover:text-white/90 transition-colors">{s.name}</span>
                    <span className="text-white/25 text-xs ml-2">{s.description}</span>
                  </div>
                );

                if (!multiLink) {
                  return (
                    <a
                      key={s.id}
                      href={s.links[0]?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={onClose}
                      className={`${rowBase} ${divider}`}
                    >
                      {iconEl}
                      {metaEl}
                      <span className="text-white/15 group-hover:text-white/40 text-sm transition-colors">↗</span>
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
                    <div className={`flex items-center gap-3 px-4 py-3 transition-colors cursor-default group ${isOpen ? 'bg-white/[0.04]' : 'hover:bg-white/[0.02]'}`}>
                      <div className={`w-8 h-8 rounded-lg bg-white/[0.04] border flex items-center justify-center shrink-0 transition-colors ${isOpen ? 'border-white/10' : 'border-white/[0.06]'}`}>
                        <ServiceIcon serviceName={s.name} iconName={s.iconName} size={18}  />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className={`text-sm transition-colors ${isOpen ? 'text-white/90' : 'text-white/70'}`}>{s.name}</span>
                        <span className="text-white/25 text-xs ml-2">{s.description}</span>
                      </div>
                      <span className={`text-xs transition-colors ${isOpen ? 'text-white/40' : 'text-white/15'}`}>
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
                          className="flex items-center gap-2 mx-3 pl-11 pr-3 py-2.5 hover:bg-white/[0.05] transition-colors group/link border-t border-white/[0.03]"
                        >
                          <span className="text-white/40 text-sm group-hover/link:text-white/75 transition-colors flex-1">{link.label}</span>
                          <span className="text-white/15 group-hover/link:text-white/40 text-sm transition-colors">↗</span>
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
