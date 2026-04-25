import { useState } from 'react';
import { GitLabSettingsModal } from './GitLabSettingsModal';
import { useGitLabConfig } from './useGitLabConfig';
import { useGitLabMRs } from './useGitLabMRs';
import { ErrorState, LoadingSkeleton, MRColumnsBoard, MRSwimlanesBoard, UnconfiguredState } from './mergeRequestsComponents';

// ── Main component ──────────────────────────────────────────────────────────

interface Props {
  showSettings: boolean;
  onCloseSettings: () => void;
  onOpenSettings: () => void;
}

type ViewMode = 'columns' | 'swimlanes';

export function MergeRequestsPage({ showSettings, onCloseSettings, onOpenSettings }: Props) {
  const { config, setConfig, isConfigured, error: configError } = useGitLabConfig();
  const { columns, loading, error, lastFetched, refresh } = useGitLabMRs(isConfigured);
  const [viewMode, setViewMode] = useState<ViewMode>('columns');

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
          <div className="flex items-center gap-2">
            {/* View toggle */}
            <div className="flex items-center h-7 bg-white/[0.04] border border-white/[0.06] rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('columns')}
                title="Columns view"
                className={`h-full px-2.5 flex items-center transition-all ${
                  viewMode === 'columns'
                    ? 'bg-white/[0.08] text-white/60'
                    : 'text-white/25 hover:text-white/45'
                }`}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <rect x="0" y="0" width="2.5" height="12" rx="0.75" fill="currentColor" />
                  <rect x="4.75" y="0" width="2.5" height="12" rx="0.75" fill="currentColor" />
                  <rect x="9.5" y="0" width="2.5" height="12" rx="0.75" fill="currentColor" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('swimlanes')}
                title="By member"
                className={`h-full px-2.5 flex items-center transition-all ${
                  viewMode === 'swimlanes'
                    ? 'bg-white/[0.08] text-white/60'
                    : 'text-white/25 hover:text-white/45'
                }`}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <rect x="0" y="0" width="12" height="2.5" rx="0.75" fill="currentColor" />
                  <rect x="0" y="4.75" width="12" height="2.5" rx="0.75" fill="currentColor" />
                  <rect x="0" y="9.5" width="12" height="2.5" rx="0.75" fill="currentColor" />
                </svg>
              </button>
            </div>

            {/* Refresh */}
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
          </div>
        )}
      </div>

      {/* Content */}
      {!isConfigured ? (
        <UnconfiguredState onOpenSettings={onOpenSettings} />
      ) : loading && totalCount === 0 ? (
        <LoadingSkeleton />
      ) : error || configError ? (
        <ErrorState message={error ?? configError ?? 'Failed to load merge requests'} onRetry={refresh} />
      ) : viewMode === 'swimlanes' ? (
        <MRSwimlanesBoard columns={columns} showRepo={showRepo} />
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
