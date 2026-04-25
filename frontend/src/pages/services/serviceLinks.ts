import type { Service } from './types';

export function isMultiLinkService(service: Service): boolean {
  return service.links.length > 1;
}

export function getPrimaryServiceUrl(service: Service): string | undefined {
  return service.links[0]?.url;
}
