## Backend (Express + TypeScript + Firestore)

### Setup & Structure

- [x] Express app with Helmet, CORS, Morgan (`server/src/app.ts`)
- [x] Config loader with zod validation (`server/src/config/env.ts`)
- [x] Firestore connection (`server/src/config/firestore.ts`)
- [x] Error handler middleware (`server/src/api/middleware/error.ts`)

### Routes

- [x] `/auth/register` (POST)
- [x] `/auth/login` (POST)
- [x] `/products` (GET list)
- [x] `/products/:id` (GET by ID)
- [x] `/products` (POST create, requires auth)
- [x] `/products/:id` (PUT update, requires auth)
- [x] `/products/:id` (DELETE, requires admin)
- [x] `/products/admin/stats` (secured admin-only route)

### Auth & Security

- [x] JWT issue with TTL (15m in `auth.service.ts`)
- [ ] Refresh flow or manual re-login documented (README note)
- [x] `requireAuth` middleware validates token (`server/src/api/middleware/auth.ts`)
- [x] `requireRole('admin')` middleware (`server/src/api/middleware/auth.ts`)
- [x] Secrets managed via `.env` only (`.env.example`, `env.ts`)

### Validation

- [x] Joi schemas for auth (register, login) (`server/src/api/validators/auth.schema.ts`)
- [x] Joi schemas for products (create, update) (`server/src/api/validators/products.schema.ts`)
- [x] `validate.ts` middleware rejects bad payloads (`server/src/api/middleware/validate.ts`)

### Data Layer

- [x] `domain/` types for Product & User (`server/src/domain/*.ts`)
- [x] Repository interface (`server/src/data/ports/products.repo.ts`)
- [x] Firestore implementation (`server/src/data/firestore/products.repo.fs.ts`)
- [x] In-memory implementation (`server/src/data/memory/products.repo.mem.ts`)
- [x] Service layer for products + auth (`server/src/services/*.ts`)

### Firestore Features

- [x] Products collection has string/number/timestamp (`products.repo.fs.ts` writes `createdAt`)
- [ ] Partition: products vs images (note in docs/design)
- [x] Sort key: `orderBy(price)` supported via `list(params.sort)`
- [ ] Composite indexes: create in console (document in screenshots)
- [ ] Query throughput optimisations (document in README/design)

### Testing & Evidence

- [x] Postman collection for all CRUD + auth routes (`docs/postman_collection.json`)
- [ ] Screenshot: Morgan log of GET
- [ ] Screenshot: Morgan log of POST
- [ ] Screenshot: Composite index definition in Firestore console
- [ ] Screenshot: Query using composite index with GUI change
- [ ] Screenshot: Number stored as number in Firestore
- [ ] Screenshot: 7 UI/backend tests passed (see front-end section for details)

---

## Documentation & Submission

- [ ] `ASSESSMENT.md` filled with Q&A answers from brief
- [ ] `API_REFERENCE.md` with route docs (inputs, outputs, codes)
- [ ] `ARCHITECTURE.md` with diagrams (flowchart, data hierarchy)
- [ ] `screenshots/` folder with all evidence images
- [ ] Private GitHub repo created (screenshot included)
- [ ] Final ZIP submission with code + docs + screenshots
