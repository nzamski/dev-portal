export interface GitLabUser {
  id: number;
  name: string;
  username: string;
  avatar_url: string;
}

export interface GitLabReviewer extends GitLabUser {
  state: 'unreviewed' | 'reviewed' | 'requested_changes' | 'approved';
}

export interface GitLabMR {
  id: number;
  iid: number;
  title: string;
  state: string;
  created_at: string;
  updated_at: string;
  web_url: string;
  project_id: number;
  author: GitLabUser;
  assignee?: GitLabUser;
  assignees: GitLabUser[];
  reviewers: GitLabReviewer[];
  references: {
    short: string;
    relative: string;
    full: string;
  };
  projectName: string;
  approved: boolean;
}

export type MRColumnId = 'unassigned' | 'author_action' | 'reviewer_action' | 'approved';

export type MRColumns = Record<MRColumnId, GitLabMR[]>;
