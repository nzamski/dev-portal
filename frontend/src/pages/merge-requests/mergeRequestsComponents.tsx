import { MRCard } from './MRCard';
import type { GitLabMR, MRColumnId } from './types';

export interface ColumnDef {
  id: MRColumnId;
  label: string;
  description: string;
  emptyTitle: string;
  emptyBody: string;
  accentClass: string;
}

export const COLUMNS: ColumnDef[] = [
  {
    id: 'unassigned',
    label: 'Unassigned',
    description: 'No reviewer assigned',
    emptyTitle: 'All covered',
    emptyBody: 'Every open MR has at least one reviewer assigned.',
    accentClass: 'text-white/30',
  },
  {
    id: 'author_action',
    label: 'Author action',
    description: 'Changes requested',
    emptyTitle: 'No action needed',
    emptyBody: 'No reviewers are requesting changes right now.',
    accentClass: 'text-amber-400/60',
  },
  {
    id: 'reviewer_action',
    label: 'Reviewer action',
    description: 'Waiting for review',
    emptyTitle: 'Inbox zero',
    emptyBody: 'Nothing is waiting for a reviewer to act.',
    accentClass: 'text-sky-400/60',
  },
  {
    id: 'approved',
    label: 'Approved',
    description: 'Ready to merge',
    emptyTitle: 'Nothing approved',
    emptyBody: 'No MRs are approved and waiting to merge.',
    accentClass: 'text-emerald-400/60',
  },
];

export function MRColumnsBoard({
  columns,
  showRepo,
}: {
  columns: Record<MRColumnId, GitLabMR[]>;
  showRepo: boolean;
}) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {COLUMNS.map((col) => (
        <MRColumn key={col.id} def={col} mrs={columns[col.id]} showRepo={showRepo} />
      ))}
    </div>
  );
}

export function LoadingSkeleton() {
  return (
    <div className="flex gap-4">
      {COLUMNS.map((col) => (
        <div key={col.id} className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-3 px-0.5">
            <div className="h-3 w-20 bg-white/[0.06] rounded animate-pulse" />
            <div className="h-3 w-4 bg-white/[0.04] rounded animate-pulse" />
          </div>
          <div className="flex flex-col gap-2">
            {Array.from({ length: 2 + (col.id === 'reviewer_action' ? 1 : 0) }).map((_, i) => (
              <CardSkeleton key={i} />
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

function ColumnHeader({ def, count }: { def: ColumnDef; count: number }) {
  return (
    <div className="flex items-center justify-between mb-3 px-0.5">
      <div>
        <span className={`text-[11px] font-semibold uppercase tracking-widest ${def.accentClass}`}>
          {def.label}
        </span>
        <span className="text-white/15 text-[11px] ml-2">{def.description}</span>
      </div>
      <span className="text-white/20 text-[11px] tabular-nums font-mono">{count}</span>
    </div>
  );
}

function EmptyColumn({ def }: { def: ColumnDef }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 rounded-xl border border-dashed border-white/[0.06] text-center">
      <span className="text-white/20 text-[13px] font-medium mb-1">{def.emptyTitle}</span>
      <span className="text-white/15 text-[11px] leading-relaxed">{def.emptyBody}</span>
    </div>
  );
}

function MRColumn({ def, mrs, showRepo }: { def: ColumnDef; mrs: GitLabMR[]; showRepo: boolean }) {
  return (
    <div className="flex-1 min-w-0">
      <ColumnHeader def={def} count={mrs.length} />
      <div className="flex flex-col gap-2">
        {mrs.length === 0 ? (
          <EmptyColumn def={def} />
        ) : (
          mrs.map((mr) => <MRCard key={mr.id} mr={mr} showRepo={showRepo} />)
        )}
      </div>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3.5 animate-pulse">
      <div className="flex justify-between mb-3">
        <div className="h-3 w-16 bg-white/[0.06] rounded" />
        <div className="h-3 w-8 bg-white/[0.04] rounded" />
      </div>
      <div className="h-3.5 w-full bg-white/[0.06] rounded mb-1.5" />
      <div className="h-3.5 w-3/4 bg-white/[0.04] rounded mb-3" />
      <div className="h-3 w-24 bg-white/[0.04] rounded" />
    </div>
  );
}
