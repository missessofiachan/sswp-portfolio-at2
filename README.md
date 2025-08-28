# sswp-portfolio-at2

A fullstack TypeScript project built with **React + Vite (frontend)** and **Express + Firestore (backend)**. This repo implements authentication, CRUD operations, and meets portfolio assessment requirements.

---

## 🚀 Tech Stack

**Frontend**

- React 18 + Vite + TypeScript
- React Router 6
- React Hook Form + Zod validation
- Axios with JWT interceptors
- Vanilla Extract (CSS-in-TS)
- Vitest + Testing Library

**Backend**

- Express + TypeScript
- Firestore (NoSQL) with Admin SDK
- Joi validation schemas
- JWT authentication & role-based access
- Helmet, CORS, Morgan for security & logging

---

## 📂 Project Structure

```txt
your-project/
├─ client/        # React + Vite app
│  └─ src/
│     ├─ app/ (routes, theme)
│     ├─ pages/ (Home, Products, ProductShow, Login, Register, 404)
│     ├─ features/auth (AuthProvider, RequireAuth)
│     ├─ api/clients (axios API clients)
│     ├─ components/ (Navbar, Footer, etc.)
│     └─ test/
│
└─ server/        # Express API + Firestore
   └─ src/
      ├─ api/ (routes, controllers, validators, middleware)
      ├─ services/ (auth, products)
      ├─ data/ (repos: firestore + in-memory)
      ├─ domain/ (TS types)
      ├─ config/ (env, firestore)
      └─ utils/
```

---

## 🔑 Features

- User registration & login with JWT
- Role-based authorisation (`user` vs `admin`)
- Products CRUD (list, detail, create, update, delete)
- Admin-only stats endpoint
- Composite Firestore indexes (e.g., category+price)
- Secure headers + CORS + request logging
- GUI integrated with API (React pages for CRUD + auth)
- 7 evidence tests/screenshots (GUI, Postman, Morgan logs, Chrome/Firefox, etc.)

Note: For local demo/testing, the very first account you register is granted the `admin` role; subsequent accounts are `user`.

---

## ⚙️ Setup

### Prerequisites

- Node.js (>=18)
- pnpm or npm
- Firebase project + service account (for Firestore)

### Clone & Install

```bash
git clone <this-repo>
cd your-project
pnpm install   # or npm install
```

### Environment

Copy `.env.example` to `.env` in both `client/` and `server/`, then update:

```ini
# client/.env
VITE_API_URL=http://localhost:4000/api/v1

# server/.env
PORT=4000
JWT_SECRET=supersecret
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n..."
```

---

## ▶️ Run

Start client & server concurrently:

```bash
pnpm run dev
```

Frontend: <http://localhost:5173>  
Backend: <http://localhost:4000/api/v1>

---

## 🧪 Testing

### Frontend

```bash
cd client
pnpm run test
```

### Backend

(Integration tests stubbed; use Postman collection in `docs/`.)

---

## 📸 Evidence Checklist

- [ ] Screenshots of CRUD (GUI + Postman)
- [ ] 404 page screenshot (no stack trace)
- [ ] Chrome + Firefox rendering
- [ ] JWT persistence & logout clears token
- [ ] Morgan logs (GET + POST)
- [ ] Firestore composite index definitions
- [ ] Number stored as number in Firestore

---

## 📖 Documentation

- [`docs/ASSESSMENT.md`](./docs/ASSESSMENT.md) – Q&A answers, standards, scaling notes
- [`docs/API_REFERENCE.md`](./docs/API_REFERENCE.md) – endpoint definitions
- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) – diagrams, flowcharts, data hierarchy
- [`docs/screenshots/`](./docs/screenshots/) - evidence images

### Assessment Mapping (quick reference)

- Part 1 – Confirm Application Requirements: see `docs/ICT50220_SSWP_AT2.md` (fill with brief answers) and this README (stack, standards)
- Part 2 – React Client: routes in `client/src/app/routes.tsx`, pages in `client/src/pages/*`, styling under `client/src/styles/`
- Part 3 – Database Design: Firestore repo `server/src/data/firestore/products.repo.fs.ts`, env in `server/src/config/env.ts`
- Part 4 – REST API: Express app `server/src/app.ts`, routes under `server/src/api/routes/*`, controllers/validators/middleware under `server/src/api/*`
- Part 5 – Refine Client/Server: sort key (products list), admin stats endpoint, security (helmet, JWT, joi), Morgan logging
- Part 6 – Test & Debug: use Postman + browser screenshots; test folders under `client/test` and `server/src/test`
- Part 7 – Handover: docs + private GitHub repo; see checklists in `docs/`

---

## 📦 Deployment

For production:

```bash
cd server
pnpm run build
node dist/index.js
```

Deploy frontend separately (e.g., Vercel, Netlify) with `VITE_API_URL` pointing to backend.

---

## 👩‍💻 Authors

- Sofia's student project (Diploma of IT – Advanced Programming)

---

## 📝 License

MIT – free to use and adapt.
