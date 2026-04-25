import { useState } from 'react';
import { ServiceIcon } from './ServiceIcon';
import { resolveIconColor } from '../data/icons';
import type { Service, ServiceLink } from '../types';

const INPUT_CLS = 'w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-white/15 transition-colors';

interface ModalProps {
  service?: Service;
  onSave: (s: Service) => void;
  onClose: () => void;
}

function ServiceEditModal({ service, onSave, onClose }: ModalProps) {
  const [form, setForm] = useState({
    name: service?.name ?? '',
    description: service?.description ?? '',
    iconName: service?.iconName ?? '',
  });
  const [links, setLinks] = useState<ServiceLink[]>(
    service?.links?.length ? service.links : [{ label: '', url: '' }]
  );

  const isMulti = links.length > 1;
  const valid =
    form.name.trim().length > 0 &&
    (links[0]?.url.trim().length ?? 0) > 0 &&
    (!isMulti || links.every((l) => l.label.trim().length > 0 && l.url.trim().length > 0));

  const addLink = () => setLinks([...links, { label: '', url: '' }]);
  const removeLink = (i: number) => {
    const next = links.filter((_, idx) => idx !== i);
    setLinks(next.length > 0 ? next : [{ label: '', url: '' }]);
  };
  const updateLink = (i: number, field: keyof ServiceLink, value: string) =>
    setLinks(links.map((l, idx) => (idx === i ? { ...l, [field]: value } : l)));

  const handleSave = () => {
    if (!valid) return;
    const id = service?.id ?? crypto.randomUUID();
    const cleanLinks = links.filter((l) => l.url.trim());
    onSave({
      id,
      name: form.name,
      description: form.description,
      iconName: form.iconName.trim() || undefined,
      links: cleanLinks,
    });
  };

  const previewIconName = form.iconName.trim() || undefined;
  const previewId = service?.id ?? '__preview__';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md" onClick={onClose}>
      <div className="w-full max-w-sm mx-8 bg-[#111111] rounded-2xl border border-white/[0.08] shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h2 className="text-white/50 text-xs font-semibold">{service ? 'Edit service' : 'Add service'}</h2>
          <button onClick={onClose} className="text-white/30 hover:text-white/70 transition-colors p-1">
            <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
              <path d="M1.5 1.5L8.5 8.5M8.5 1.5L1.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="px-5 pb-5 flex flex-col gap-2.5">
          <input
            autoFocus
            className={INPUT_CLS}
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className={INPUT_CLS}
            placeholder="Short description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          {/* Icon field with live preview */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0">
              <ServiceIcon
                serviceId={previewId}
                serviceName={form.name || undefined}
                iconName={previewIconName}
                size={16}
                color={resolveIconColor(previewId, form.name || undefined, previewIconName)}
              />
            </div>
            <input
              className={INPUT_CLS}
              placeholder="Icon (e.g. github, MdOutlineSupport)"
              value={form.iconName}
              onChange={(e) => setForm({ ...form, iconName: e.target.value })}
            />
          </div>
          <p className="text-white/20 text-[11px] -mt-1 pl-1">
            Simple Icons slug or any react-icons name (MdXxx, FaXxx, BiXxx…)
          </p>

          {/* URLs */}
          <div className="mt-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/30 text-[11px] font-medium uppercase tracking-wider">URLs</span>
              <button
                onClick={addLink}
                className="text-white/30 hover:text-white/60 text-[11px] px-2 py-0.5 rounded-lg hover:bg-white/[0.06] transition-all"
              >
                + Add
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              {links.map((link, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  {isMulti && (
                    <input
                      className="flex-[0_0_30%] bg-white/[0.05] border border-white/[0.08] rounded-xl px-2.5 py-1.5 text-sm text-white placeholder-white/20 outline-none focus:border-white/15 transition-colors min-w-0"
                      placeholder="Label *"
                      value={link.label}
                      onChange={(e) => updateLink(i, 'label', e.target.value)}
                    />
                  )}
                  <input
                    className={
                      isMulti
                        ? 'flex-1 bg-white/[0.05] border border-white/[0.08] rounded-xl px-2.5 py-1.5 text-sm text-white placeholder-white/20 outline-none focus:border-white/15 transition-colors min-w-0'
                        : INPUT_CLS
                    }
                    placeholder="https://…"
                    value={link.url}
                    onChange={(e) => updateLink(i, 'url', e.target.value)}
                  />
                  {isMulti && (
                    <button
                      onClick={() => removeLink(i)}
                      className="shrink-0 w-6 h-6 flex items-center justify-center text-white/25 hover:text-red-400/70 rounded-lg hover:bg-red-900/20 transition-all"
                    >
                      <svg width="7" height="7" viewBox="0 0 10 10" fill="none">
                        <path d="M1.5 1.5L8.5 8.5M8.5 1.5L1.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
            {isMulti && (
              <p className="text-white/20 text-[11px] mt-1.5 pl-1">Labels are required when multiple URLs are added.</p>
            )}
          </div>

          <button
            onClick={handleSave}
            disabled={!valid}
            className="mt-1 w-full py-2 rounded-xl text-sm font-medium bg-white/[0.1] text-white/80 hover:bg-white/[0.15] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {service ? 'Save changes' : 'Add service'}
          </button>
        </div>
      </div>
    </div>
  );
}

interface Props {
  services: Service[];
  setServices: (services: Service[]) => void;
}

export function ManageServices({ services, setServices }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const handleDelete = (id: string) => setServices(services.filter((s) => s.id !== id));

  const handleSave = (updated: Service) => {
    if (editingId) {
      setServices(services.map((s) => (s.id === editingId ? updated : s)));
      setEditingId(null);
    } else {
      setServices([...services, updated]);
      setShowAdd(false);
    }
  };

  const closeModal = () => { setEditingId(null); setShowAdd(false); };

  return (
    <div className="max-w-5xl mx-auto px-8 pb-24">
      <div className="flex items-baseline justify-between mb-4">
        <div className="flex items-baseline gap-3">
          <h2 className="text-white/50 text-xs font-semibold uppercase tracking-widest">All Services</h2>
          <span className="text-white/20 text-xs">{services.length}</span>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="h-7 px-3 rounded-lg text-xs font-medium bg-white/[0.07] text-white/50 hover:bg-white/[0.1] hover:text-white/70 border border-white/[0.07] transition-all duration-200"
        >
          + Add service
        </button>
      </div>

      <div className="rounded-2xl border border-white/[0.06] overflow-hidden">
        {services.map((s, i) => (
          <div
            key={s.id}
            className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? 'border-t border-white/[0.04]' : ''}`}
          >
            <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0">
              <ServiceIcon
                serviceId={s.id}
                serviceName={s.name}
                iconName={s.iconName}
                size={15}
                color={resolveIconColor(s.id, s.name, s.iconName)}
              />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-white/70 text-[13px]">{s.name}</span>
              <span className="text-white/25 text-xs ml-2">{s.description}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {s.links.length > 1 ? (
                <span className="text-white/20 text-[11px]">{s.links.length} links</span>
              ) : (
                <span className="text-white/20 text-xs truncate max-w-[160px] hidden lg:block">{s.links[0]?.url}</span>
              )}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setEditingId(s.id)}
                className="text-white/25 hover:text-white/60 text-xs px-2 py-1 rounded-lg hover:bg-white/[0.06] transition-all"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(s.id)}
                className="text-white/25 hover:text-red-400/70 text-xs px-2 py-1 rounded-lg hover:bg-red-900/20 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {(showAdd || editingId !== null) && (
        <ServiceEditModal
          service={editingId !== null ? services.find((s) => s.id === editingId) : undefined}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
