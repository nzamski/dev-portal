import { BadRequestException, Injectable } from '@nestjs/common';
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
    const response = await fetch(`${endpoint}?${params.toString()}`, { headers });

    if (!response.ok) {
      throw new BadRequestException(`GitLab API returned ${response.status}: ${response.statusText}`);
    }

    const rawMRs = (await response.json()) as GitLabMR[];
    const enriched = await Promise.all(
      rawMRs.map((mergeRequest) => this.enrichMergeRequest(mergeRequest, base, headers, config)),
    );

    const columns = this.emptyColumns();
    for (const mergeRequest of enriched) {
      columns[this.categorize(mergeRequest)].push(mergeRequest);
    }

    columns.unassigned = this.sortMRs(columns.unassigned);
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
      const approvalsResponse = await fetch(
        `${base}/api/v4/projects/${mergeRequest.project_id}/merge_requests/${mergeRequest.iid}/approvals`,
        { headers },
      );
      if (approvalsResponse.ok) {
        const approvals = (await approvalsResponse.json()) as { approved?: boolean };
        approved = approvals.approved === true;
      }
    } catch {
      // Keep this MR in the board even if approvals lookup fails.
    }

    return {
      ...mergeRequest,
      reviewers: mergeRequest.reviewers ?? [],
      assignees: mergeRequest.assignees ?? [],
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
      return 'unassigned';
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
      unassigned: [],
      author_action: [],
      reviewer_action: [],
      approved: [],
    };
  }
}
