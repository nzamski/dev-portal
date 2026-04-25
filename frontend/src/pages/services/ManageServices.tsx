import { useState, memo } from 'react';
import { ServiceIcon } from './ServiceIcon';
import type { Service } from './types';
import { ServiceEditModal } from './ServiceEditModal';

interface Props {
  services: Service[];
  setServices: (services: Service[]) => void;
  addService: (data: Omit<Service, 'id'>) => Promise<Service>;
}

const ManageServices = memo(function ManageServices({ services, setServices, addService }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const handleDelete = (id: string) => setServices(services.filter((s) => s.id !== id));

  const handleSave = async (data: Omit<Service, 'id'>) => {
    if (editingId) {
      setServices(services.map((s) => (s.id === editingId ? { ...data, id: editingId } : s)));
      setEditingId(null);
    } else {
      await addService(data);
      setShowAdd(false);
    }
  };

  const closeModal = () => { setEditingId(null); setShowAdd(false); };

  const sorted = [...services].sort((a, b) => a.name.localeCompare(b.name));

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
        {sorted.map((s, i) => (
          <div
            key={s.id}
            className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? 'border-t border-white/[0.04]' : ''}`}
          >
            <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0">
              <ServiceIcon serviceName={s.name} iconName={s.iconName} size={15} />
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
});

export { ManageServices };
