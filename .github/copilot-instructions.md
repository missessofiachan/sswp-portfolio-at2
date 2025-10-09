# Copilot AI Agent Instructions for sswp-portfolio-at2

> This document provides essential, actionable guidance for AI coding agents working in this codebase. It summarizes architecture, workflows, and conventions that are unique or critical for productivity.

---

## 🧭 Agent Workflow Cheatsheet

1. **Start with context**

- Skim `docs/ARCHITECTURE.md`, `docs/project_file_map.md`, and the relevant feature folder.
- Use `read_file` or `grep_search` before editing—many files already have detailed comments.

2. **Plan before you code**

- Draft a short plan covering inputs/outputs, data flow, and validation.
- List edge cases (empty data, auth failure, network errors) and handle or log them.

3. **Implement with project conventions**

- Stick to TypeScript strict mode, Vanilla Extract for styles, React Hook Form + Zod for forms, and Axios clients in `client/src/api/clients`.
- Keep server logic layered: controller → service → repository.

4. **Verify**

- Run the narrowest command that exercises your change, e.g. `pnpm -C client run typecheck`, `pnpm -C server run test`.
- For UI work, at minimum run typecheck + lint; smoke-test via Storybook is optional (not currently configured).

5. **Document**

- Update TODOs, docs, or inline comments when you introduce a new pattern.

6. **Report**

- Summarize the change, tests run, and follow-ups. Call out assumptions explicitly.

Avoid merging/committing—leave that to the user. If blocked (missing env vars, external service), suggest a mock or describe manual steps.

## 🏗️ Project Architecture (Big Picture)

- **Monorepo**: Two main apps—`client/` (React + Vite + TS) and `server/` (Express + TS + Firestore). Shared root for scripts and docs.
- **Frontend**: SPA with React Router, API clients in `client/src/api/clients/`, state via Jotai, forms via React Hook Form + Zod, styling with Vanilla Extract.
- **Backend**: Express REST API, business logic in `server/src/services/`, data access via repository pattern (`server/src/data/`), Firestore as DB, validation with Joi, JWT auth, role-based access.
- **Docs**: Key documentation in `docs/` (see `ARCHITECTURE.md`, `API_REFERENCE.md`, `ASSESSMENT.md`, `project_file_map.md`).

## 🚦 Developer Workflows

- **Install**: `pnpm install` at root. Use `pnpm` for all scripts unless otherwise noted.
- **Env Setup**: Copy `.env.example` to `.env` in both `client/` and `server/`. Set `VITE_API_URL` in client, Firebase/JWT vars in server.
- **Dev Start**: `pnpm run dev` (runs both apps concurrently; see `scripts/dev-all.sh` for details).
- **Build/Test**:
  - Client: `pnpm -C client run build` / `pnpm -C client run test`
  - Server: `pnpm -C server run build` / `pnpm -C server run test`
  - Full: Use workspace tasks (see VS Code tasks) or `pnpm run build` at root.
- **Lint/Typecheck**: `pnpm -C client run typecheck` (client), `pnpm -C server run typecheck` (server).
- **Seeding/Healthcheck**: Use scripts in `scripts/` (e.g., `seed.ts`, `healthcheck.ts`).
- **Formatting**: `pnpm run format` at repo root (runs Prettier according to existing config).
- **Testing Evidence**: Postman collection in `docs/`, screenshots in `docs/screenshots/`.
- **Git Hygiene**: Feature branches preferred; keep commits small and descriptive. No direct pushes to `main` during automated work.

## 📦 Key Patterns & Conventions

- **Repository Pattern**: All data access in server goes through interfaces in `server/src/data/ports/`, with Firestore and in-memory implementations.
- **Validation**: Joi schemas in `server/src/api/validators/` for POST/PUT; Zod for client-side forms.
- **Auth**: JWT-based; first registered user is admin. Role checks in `server/src/api/middleware/auth.ts`.
- **API Clients**: All HTTP calls from client go through `client/src/api/clients/` (Axios, with JWT interceptors).
- **Error Handling**: Centralized in `server/src/api/middleware/error.ts` (backend) and `AppErrorBoundary.tsx` (frontend).
- **Testing**: Frontend uses Vitest + Testing Library (`client/test/`). Backend tests are stubbed; use Postman for API evidence.
- **Styling**: Use Vanilla Extract for theme and component styles (`client/src/app/theme.css.ts`, `ui.css.ts`).
- **Routing**: Client routes in `client/src/app/routes.tsx`; server routes in `server/src/api/routes/`.
- **Type Safety**: Shared types in `client/src/types/` and `server/src/domain/`.
- **Error UX**: For client forms, display error summary + inline errors; fall back to toast/log for unexpected failures.
- **Accessibility**: Ensure semantic HTML, labelled form controls, focus management—axe audits encouraged.
- **Internationalisation**: Not currently implemented; keep copy centralised for future i18n.

## 🔗 Integration & External Dependencies

- **Firestore**: Configured in `server/src/config/firestore.ts` via Firebase Admin SDK. Requires service account.
- **JWT**: Secret in server `.env`. Tokens attached to API requests via Axios interceptor.
- **Vite**: Used for client build/dev. API URL set via `VITE_API_URL` env var.
- **Email**: `server/src/services/email.service.ts` provides a stub; wire to real provider before production.
- **Uploads**: `server/uploads/` holds uploaded assets; ensure filenames are sanitized.

## 📝 Documentation & Evidence

- **API Reference**: `docs/API_REFERENCE.md` (endpoints, payloads, status codes)
- **Architecture**: `docs/ARCHITECTURE.md` (diagrams, data flows)
- **Assessment**: `docs/ASSESSMENT.md` (Q&A, standards)
- **Screenshots**: `docs/screenshots/` (required for assessment)
- **TODO Backlog**: `todo` (high-level tasks, priorities, acceptance criteria)

## ✅ Coding Standards & Tools

- **Style**: Use existing ESLint/Prettier rules (no manual formatting).
- **Imports**: Prefer path aliases (`@client/...`, `@server/...`). Keep import groups sorted (external → internal → types).
- **Components**: Functional components with hooks; avoid class components.
- **State**: Use Jotai atoms when state spans multiple components; local `useState` for simple UI state.
- **Forms**: `react-hook-form` + Zod schema; surface validation errors via helper text.
- **HTTP**: Use Axios instance in `client/src/lib/axios.ts`; don’t call `fetch` directly.
- **Testing**: Vitest + Testing Library for client; keep tests colocated under `client/test/`. Server tests live under `server/src/test/` (Vitest configuration ready but coverage sparse).

## 🛡️ Security & Compliance

- Never commit secrets. Use `.env` files (already gitignored).
- Validate all external input (Zod on client, Joi on server). Reject or sanitize HTML to prevent XSS.
- Firestore security rules and indexes are documented in `docs/FIRESTORE_INDEXES.md`; update when adding new queries.
- Follow CORS rules found in `server/src/api/middleware` when adding endpoints.

## 🔁 PR / Review Expectations (for human maintainers)

- Provide before/after screenshots for UI changes.
- List commands run and their results (e.g., typecheck, tests).
- Call out migrations or manual steps (Firestore index creation, env vars) in the PR description.
- Highlight any follow-up work in the README or TODO file.

---

**When in doubt, consult the README and docs/ folder for up-to-date project details.**
