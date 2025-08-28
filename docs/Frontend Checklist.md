# Fullstack Project Checklist (Frontend + Backend)

This checklist tracks all deliverables, evidence, and best practices for the project. Tick them off as you implement.

---

## Frontend (React + Vite + TypeScript)

### Setup & Structure
- [ ] Vite + React + TS scaffolded (`npm create vite@latest ... --template react-ts`)
- [ ] ESLint + Prettier configured
- [ ] Vanilla Extract theme tokens set up
- [ ] Routing file (`routes.tsx`) with `<Navbar/> + <Outlet/>`

### Pages & Components
- [ ] Home page
- [ ] Products list page (`/products`)
- [ ] Product detail page (`/products/:id`)
- [ ] Login page with form + zod validation
- [ ] Register page with form + zod validation
- [ ] NotFound (404) page
- [ ] One class-based component (LegacyClock)
- [ ] Navbar with NavLinks

### Auth
- [ ] `AuthProvider` context with login/logout/token persistence
- [ ] `RequireAuth` guard for protected routes
- [ ] Axios interceptor attaches JWT to requests

### API Integration
- [ ] `auth.api.ts` (login, register)
- [ ] `products.api.ts` (list, getById, create, update, delete)
- [ ] Hooks (optional) for queries/mutations

### Styling & Accessibility
- [ ] Theme variables (colors, spacing, radius)
- [ ] Basic responsive layout (Navbar, container)
- [ ] Accessible forms (labels, aria, error messages)

### Testing & Evidence
- [ ] At least one vitest + testing-library smoke test
- [ ] Screenshot: 404 page (no stack trace)
- [ ] Screenshot: GUI showing CRUD actions (GET, POST, PUT, DELETE, GET by ID)
- [ ] Screenshot: JWT persistence in localStorage or cookies
- [ ] Screenshot: Logout clears token
- [ ] Screenshot: GUI renders correctly in Chrome
- [ ] Screenshot: GUI renders correctly in Firefox

---
