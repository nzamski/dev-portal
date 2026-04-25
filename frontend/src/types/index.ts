export interface ServiceLink {
  label: string;
  url: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  iconName?: string;
  links: ServiceLink[];
}

export type BoardItem = { type: 'service'; id: string };
