# Server Packages Overview (Express + TypeScript + Firestore)

This document lists the npm packages used in the **server** and why they’re included.

---

## Core & Runtime
- **typescript**  
  Type safety for the backend.
- **ts-node / ts-node-esm**  
  Run TypeScript directly in development.
- **@types/node**  
  TypeScript typings for Node.js APIs.
- **nodemon**  
  Restarts the server on file changes during development.

---

## Web Framework & HTTP
- **express**  
  Minimal, unopinionated web framework for building REST APIs.
- **@types/express**  
  TypeScript typings for Express.

---

## Security & CORS
- **helmet**  
  Sets secure HTTP headers (e.g., HSTS, X-Frame-Options) to harden the API.
- **cors**  
  Controls cross-origin requests (frontend ↔ backend during local dev and prod).
- **@types/cors**  
  TypeScript typings for CORS middleware.

---

## Logging & Observability
- **morgan**  
  HTTP request logger middleware. Useful for evidence screenshots (GET/POST throughput).
- **@types/morgan**  
  TypeScript typings for Morgan.

---

## Validation
- **joi**  
  Schema-based request validation for POST/PUT payloads (rejects with 400 on bad input).

---

## Authentication & Crypto
- **bcrypt**  
  Secure password hashing for local auth.
- **jsonwebtoken**  
  Issue/verify JWTs with TTL and role claims.
- **@types/jsonwebtoken**  
  TypeScript typings for jsonwebtoken.
- **@types/bcrypt**  
  TypeScript typings for bcrypt.

---

## Database / NoSQL
- **firebase-admin**  
  Firebase Admin SDK to connect to **Cloud Firestore** from the server, enabling CRUD, composite indexes, and secure service-account auth.

---

## Types & DX
- **@types/bcrypt, @types/morgan, @types/jsonwebtoken, @types/express, @types/cors**  
  Ambient type packages used by TypeScript for stronger type checking and editor IntelliSense.

---

## How They Fit Together
1. **Express** exposes `/api/v1` routes.  
2. **helmet + cors + morgan** are applied at the app level for security & logging.  
3. **joi** validates request bodies at the edge (middleware).  
4. **bcrypt + jsonwebtoken** implement register/login and protect routes with `requireAuth` + `requireRole`.  
5. **firebase-admin** provides a Firestore client; repository classes encapsulate queries and sorting/index usage.  
6. **nodemon + ts-node** power a fast TypeScript dev loop; types packages keep everything type-safe.

---

## Optional Add‑Ons (nice to have)
- **pino** or **winston** – structured logging in production.
- **express-rate-limit** – request throttling for brute-force protection.
- **zod** – if you prefer zod for runtime validation to align with the frontend.
- **supertest / vitest** – HTTP integration testing of routes.

---

## Summary
The server stack balances simplicity and robustness: Express for routing, Helmet/CORS/Morgan for security/observability, Joi for validation, JWT + bcrypt for auth, and Firestore via Firebase Admin for NoSQL storage with composite indexes and ordered queries.

