import { useState } from 'react';
import { MRCard } from './MRCard';
import type { GitLabMR, GitLabUser, MRColumns } from './types';

// ── Data transform ────────────────────────────────────────────────────────────

interface MemberLoad {
  member: GitLabUser;
  authoring: GitLabMR[];
  reviewing: GitLabMR[];
  totalLoad: number;
}

function buildMemberLoad(columns: MRColumns): {
  members: MemberLoad[];
  unassigned: GitLabMR[];
} {
  const memberMap = new Map<number, { user: GitLabUser; authoring: GitLabMR[]; reviewing: GitLabMR[] }>();

  function ensureMember(user: GitLabUser) {
    if (!memberMap.has(user.id)) {
      memberMap.set(user.id, { user, authoring: [], reviewing: [] });
    }
    return memberMap.get(user.id)!;
  }

  // Authoring: all open MRs across every status column
  const allMRs = [
    ...columns.author_action,
    ...columns.reviewer_action,
    ...columns.approved,
    ...columns.unassigned,
  ];

  for (const mr of allMRs) {
    if (mr.assignees.length > 0) {
      for (const assignee of mr.assignees) ensureMember(assignee).authoring.push(mr);
    } else {
      ensureMember(mr.author).authoring.push(mr);
    }
  }

  // Reviewing: pending reviewers on MRs waiting for review
  for (const mr of columns.reviewer_action) {
    const pending = mr.reviewers.filter((r) => r.state === 'unreviewed' || r.state === 'reviewed');
    const targets = pending.length > 0 ? pending : mr.reviewers;
    for (const r of targets) ensureMember(r).reviewing.push(mr);
  }

  const members: MemberLoad[] = [...memberMap.values()]
    .map(({ user, authoring, reviewing }) => ({
      member: user,
      authoring,
      reviewing,
      totalLoad: authoring.length + reviewing.length,
    }))
    .sort((a, b) => b.totalLoad - a.totalLoad);

  return { members, unassigned: columns.unassigned };
}

// ── Member load board ─────────────────────────────────────────────────────────

export function MRLoadBoard({
  columns,
  showRepo,
}: {
  columns: MRColumns;
  showRepo: boolean;
}) {
  const totalCount = Object.values(columns).reduce((s, c) => s + c.length, 0);

  if (totalCount === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-white/20 text-sm">No open merge requests</p>
      </div>
    );
  }

  const { members, unassigned } = buildMemberLoad(columns);

  const maxAuthoring = Math.max(1, ...members.map((m) => m.authoring.length));
  const maxReviewing = Math.max(1, ...members.map((m) => m.reviewing.length));
  const maxLoad = Math.max(1, ...members.map((m) => m.totalLoad));

  return (
    <div>
      {/* Table header */}
      <div className="flex items-center gap-4 px-3 pb-2 mb-1 border-b border-white/[0.04]">
        <div className="w-36 shrink-0" />
        <div className="flex-1 grid grid-cols-[1fr_1fr_80px] gap-6">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-sky-400/50">
            Authoring
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-amber-400/50">
            Review queue
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-white/20">
            Load
          </span>
        </div>
      </div>

      {/* Member rows */}
      {members.map((row) => (
        <MemberLoadRow
          key={row.member.id}
          row={row}
          maxAuthoring={maxAuthoring}
          maxReviewing={maxReviewing}
          maxLoad={maxLoad}
          showRepo={showRepo}
        />
      ))}

      {/* Unassigned zone */}
      {unassigned.length > 0 && (
        <div className="mt-6 pt-5 border-t border-white/[0.03]">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/20 mb-3 px-1">
            Unassigned · {unassigned.length}
          </p>
          <div className="flex flex-wrap gap-3">
            {unassigned.map((mr) => (
              <div key={mr.id} className="w-72 shrink-0">
                <MRCard mr={mr} showRepo={showRepo} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Member row ────────────────────────────────────────────────────────────────

function MemberLoadRow({
  row,
  maxAuthoring,
  maxReviewing,
  maxLoad,
  showRepo,
}: {
  row: MemberLoad;
  maxAuthoring: number;
  maxReviewing: number;
  maxLoad: number;
  showRepo: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  const initials = row.member.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const authoringPct = (row.authoring.length / maxAuthoring) * 100;
  const reviewingPct = (row.reviewing.length / maxReviewing) * 100;
  const loadPct = (row.totalLoad / maxLoad) * 100;

  const approvedMRs = row.authoring.filter((mr) => mr.approved);
  const otherAuthoredMRs = row.authoring.filter((mr) => !mr.approved);

  return (
    <div className="border-t border-white/[0.03]">
      {/* Summary row */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-4 px-3 py-3 hover:bg-white/[0.02] transition-colors text-left rounded-lg group"
      >
        {/* Name */}
        <div className="w-36 shrink-0 flex items-center gap-2.5 min-w-0">
          <div className="w-6 h-6 rounded-full bg-white/[0.07] flex items-center justify-center shrink-0 text-[9px] font-semibold text-white/35">
            {initials}
          </div>
          <span className="text-[12px] font-medium text-white/50 truncate">
            {row.member.name.split(' ')[0]}
          </span>
          <svg
            width="8"
            height="8"
            viewBox="0 0 8 8"
            fill="none"
            className={`shrink-0 text-white/20 transition-transform ${expanded ? 'rotate-180' : ''}`}
          >
            <path d="M1 2.5L4 5.5L7 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Bars */}
        <div className="flex-1 grid grid-cols-[1fr_1fr_80px] gap-6 items-center">
          {/* Authoring */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] tabular-nums font-mono text-white/30 w-4 shrink-0 text-right">
              {row.authoring.length}
            </span>
            <div className="flex-1 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-400/35 rounded-full transition-all"
                style={{ width: `${authoringPct}%` }}
              />
            </div>
          </div>

          {/* Review queue */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] tabular-nums font-mono text-white/30 w-4 shrink-0 text-right">
              {row.reviewing.length}
            </span>
            <div className="flex-1 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400/35 rounded-full transition-all"
                style={{ width: `${reviewingPct}%` }}
              />
            </div>
          </div>

          {/* Total load */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] tabular-nums font-mono text-white/20 w-4 shrink-0 text-right">
              {row.totalLoad}
            </span>
            <div className="flex-1 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
              <div
                className="h-full bg-white/10 rounded-full transition-all"
                style={{ width: `${loadPct}%` }}
              />
            </div>
          </div>
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="grid grid-cols-2 gap-4 px-3 pb-4">
          {/* Authoring column */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-sky-400/40 mb-2.5 px-0.5">
              Authoring · {row.authoring.length}
            </p>
            <div className="flex flex-col gap-2">
              {approvedMRs.length > 0 && (
                <div>
                  <p className="text-[10px] text-emerald-400/40 mb-1.5 px-0.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/50 inline-block" />
                    Ready to merge · {approvedMRs.length}
                  </p>
                  <div className="flex flex-col gap-2">
                    {approvedMRs.map((mr) => (
                      <MRCard key={mr.id} mr={mr} showRepo={showRepo} />
                    ))}
                  </div>
                </div>
              )}
              {otherAuthoredMRs.length > 0 && (
                <div className={approvedMRs.length > 0 ? 'mt-2' : ''}>
                  {approvedMRs.length > 0 && (
                    <p className="text-[10px] text-white/20 mb-1.5 px-0.5">In progress · {otherAuthoredMRs.length}</p>
                  )}
                  <div className="flex flex-col gap-2">
                    {otherAuthoredMRs.map((mr) => (
                      <MRCard key={mr.id} mr={mr} showRepo={showRepo} />
                    ))}
                  </div>
                </div>
              )}
              {row.authoring.length === 0 && (
                <div className="py-4 rounded-xl border border-dashed border-white/[0.04] flex items-center justify-center">
                  <span className="text-white/15 text-[12px]">No open MRs</span>
                </div>
              )}
            </div>
          </div>

          {/* Review queue column */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-400/40 mb-2.5 px-0.5">
              Review queue · {row.reviewing.length}
            </p>
            <div className="flex flex-col gap-2">
              {row.reviewing.length === 0 ? (
                <div className="py-4 rounded-xl border border-dashed border-white/[0.04] flex items-center justify-center">
                  <span className="text-white/15 text-[12px]">Nothing to review</span>
                </div>
              ) : (
                row.reviewing.map((mr) => <MRCard key={mr.id} mr={mr} showRepo={showRepo} />)
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Loading / error / empty states ────────────────────────────────────────────

export function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-1">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-3 py-3 border-t border-white/[0.03]">
          <div className="w-36 shrink-0 flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-white/[0.06] animate-pulse" />
            <div className="h-3 w-16 bg-white/[0.06] rounded animate-pulse" />
          </div>
          <div className="flex-1 grid grid-cols-[1fr_1fr_80px] gap-6 items-center">
            {[0, 1, 2].map((j) => (
              <div key={j} className="flex items-center gap-2">
                <div className="w-4 h-2.5 bg-white/[0.04] rounded animate-pulse" />
                <div className="flex-1 h-1.5 bg-white/[0.04] rounded-full animate-pulse" />
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
      <div className="w-10 h-10 rounded-2xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center mb-4">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0 1 19.6 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.51L23.95 13.45a.84.84 0 0 1-.3.94z" />
        </svg>
      </div>
      <p className="text-white/40 text-sm font-medium mb-1">Connect to GitLab</p>
      <p className="text-white/20 text-[13px] mb-5 max-w-xs leading-relaxed">
        Set your instance URL, access token, and group or project ID to start tracking merge
        requests.
      </p>
      <button
        onClick={onOpenSettings}
        className="h-8 px-4 rounded-xl text-xs font-medium bg-white/[0.08] text-white/60 hover:bg-white/[0.12] hover:text-white/80 border border-white/[0.08] transition-all"
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
      <p className="text-white/20 text-[12px] mb-5 max-w-sm leading-relaxed font-mono break-all">
        {message}
      </p>
      <button
        onClick={onRetry}
        className="h-8 px-4 rounded-xl text-xs font-medium bg-white/[0.07] text-white/50 hover:bg-white/[0.1] hover:text-white/70 border border-white/[0.07] transition-all"
      >
        Retry
      </button>
    </div>
  );
}
