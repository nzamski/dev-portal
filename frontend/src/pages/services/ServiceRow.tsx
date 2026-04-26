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
    <div className={`w-7 h-7 rounded-lg bg-ink-4 border flex items-center justify-center shrink-0 transition-colors ${expanded ? 'border-ink-10' : 'border-ink-6'}`}>
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
        className="flex items-center gap-3 px-4 py-3 hover:bg-ink-4 transition-colors group"
      >
        <div className="w-7 h-7 rounded-lg bg-ink-4 border border-ink-6 flex items-center justify-center shrink-0 group-hover:border-ink-10 transition-colors">
          <ServiceIcon serviceName={service.name} iconName={service.iconName} size={16} shaded className="group-hover:hidden" />
          <ServiceIcon serviceName={service.name} iconName={service.iconName} size={16} className="hidden group-hover:block" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-ink-60 text-[13px] group-hover:text-ink-85 transition-colors">{service.name}</span>
          <span className="text-ink-25 text-xs ml-2">{service.description}</span>
        </div>
        <span className="text-ink-15 group-hover:text-ink-35 text-xs transition-colors">↗</span>
      </a>
    );
  }

  return (
    <div
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div className={`flex items-center gap-3 px-4 py-3 transition-colors cursor-default ${expanded ? 'bg-ink-4' : 'hover:bg-ink-2'}`}>
        {iconBox(!expanded)}
        <div className="min-w-0 flex-1">
          <span className={`text-[13px] transition-colors ${expanded ? 'text-ink-85' : 'text-ink-60'}`}>{service.name}</span>
          <span className="text-ink-25 text-xs ml-2">{service.description}</span>
        </div>
        <span className={`text-xs transition-colors ${expanded ? 'text-ink-40' : 'text-ink-15'}`}>
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
            className="flex items-center gap-3 pl-[52px] pr-4 py-2.5 hover:bg-ink-5 transition-colors group/link border-t border-ink-3"
          >
            <span className="text-ink-40 text-[12px] group-hover/link:text-ink-75 transition-colors flex-1">{link.label}</span>
            <span className="text-ink-15 group-hover/link:text-ink-35 text-xs transition-colors">↗</span>
          </a>
        ))}
      </div>
    </div>
  );
}
