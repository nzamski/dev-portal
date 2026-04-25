import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { TextInput } from '@/components/ui/TextInput';
import type { GitLabConfig } from './types';

interface Props {
  config: GitLabConfig;
  onSave: (updates: Partial<GitLabConfig>) => Promise<void>;
  onClose: () => void;
}

export function GitLabSettingsModal({ config, onSave, onClose }: Props) {
  const [form, setForm] = useState({
    instanceUrl: config.instanceUrl,
    token: config.token,
    resourceType: config.resourceType,
    resourceId: config.resourceId,
  });

  const valid =
    form.instanceUrl.trim().length > 0 &&
    form.token.trim().length > 0 &&
    form.resourceId.trim().length > 0;

  const handleSave = () => {
    if (!valid) return;
    void onSave({
      instanceUrl: form.instanceUrl.replace(/\/$/, ''),
      token: form.token.trim(),
      resourceType: form.resourceType,
      resourceId: form.resourceId.trim(),
    });
    onClose();
  };

  return (
    <Modal
      onClose={onClose}
      panelClassName="surface w-full max-w-sm mx-8 rounded-2xl border border-white/[0.08] shadow-2xl"
    >
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h2 className="text-white/50 text-xs font-semibold">GitLab Settings</h2>
          <button
            onClick={onClose}
            className="text-white/30 hover:text-white/70 transition-colors p-1"
          >
            <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
              <path
                d="M1.5 1.5L8.5 8.5M8.5 1.5L1.5 8.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="px-5 pb-5 flex flex-col gap-2.5">
          <div>
            <label className="text-white/30 text-[11px] font-medium uppercase tracking-wider block mb-1.5">
              Instance URL
            </label>
            <TextInput
              placeholder="https://gitlab.com"
              value={form.instanceUrl}
              onChange={(e) => setForm((f) => ({ ...f, instanceUrl: e.target.value }))}
            />
          </div>

          <div>
            <label className="text-white/30 text-[11px] font-medium uppercase tracking-wider block mb-1.5">
              Access Token
            </label>
            <TextInput
              type="password"
              placeholder="glpat-xxxxxxxxxxxxxxxxxxxx"
              value={form.token}
              onChange={(e) => setForm((f) => ({ ...f, token: e.target.value }))}
            />
            <p className="text-white/20 text-[11px] mt-1 pl-1">
              Requires <code className="text-white/30">read_api</code> scope. Stored on the backend.
            </p>
          </div>

          <div>
            <label className="text-white/30 text-[11px] font-medium uppercase tracking-wider block mb-1.5">
              Scope
            </label>
            <div className="flex rounded-xl border border-white/[0.08] overflow-hidden text-[11px] font-medium">
              {(['group', 'project'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, resourceType: type }))}
                  className={`flex-1 py-2 transition-colors capitalize ${
                    form.resourceType === type
                      ? 'bg-white/[0.1] text-white/80'
                      : 'text-white/30 hover:text-white/50 hover:bg-white/[0.04]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-white/30 text-[11px] font-medium uppercase tracking-wider block mb-1.5">
              {form.resourceType === 'group' ? 'Group ID or Path' : 'Project ID or Path'}
            </label>
            <TextInput
              placeholder={form.resourceType === 'group' ? 'my-group or 123' : 'my-group/my-repo or 456'}
              value={form.resourceId}
              onChange={(e) => setForm((f) => ({ ...f, resourceId: e.target.value }))}
            />
          </div>

          <Button
            onClick={handleSave}
            disabled={!valid}
            size="md"
            className="mt-1 w-full rounded-xl"
          >
            Save & Refresh
          </Button>
        </div>
    </Modal>
  );
}
