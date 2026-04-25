import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from './setting.entity';
import type { GitLabConfigContract } from '../contracts/domain.types';

const DEFAULT_GITLAB_CONFIG: GitLabConfigContract = {
  instanceUrl: 'https://gitlab.com',
  token: '',
  resourceType: 'group',
  resourceId: '',
  members: [],
};

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting) private readonly repo: Repository<Setting>,
  ) {}

  async getTitle(): Promise<string> {
    const setting = await this.repo.findOne({ where: { key: 'title' } });
    return setting?.value ?? 'Dev Portal';
  }

  async setTitle(value: string): Promise<string> {
    await this.repo.upsert({ key: 'title', value }, ['key']);
    return value;
  }

  async getGitLabConfig(): Promise<GitLabConfigContract> {
    const setting = await this.repo.findOne({ where: { key: 'gitlab-config' } });
    if (!setting) return DEFAULT_GITLAB_CONFIG;
    try {
      return { ...DEFAULT_GITLAB_CONFIG, ...JSON.parse(setting.value) };
    } catch {
      return DEFAULT_GITLAB_CONFIG;
    }
  }

  async setGitLabConfig(config: Partial<GitLabConfigContract>): Promise<GitLabConfigContract> {
    const current = await this.getGitLabConfig();
    const next = { ...current, ...config };
    await this.repo.upsert({ key: 'gitlab-config', value: JSON.stringify(next) }, ['key']);
    return next;
  }
}
