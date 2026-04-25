# Dev Portal

A full-stack developer portal with a React frontend and a NestJS API. It includes a customizable services board and a GitLab merge request dashboard.

## Features

- Drag-sortable pinned services board with add/remove and catalog management
- Search spotlight for quick service navigation
- GitLab merge request member-load table — per-person authoring and review queue with expandable MR cards
- Persisted settings, services, board layout, and GitLab config via backend API
- Shared domain contracts for key frontend/backend payloads

## Project Structure

- `frontend/` — Vite + React 19 + TypeScript UI (React Router v6, Tailwind CSS v4)
- `backend/` — NestJS + TypeORM + PostgreSQL API
- `.github/workflows/ci.yml` — CI checks for frontend and backend

## Development

Frontend:

```bash
cd frontend
npm install
npm run dev       # http://localhost:5173
```

Backend:

```bash
cd backend
npm install
npm run dev       # http://localhost:3001
```

The backend requires a PostgreSQL database. Configure connection via environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_HOST` | `localhost` | Postgres host |
| `DB_PORT` | `5432` | Postgres port |
| `DB_USERNAME` | — | Postgres user |
| `DB_PASSWORD` | — | Postgres password |
| `DB_NAME` | `devportal` | Database name |
| `DB_SCHEMA` | `public` | Schema name |

## Quality Gates

Both frontend and backend include:

- `npm run typecheck`
- `npm run lint`
- `npm run lint:fix`
- `npm run format`
- `npm run format:check`

CI runs typecheck, lint, and build for both projects on pushes and pull requests.
