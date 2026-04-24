import { ServiceIcon } from './ServiceIcon';
import { resolveIconColor } from '../data/icons';
import type { Service } from '../types';

interface Props {
  service: Service;
}

export function ServiceRow({ service }: Props) {
  const iconColor = resolveIconColor(service.id);

  return (
    <a
      href={service.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.04] transition-colors group"
    >
      <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0 group-hover:border-white/10 transition-colors">
        <ServiceIcon serviceId={service.id} size={16} color="rgba(255,255,255,0.3)" className="group-hover:hidden" />
        <ServiceIcon serviceId={service.id} size={16} color={iconColor} className="hidden group-hover:block" />
      </div>
      <div className="min-w-0 flex-1">
        <span className="text-white/60 text-[13px] group-hover:text-white/85 transition-colors">{service.name}</span>
        <span className="text-white/25 text-xs ml-2">{service.description}</span>
      </div>
      <span className="text-white/15 group-hover:text-white/35 text-xs transition-colors">↗</span>
    </a>
  );
}
