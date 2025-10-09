# sswp-portfolio-at2

A fullstack TypeScript project built with **React + Vite (frontend)** and **Express + Firestore (backend)**. This repo implements authentication, CRUD operations, AI-powered help chat, and meets portfolio assessment requirements with comprehensive JSDoc documentation.

---

## 🚀 Tech Stack

**Frontend**

- React 18 + Vite + TypeScript
- React Router 6
- React Hook Form + Zod validation
- Axios with JWT interceptors
- Vanilla Extract (CSS-in-TS)
- AI-powered help chat component
- Vitest + Testing Library

**Backend**

- Express + TypeScript
- Firestore (NoSQL) with Admin SDK
- Secure file upload with validation
- Joi validation schemas
- JWT authentication & role-based access
- Helmet, CORS, request logging
- Comprehensive JSDoc documentation

---

## 📂 Project Structure

```txt
your-project/
├─ client/        # React + Vite app
│  └─ src/
│     ├─ app/ (routes, theme)
│     ├─ pages/ (Home, Products, ProductShow, Login, Register, 404)
│     ├─ features/auth (AuthProvider, RequireAuth)
│     ├─ api/clients (axios API clients with JSDoc)
│     ├─ components/ (Navbar, Footer, HelpChat with AI)
│     └─ test/
│
├─ server/        # Express API + Firestore
│  └─ src/
│     ├─ api/ (routes, controllers, validators, middleware)
│     ├─ services/ (auth, products with comprehensive docs)
│     ├─ data/ (repos: firestore + in-memory)
│     ├─ domain/ (TS types)
│     ├─ config/ (env, firestore)
│     └─ utils/ (uploads, crypto, logging)
│
└─ docs/          # Documentation & evidence
   ├─ jsdoc/      # Generated API documentation
   ├─ screenshots/ # Evidence images
   └─ *.md        # Architecture, API reference, help chat docs
```

---

## 🔑 Features

### Core Functionality

- User registration & login with JWT
- Role-based authorisation (`user` vs `admin`)
- Products CRUD (list, detail, create, update, delete)
- Admin-only stats endpoint
- Composite Firestore indexes (e.g., category+price)
- Secure headers + CORS + request logging

### New Features

- **AI Help Chat**: Interactive chat widget with contextual responses
- **Secure File Upload**: Image upload with type validation and size limits
- **Enhanced Error Handling**: Detailed error messages with user-friendly feedback
- **Comprehensive JSDoc**: Full API documentation with examples and type information
- **Visual Upload Feedback**: Real-time upload status indicators

### UI/UX Improvements

- Dual-mode help chat (Quick Links + AI Assistant)
- Smart AI responses for common support questions
- Upload progress indicators and error feedback
- Responsive design with accessibility support
- Enhanced admin dashboard with file management

Note: For local demo/testing, the very first account you register is granted the `admin` role; subsequent accounts are `user`.

---

## ⚙️ Setup

### Prerequisites

- Node.js (>=18)
- pnpm or npm
- Firebase project + service account (for Firestore)
- fireStore storage for pictures 

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
UPLOAD_MAX_MB=5
CORS_ORIGIN=http://localhost:5173
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

### Additional Commands

```bash
# Generate JSDoc documentation
pnpm run docs

# Serve documentation
pnpm run docs:serve

# Type checking
pnpm run typecheck

# Formatting
pnpm run format

# Testing
pnpm run test
```

---

## 🤖 AI Help Chat

The application includes an intelligent help chat system with:

- **Dual Interface**: Quick navigation links and AI-powered chat
- **Smart Responses**: Contextual answers for common questions
- **Quick Suggestions**: Pre-defined helpful prompts
- **Error Recovery**: Fallback to human support for complex queries

See [`docs/HELP_CHAT.md`](./docs/HELP_CHAT.md) for detailed documentation.

---

## � File Upload System

Secure image upload functionality with:

- **Type Validation**: Only allows image formats (PNG, JPEG, WebP, etc.)
- **Size Limits**: Configurable maximum file size (default: 5MB)
- **Security**: Filename sanitization and secure storage
- **User Feedback**: Real-time upload progress and error handling

Supported formats: PNG, JPEG, JPG, WebP, GIF, HEIC, HEIF, AVIF

---

## 🧪 Testing

### Frontend

```bash
cd client
pnpm run test
```

### Backend

```bash
cd server
pnpm run test
```

Integration tests include file upload, authentication flow, and CRUD operations.

---

## 📚 Documentation

### API Documentation

- Generated JSDoc: `pnpm run docs` then open `docs/jsdoc/index.html`
- Comprehensive function documentation with examples
- Type definitions and interface documentation

### Project Documentation

- [`docs/ASSESSMENT.md`](./docs/ASSESSMENT.md) – Q&A answers, standards, scaling notes
- [`docs/API_REFERENCE.md`](./docs/API_REFERENCE.md) – endpoint definitions
- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) – diagrams, flowcharts, data hierarchy
- [`docs/HELP_CHAT.md`](./docs/HELP_CHAT.md) – AI help chat system documentation
- [`docs/screenshots/`](./docs/screenshots/) - evidence images

### Code Documentation

All major functions and components include comprehensive JSDoc with:

- Parameter descriptions and types
- Return value documentation
- Usage examples
- Error handling information
- Security considerations

---

## 📦 Deployment

For production:

```bash
# Build server
cd server
pnpm run build
node dist/index.js

# Build client
cd client
pnpm run build
# Deploy dist/ folder to static hosting
```

Deploy frontend separately (e.g., Vercel, Netlify) with `VITE_API_URL` pointing to backend.

### Environment Variables for Production

Ensure these are set:

- `NODE_ENV=production`
- `CORS_ORIGIN=https://yourdomain.com`
- `UPLOAD_MAX_MB=10` (or your preferred limit)

---

## 👩‍💻 Authors

- Sofia's student project (Diploma of IT – Advanced Programming)
---

## 📝 License

MIT – free to use and adapt.
