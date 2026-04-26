import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { TextInput } from '@/components/ui/TextInput';
import type { GitLabConfig, GitLabMember } from '@/domain/contracts';

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

  const [showToken, setShowToken] = useState(false);

  const [memberInputs, setMemberInputs] = useState<string[]>([
    ...config.members.map((m) => m.username),
    '',
  ]);

  const valid =
    form.instanceUrl.trim().length > 0 &&
    form.token.trim().length > 0 &&
    form.resourceId.trim().length > 0;

  const handleSave = () => {
    if (!valid) return;
    const seen = new Set<string>();
    const members: GitLabMember[] = memberInputs
      .filter((u) => u.trim().length > 0)
      .filter((u) => (seen.has(u) ? false : (seen.add(u), true)))
      .map((username) => ({ name: username, username }));
    void onSave({
      instanceUrl: form.instanceUrl.replace(/\/$/, ''),
      token: form.token.trim(),
      resourceType: form.resourceType,
      resourceId: form.resourceId.trim(),
      members,
    });
    onClose();
  };

  const updateMember = (index: number, raw: string) => {
    const value = raw.replace(/^@/, '');
    setMemberInputs((prev) => {
      const next = [...prev];
      next[index] = value;
      if (index === prev.length - 1 && value.length > 0) next.push('');
      return next;
    });
  };

  const removeMember = (index: number) => {
    setMemberInputs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleBlur = (index: number) => {
    setMemberInputs((prev) => {
      if (index === prev.length - 1) return prev;
      if (prev[index].trim() === '') return prev.filter((_, i) => i !== index);
      return prev;
    });
  };

  return (
    <Modal
      onClose={onClose}
      panelClassName="surface w-full max-w-sm mx-8 rounded-2xl border border-ink-8 shadow-2xl"
    >
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <h2 className="text-ink-50 text-xs font-semibold">GitLab Settings</h2>
        <button
          onClick={onClose}
          className="text-ink-30 hover:text-ink-70 transition-colors p-1"
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
          <label className="text-ink-30 text-[11px] font-medium uppercase tracking-wider block mb-1.5">
            Instance URL
          </label>
          <TextInput
            placeholder="https://gitlab.com"
            value={form.instanceUrl}
            onChange={(e) => setForm((f) => ({ ...f, instanceUrl: e.target.value }))}
          />
        </div>

        <div>
          <label className="text-ink-30 text-[11px] font-medium uppercase tracking-wider block mb-1.5">
            Access Token
          </label>
          <div className="relative">
            <TextInput
              type={showToken ? 'text' : 'password'}
              placeholder="glpat-xxxxxxxxxxxxxxxxxxxx"
              value={form.token}
              onChange={(e) => setForm((f) => ({ ...f, token: e.target.value }))}
              className="w-full pr-9"
            />
            <button
              type="button"
              onClick={() => setShowToken((v) => !v)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-25 hover:text-ink-60 transition-colors"
              tabIndex={-1}
            >
              {showToken ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          <p className="text-ink-20 text-[11px] mt-1 pl-1">
            Requires <code className="text-ink-30">read_api</code> scope. Stored on the backend.
          </p>
        </div>

        <div>
          <label className="text-ink-30 text-[11px] font-medium uppercase tracking-wider block mb-1.5">
            Scope
          </label>
          <div className="flex rounded-xl border border-ink-8 overflow-hidden text-[11px] font-medium">
            {(['group', 'project'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setForm((f) => ({ ...f, resourceType: type }))}
                className={`flex-1 py-2 transition-colors capitalize ${
                  form.resourceType === type
                    ? 'bg-ink-10 text-ink-80'
                    : 'text-ink-30 hover:text-ink-50 hover:bg-ink-4'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-ink-30 text-[11px] font-medium uppercase tracking-wider block mb-1.5">
            {form.resourceType === 'group' ? 'Group ID or Path' : 'Project ID or Path'}
          </label>
          <TextInput
            placeholder={
              form.resourceType === 'group' ? 'my-group or 123' : 'my-group/my-repo or 456'
            }
            value={form.resourceId}
            onChange={(e) => setForm((f) => ({ ...f, resourceId: e.target.value }))}
          />
        </div>

        <div className="pt-1">
          <label className="text-ink-30 text-[11px] font-medium uppercase tracking-wider block mb-1.5">
            Team Members
          </label>
          <div className="flex flex-col gap-1">
            {memberInputs.map((username, index) => {
              const isLast = index === memberInputs.length - 1;
              return (
                <div key={index} className="flex items-center gap-1.5">
                  <TextInput
                    placeholder="@username"
                    value={username}
                    onChange={(e) => updateMember(index, e.target.value)}
                    onBlur={() => handleBlur(index)}
                    className="flex-1"
                  />
                  {!isLast && (
                    <button
                      type="button"
                      onClick={() => removeMember(index)}
                      className="text-ink-20 hover:text-ink-60 transition-colors shrink-0 p-1"
                    >
                      <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                        <path
                          d="M1.5 1.5L8.5 8.5M8.5 1.5L1.5 8.5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
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
