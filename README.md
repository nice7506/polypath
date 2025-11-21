# Polypath Monorepo

React + Tailwind (shadcn style) frontend and Node backend in npm workspaces.

## Structure
- `frontend/` — Vite + React + Tailwind + shadcn-style tokens/components.
- `backend/` — Express server with health check and CORS/logging defaults.

## Getting Started
1. Install deps (workspace-aware):
   ```bash
   npm install
   ```
2. Frontend dev server:
   ```bash
   npm run dev:frontend
   ```
3. Backend dev server (uses `PORT` env, defaults to 4000):
   ```bash
   npm run dev:backend
   ```

## Scripts
- `npm run dev:frontend` — Vite dev server.
- `npm run build:frontend` — Type-check and production build.
- `npm run dev:backend` — Nodemon server.
- `npm run start:backend` — Start backend with Node.

## Environment
Copy `backend/.env.example` to `backend/.env` and adjust as needed.

## Notes
- Root `package.json` is the workspace orchestrator; per-app deps live in their folders.
- Single root `package-lock.json` keeps versions in sync across workspaces.
