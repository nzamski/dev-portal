export interface ServiceLink {
  label: string;
  url: string;
}

export interface ServiceContract {
  id: string;
  name: string;
  description: string;
  iconName?: string;
  links: ServiceLink[];
}

export interface BoardItemContract {
  type: 'service';
  id: string;
}

export interface GitLabMember {
  name: string;
  username: string;
}

export interface GitLabConfigContract {
  instanceUrl: string;
  token: string;
  resourceType: 'group' | 'project';
  resourceId: string;
  members: GitLabMember[];
}
