import { useState } from 'react';
import { ServiceIcon } from './ServiceIcon';
import { resolveIconColor } from '../data/icons';
import type { Service } from '../types';

interface Props {
  boardIds: string[];
  services: Service[];
  onAdd: (service: Service) => void;
  onClose: () => void;
}

export function AddServicePanel({ boardIds, services, onAdd, onClose }: Props) {
  const [query, setQuery] = useState('');

  const available = services.filter((s) => !boardIds.includes(s.id));
  const filtered = query.trim()
    ? available.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()))
    : available;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-[#111111] rounded-2xl overflow-hidden shadow-2xl border border-white/[0.08]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h2 className="text-white text-sm font-semibold">Add Service</h2>
          <button onClick={onClose} className="text-white/30 hover:text-white/70 transition-colors text-base leading-none">✕</button>
        </div>

        <div className="px-5 pb-3">
          <input
            autoFocus
            placeholder="Search…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-white/15 transition-colors"
          />
        </div>

        <div className="max-h-80 overflow-y-auto px-3 pb-4">
          {filtered.length === 0 && (
            <p className="text-white/25 text-xs text-center py-8">No services found</p>
          )}
          {filtered.map((s) => (
            <button
              key={s.id}
              onClick={() => { onAdd(s); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.05] transition-colors group text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.06] flex items-center justify-center shrink-0">
                <ServiceIcon serviceId={s.id} serviceName={s.name} size={18} color={resolveIconColor(s.id, s.name)} />
              </div>
                <div className="min-w-0 flex-1">
                  <p className="text-white/80 text-sm leading-tight">{s.name}</p>
                  <p className="text-white/30 text-xs truncate mt-0.5">{s.description}</p>
                </div>
              <span className="text-white/15 group-hover:text-white/40 transition-colors text-base leading-none">+</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
