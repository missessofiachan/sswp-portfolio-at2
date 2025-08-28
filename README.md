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
- [`docs/screenshots/`](./docs/screenshots/) – evidence images

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

