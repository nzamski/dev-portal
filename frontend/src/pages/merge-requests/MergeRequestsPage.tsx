import { GitLabSettingsModal } from './GitLabSettingsModal';
import { useGitLabConfig } from './useGitLabConfig';
import { useGitLabMRs } from './useGitLabMRs';
import { ErrorState, LoadingSkeleton, MRColumnsBoard, UnconfiguredState } from './mergeRequestsComponents';

// ── Main component ──────────────────────────────────────────────────────────

interface Props {
  showSettings: boolean;
  onCloseSettings: () => void;
  onOpenSettings: () => void;
}

export function MergeRequestsPage({ showSettings, onCloseSettings, onOpenSettings }: Props) {
  const { config, setConfig, isConfigured, error: configError } = useGitLabConfig();
  const { columns, loading, error, lastFetched, refresh } = useGitLabMRs(isConfigured);

  const showRepo = config.resourceType === 'group';
  const totalCount = Object.values(columns).reduce((sum, col) => sum + col.length, 0);

  return (
    <div className="max-w-7xl mx-auto px-8 pt-6 pb-24">
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-baseline gap-3">
          <h2 className="text-white/50 text-xs font-semibold uppercase tracking-widest">
            Merge Requests
          </h2>
          {isConfigured && !loading && (
            <span className="text-white/20 text-xs tabular-nums">{totalCount} open</span>
          )}
          {isConfigured && lastFetched && !loading && (
            <span className="text-white/15 text-[11px]">
              updated {formatRelativeTime(lastFetched)}
            </span>
          )}
        </div>
        {isConfigured && (
          <button
            onClick={refresh}
            disabled={loading}
            className="h-7 px-3 rounded-lg text-[11px] font-medium bg-white/[0.05] text-white/30 hover:bg-white/[0.08] hover:text-white/50 border border-white/[0.06] transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={loading ? 'animate-spin' : ''}
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            Refresh
          </button>
        )}
      </div>

      {/* Content */}
      {!isConfigured ? (
        <UnconfiguredState onOpenSettings={onOpenSettings} />
      ) : loading && totalCount === 0 ? (
        <LoadingSkeleton />
      ) : error || configError ? (
        <ErrorState message={error ?? configError ?? 'Failed to load merge requests'} onRetry={refresh} />
      ) : (
        <MRColumnsBoard columns={columns} showRepo={showRepo} />
      )}

      {/* Settings modal */}
      {showSettings && (
        <GitLabSettingsModal
          config={config}
          onSave={setConfig}
          onClose={onCloseSettings}
        />
      )}
    </div>
  );
}

function formatRelativeTime(date: Date): string {
  const secs = Math.floor((Date.now() - date.getTime()) / 1000);
  if (secs < 60) return 'just now';
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  return `${Math.floor(secs / 3600)}h ago`;
}
