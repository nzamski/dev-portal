import { memo } from 'react';
import { ServiceRow } from './ServiceRow';
import type { Service } from './types';

interface Props {
  services: Service[];
}

const ServiceDirectory = memo(function ServiceDirectory({ services }: Props) {
  const sorted = [...services].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <section className="pb-24">
      <div className="flex items-baseline gap-3 mb-3">
        <h2 className="text-white/50 text-xs font-semibold uppercase tracking-widest">All Services</h2>
        <span className="text-white/20 text-xs">{sorted.length}</span>
      </div>

      <div className="rounded-2xl border border-white/[0.06] overflow-hidden">
        <div className="grid grid-cols-2 divide-x divide-white/[0.04]">
          {sorted.map((s, i) => (
            <div key={s.id} className={i > 1 ? 'border-t border-white/[0.04]' : ''}>
              <ServiceRow service={s} />
            </div>
          ))}
          {sorted.length % 2 !== 0 && (
            <div className="border-t border-white/[0.04]" />
          )}
        </div>
      </div>
    </section>
  );
});

export { ServiceDirectory };
