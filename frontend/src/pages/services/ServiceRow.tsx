import { useState } from 'react';
import { ServiceIcon } from './ServiceIcon';
import type { Service } from './types';
import { getPrimaryServiceUrl, isMultiLinkService } from './serviceLinks';

interface Props {
  service: Service;
}

export function ServiceRow({ service }: Props) {
  const isMultiLink = isMultiLinkService(service);
  const [expanded, setExpanded] = useState(false);

  const iconBox = (dimmed: boolean) => (
    <div className={`w-7 h-7 rounded-lg bg-white/[0.04] border flex items-center justify-center shrink-0 transition-colors ${expanded ? 'border-white/10' : 'border-white/[0.06]'}`}>
      <ServiceIcon
        serviceName={service.name}
        iconName={service.iconName}
        size={16}
        shaded={dimmed}
      />
    </div>
  );

  if (!isMultiLink) {
    return (
      <a
        href={getPrimaryServiceUrl(service)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.04] transition-colors group"
      >
        <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0 group-hover:border-white/10 transition-colors">
          <ServiceIcon serviceName={service.name} iconName={service.iconName} size={16} shaded className="group-hover:hidden" />
          <ServiceIcon serviceName={service.name} iconName={service.iconName} size={16} className="hidden group-hover:block" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-white/60 text-[13px] group-hover:text-white/85 transition-colors">{service.name}</span>
          <span className="text-white/25 text-xs ml-2">{service.description}</span>
        </div>
        <span className="text-white/15 group-hover:text-white/35 text-xs transition-colors">↗</span>
      </a>
    );
  }

  return (
    <div
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div className={`flex items-center gap-3 px-4 py-3 transition-colors cursor-default ${expanded ? 'bg-white/[0.04]' : 'hover:bg-white/[0.02]'}`}>
        {iconBox(!expanded)}
        <div className="min-w-0 flex-1">
          <span className={`text-[13px] transition-colors ${expanded ? 'text-white/85' : 'text-white/60'}`}>{service.name}</span>
          <span className="text-white/25 text-xs ml-2">{service.description}</span>
        </div>
        <span className={`text-xs transition-colors ${expanded ? 'text-white/40' : 'text-white/15'}`}>
          {service.links!.length} links ▾
        </span>
      </div>

      <div
        className="overflow-hidden transition-all duration-200"
        style={{ maxHeight: expanded ? `${service.links!.length * 40}px` : '0px' }}
      >
        {service.links!.map((link, i) => (
          <a
            key={i}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 pl-[52px] pr-4 py-2.5 hover:bg-white/[0.05] transition-colors group/link border-t border-white/[0.03]"
          >
            <span className="text-white/40 text-[12px] group-hover/link:text-white/75 transition-colors flex-1">{link.label}</span>
            <span className="text-white/15 group-hover/link:text-white/35 text-xs transition-colors">↗</span>
          </a>
        ))}
      </div>
    </div>
  );
}
