# Dev Portal

A full-stack developer portal with a React frontend and a NestJS API. It includes a customizable services board and a GitLab merge request dashboard.

## Features

- Drag-sortable pinned services board with add/remove and catalog management
- Search spotlight for quick service navigation
- GitLab merge request board with actionable columns
- Persisted settings, services, board layout, and GitLab config via backend API
- Shared domain contracts for key frontend/backend payloads

## Project Structure

- `frontend/`: Vite + React + TypeScript UI
- `backend/`: NestJS + TypeORM + PostgreSQL API
- `.github/workflows/ci.yml`: CI checks for frontend and backend

## Development

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Backend:

```bash
cd backend
npm install
npm run dev
```

## Quality Gates

Both frontend and backend now include:

- `npm run typecheck`
- `npm run lint`
- `npm run lint:fix`
- `npm run format`
- `npm run format:check`

CI runs typecheck, lint, and build for both projects on pushes and pull requests.
