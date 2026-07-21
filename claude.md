# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this app is

A single-user task tracker. No auth, one global task list, no projects, attachments, comments, or notifications. The task entity has these fields:

- Title, Description
- Status: `Todo` | `In Progress` | `Completed`
- Category (free-form string)
- Due Date, Created Date, Updated Date, Completed Date

The `Completed Date` is set when status transitions to `Completed` and cleared if it transitions back out.

## Tech stack

- **Frontend** — Angular 21, Angular Material, SCSS, standalone components (no NgModules)
- **Backend** — Node.js, Express.js
- **Database** — PostgreSQL with Prisma ORM
- **Tests** — Jest on both frontend and backend

## Repository layout

- `frontend/` — Angular 21 app (standalone components, Angular Material, SCSS)
- `backend/` — Node + Express API, Prisma schema and migrations
- `docs/` — project documentation
- `.claude/skills/` — local Claude Code skill definitions (do not edit casually)

## Common commands

### Backend (`backend/`)

```bash
npm install
npx prisma migrate dev          # apply migrations + regenerate client
npx prisma generate             # regenerate client after schema edits
npx prisma studio               # inspect DB
npm run dev                     # start Express on http://localhost:3000
npm test                        # Jest
npm run lint
```

### Frontend (`frontend/`)

```bash
npm install
npm start                       # ng serve on http://localhost:4200, proxies /api → :3000
npm test                        # Jest (ng test)
npm run lint
npm run build                   # production build
```

### Database

A local PostgreSQL instance is expected. Connection string lives in `backend/.env` as `DATABASE_URL`.

## Architecture

### Backend

- Single Express app exposing a REST API under `/api`.
- Tasks are the only resource. CRUD endpoints plus a status-change endpoint. Prisma is the only data-access layer — no raw SQL in route handlers.
- The status-change endpoint is the place that owns the `Completed Date` logic: set on entering `Completed`, clear on leaving it. `Updated Date` is bumped on every mutation.
- No authentication middleware. If endpoints are exposed beyond localhost, that has to be added deliberately.

### Frontend

- Angular 21 with **standalone components** throughout — no NgModules. `bootstrapApplication` in `main.ts`, providers in `app.config.ts`.
- Angular Material for the UI primitives (table/list, form fields, datepicker, buttons, dialogs).
- A single `TaskService` (Angular `HttpClient` + signals or RxJS — pick one and stay consistent) is the only thing that talks to the API. Components consume it; they do not call `HttpClient` directly.
- One main route for the task list, with an inline create/edit form or a Material dialog — keep it to a single screen. Status transitions can be a dropdown or chip group, not a separate page.
- Dev server proxies `/api` to the backend on `:3000` via `proxy.conf.json` so the frontend never hardcodes the API origin.

## Conventions

- **TypeScript strict mode** on both sides.
- **Prisma schema is the source of truth** for the Task shape. Mirror it as a TypeScript type in the backend, and generate or hand-mirror a matching interface on the frontend. Don't let them drift.
- **Enums** in Prisma for `Status`; expose the same string values (`Todo`, `In Progress`, `Completed`) over the API.
- **Dates** are ISO 8601 strings on the wire. The frontend formats for display.
- **Validation** lives in the backend (zod or express-validator) — the frontend is not the last line of defense.
- **No NgModules** in the frontend. If a new component shows up with `@NgModule`, that's a regression.

## Things to watch for

- `Completed Date` clearing on status rollback is easy to miss — any code that updates status should go through the dedicated endpoint, not a generic PATCH.
- Prisma client must be regenerated (`npx prisma generate`) after any schema change; stale clients are a common source of "field does not exist" errors.
- The frontend dev server depends on the backend being up at `:3000`; document this in `frontend/README.md` once it exists.
