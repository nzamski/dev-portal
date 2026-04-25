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

export interface GitLabMember {
  name: string;
  username: string;
}

export interface GitLabConfig {
  instanceUrl: string;
  token: string;
  resourceType: 'group' | 'project';
  resourceId: string;
  members: GitLabMember[];
}
