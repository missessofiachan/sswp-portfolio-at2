# Fullstack Project Checklist (Frontend + Backend)

This checklist tracks all deliverables, evidence, and best practices for the project. Tick them off as you implement.

---

## Frontend (React + Vite + TypeScript)

### Setup & Structure

- [x] Vite + React + TS scaffolded (`client/`)
- [x] ESLint + Prettier configured (`client/eslint.config.js`, root `.prettierrc`)
- [x] Vanilla Extract tokens (`client/src/styles/theme.css.ts`)
- [x] Routing (`client/src/app/routes.tsx`) with `<Navbar/> + <Outlet/>`

### Pages & Components

- [x] Home (`client/src/pages/Home.tsx`)
- [x] Products list (`client/src/pages/Products.tsx`)
- [x] Product detail (`client/src/pages/ProductShow.tsx`)
- [x] Login page (`client/src/pages/Login.tsx`)
- [x] Register page (`client/src/pages/Register.tsx`)
- [x] NotFound (404) (`client/src/pages/NotFound.tsx`)
- [x] Class-based component (LegacyClock) (`client/src/pages/LegacyClock.tsx`)
- [x] Navbar with NavLinks (`client/src/components/layout/Navbar.tsx`)

### Auth

- [x] `AuthProvider` (`client/src/features/auth/AuthProvider.tsx`)
- [x] `RequireAuth` guard (`client/src/features/auth/RequireAuth.tsx`)
- [x] Axios interceptor (`client/src/lib/axios.ts`)

### API Integration

- [x] `auth.api.ts` (`client/src/api/clients/auth.api.ts`)
- [x] `products.api.ts` (`client/src/api/clients/products.api.ts`)
- [ ] Hooks (optional) for queries/mutations

### Styling & Accessibility

- [x] Theme variables (vanilla-extract)
- [x] Basic layout (Navbar + container)
- [x] Accessible labels and error messages in forms

### Testing & Evidence

- [ ] At least one vitest + testing-library smoke test (`client/test`)
- [ ] Screenshot: 404 page (no stack trace)
- [ ] Screenshot: GUI showing CRUD actions (GET, POST, PUT, DELETE, GET by ID)
- [ ] Screenshot: JWT persistence in localStorage or cookies
- [ ] Screenshot: Logout clears token
- [ ] Screenshot: GUI renders correctly in Chrome
- [ ] Screenshot: GUI renders correctly in Firefox

---
