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
        <h2 className="text-ink-50 text-xs font-semibold uppercase tracking-widest">All Services</h2>
        <span className="text-ink-20 text-xs">{sorted.length}</span>
      </div>

      <div className="rounded-2xl border border-ink-6 overflow-hidden">
        <div className="grid grid-cols-2">
          {sorted.map((s, i) => (
            <div key={s.id} className={[i % 2 === 1 ? 'border-l border-ink-4' : '', i > 1 ? 'border-t border-ink-4' : ''].filter(Boolean).join(' ')}>
              <ServiceRow service={s} />
            </div>
          ))}
          {sorted.length % 2 !== 0 && (
            <div className="border-t border-ink-4" />
          )}
        </div>
      </div>
    </section>
  );
});

export { ServiceDirectory };
