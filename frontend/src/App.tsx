import { useState } from 'react';
import { Board } from './components/Board';
import { ServiceDirectory } from './components/ServiceDirectory';
import { SearchSpotlight } from './components/SearchSpotlight';
import { ManageServices } from './components/ManageServices';
import { usePortalData } from './hooks/usePortalData';

export default function App() {
  const { services, setServices, portalTitle, setPortalTitle, boardItems, setBoardItems, flushChanges, loading } = usePortalData();
  const [editMode, setEditMode] = useState(false);
  const [search, setSearch] = useState('');
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState('');

  if (loading) return null;

  const showSpotlight = search.trim().length > 0;

  const commitTitle = () => {
    const t = titleDraft.trim();
    if (t) setPortalTitle(t);
    setEditingTitle(false);
  };

  const handleManageToggle = () => {
    if (editMode) {
      flushChanges();
      setEditingTitle(false);
    }
    setEditMode((v) => !v);
  };

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white font-sans">

      {/* ── Header ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 bg-[#0c0c0c]/90 backdrop-blur-xl border-b border-white/[0.05]">
        <div className="max-w-5xl mx-auto px-8 h-14 flex items-center gap-5">

          {/* wordmark — editable in manage mode */}
          {editMode && editingTitle ? (
            <input
              autoFocus
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              onBlur={commitTitle}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitTitle();
                if (e.key === 'Escape') setEditingTitle(false);
              }}
              className="text-white/70 text-sm font-medium tracking-tight shrink-0 bg-transparent border-b border-white/30 outline-none w-36 min-w-0"
            />
          ) : (
            <span
              onClick={editMode ? () => { setTitleDraft(portalTitle); setEditingTitle(true); } : undefined}
              title={editMode ? 'Click to rename' : undefined}
              className={[
                'text-white/70 text-sm font-medium tracking-tight shrink-0',
                editMode ? 'cursor-text hover:text-white/90 border-b border-dashed border-white/20 transition-colors' : '',
              ].join(' ')}
            >
              {portalTitle}
            </span>
          )}

          <span className="text-white/10 select-none">|</span>

          {/* search */}
          <div className="flex-1 relative">
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search services…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Escape') setSearch(''); }}
              className="w-full bg-transparent pl-8 pr-7 py-1.5 text-[13px] text-white/70 placeholder-white/20 outline-none"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors p-1"
              >
                <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                  <path d="M1.5 1.5L8.5 8.5M8.5 1.5L1.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            )}
          </div>

          {/* manage */}
          <button
            onClick={handleManageToggle}
            className={[
              'shrink-0 h-7 px-3.5 rounded-lg text-xs font-medium transition-all duration-200',
              editMode
                ? 'bg-white text-[#0c0c0c]'
                : 'bg-white/[0.07] text-white/50 hover:bg-white/[0.1] hover:text-white/70 border border-white/[0.07]',
            ].join(' ')}
          >
            {editMode ? 'Done' : 'Manage'}
          </button>
        </div>
      </header>

      {/* ── Spotlight ───────────────────────────────────────── */}
      {showSpotlight && (
        <SearchSpotlight
          query={search}
          services={services}
          onClose={() => setSearch('')}
        />
      )}

      {/* ── Pinned board ────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-8 pt-7 pb-7">
        {editMode && (
          <p className="text-white/20 text-[11px] mb-3">
            Drag to reorder · click × to remove
          </p>
        )}
        <Board
          editMode={editMode}
          services={services}
          boardItems={boardItems}
          setBoardItems={setBoardItems}
        />
      </div>

      {/* ── Manage / Directory ──────────────────────────────── */}
      {editMode ? (
        <ManageServices services={services} setServices={setServices} />
      ) : (
        <div className="max-w-5xl mx-auto px-8">
          <ServiceDirectory services={services} />
        </div>
      )}

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="max-w-5xl mx-auto px-8 py-6 mt-8 border-t border-white/[0.05]">
        <p className="text-white/20 text-[11px] text-center">
          &copy; {new Date().getFullYear()} Noam Zamski. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
