# Project File Map – Folder & File Purpose

This document explains what each folder and file in the project is responsible for.

---

## Root

- **package.json** – root scripts (dev, lint, typecheck, test), workspaces setup.
- **pnpm-workspace.yaml** – defines monorepo workspaces (`client` + `server`).
- **tsconfig.base.json** – shared TypeScript settings for frontend and backend.
- **.eslintrc.cjs** – ESLint config for code style and linting.
- **.prettierrc** – Prettier config for formatting.
- **.env.example** – sample environment variables (never commit real secrets).
- **docs/** – assessment answers, API reference, architecture notes, and screenshots.
- **scripts/** – helper scripts (start both apps, seed data, healthcheck).

---

## Client (React + Vite + TS)

**client/index.html** – HTML entry for Vite app.  
**client/vite.config.ts** – Vite build/dev configuration.  
**client/tsconfig.json** – TypeScript config for frontend.  
**client/.env.example** – sample VITE\_\* env vars for frontend.

### `client/src/`

- **main.tsx** – React entrypoint; mounts root with RouterProvider.
- **app/**
  - **routes.tsx** – central route definitions (Home, Products, etc.).
  - **theme.css.ts** – Vanilla Extract theme tokens (colors, spacing, radius).
- **components/**
  - **ui/** – reusable UI elements (Button, Input, Card).
  - **layout/** – layout components (Navbar, Footer, Sidebar).
    - **HelpChat.tsx** – floating help/chat component with quick navigation and actions.
    - **helpChat.css.ts** – Vanilla Extract styles for help chat component.
- **features/**
  - **auth/** – authentication feature: AuthProvider, RequireAuth, hooks.
  - **products/** – optional feature folder for product hooks/views.
- **pages/** – top-level route components:
  - **Home.tsx** – landing page.
  - **Products.tsx** – list view of products.
  - **ProductShow.tsx** – detail view of a product.
  - **Login.tsx** – login form.
  - **Register.tsx** – register form.
  - **LegacyClock.tsx** – class-based demo component.
  - **NotFound.tsx** – 404 error page.
- **lib/**
  - **axios.ts** – axios instance with JWT interceptors.
  - **query.ts** – (optional) React Query setup.
- **api/**
  - **clients/** – API client functions (auth.api.ts, products.api.ts).
  - **dto/** – request/response TypeScript types.
- **hooks/** – custom React hooks (e.g., useLocalStorage).
- **types/** – shared frontend types.
- **test/** – frontend tests (setup.ts, smoke tests).

---

## Server (Express + TS + Firestore)

**server/package.json** – backend scripts (dev, build, start, test).  
**server/tsconfig.json** – backend TypeScript config.  
**server/nodemon.json** – reload config for dev.  
**server/.env.example** – backend env vars (port, secrets, Firebase creds).

### `server/src/`

- **index.ts** – server entrypoint; starts Express on port.
- **app.ts** – Express app setup (helmet, cors, morgan, routes, error handler).
- **config/**
  - **env.ts** – loads and validates env vars with zod.
  - **firestore.ts** – Firestore connection via Firebase Admin SDK.
- **api/**
  - **routes/** – Express route definitions (`auth.routes.ts`, `products.routes.ts`).
  - **controllers/** – handlers mapping HTTP requests to service logic.
  - **validators/** – Joi schemas for validating request bodies.
  - **middleware/** – request middleware:
    - **auth.ts** – JWT verification & role checks.
    - **validate.ts** – applies Joi schema validation.
    - **error.ts** – centralized error handler.
- **domain/**
  - **product.ts** – Product TypeScript type definition.
  - **user.ts** – User TypeScript type definition.
- **services/**
  - **auth.service.ts** – handles registration/login, password hashing, JWT.
  - **products.service.ts** – orchestrates product CRUD using repository.
- **data/**
  - **ports/** – repository interfaces (contract for data layer).
  - **firestore/** – Firestore implementation of repos.
  - **memory/** – in-memory implementation for testing.
- **utils/**
  - **logger.ts** – optional logger (morgan wrapper / winston/pino).
  - **crypto.ts** – crypto helpers (jwt, bcrypt wrappers).
- **test/** – backend test files (unit/integration, e.g., products.test.ts).

---

## Docs

- **docs/ASSESSMENT.md** – answers to assessment questions.
- **docs/API_REFERENCE.md** – API endpoints, payloads, status codes.
- **docs/ARCHITECTURE.md** – diagrams, hierarchy, data flows.
- **docs/HELP_CHAT.md** – documentation for the custom help chat component.
- **docs/screenshots/** – required evidence screenshots (GUI, Postman, logs).

---

## Scripts

- **scripts/dev-all.sh** – runs client & server concurrently.
- **scripts/seed.ts** – seeds database with sample data.
- **scripts/healthcheck.ts** – pings endpoints for smoke testing.
