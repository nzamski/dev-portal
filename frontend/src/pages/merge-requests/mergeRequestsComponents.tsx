import { MRCard } from './MRCard';
import type { GitLabMember } from '@/domain/contracts';
import type { GitLabMR, GitLabUser, MRColumns } from './types';

// ── Data transform ────────────────────────────────────────────────────────────

interface MemberLoad {
  member: GitLabUser;
  authoring: GitLabMR[];
  reviewing: GitLabMR[];
  totalLoad: number;
}

function buildMemberLoad(columns: MRColumns, seedMembers: GitLabMember[]): { members: MemberLoad[] } {
  const memberMap = new Map<string, { user: GitLabUser; authoring: GitLabMR[]; reviewing: GitLabMR[] }>();

  for (const m of seedMembers) {
    memberMap.set(m.username, {
      user: { id: -1, name: m.name, username: m.username, avatar_url: '' },
      authoring: [],
      reviewing: [],
    });
  }

  function ensureMember(user: GitLabUser) {
    if (!memberMap.has(user.username)) return null;
    memberMap.get(user.username)!.user = user;
    return memberMap.get(user.username)!;
  }

  const allMRs = [...columns.author_action, ...columns.reviewer_action, ...columns.approved];

  for (const mr of allMRs) {
    if (mr.assignees.length > 0) {
      for (const assignee of mr.assignees) ensureMember(assignee)?.authoring.push(mr);
    } else {
      ensureMember(mr.author)?.authoring.push(mr);
    }
  }

  for (const mr of columns.reviewer_action) {
    const pending = mr.reviewers.filter((r) => r.state === 'unreviewed' || r.state === 'reviewed');
    const targets = pending.length > 0 ? pending : mr.reviewers;
    for (const r of targets) ensureMember(r)?.reviewing.push(mr);
  }

  const members: MemberLoad[] = [...memberMap.values()]
    .map(({ user, authoring, reviewing }) => ({
      member: user,
      authoring,
      reviewing,
      totalLoad: authoring.length + reviewing.length,
    }))
    .sort((a, b) => b.totalLoad - a.totalLoad);

  return { members };
}

// ── Member load board ─────────────────────────────────────────────────────────

export function MRLoadBoard({
  columns,
  members: seedMembers,
  showRepo,
}: {
  columns: MRColumns;
  members: GitLabMember[];
  showRepo: boolean;
}) {
  const totalCount = Object.values(columns).reduce((s, c) => s + c.length, 0);

  if (totalCount === 0 && seedMembers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-ink-20 text-sm">No open merge requests</p>
      </div>
    );
  }

  const { members } = buildMemberLoad(columns, seedMembers);

  return (
    <div>
      {/* Table header */}
      <div className="flex items-center gap-4 px-3 pb-2 mb-1">
        <div className="w-36 shrink-0" />
        <div className="flex-1 grid grid-cols-2 gap-6">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-author">
            Authoring
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-reviewer">
            Reviewing
          </span>
        </div>
      </div>

      {/* Member rows */}
      {members.map((row) => (
        <MemberLoadRow
          key={row.member.username}
          row={row}
          showRepo={showRepo}
        />
      ))}
    </div>
  );
}

// ── Member row ────────────────────────────────────────────────────────────────

function MemberLoadRow({
  row,
  showRepo,
}: {
  row: MemberLoad;
  showRepo: boolean;
}) {
  const initials = row.member.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="border-t border-ink-3">
      {/* Summary row */}
      <div className="flex items-center gap-4 px-3 py-3">
        {/* Name */}
        <div className="w-36 shrink-0 flex items-center gap-2.5 min-w-0">
          <div className="w-6 h-6 rounded-full bg-ink-7 flex items-center justify-center shrink-0 text-[9px] font-semibold text-ink-35">
            {initials}
          </div>
          <span className="text-[12px] font-medium text-ink-50 truncate">
            {row.member.name.split(' ')[0]}
          </span>
        </div>

        {/* Counts */}
        <div className="flex-1 grid grid-cols-2 gap-6 items-center">
          <span className={`text-[13px] tabular-nums font-medium ${row.authoring.length > 0 ? 'text-author' : 'text-ink-15'}`}>
            {row.authoring.length}
          </span>
          <span className={`text-[13px] tabular-nums font-medium ${row.reviewing.length > 0 ? 'text-reviewer' : 'text-ink-15'}`}>
            {row.reviewing.length}
          </span>
        </div>
      </div>

      {/* Cards */}
      <div className="flex gap-4 px-3 pb-3">
        <div className="w-36 shrink-0" />
        <div className="flex-1 grid grid-cols-2 gap-6">
          {/* Authoring column */}
          <div className="flex flex-col gap-1.5">
            {row.authoring.length === 0 ? (
              <div className="py-3 rounded-lg border border-dashed border-ink-4 flex items-center justify-center">
                <span className="text-ink-15 text-[11px]">No open MRs</span>
              </div>
            ) : (
              row.authoring.map((mr) => <MRCard key={mr.id} mr={mr} showRepo={showRepo} />)
            )}
          </div>

          {/* Review queue column */}
          <div className="flex flex-col gap-1.5">
            {row.reviewing.length === 0 ? (
              <div className="py-3 rounded-lg border border-dashed border-ink-4 flex items-center justify-center">
                <span className="text-ink-15 text-[11px]">Nothing to review</span>
              </div>
            ) : (
              row.reviewing.map((mr) => <MRCard key={mr.id} mr={mr} showRepo={showRepo} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Loading / error / empty states ────────────────────────────────────────────

export function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-1">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-3 py-3 border-t border-ink-3">
          <div className="w-36 shrink-0 flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-ink-6 animate-pulse" />
            <div className="h-3 w-16 bg-ink-6 rounded animate-pulse" />
          </div>
          <div className="flex-1 grid grid-cols-2 gap-6 items-center">
            {[0, 1].map((j) => (
              <div key={j} className="flex items-center gap-2">
                <div className="w-4 h-2.5 bg-ink-4 rounded animate-pulse" />
                <div className="flex-1 h-1.5 bg-ink-4 rounded-full animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function UnconfiguredState({ onOpenSettings }: { onOpenSettings: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-10 h-10 rounded-2xl bg-ink-4 border border-ink-7 flex items-center justify-center mb-4">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-ink-25"
        >
          <path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0 1 19.6 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.51L23.95 13.45a.84.84 0 0 1-.3.94z" />
        </svg>
      </div>
      <p className="text-ink-40 text-sm font-medium mb-1">Connect to GitLab</p>
      <p className="text-ink-20 text-[13px] mb-5 max-w-xs leading-relaxed">
        Set your instance URL, access token, and group or project ID to start tracking merge
        requests.
      </p>
      <button
        onClick={onOpenSettings}
        className="h-8 px-4 rounded-xl text-xs font-medium bg-ink-8 text-ink-60 hover:bg-ink-12 hover:text-ink-80 border border-ink-8 transition-all"
      >
        Configure GitLab
      </button>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p className="text-red-400/60 text-sm font-medium mb-1.5">Failed to load merge requests</p>
      <p className="text-ink-20 text-[12px] mb-5 max-w-sm leading-relaxed font-mono break-all">
        {message}
      </p>
      <button
        onClick={onRetry}
        className="h-8 px-4 rounded-xl text-xs font-medium bg-ink-7 text-ink-50 hover:bg-ink-10 hover:text-ink-70 border border-ink-7 transition-all"
      >
        Retry
      </button>
    </div>
  );
}
