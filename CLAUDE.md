# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start dev server at http://localhost:5173
npm run build     # tsc type-check + vite production build
npm run preview   # serve the production build locally
npx tsc --noEmit  # type-check only (no emit), useful after edits
```

There are no tests or linting scripts configured.

## Stack

- **React 19** + **TypeScript** via **Vite 6**
- **Tailwind CSS v4** — configured through `@tailwindcss/vite` plugin; there is no `tailwind.config.js`. All CSS lives in `src/index.css` with `@import "tailwindcss"`.
- **@dnd-kit** (`/core`, `/sortable`, `/utilities`) — drag-and-drop for the pinned board
- **react-icons/si** — Simple Icons brand logos; **react-icons/fa** for `FaAws` (AWS has no `si` equivalent in this version)

## Architecture

The app is a single-page developer portal with two modes: normal view and manage mode.

### State ownership

All persistent state lives in `src/hooks/usePortalData.ts`, which wraps `localStorage` for three keys:
- `portal-title` — the editable header title string
- `portal-services` — the full services catalog (`Service[]`), seeded from `src/data/services.ts`
- `portal-board` — the ordered pinned items (`BoardItem[]`), seeded from `DEFAULT_BOARD_IDS`

`App.tsx` owns all state via this hook and passes slices down to children.

### Data flow

```
App.tsx
├── usePortalData()          ← all persistent state + setters
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

`src/data/icons.ts` exports `SERVICE_ICONS: Record<string, IconData>` mapping service IDs to `{ Icon: IconType | null, hex: string, fallbackLabel?: string }`. Azure has no react-icons equivalent so its `Icon` is `null` and it uses `fallbackLabel: 'Az'`.

`resolveIconColor(serviceId)` applies the near-black fix (hex values darker than `#333333` are rendered as `#e0e0e0` instead) — use this everywhere a brand color is needed.

`src/components/ServiceIcon.tsx` renders the icon component or a styled text fallback if `Icon` is null/missing.

### Adding a new service

1. Add the entry to `ALL_SERVICES` in `src/data/services.ts`
2. Add an icon mapping in `src/data/icons.ts` (import from `react-icons/si`; check the export exists with `grep -i "<name>" node_modules/react-icons/si/index.d.ts`)
3. Optionally add the ID to `DEFAULT_BOARD_IDS` to pin it by default
