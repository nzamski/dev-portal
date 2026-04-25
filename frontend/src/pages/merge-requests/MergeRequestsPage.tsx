import { GitLabSettingsModal } from './GitLabSettingsModal';
import { useGitLabConfig } from './useGitLabConfig';
import { useGitLabMRs } from './useGitLabMRs';
import { ErrorState, LoadingSkeleton, MRLoadBoard, UnconfiguredState } from './mergeRequestsComponents';

interface Props {
  showSettings: boolean;
  onCloseSettings: () => void;
  onOpenSettings: () => void;
}

export function MergeRequestsPage({ showSettings, onCloseSettings, onOpenSettings }: Props) {
  const { config, setConfig, isConfigured, error: configError } = useGitLabConfig();
  const { columns, loading, error } = useGitLabMRs(isConfigured);

  const showRepo = config.resourceType === 'group';
  const totalCount = Object.values(columns).reduce((sum, col) => sum + col.length, 0);

  return (
    <div className="max-w-7xl mx-auto px-8 pt-6 pb-24">
      {!isConfigured ? (
        <UnconfiguredState onOpenSettings={onOpenSettings} />
      ) : loading && totalCount === 0 ? (
        <LoadingSkeleton />
      ) : error || configError ? (
        <ErrorState message={error ?? configError ?? 'Failed to load merge requests'} onRetry={() => {}} />
      ) : (
        <MRLoadBoard columns={columns} members={config.members} showRepo={showRepo} />
      )}

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
