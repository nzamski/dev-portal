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
  normal: 'text-ink-25',
  warning: 'text-amber-400/70',
  stale: 'text-red-400/70',
};

const AGE_DOT: Record<AgeLevel, string> = {
  normal: 'bg-ink-20',
  warning: 'bg-amber-400/70',
  stale: 'bg-red-400/70',
};

function firstName(fullName: string): string {
  return fullName.split(' ')[0];
}

export function MRCard({ mr, showRepo }: Props) {
  const age = getAge(mr.updated_at);

  const authorLine =
    mr.assignees.length > 0
      ? mr.assignees.map((a) => firstName(a.name)).join(', ')
      : firstName(mr.author.name);

  const reviewerLine =
    mr.reviewers.length > 0
      ? mr.reviewers.map((r) => firstName(r.name)).join(', ')
      : null;

  return (
    <a
      href={mr.web_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-ink-3 hover:bg-ink-5 border border-ink-5 hover:border-ink-9 rounded-lg px-2.5 py-1.5 transition-all duration-150 cursor-pointer"
    >
      {/* Primary row — always visible */}
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-[10px] text-ink-25 font-mono shrink-0 tabular-nums">
          {mr.references?.short ?? `!${mr.iid}`}
        </span>
        {showRepo && (
          <span className="text-[10px] text-ink-15 bg-ink-4 px-1 rounded shrink-0 max-w-[72px] truncate">
            {mr.projectName}
          </span>
        )}
        <p className="flex-1 text-[12px] text-ink-55 group-hover:text-ink-75 truncate leading-none transition-colors">
          {mr.title}
        </p>
        <div className="flex items-center gap-1 shrink-0 ml-1">
          <span className={`w-1.5 h-1.5 rounded-full ${AGE_DOT[age.level]}`} />
          <span className={`text-[10px] font-mono tabular-nums ${AGE_TEXT[age.level]}`}>
            {age.label}
          </span>
        </div>
      </div>

      {/* People row — revealed on hover */}
      <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-150">
        <div className="overflow-hidden">
          <div className="flex items-center gap-1 pt-1.5 min-w-0">
            <span className="text-ink-15 text-[10px] shrink-0">by</span>
            <span className="text-[10px] text-ink-30 truncate">{authorLine}</span>
            {reviewerLine && (
              <>
                <span className="text-ink-10 text-[10px] shrink-0 mx-0.5">→</span>
                <span className="text-[10px] text-ink-25 truncate">{reviewerLine}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </a>
  );
}
