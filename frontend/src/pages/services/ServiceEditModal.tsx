import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { isMdIcon } from '@/lib/icons';
import { Modal } from '@/components/ui/Modal';
import { TextInput } from '@/components/ui/TextInput';
import { ServiceIcon } from './ServiceIcon';
import type { Service, ServiceLink } from './types';

type IconSource = 'initials' | 'si' | 'md';

function deriveIconSource(iconName: string | undefined): IconSource {
  if (!iconName?.trim()) return 'initials';
  if (isMdIcon(iconName)) return 'md';
  return 'si';
}

interface ModalProps {
  service?: Service;
  onSave: (s: Omit<Service, 'id'>) => void;
  onClose: () => void;
}

export function ServiceEditModal({ service, onSave, onClose }: ModalProps) {
  const [form, setForm] = useState({
    name: service?.name ?? '',
    description: service?.description ?? '',
    iconName: service?.iconName ?? '',
  });
  const [links, setLinks] = useState<ServiceLink[]>(
    service?.links?.length ? service.links : [{ label: '', url: '' }],
  );
  const [iconSource, setIconSource] = useState<IconSource>(() => deriveIconSource(service?.iconName));

  const isMulti = links.length > 1;
  const valid =
    form.name.trim().length > 0 &&
    (links[0]?.url.trim().length ?? 0) > 0 &&
    (!isMulti || links.every((link) => link.label.trim().length > 0 && link.url.trim().length > 0));

  const addLink = () => setLinks([...links, { label: '', url: '' }]);
  const removeLink = (index: number) => {
    const next = links.filter((_, idx) => idx !== index);
    setLinks(next.length > 0 ? next : [{ label: '', url: '' }]);
  };
  const updateLink = (index: number, field: keyof ServiceLink, value: string) =>
    setLinks(links.map((link, idx) => (idx === index ? { ...link, [field]: value } : link)));

  const handleSave = () => {
    if (!valid) return;
    const cleanLinks = links.filter((link) => link.url.trim());
    onSave({
      name: form.name,
      description: form.description,
      iconName: form.iconName.trim() || undefined,
      links: cleanLinks,
    });
  };

  const handleIconSourceChange = (source: IconSource) => {
    setIconSource(source);
    setForm((current) => ({ ...current, iconName: '' }));
  };

  const handleMdInput = (raw: string) => {
    if (!raw) {
      setForm((current) => ({ ...current, iconName: '' }));
      return;
    }

    const stripped = raw.startsWith('Md') && raw.length > 2 ? raw.slice(2) : raw;
    setForm((current) => ({
      ...current,
      iconName: 'Md' + stripped.charAt(0).toUpperCase() + stripped.slice(1),
    }));
  };

  const previewIconName = form.iconName.trim() || undefined;

  return (
    <Modal
      onClose={onClose}
      panelClassName="surface w-full max-w-sm mx-8 rounded-2xl border border-ink-8 shadow-2xl max-h-[90vh] overflow-y-auto"
    >
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <h2 className="text-ink-50 text-xs font-semibold">{service ? 'Edit service' : 'Add service'}</h2>
        <button onClick={onClose} className="text-ink-30 hover:text-ink-70 transition-colors p-1">
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
        <TextInput
          autoFocus
          placeholder="Name"
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
        />
        <TextInput
          placeholder="Short description"
          value={form.description}
          onChange={(event) => setForm({ ...form, description: event.target.value })}
        />
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-ink-4 border border-ink-6 flex items-center justify-center shrink-0">
              <ServiceIcon serviceName={form.name || undefined} iconName={previewIconName} size={16} />
            </div>
            <div className="flex rounded-lg border border-ink-8 overflow-hidden text-[11px] font-medium">
              {(['initials', 'si', 'md'] as IconSource[]).map((source) => {
                const label =
                  source === 'initials'
                    ? 'Initials'
                    : source === 'si'
                      ? 'Simple Icons'
                      : 'Material Design';
                return (
                  <button
                    key={source}
                    type="button"
                    onClick={() => handleIconSourceChange(source)}
                    className={`px-2.5 py-1.5 transition-colors ${iconSource === source ? 'bg-ink-12 text-ink-80' : 'text-ink-30 hover:text-ink-50 hover:bg-ink-5'}`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
          {iconSource === 'si' && (
            <div>
              <TextInput
                placeholder="Slug — e.g. github, grafana, kubernetes"
                value={form.iconName}
                onChange={(event) => setForm({ ...form, iconName: event.target.value })}
              />
              <p className="text-ink-20 text-[11px] mt-1 pl-1">Find slugs at simpleicons.org</p>
            </div>
          )}
          {iconSource === 'md' && (
            <div>
              <TextInput
                placeholder="Name — e.g. Cloud, Storage, Settings"
                value={isMdIcon(form.iconName) ? form.iconName.slice(2) : form.iconName}
                onChange={(event) => handleMdInput(event.target.value)}
              />
              <p className="text-ink-20 text-[11px] mt-1 pl-1">
                Browse at react-icons.github.io/react-icons/md
              </p>
            </div>
          )}
        </div>
        <div className="mt-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-ink-30 text-[11px] font-medium uppercase tracking-wider">URLs</span>
            <button
              onClick={addLink}
              className="text-ink-30 hover:text-ink-60 text-[11px] px-2 py-0.5 rounded-lg hover:bg-ink-6 transition-all"
            >
              + Add
            </button>
          </div>
          <div className="flex flex-col gap-1.5">
            {links.map((link, index) => (
              <div key={index} className="flex items-center gap-1.5">
                {isMulti && (
                  <TextInput
                    className="flex-[0_0_30%] min-w-0"
                    placeholder="Label *"
                    value={link.label}
                    onChange={(event) => updateLink(index, 'label', event.target.value)}
                  />
                )}
                <TextInput
                  className={isMulti ? 'flex-1 min-w-0' : ''}
                  placeholder="https://..."
                  value={link.url}
                  onChange={(event) => updateLink(index, 'url', event.target.value)}
                />
                {isMulti && (
                  <button
                    onClick={() => removeLink(index)}
                    className="shrink-0 w-6 h-6 flex items-center justify-center text-ink-25 hover:text-red-400/70 rounded-lg hover:bg-red-900/20 transition-all"
                  >
                    <svg width="7" height="7" viewBox="0 0 10 10" fill="none">
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
            ))}
          </div>
          {isMulti && (
            <p className="text-ink-20 text-[11px] mt-1.5 pl-1">
              Labels are required when multiple URLs are added.
            </p>
          )}
        </div>
        <Button
          onClick={handleSave}
          disabled={!valid}
          size="md"
          className="mt-1 w-full rounded-xl"
        >
          {service ? 'Save changes' : 'Add service'}
        </Button>
      </div>
    </Modal>
  );
}
