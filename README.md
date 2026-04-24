# Dev Portal

A minimal developer portal — a pinned grid of your most-used services plus a full searchable directory, all in a single dark-themed page.

## Features

- **Pinned board** — drag to reorder, click to open, customizable per-user
- **Spotlight search** — type anywhere to surface services with a blurred overlay (Escape or × to dismiss)
- **Manage mode** — rename the portal title, reorder/remove pinned tiles, and add/edit/delete services in the catalog
- **Brand icons** — real logos from Simple Icons via react-icons, with per-icon brand color on hover
- **Persistent** — board layout, catalog edits, and portal title are saved to `localStorage`

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
```

## Stack

| Layer | Library |
|---|---|
| UI | React 19 + TypeScript |
| Bundler | Vite 6 |
| Styling | Tailwind CSS v4 |
| Drag & drop | @dnd-kit |
| Icons | react-icons (Simple Icons + Font Awesome) |

## Usage

### Normal mode
- Click any tile to open the service in a new tab
- Type in the search bar to trigger the spotlight overlay
- Scroll down to browse the full alphabetical service directory

### Manage mode (click **Manage**)
- Click the portal title to rename it
- Drag tiles to reorder, click × to remove from the board
- Use **+ Add** to pin additional services
- Below the board: edit any service's name/URL/description/category, delete it, or add a new one entirely
