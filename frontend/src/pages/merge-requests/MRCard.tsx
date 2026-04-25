import type { GitLabMR } from './types';

interface Props {
  mr: GitLabMR;
  showRepo: boolean;
}

type AgeLevel = 'normal' | 'warning' | 'stale';

function getAge(dateStr: string): { label: string; level: AgeLevel } {
  const ms = Date.now() - new Date(dateStr).getTime();
  const totalHours = ms / (1000 * 60 * 60);
  const days = totalHours / 24;

  let label: string;
  if (totalHours < 1) label = 'just now';
  else if (totalHours < 24) label = `${Math.floor(totalHours)}h`;
  else label = `${Math.floor(days)}d`;

  const level: AgeLevel = days >= 5 ? 'stale' : days >= 2 ? 'warning' : 'normal';
  return { label, level };
}

const AGE_TEXT: Record<AgeLevel, string> = {
  normal: 'text-white/25',
  warning: 'text-amber-400/70',
  stale: 'text-red-400/70',
};

const AGE_DOT: Record<AgeLevel, string> = {
  normal: 'bg-white/20',
  warning: 'bg-amber-400/70',
  stale: 'bg-red-400/70',
};

function firstName(fullName: string): string {
  return fullName.split(' ')[0];
}

export function MRCard({ mr, showRepo }: Props) {
  const age = getAge(mr.updated_at);

  return (
    <a
      href={mr.web_url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/[0.12] rounded-xl p-3.5 transition-all duration-150 group cursor-pointer"
    >
      {/* MR ref + repo + age */}
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-[11px] text-white/30 font-mono shrink-0 tabular-nums">
            {mr.references?.short ?? `!${mr.iid}`}
          </span>
          {showRepo && (
            <span className="text-[11px] text-white/20 bg-white/[0.04] px-1.5 py-0.5 rounded-md truncate max-w-[110px]">
              {mr.projectName}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${AGE_DOT[age.level]}`} />
          <span className={`text-[10px] font-mono tabular-nums ${AGE_TEXT[age.level]}`}>
            {age.label}
          </span>
        </div>
      </div>

      {/* Title */}
      <p className="text-[13px] text-white/65 group-hover:text-white/85 leading-snug mb-3 transition-colors line-clamp-2">
        {mr.title}
      </p>

      {/* People row */}
      <div className="flex items-center gap-0 flex-wrap">
        {mr.assignees.length > 0 ? (
          <span className="text-[11px] text-white/35 mr-2">
            <span className="text-white/15 mr-1">by</span>
            {mr.assignees.map((a) => firstName(a.name)).join(', ')}
          </span>
        ) : (
          <span className="text-[11px] text-white/20 mr-2">
            <span className="text-white/15 mr-1">by</span>
            {firstName(mr.author.name)}
          </span>
        )}
        {mr.reviewers.length > 0 && (
          <span className="text-[11px] text-white/25">
            <span className="text-white/12 mr-1">→</span>
            {mr.reviewers.map((r) => firstName(r.name)).join(', ')}
          </span>
        )}
      </div>
    </a>
  );
}
