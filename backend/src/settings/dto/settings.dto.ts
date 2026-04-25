import type { GitLabConfigContract } from 'src/contracts/domain.types';

export interface SetTitleDto {
  value: string;
}

export type UpdateGitLabConfigDto = Partial<GitLabConfigContract>;
