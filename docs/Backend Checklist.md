## Backend (Express + TypeScript + Firestore)

### Setup & Structure

- [ ] Express app with Helmet, CORS, Morgan
- [ ] Config loader with zod validation (`env.ts`)
- [ ] Firestore connection (`firestore.ts`)
- [ ] Error handler middleware

### Routes

- [ ] `/auth/register` (POST)
- [ ] `/auth/login` (POST)
- [ ] `/products` (GET list)
- [ ] `/products/:id` (GET by ID)
- [ ] `/products` (POST create, requires auth)
- [ ] `/products/:id` (PUT update, requires auth)
- [ ] `/products/:id` (DELETE, requires admin)
- [ ] `/products/admin/stats` (secured admin-only route)

### Auth & Security

- [ ] JWT issue with TTL (e.g., 15m)
- [ ] Refresh flow or manual re-login documented
- [ ] `requireAuth` middleware validates token
- [ ] `requireRole('admin')` middleware restricts admin endpoints
- [ ] Secrets managed via `.env` only

### Validation

- [ ] Joi schemas for auth (register, login)
- [ ] Joi schemas for products (create, update)
- [ ] `validate.ts` middleware rejects bad payloads with 400

### Data Layer

- [ ] `domain/` types for Product & User
- [ ] Repository interface (`ProductsRepo`)
- [ ] Firestore implementation (`products.repo.fs.ts`)
- [ ] In-memory implementation (`products.repo.mem.ts`)
- [ ] Service layer for products + auth

### Firestore Features

- [ ] Products collection with at least 3+ data types (string, number, timestamp)
- [ ] Partition: products vs images (separate collection)
- [ ] Sort key: `orderBy(price)` (or similar)
- [ ] 2 composite indexes defined in Firestore console (e.g., category+price, createdAt+rating)
- [ ] Document query throughput optimisations (e.g., `.select()`, pagination, denormalisation)

### Testing & Evidence

- [ ] Postman collection for all CRUD + auth routes
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
