import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { SettingsService } from '../settings/settings.service';
import type { GitLabConfigContract } from '../contracts/domain.types';
import type { GitLabMR, MRColumnId, MRColumns } from './merge-requests.types';

@Injectable()
export class MergeRequestsService {
  constructor(private readonly settingsService: SettingsService) {}

  async getOpenMergeRequests(): Promise<MRColumns> {
    const config = await this.settingsService.getGitLabConfig();
    if (!this.isConfigured(config)) {
      return this.emptyColumns();
    }

    const base = config.instanceUrl.replace(/\/$/, '');
    const headers: Record<string, string> = {
      'PRIVATE-TOKEN': config.token,
    };

    const endpoint =
      config.resourceType === 'group'
        ? `${base}/api/v4/groups/${encodeURIComponent(config.resourceId)}/merge_requests`
        : `${base}/api/v4/projects/${encodeURIComponent(config.resourceId)}/merge_requests`;

    const params = new URLSearchParams({ state: 'opened', per_page: '100' });
    let rawMRs: GitLabMR[];
    try {
      const response = await axios.get<GitLabMR[]>(`${endpoint}?${params.toString()}`, { headers });
      rawMRs = response.data;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        throw new BadRequestException(`GitLab API returned ${err.response.status}: ${err.response.statusText}`);
      }
      throw err;
    }
    const enriched = await Promise.all(
      rawMRs.map((mergeRequest) => this.enrichMergeRequest(mergeRequest, base, headers, config)),
    );

    const columns = this.emptyColumns();
    for (const mergeRequest of enriched) {
      columns[this.categorize(mergeRequest)].push(mergeRequest);
    }

    columns.author_action = this.sortMRs(columns.author_action);
    columns.reviewer_action = this.sortMRs(columns.reviewer_action);
    columns.approved = this.sortMRs(columns.approved);

    return columns;
  }

  private async enrichMergeRequest(
    mergeRequest: GitLabMR,
    base: string,
    headers: Record<string, string>,
    config: GitLabConfigContract,
  ): Promise<GitLabMR> {
    let approved = false;
    try {
      const approvalsResponse = await axios.get<{ approved?: boolean }>(
        `${base}/api/v4/projects/${mergeRequest.project_id}/merge_requests/${mergeRequest.iid}/approvals`,
        { headers },
      );
      approved = approvalsResponse.data.approved === true;
    } catch {
      // Keep this MR in the board even if approvals lookup fails.
    }

    // GitLab free tier returns `assignee` (singular); Premium returns `assignees` (array).
    // Normalize to always use the array form.
    const assignees =
      mergeRequest.assignees?.length > 0
        ? mergeRequest.assignees
        : mergeRequest.assignee
          ? [mergeRequest.assignee]
          : [];

    return {
      ...mergeRequest,
      reviewers: mergeRequest.reviewers ?? [],
      assignees,
      projectName: this.extractProjectName(mergeRequest.web_url, config.instanceUrl),
      approved,
    };
  }

  private isConfigured(config: GitLabConfigContract): boolean {
    return config.token.trim().length > 0 && config.resourceId.trim().length > 0;
  }

  private categorize(mergeRequest: GitLabMR): MRColumnId {
    if (mergeRequest.reviewers.length === 0) {
      // Has an assignee but no reviewer — assignee needs to find one
      if (mergeRequest.assignees.length > 0) return 'author_action';
      return 'author_action';
    }
    if (mergeRequest.approved) return 'approved';
    if (mergeRequest.reviewers.some((reviewer) => reviewer.state === 'requested_changes')) {
      return 'author_action';
    }
    return 'reviewer_action';
  }

  private sortMRs(mergeRequests: GitLabMR[]): GitLabMR[] {
    return [...mergeRequests].sort((a, b) => {
      const createdA = new Date(a.created_at).getTime();
      const createdB = new Date(b.created_at).getTime();
      if (createdA !== createdB) return createdA - createdB;

      const updatedA = new Date(a.updated_at).getTime();
      const updatedB = new Date(b.updated_at).getTime();
      if (updatedA !== updatedB) return updatedA - updatedB;

      return a.projectName.localeCompare(b.projectName);
    });
  }

  private extractProjectName(webUrl: string, instanceUrl: string): string {
    const base = instanceUrl.replace(/\/$/, '');
    const path = webUrl.startsWith(base) ? webUrl.slice(base.length) : webUrl;
    const segments = path.split('/-/merge_requests/')[0].split('/').filter(Boolean);
    return segments[segments.length - 1] ?? 'unknown';
  }

  private emptyColumns(): MRColumns {
    return {
      author_action: [],
      reviewer_action: [],
      approved: [],
    };
  }
}
