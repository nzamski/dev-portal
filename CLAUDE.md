# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start dev server at http://localhost:5173
npm run build     # tsc type-check + vite production build
npm run preview   # serve the production build locally
npx tsc --noEmit  # type-check only (no emit), useful after edits
```

Backend commands:

```bash
cd backend
npm run dev       # start API server at http://localhost:3001
npm run build     # compile TypeScript backend
npm run start     # run compiled backend from dist
```

Quality scripts (both frontend/backend package.json):
- `npm run typecheck`
- `npm run lint`
- `npm run lint:fix`
- `npm run format`
- `npm run format:check`

## Stack

- **React 19** + **TypeScript** via **Vite 6**
- **Tailwind CSS v4** — configured through `@tailwindcss/vite` plugin; there is no `tailwind.config.js`. All CSS lives in `src/index.css` with `@import "tailwindcss"`.
- **@dnd-kit** (`/core`, `/sortable`, `/utilities`) — drag-and-drop for the pinned board
- **react-icons/si** — Simple Icons brand logos; **react-icons/fa** for `FaAws` (AWS has no `si` equivalent in this version)

## Architecture

The app is a single-page developer portal with two modes: normal view and manage mode.

### State ownership

Frontend state orchestration is in `frontend/src/features/portal/usePortalData.ts`.

Persistence is API-backed (not localStorage):
- `GET/PUT /api/settings` and `/api/settings/title`
- `GET/POST/PUT /api/services`
- `GET/PUT /api/board`

### Data flow

```
App.tsx
├── usePortalData()                 ← composed portal hooks + persistence
├── SearchSpotlight          ← shown when search has text; blurs page, shows results
├── Board                    ← pinned grid; receives services + boardItems + setBoardItems
│   ├── Widget (×N)          ← each pinned tile; drag-sortable, hover brand color
│   └── AddServicePanel      ← modal to add services to the board
├── ManageServices           ← shown instead of directory in manage mode
│   └── ServiceEditModal     ← add/edit a service in the catalog
└── ServiceDirectory         ← alphabetical flat list; shown in normal mode
    └── ServiceRow (×N)
```

### Icon system

`frontend/src/lib/icons.ts` resolves Simple Icons slug/title dynamically and applies the near-black color fallback.

`frontend/src/pages/services/ServiceIcon.tsx` renders a resolved icon or text fallback.

### Adding a new service

1. Open Manage mode in the UI and add a service.
2. Optionally provide `iconName` as a Simple Icons slug or `Md*` Material icon name.
3. Service and board changes persist through backend API.
