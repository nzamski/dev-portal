import { useState } from 'react';
import { useNavigate, useLocation, Navigate, Routes, Route } from 'react-router-dom';
import { Button } from './components/ui/Button';
import { ServicesPage } from './pages/services/ServicesPage';
import { MergeRequestsPage } from './pages/merge-requests/MergeRequestsPage';
import { usePortalData } from './features/portal/usePortalData';
import { useTheme } from './ThemeContext';

export default function App() {
  const {
    services,
    setServices,
    addService,
    portalTitle,
    saveTitle,
    boardItems,
    setBoardItems,
    flushChanges,
    loading,
    saving,
    error,
    reload,
  } = usePortalData();
  const [editMode, setEditMode] = useState(false);
  const [search, setSearch] = useState('');
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState('');
  const [showGitLabSettings, setShowGitLabSettings] = useState(false);

  const { theme, toggleTheme } = useTheme();

  const navigate = useNavigate();
  const location = useLocation();
  const onServicesPage = location.pathname === '/services' || location.pathname === '/';
  const onMRPage = location.pathname === '/merge-requests';

  if (loading) {
    return (
      <div className="app-shell grid place-items-center">
        <p className="text-ink-40 text-sm">Loading portal data...</p>
      </div>
    );
  }

  if (error && services.length === 0) {
    return (
      <div className="app-shell grid place-items-center px-6">
        <div className="text-center max-w-lg">
          <p className="text-red-400/70 text-sm mb-2">Unable to load portal data</p>
          <p className="text-ink-30 text-xs mb-4 break-all">{error}</p>
          <Button onClick={() => void reload()} size="md">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const commitTitle = () => {
    const t = titleDraft.trim();
    if (t && t !== portalTitle) {
      void saveTitle(t);
    }
    setEditingTitle(false);
  };

  const handleManageToggle = async () => {
    if (editMode) {
      try {
        await flushChanges();
      } catch {
        // Save errors are already surfaced from the data hook.
      }
      setEditingTitle(false);
    }
    setEditMode((v) => !v);
  };

  const handlePageChange = (path: string) => {
    if (location.pathname === path) return;
    navigate(path);
    setEditMode(false);
    setSearch('');
    setEditingTitle(false);
  };

  return (
    <div className="app-shell font-sans">

      {/* ── Header ─────────────────────────────────────────── */}
      <header className="app-header sticky top-0 z-20 backdrop-blur-xl border-b border-ink-5">
        <div className="max-w-7xl mx-auto px-8 h-14 flex items-center gap-5">

          {/* wordmark — always editable */}
          {editingTitle ? (
            <input
              autoFocus
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              onBlur={commitTitle}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitTitle();
                if (e.key === 'Escape') setEditingTitle(false);
              }}
              className="text-ink-70 text-sm font-medium tracking-tight shrink-0 bg-transparent border-b border-ink-30 outline-none w-36 min-w-0"
            />
          ) : (
            <span
              onClick={() => { setTitleDraft(portalTitle); setEditingTitle(true); }}
              title="Click to rename"
              className="text-ink-70 text-sm font-medium tracking-tight shrink-0 cursor-text hover:text-ink-90 border-b border-dashed border-ink-20 hover:border-ink-40 transition-colors"
            >
              {portalTitle}
            </span>
          )}

          <span className="text-ink-10 select-none">|</span>

          {/* nav tabs */}
          <nav className="flex items-center gap-0.5">
            <button
              onClick={() => handlePageChange('/services')}
              className={[
                'h-7 px-3 rounded-lg text-[13px] font-medium transition-all duration-150',
                onServicesPage
                  ? 'text-ink-80 bg-ink-7'
                  : 'text-ink-30 hover:text-ink-55 hover:bg-ink-4',
              ].join(' ')}
            >
              Services
            </button>
            <button
              onClick={() => handlePageChange('/merge-requests')}
              className={[
                'h-7 px-3 rounded-lg text-[13px] font-medium transition-all duration-150',
                onMRPage
                  ? 'text-ink-80 bg-ink-7'
                  : 'text-ink-30 hover:text-ink-55 hover:bg-ink-4',
              ].join(' ')}
            >
              Merge Requests
            </button>
          </nav>

          {/* search — services page only */}
          {onServicesPage && (
            <>
              <span className="text-ink-10 select-none">|</span>
              <div className="flex-1 relative">
                <svg
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-ink-25"
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search services…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Escape') setSearch(''); }}
                  className="w-full bg-transparent pl-8 pr-7 py-1.5 text-[13px] text-ink-70 placeholder-ink-20 outline-none"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 text-ink-20 hover:text-ink-50 transition-colors p-1"
                  >
                    <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                      <path d="M1.5 1.5L8.5 8.5M8.5 1.5L1.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                )}
              </div>
            </>
          )}

          <div className="ml-auto flex items-center gap-2">
            {onServicesPage && (
              <Button
                onClick={() => void handleManageToggle()}
                variant={editMode ? 'solid' : 'ghost'}
                className="px-3.5"
              >
                {editMode ? (saving ? 'Saving...' : 'Done') : 'Manage'}
              </Button>
            )}
            {onMRPage && (
              <Button onClick={() => setShowGitLabSettings(true)} className="px-3.5">
                Settings
              </Button>
            )}

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="h-7 w-7 rounded-lg bg-ink-7 border border-ink-7 text-ink-50 hover:bg-ink-10 hover:text-ink-70 transition-all duration-200 flex items-center justify-center shrink-0"
            >
              {theme === 'dark' ? (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
              ) : (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── Routes ─────────────────────────────────────────── */}
      <Routes>
        <Route path="/" element={<Navigate to="/services" replace />} />
        <Route
          path="/services"
          element={
            <ServicesPage
              services={services}
              setServices={setServices}
              addService={addService}
              boardItems={boardItems}
              setBoardItems={setBoardItems}
              editMode={editMode}
              search={search}
              onCloseSearch={() => setSearch('')}
            />
          }
        />
        <Route
          path="/merge-requests"
          element={
            <MergeRequestsPage
              showSettings={showGitLabSettings}
              onCloseSettings={() => setShowGitLabSettings(false)}
              onOpenSettings={() => setShowGitLabSettings(true)}
            />
          }
        />
      </Routes>

      {error && (
        <div className="fixed bottom-4 right-4 z-30 max-w-sm rounded-xl border border-red-400/30 bg-[#1a0f12] px-3 py-2 text-xs text-red-200/80">
          {error}
        </div>
      )}

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="max-w-7xl mx-auto px-8 py-6 mt-8 border-t border-ink-5">
        <p className="text-ink-20 text-[11px] text-center">
          &copy; {new Date().getFullYear()} Noam Zamski. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
