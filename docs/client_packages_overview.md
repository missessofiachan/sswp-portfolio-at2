# Client Packages Overview (React + Vite + TypeScript)

This document lists all npm packages used in the **client** app and explains why they are included.

---

## Core
- **react / react-dom**  
  The React library for building user interfaces and DOM rendering.

- **vite**  
  Modern build tool providing fast dev server and optimized production builds.

- **typescript**  
  Adds static typing and improved developer tooling.

---

## Routing & State
- **react-router-dom**  
  Handles client-side routing (e.g., `/products/:id`, `/login`).

- **jotai**  
  Lightweight state management for global atoms (used for auth token/user state).

---

## Forms & Validation
- **react-hook-form**  
  Efficient, performant form state management.

- **zod**  
  TypeScript-first schema validation library.

- **@hookform/resolvers**  
  Connects zod schemas (or other validators) to react-hook-form.

---

## HTTP & API
- **axios**  
  HTTP client for making API requests to the Express backend. Configured with interceptors to attach JWT tokens.

---

## Styling
- **@vanilla-extract/css**  
  Zero-runtime CSS-in-TS library for design tokens and scoped styles.

- **@vanilla-extract/vite-plugin**  
  Vite plugin to process vanilla-extract CSS files.

---

## Testing
- **vitest**  
  Vite-native test runner (fast unit + integration tests).

- **@testing-library/react**  
  Testing utilities for React components (focuses on user interactions).

- **@testing-library/jest-dom**  
  Custom DOM matchers for better test assertions.

- **jsdom**  
  Simulated browser DOM for running tests in Node.

---

## DX (Developer Experience)
- **vite-tsconfig-paths**  
  Supports `tsconfig.json` path aliases in Vite builds.

---

## Summary
These packages together provide:
- **React** for UI
- **Vite** for tooling
- **TypeScript** for type safety
- **React Router** for navigation
- **React Hook Form + Zod** for robust forms & validation
- **Axios** for API communication
- **Jotai** for state management
- **Vanilla Extract** for styling
- **Vitest + Testing Library** for testing
- **Path aliasing** for clean imports

