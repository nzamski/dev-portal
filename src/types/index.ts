export type ServiceCategory = 'ci-cd' | 'monitoring' | 'infra' | 'code' | 'communication' | 'data' | 'security';

export interface Service {
  id: string;
  name: string;
  url: string;
  category: ServiceCategory;
  description: string;
}

export type BoardItem = { type: 'service'; id: string };
