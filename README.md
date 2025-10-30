# Sofia's Shop - Full-Stack E-Commerce Portfolio

A production-grade full-stack TypeScript e-commerce platform built with **React + Vite (frontend)** and **Express + Firestore (backend)**. This comprehensive portfolio application demonstrates modern web development practices, secure authentication, real-time features, AI integration, and enterprise-level architecture.

---

## 🚀 Tech Stack

### Frontend Technologies

- **React 19** with **TypeScript** - Type-safe UI development
- **Vite** - Lightning-fast build tool and dev server
- **React Router 7** - Client-side routing with nested layouts
- **React Hook Form** - Performant form handling
- **Zod** - Runtime type validation
- **Jotai** - Atomic state management for cart
- **Axios** - HTTP client with JWT interceptors
- **Vanilla Extract** - Type-safe CSS-in-TypeScript styling
- **Framer Motion** - Smooth animations and transitions
- **Vitest + Testing Library** - Modern testing framework

### Backend Technologies

- **Express 5** with **TypeScript** - RESTful API server
- **Firebase Admin SDK** - Firestore NoSQL database
- **JWT** - Secure token-based authentication
- **bcrypt** - Password hashing and security
- **Cloudinary** - Cloud-based image storage and optimization
- **Joi + Zod** - Request validation schemas
- **Winston** - Advanced logging and monitoring
- **Helmet** - Security headers middleware
- **Morgan** - HTTP request logging
- **express-fileupload** - Multipart file upload handling
- **Vitest** - Fast unit and integration testing

### Development Tools

- **Biome** - Fast linter and formatter (Prettier/ESLint alternative)
- **TypeScript 5.9** - Static type checking
- **Yarn Workspaces** - Monorepo dependency management
- **Concurrently** - Parallel script execution
- **JSDoc** - Automated API documentation generation
- **Nodemon** - Auto-restart development server

---

## 📂 Project Structure

```txt
sswp-portfolio-at2/
├─ client/                  # React Frontend Application
│  ├─ src/
│  │  ├─ app/              # App configuration & theme
│  │  │  ├─ routes.tsx     # Route definitions
│  │  │  ├─ theme.css.ts   # Design system tokens
│  │  │  └─ sprinkles.css.ts  # Utility CSS classes
│  │  │
│  │  ├─ pages/            # Page components
│  │  │  ├─ Home.tsx       # Landing page
│  │  │  ├─ Products.tsx   # Product listing with filters
│  │  │  ├─ ProductShow.tsx # Product detail page
│  │  │  ├─ ProductCreate.tsx # Create new product
│  │  │  ├─ ProductEdit.tsx   # Edit existing product
│  │  │  ├─ Orders.tsx        # User order history
│  │  │  ├─ OrderDetail.tsx   # Order details page
│  │  │  ├─ Checkout.tsx      # Checkout flow
│  │  │  ├─ Login.tsx         # Login page
│  │  │  ├─ Register.tsx      # Registration page
│  │  │  ├─ About.tsx         # About page
│  │  │  ├─ Contact.tsx       # Contact page
│  │  │  ├─ Admin.tsx         # Admin dashboard entry
│  │  │  ├─ admin/
│  │  │  │  ├─ Overview.tsx   # Admin stats dashboard
│  │  │  │  ├─ Products.tsx   # Product management
│  │  │  │  ├─ Orders.tsx     # Order management
│  │  │  │  └─ Users.tsx      # User management
│  │  │  ├─ NotFound.tsx      # 404 page
│  │  │  └─ Unauthorized.tsx  # 403 page
│  │  │
│  │  ├─ features/         # Feature modules
│  │  │  ├─ auth/          # Authentication
│  │  │  │  ├─ AuthProvider.tsx   # Auth context
│  │  │  │  └─ RequireAuth.tsx    # Route guards
│  │  │  └─ cart/          # Shopping cart
│  │  │     └─ cartAtoms.ts       # Cart state management
│  │  │
│  │  ├─ components/       # Reusable components
│  │  │  ├─ layout/
│  │  │  │  ├─ Navbar.tsx         # Navigation header
│  │  │  │  ├─ Footer.tsx         # Site footer
│  │  │  │  ├─ HelpChat.tsx       # AI-powered help widget
│  │  │  │  ├─ ThemeToggle.tsx    # Dark/light mode toggle
│  │  │  │  └─ ConnectionStatus.tsx # Network status indicator
│  │  │  ├─ ui/
│  │  │  │  ├─ Button.tsx         # Styled button component
│  │  │  │  ├─ Cart.tsx           # Shopping cart drawer
│  │  │  │  ├─ Modal.tsx          # Modal dialog
│  │  │  │  ├─ ImageUploader.tsx  # Image upload component
│  │  │  │  ├─ ErrorAlert.tsx     # Error display
│  │  │  │  ├─ Skeleton.tsx       # Loading skeletons
│  │  │  │  ├─ ToastContainer.tsx # Toast notifications
│  │  │  │  └─ VirtualList.tsx    # Virtualized lists
│  │  │  ├─ forms/
│  │  │  │  ├─ FormField.tsx      # Form input wrapper
│  │  │  │  └─ FormActions.tsx    # Form button group
│  │  │  ├─ charts/
│  │  │  │  └─ MiniArea.tsx       # Chart component
│  │  │  └─ errors/
│  │  │     └─ FeatureErrorBoundary.tsx # Error boundaries
│  │  │
│  │  ├─ api/              # API client layer
│  │  │  ├─ clients/
│  │  │  │  ├─ auth.api.ts        # Auth endpoints
│  │  │  │  ├─ products.api.ts    # Product endpoints
│  │  │  │  ├─ orders.api.ts      # Order endpoints
│  │  │  │  ├─ admin.api.ts       # Admin endpoints
│  │  │  │  └─ health.api.ts      # Health check
│  │  │  └─ dto/                  # Data transfer objects
│  │  │
│  │  ├─ lib/              # Utility libraries
│  │  │  ├─ axios.ts              # Configured axios instance
│  │  │  ├─ query.ts              # React Query setup
│  │  │  ├─ toast.ts              # Toast notifications
│  │  │  ├─ images.ts             # Image utilities
│  │  │  └─ hooks/                # Custom React hooks
│  │  │
│  │  └─ test/             # Test setup and utilities
│
├─ server/                 # Express Backend Application
│  ├─ src/
│  │  ├─ api/              # API layer
│  │  │  ├─ routes/        # Route definitions
│  │  │  │  ├─ auth.routes.ts     # Authentication routes
│  │  │  │  ├─ products.routes.ts # Product CRUD routes
│  │  │  │  ├─ orders.routes.ts   # Order management routes
│  │  │  │  ├─ admin.routes.ts    # Admin-only routes
│  │  │  │  ├─ uploads.routes.ts  # File upload routes
│  │  │  │  ├─ health.routes.ts   # Health check endpoint
│  │  │  │  └─ maintenance.routes.ts # Maintenance tasks
│  │  │  │
│  │  │  ├─ controllers/   # Request handlers
│  │  │  │  ├─ auth.controller.ts
│  │  │  │  ├─ products.controller.ts
│  │  │  │  ├─ order.controller.ts
│  │  │  │  └─ admin.controller.ts
│  │  │  │
│  │  │  ├─ middleware/    # Express middleware
│  │  │  │  ├─ auth.ts            # JWT authentication
│  │  │  │  ├─ validate.ts        # Request validation
│  │  │  │  ├─ validation.ts      # Zod validation
│  │  │  │  ├─ error.ts           # Error handling
│  │  │  │  ├─ rateLimit.ts       # Rate limiting
│  │  │  │  ├─ correlationId.ts   # Request tracing
│  │  │  │  └─ maintenanceAuth.ts # Maintenance mode
│  │  │  │
│  │  │  └─ validators/    # Validation schemas
│  │  │     ├─ auth.schema.ts
│  │  │     ├─ products.schema.ts
│  │  │     └─ order.validators.ts
│  │  │
│  │  ├─ services/         # Business logic layer
│  │  │  ├─ auth.service.ts       # Authentication logic
│  │  │  ├─ products.service.ts   # Product business logic
│  │  │  ├─ order.service.ts      # Order processing
│  │  │  ├─ cloudinary.service.ts # Image upload service
│  │  │  ├─ email.service.ts      # Email notifications
│  │  │  ├─ tokenRevocation.service.ts # Token blacklist
│  │  │  ├─ order.events.ts       # Order event handlers
│  │  │  └─ email/                # Email providers
│  │  │     ├─ EmailProvider.interface.ts
│  │  │     ├─ ConsoleEmailProvider.ts
│  │  │     └─ SendGridEmailProvider.ts
│  │  │
│  │  ├─ data/             # Data access layer
│  │  │  ├─ ports/         # Repository interfaces
│  │  │  ├─ firestore/     # Firestore implementations
│  │  │  │  ├─ FirestoreUserRepository.ts
│  │  │  │  ├─ FirestoreProductRepository.ts
│  │  │  │  └─ FirestoreOrderRepository.ts
│  │  │  ├─ memory/        # In-memory implementations
│  │  │  │  ├─ users.repo.mem.ts
│  │  │  │  ├─ products.repo.mem.ts
│  │  │  │  └─ orders.repo.mem.ts
│  │  │  └─ adapters/      # Data adapters
│  │  │
│  │  ├─ domain/           # Domain models and types
│  │  │  ├─ user.ts        # User entity
│  │  │  ├─ product.ts     # Product entity
│  │  │  └─ orders.ts      # Order entity
│  │  │
│  │  ├─ config/           # Configuration
│  │  │  ├─ env.ts         # Environment variables
│  │  │  └─ firestore.ts   # Firestore setup
│  │  │
│  │  ├─ utils/            # Utility functions
│  │  │  ├─ crypto.ts      # Encryption utilities
│  │  │  ├─ fileValidation.ts # File type validation
│  │  │  ├─ logger.ts      # Winston logger setup
│  │  │  ├─ monitoring.ts  # Application monitoring
│  │  │  └─ securityLogger.ts # Security event logging
│  │  │
│  │  ├─ app.ts            # Express app setup
│  │  └─ index.ts          # Server entry point
│  │
│  └─ test/                # Backend tests
│
├─ docs/                   # Project documentation
│  ├─ jsdoc/              # Generated API docs
│  ├─ screenshots/        # Evidence and screenshots
│  ├─ ASSESSMENT.md       # Assessment criteria answers
│  ├─ API_REFERENCE.md    # API documentation
│  ├─ ARCHITECTURE.md     # System architecture
│  └─ HELP_CHAT.md        # Help chat documentation
│
└─ scripts/               # Utility scripts
   ├─ seed.ts            # Database seeding
   └─ healthcheck.ts     # Health check script
```

---

## ✨ Complete Feature List

### 🔐 Authentication & Authorization

#### User Authentication
- **User Registration** - Create new user accounts with email/password
- **User Login** - JWT-based authentication with secure tokens
- **Password Reset Flow** - Request and reset password via email
  - Token-based password reset with expiration
  - Rate-limited reset requests (prevents abuse)
  - Email notifications for password changes
- **Token Revocation** - Logout functionality with token blacklist
- **Auto-Token Refresh** - Seamless token renewal on expiration
- **Remember Me** - Persistent login sessions

#### Role-Based Access Control (RBAC)
- **User Roles** - `user` and `admin` role system
- **Admin Dashboard** - Full administrative interface
- **Protected Routes** - Frontend route guards (`RequireAuth`)
- **Protected Endpoints** - Backend middleware authorization
- **First User Admin** - First registered user becomes admin automatically
- **Role Promotion/Demotion** - Admin can change user roles

#### Security Features
- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt with salt rounds
- **Security Headers** - Helmet.js for HTTP security
- **CORS Protection** - Configurable origin whitelist
- **Rate Limiting** - Multiple rate limit tiers:
  - Auth endpoints: 5 requests/15 min
  - API endpoints: 100 requests/15 min
  - Upload endpoints: 5 requests/5 min
  - Admin endpoints: Custom limits
- **Request Correlation IDs** - Request tracing for debugging
- **Security Logging** - Audit trail for security events

---

### 🛍️ Product Management

#### Product Features
- **Product Listing** - Browse all products with pagination
- **Product Detail View** - Detailed product information page
- **Product Search** - Search products by name and description
- **Product Filtering** - Filter by category, price range, stock status
- **Product Sorting** - Sort by price, name, date added, popularity
- **Category System** - Organize products into categories
- **Stock Management** - Track inventory levels
- **Product Images** - Cloudinary-hosted product images
- **Image Upload** - Secure image upload for products
- **Product Variants** - Support for product variations
- **Product Reviews** - (Framework in place)

#### Admin Product Management
- **Create Products** - Admin form to add new products
- **Edit Products** - Update existing product details
- **Delete Products** - Remove products (admin only)
- **Bulk Operations** - Batch product updates
- **Product Statistics** - View product performance metrics
- **Image Management** - Upload and manage product images
- **Stock Alerts** - Low stock notifications
- **Product Time Series** - Historical product data

---

### 🛒 Shopping Cart & Orders

#### Shopping Cart Features
- **Add to Cart** - Add products with quantity selection
- **Cart Persistence** - Cart saved in local state (Jotai)
- **Update Quantity** - Adjust item quantities
- **Remove Items** - Delete items from cart
- **Clear Cart** - Empty entire cart
- **Cart Summary** - Real-time subtotal, tax, shipping calculation
- **Cart Badge** - Visual indicator showing item count
- **Cart Drawer** - Slide-out cart panel
- **Keyboard Navigation** - Full keyboard accessibility
- **Focus Management** - Proper focus trapping in cart modal

#### Order Management
- **Place Orders** - Convert cart to order with validation
- **Order History** - View all past orders
- **Order Details** - Detailed order information page
- **Order Status Tracking** - Track order fulfillment stages:
  - Pending
  - Processing
  - Shipped
  - Delivered
  - Cancelled
- **Cancel Orders** - User can cancel pending orders
- **Order Search** - Search orders by ID, status, date
- **Order Filtering** - Filter by status, date range
- **Order Statistics** - Admin view of order metrics
- **Order Notifications** - Email confirmations (ready for SendGrid)
- **Order Events** - Event-driven order processing

#### Admin Order Management
- **View All Orders** - Admin dashboard for all orders
- **Update Order Status** - Change order status
- **Order Details Admin View** - Full order information
- **Delete Orders** - Remove orders (admin only)
- **Order Analytics** - Revenue, conversion metrics
- **Export Orders** - (Framework ready)

---

### 📊 Admin Dashboard

#### Overview & Analytics
- **Dashboard Home** - Key metrics at a glance
- **Sales Statistics** - Revenue, order count, average order value
- **User Statistics** - Total users, new registrations, active users
- **Product Statistics** - Total products, low stock alerts, top sellers
- **Charts & Graphs** - Visual data representation with MiniArea charts
- **Time Series Data** - Historical trend analysis
- **Real-time Updates** - Live data refresh

#### User Management
- **List Users** - View all registered users
- **View User Details** - Detailed user information
- **Promote Users** - Grant admin privileges
- **Demote Users** - Revoke admin privileges
- **Delete Users** - Remove user accounts
- **User Activity** - Track user actions (logging ready)

#### Content Management
- **Product CRUD** - Create, read, update, delete products
- **Order Management** - View and update all orders
- **Image Library** - Manage uploaded images
- **Maintenance Mode** - Toggle site maintenance
- **Data Cleanup** - Manual cleanup utilities

---

### 📤 File Upload System

#### Upload Features
- **Image Upload** - Cloudinary integration for image storage
- **File Type Validation** - Strict MIME type checking:
  - PNG, JPEG, JPG, WebP, GIF
  - HEIC, HEIF, AVIF support
- **File Size Limits** - Configurable max file size (default: 5MB)
- **Content Validation** - Magic number verification
- **Filename Sanitization** - Safe filename handling
- **Multi-file Upload** - Upload multiple images at once
- **Upload Progress** - Visual progress indicators
- **Error Handling** - User-friendly error messages
- **Drag & Drop** - (UI framework ready)
- **Image Preview** - Preview before upload
- **Cloud Storage** - Cloudinary CDN delivery
- **Image Optimization** - Automatic image optimization

---

### 💬 AI Help Chat System

#### Chat Features
- **Dual Mode Interface** - Switch between Quick Links and AI Help
- **AI Responses** - Pattern-matching conversational AI
- **Quick Links** - Navigate to key pages instantly
- **Quick Actions** - Call or email support directly
- **Contextual Help** - Smart responses based on user questions
- **Suggested Questions** - Pre-defined helpful prompts
- **Chat History** - Conversation persistence during session
- **Typing Indicators** - Shows when AI is "thinking"
- **Auto-scroll** - Automatically scroll to latest message
- **Keyboard Support** - Enter to send, Escape to close

#### Help Topics Covered
- Product information and browsing
- Return and refund policy
- Contact and support information
- Order tracking
- Product categories
- General inquiries with fallback to human support

---

### 🎨 UI/UX Features

#### Design System
- **Vanilla Extract Styling** - Type-safe CSS-in-TypeScript
- **Design Tokens** - Consistent theme variables
- **Sprinkles Utility Classes** - Atomic CSS utilities
- **Dark Mode** - Toggle between light/dark themes
- **Theme Persistence** - Save theme preference
- **Responsive Design** - Mobile-first responsive layouts
- **Custom Color Palette** - Brand-specific colors

#### Components & Interactions
- **Loading States** - Skeleton loaders for async content
- **Error Boundaries** - Graceful error handling
- **Toast Notifications** - Non-intrusive user feedback
- **Modal Dialogs** - Accessible modal components
- **Smooth Animations** - Framer Motion transitions
- **Virtual Scrolling** - Efficient rendering of long lists
- **Lazy Loading** - Performance-optimized component loading
- **Connection Status** - Network connectivity indicator
- **Form Validation** - Real-time validation feedback
- **Custom Error Pages** - 404 and 403 pages

#### Accessibility (A11y)
- **ARIA Labels** - Comprehensive screen reader support
- **Keyboard Navigation** - Full keyboard accessibility
- **Focus Management** - Proper focus trapping and restoration
- **Color Contrast** - WCAG AA compliant
- **Semantic HTML** - Proper HTML structure
- **Skip Links** - Skip to main content
- **Alt Text** - Image descriptions
- **Form Labels** - Associated labels for inputs

---

### 🗄️ Database & Data Management

#### Firestore Integration
- **NoSQL Database** - Google Cloud Firestore
- **Composite Indexes** - Optimized queries with indexes
- **Real-time Updates** - (Framework ready for subscriptions)
- **Batch Operations** - Efficient bulk writes
- **Transactions** - ACID transaction support
- **Data Validation** - Schema validation on write
- **TTL Collections** - Auto-expiring documents
- **Pagination Support** - Cursor-based pagination

#### Repository Pattern
- **Abstraction Layer** - Swappable data stores
- **Firestore Repositories** - Production implementations
- **In-Memory Repositories** - Testing implementations
- **Port/Adapter Pattern** - Clean architecture
- **Type-safe Queries** - TypeScript query builders

#### Data Models
- **User Entity** - User accounts with roles
- **Product Entity** - Product catalog items
- **Order Entity** - Customer orders with line items
- **Password Reset Tokens** - Temporary reset tokens
- **Token Revocations** - JWT blacklist
- **Logs** - Application and security logs

---

### 📧 Email & Notifications

#### Email Service
- **Email Provider Interface** - Pluggable email providers
- **Console Email Provider** - Development/testing email output
- **SendGrid Integration** - Production email delivery (ready)
- **Password Reset Emails** - Automated reset links
- **Order Confirmation Emails** - Order placed notifications
- **Status Update Emails** - Order status change notifications
- **Welcome Emails** - New user registration (ready)
- **Email Templates** - HTML email formatting (ready)

---

### 🛠️ Developer Experience

#### Code Quality
- **TypeScript** - Full type safety across stack
- **Biome** - Fast linting and formatting
- **ESLint Rules** - Code quality enforcement
- **Prettier Formatting** - Consistent code style
- **Git Hooks** - Pre-commit quality checks (ready)
- **Comprehensive JSDoc** - Inline documentation with examples
- **Type Definitions** - Shared types between frontend/backend

#### Testing
- **Vitest** - Fast unit test runner
- **Testing Library** - React component testing
- **Supertest** - HTTP integration testing
- **Mock Adapters** - Axios mock testing
- **Test Coverage** - Coverage reporting
- **Integration Tests** - End-to-end API tests
- **Unit Tests** - Isolated function tests

#### Documentation
- **Generated API Docs** - JSDoc to HTML documentation
- **Architecture Diagrams** - System design documentation
- **API Reference** - Complete endpoint documentation
- **Setup Guides** - Detailed setup instructions
- **Testing Guide** - Comprehensive testing documentation
- **Quick Reference** - Developer quick-start guide
- **Accessibility Guide** - A11y best practices

#### Development Tools
- **Hot Module Replacement** - Instant frontend updates
- **Auto-restart Server** - Nodemon for backend changes
- **Concurrent Dev Server** - Run frontend + backend simultaneously
- **TypeScript Watch** - Real-time type checking
- **Source Maps** - Debug original TypeScript
- **Environment Variables** - `.env` configuration
- **Development Scripts** - Convenient npm scripts

---

### 🔧 DevOps & Infrastructure

#### Monitoring & Logging
- **Winston Logger** - Structured application logging
- **Security Logger** - Audit trail for security events
- **Request Logging** - HTTP request/response logs
- **Error Tracking** - Centralized error logging
- **Log Rotation** - Automatic log file rotation
- **Log Levels** - Configurable log verbosity
- **Correlation IDs** - Request tracing across services

#### Performance
- **Rate Limiting** - DDoS protection
- **Request Throttling** - Prevent API abuse
- **Caching Headers** - Browser cache optimization
- **CDN Delivery** - Cloudinary CDN for images
- **Gzip Compression** - Response compression
- **Database Indexing** - Optimized query performance

#### Maintenance
- **Maintenance Mode** - Graceful site downtime
- **Database Cleanup** - Remove expired records:
  - Expired password reset tokens
  - Expired token revocations
  - Old log entries
- **Health Check Endpoint** - `/health` API status
- **Smoke Tests** - Basic functionality validation

---

### 🚀 Deployment Ready

#### Production Features
- **Environment Configuration** - Separate dev/prod configs
- **Build Scripts** - Optimized production builds
- **Static Asset Hosting** - Vercel/Netlify ready
- **API Hosting** - VPS/cloud platform ready
- **Database Scaling** - Firestore auto-scaling
- **Error Monitoring** - Integration-ready for Sentry
- **Analytics** - Framework for Google Analytics
- **SSL/HTTPS** - Security-first deployment

#### Configuration
- **Environment Variables** - Comprehensive `.env` setup
- **CORS Configuration** - Production origin whitelist
- **JWT Secrets** - Secure token signing
- **Firebase Credentials** - Service account setup
- **Cloudinary Config** - Image storage credentials
- **Email Provider Config** - SendGrid API keys

---

### 📦 Additional Features

#### Content Pages
- **Home Page** - Landing page with featured products
- **About Page** - Company information and story
- **Contact Page** - Contact form and support information
- **404 Page** - Custom not found page
- **Unauthorized Page** - Custom 403 access denied page

#### Utilities
- **Custom Hooks** - Reusable React hooks:
  - `useDebounce` - Debounced values
  - `useLocalStorage` - Persistent local storage
  - `useMediaQuery` - Responsive breakpoints
  - `useOnClickOutside` - Click outside detection
- **Form Helpers** - React Hook Form utilities
- **API Clients** - Typed API service layer
- **Error Handling** - Global error boundaries
- **Image Utilities** - Image URL helpers

---

Note: The first user to register automatically receives the `admin` role for easy local testing.

---

## ⚙️ Setup & Installation

### Prerequisites

- **Node.js** >= 18.x (LTS recommended)
- **Yarn** >= 1.22 (package manager)
- **Firebase Project** - Google Cloud Firestore database
  - Create project at [Firebase Console](https://console.firebase.google.com/)
  - Enable Firestore Database
  - Generate service account credentials
- **Cloudinary Account** - Image hosting and CDN
  - Sign up at [Cloudinary](https://cloudinary.com/)
  - Get API credentials from dashboard

### Clone Repository

```bash
git clone https://github.com/yourusername/sswp-portfolio-at2.git
cd sswp-portfolio-at2
```

### Install Dependencies

This project uses **Yarn Workspaces** for monorepo management:

```bash
# Install all dependencies for client + server
yarn install
```

### Environment Configuration

#### Client Environment (client/.env)

Create `client/.env`:

```bash
# API Base URL
VITE_API_URL=http://localhost:4000/api/v1
```

#### Server Environment (server/.env)

Create `server/.env` with the following variables:

```bash
# Server Configuration
PORT=4000
NODE_ENV=development

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=15m

# Database
DATA_STORE=firestore  # Options: firestore | memory

# CORS
CORS_ORIGIN=http://localhost:5173

# File Upload
UPLOAD_MAX_MB=5

# Password Reset
PASSWORD_RESET_TTL_MINUTES=60
PASSWORD_RESET_RATE_LIMIT_MINUTES=5

# Logging
LOG_TO_FILE=true
LOG_DIR=logs
LOG_FILE=app.log
LOG_LEVEL=debug
LOG_MAX_SIZE=5242880
LOG_MAX_FILES=5

# Firebase / Firestore
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n"

# Cloudinary (Image Upload)
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
CLOUDINARY_UPLOAD_FOLDER=portfolio-assets

# Optional: Maintenance Mode
# MAINTENANCE_SECRET=change-me-in-production
```

**Important Notes:**
- Replace all placeholder values with your actual credentials
- Never commit `.env` files to version control
- Keep `JWT_SECRET` secure and random (use at least 32 characters)
- For Firestore private key, ensure proper newline escaping (`\n`)

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Enable **Firestore Database** in Native mode
4. Create a **Service Account**:
   - Go to Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Save the JSON file securely
5. Copy credentials to `.env` file
6. Set up Firestore indexes (see `firestore.indexes.json`)

### Cloudinary Setup

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Go to Dashboard
3. Copy your **Cloud Name**, **API Key**, and **API Secret**
4. Format as: `cloudinary://API_KEY:API_SECRET@CLOUD_NAME`
5. Add to `server/.env` as `CLOUDINARY_URL`

---

## ▶️ Running the Application

### Development Mode

Start both frontend and backend concurrently:

```bash
# From project root
yarn dev
```

This runs:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:4000/api/v1
- **Hot reload** enabled for both

### Run Individually

```bash
# Frontend only
yarn dev:client

# Backend only
yarn dev:server
```

### Production Build

```bash
# Build both frontend and backend
yarn build

# Or build individually
cd client && yarn build
cd server && yarn build
```

---

## 🧰 Available Scripts

### Root Level Commands

```bash
# Development
yarn dev              # Run client + server concurrently
yarn dev:client       # Run frontend only
yarn dev:server       # Run backend only

# Code Quality
yarn format           # Format code with Biome
yarn format:check     # Check formatting without changes
yarn lint             # Lint all code
yarn lint:fix         # Auto-fix linting issues
yarn check            # Format + lint in one command

# Type Checking
yarn typecheck        # Type check all workspaces

# Testing
yarn test             # Run all tests (client + server)

# Building
yarn build            # Build all workspaces for production

# Documentation
yarn docs             # Generate JSDoc documentation
yarn docs:serve       # Generate docs + serve on port 8080

# Cleanup
yarn clean            # Remove all node_modules and build files
```

### Client-Specific Commands

```bash
cd client

yarn dev              # Start dev server
yarn build            # Production build
yarn preview          # Preview production build
yarn test             # Run frontend tests
yarn typecheck        # Type check TypeScript
yarn lint             # Lint frontend code
yarn format           # Format frontend code
```

### Server-Specific Commands

```bash
cd server

yarn dev              # Start dev server with nodemon
yarn build            # Compile TypeScript to JavaScript
yarn start            # Run production build
yarn test             # Run backend tests
yarn seed             # Seed database with sample data
yarn typecheck        # Type check TypeScript
yarn lint             # Lint backend code
yarn format           # Format backend code
```

---

## 🧪 Testing

### Run All Tests

```bash
# From project root
yarn test
```

### Frontend Tests

```bash
cd client
yarn test             # Run all tests
yarn test --watch     # Watch mode
yarn test --coverage  # With coverage report
```

Test coverage includes:
- Component rendering tests
- Custom hook tests
- API client tests
- Utility function tests
- Error boundary tests

### Backend Tests

```bash
cd server
yarn test             # Run all tests
yarn test --watch     # Watch mode
yarn test --coverage  # With coverage report
```

Test coverage includes:
- Unit tests for services
- Integration tests for API endpoints
- Middleware tests
- Repository tests
- Validation tests

See [TESTING.md](./TESTING.md) for comprehensive testing documentation.

---

## 🤖 AI Help Chat

The application includes an intelligent help chat widget powered by pattern-matching AI:

### Features
- **Dual Interface**: Switch between Quick Navigation and AI Chat modes
- **Smart Responses**: Contextual answers for common support questions
- **Quick Actions**: Direct call/email links to support
- **Quick Suggestions**: Pre-defined helpful question prompts
- **Conversation History**: Messages persist during session
- **Typing Indicators**: Natural conversation feel
- **Keyboard Support**: Full keyboard navigation (Enter to send, Escape to close)
- **Accessibility**: ARIA labels and screen reader support

### Supported Topics
- Product information and browsing help
- Return and refund policy questions
- Contact and support information
- Order tracking inquiries
- Product category explanations
- General inquiries with fallback to human support

See [HELP_CHAT.md](./docs/HELP_CHAT.md) for detailed implementation documentation.

---

## 📤 File Upload System

Secure, production-ready image upload system integrated with Cloudinary CDN:

### Features
- **Cloud Storage**: Cloudinary integration for scalable image hosting
- **Type Validation**: Strict MIME type checking and magic number verification
- **Size Limits**: Configurable maximum file size (default: 5MB)
- **Security**: Filename sanitization, content validation, rate limiting
- **Multi-file Upload**: Upload multiple images simultaneously
- **User Feedback**: Real-time progress indicators and error messages
- **CDN Delivery**: Fast global image delivery via Cloudinary CDN
- **Automatic Optimization**: Image compression and format conversion

### Supported Formats
PNG, JPEG, JPG, WebP, GIF, HEIC, HEIF, AVIF

### Security Features
- Rate limiting (5 uploads per 5 minutes)
- File size validation
- MIME type verification
- Magic number content validation
- Filename sanitization
- Authenticated uploads only

---

## 📚 Documentation

### API Documentation

Generate comprehensive API documentation with JSDoc:

```bash
# Generate documentation
yarn docs

# Generate and serve documentation
yarn docs:serve
```

Then open http://localhost:8080 to browse the generated documentation.

The documentation includes:
- **Function signatures** with parameter types
- **Return value documentation**
- **Usage examples** with code snippets
- **Error handling** information
- **Security considerations**
- **Type definitions** and interfaces

### Project Documentation

Comprehensive documentation is available in the `docs/` directory:

- **[SETUP.md](./SETUP.md)** - Detailed setup and configuration guide
- **[YARN_SETUP.md](./YARN_SETUP.md)** - Yarn workspace setup instructions
- **[TESTING.md](./TESTING.md)** - Complete testing guide and best practices
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Developer quick reference
- **[ACCESSIBILITY.md](./ACCESSIBILITY.md)** - Accessibility guidelines and A11y features
- **[API_REFERENCE.md](./docs/API_REFERENCE.md)** - Complete API endpoint documentation
- **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - System architecture and design patterns
- **[ASSESSMENT.md](./docs/ASSESSMENT.md)** - Assessment criteria and answers
- **[HELP_CHAT.md](./docs/HELP_CHAT.md)** - AI help chat implementation details
- **[screenshots/](./docs/screenshots/)** - Application screenshots and evidence

### Code Documentation Standards

All major functions, components, and services include comprehensive JSDoc documentation:

- ✅ Parameter descriptions with types
- ✅ Return value documentation
- ✅ Usage examples with code blocks
- ✅ Error handling information
- ✅ Security considerations
- ✅ Related function references
- ✅ @example, @param, @returns tags
- ✅ TypeScript type definitions

---

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)

**Recommended: Vercel or Netlify for zero-config deployment**

#### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Build and deploy
cd client
yarn build
vercel --prod
```

**Vercel Configuration** (`client/vercel.json`):
```json
{
  "buildCommand": "yarn build",
  "outputDirectory": "dist",
  "devCommand": "yarn dev",
  "framework": "vite"
}
```

#### Netlify Deployment

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
cd client
yarn build
netlify deploy --prod --dir=dist
```

**Netlify Configuration** (`client/netlify.toml`):
```toml
[build]
  command = "yarn build"
  publish = "dist"
```

#### Environment Variables (Frontend)

Set in your hosting platform dashboard:
```bash
VITE_API_URL=https://your-backend-domain.com/api/v1
```

---

### Backend Deployment (VPS/Cloud Platform)

**Recommended: Railway, Render, DigitalOcean, or AWS**

#### Option 1: Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

#### Option 2: Docker Deployment

Create `server/Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --production
COPY dist ./dist
EXPOSE 4000
CMD ["node", "dist/index.js"]
```

Build and deploy:
```bash
cd server
yarn build
docker build -t sofia-shop-api .
docker run -p 4000:4000 --env-file .env sofia-shop-api
```

#### Option 3: Traditional VPS (Ubuntu)

```bash
# SSH into your server
ssh user@your-server-ip

# Install Node.js and dependencies
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and setup
git clone your-repo
cd sswp-portfolio-at2/server
yarn install
yarn build

# Setup PM2 for process management
npm install -g pm2
pm2 start dist/index.js --name sofia-shop-api
pm2 save
pm2 startup
```

#### Environment Variables (Backend)

**Critical Production Variables:**

```bash
NODE_ENV=production
PORT=4000

# Security (CHANGE THESE!)
JWT_SECRET=<generate-secure-random-string-min-32-chars>
CORS_ORIGIN=https://your-frontend-domain.com

# Database
DATA_STORE=firestore
FIREBASE_PROJECT_ID=your-project
FIREBASE_CLIENT_EMAIL=your-service-account@...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Image Upload
CLOUDINARY_URL=cloudinary://key:secret@cloud
CLOUDINARY_UPLOAD_FOLDER=production-assets
UPLOAD_MAX_MB=10

# Logging
LOG_LEVEL=info
LOG_TO_FILE=true

# Email (if using SendGrid)
SENDGRID_API_KEY=your-sendgrid-key
EMAIL_FROM=noreply@yourdomain.com
```

---

### Production Checklist

#### Security
- ✅ Set strong `JWT_SECRET` (min 32 random characters)
- ✅ Configure `CORS_ORIGIN` to your frontend domain
- ✅ Enable HTTPS/SSL on both frontend and backend
- ✅ Set `NODE_ENV=production`
- ✅ Secure all API keys and credentials
- ✅ Enable rate limiting (already configured)
- ✅ Review and harden Firestore security rules

#### Performance
- ✅ Enable gzip compression (built-in)
- ✅ Configure CDN for static assets
- ✅ Set up Firestore indexes (see `firestore.indexes.json`)
- ✅ Configure caching headers
- ✅ Monitor application performance

#### Monitoring
- ✅ Set up error tracking (Sentry recommended)
- ✅ Configure log aggregation
- ✅ Set up uptime monitoring
- ✅ Enable health check endpoint (`/health`)
- ✅ Configure alerts for critical errors

#### Database
- ✅ Review Firestore security rules
- ✅ Set up automatic backups
- ✅ Configure TTL policies for temporary data
- ✅ Create required composite indexes
- ✅ Monitor database usage and costs

---

## 🏗️ Architecture & Design Patterns

This application follows industry best practices and clean architecture principles:

### Architecture Patterns
- **Repository Pattern** - Abstraction layer for data access
- **Service Layer** - Business logic separation
- **Dependency Injection** - Loose coupling and testability
- **Port/Adapter Pattern** - Swappable implementations
- **Event-Driven Architecture** - Order event handlers
- **Provider Pattern** - React context for state management

### Code Organization
- **Feature-based Structure** - Organized by business domain
- **Separation of Concerns** - Clear layer boundaries
- **Single Responsibility** - Each module has one job
- **DRY Principle** - Reusable components and utilities
- **Type Safety** - Full TypeScript coverage

See [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for detailed diagrams and explanations.

---

## 🤝 Contributing

This is a portfolio/assessment project. If you'd like to use it as a starting point:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- Follow the existing code style (enforced by Biome)
- Write comprehensive JSDoc comments
- Add tests for new features
- Update documentation as needed
- Ensure TypeScript compiles without errors

---

## 👩‍💻 Author

**Sofia**  
Diploma of IT – Advanced Programming Portfolio Project

This full-stack application demonstrates advanced web development skills including:
- Modern React development with TypeScript
- RESTful API design and implementation
- NoSQL database design and optimization
- Authentication and authorization systems
- Cloud services integration
- Production deployment practices
- Comprehensive testing strategies
- Accessibility best practices
- Security-first development

---

## 📝 License

MIT License - free to use and adapt for educational purposes.

---

## 🙏 Acknowledgments

- **React Team** - For the amazing React framework
- **Vite** - For blazing-fast development experience
- **Firebase** - For scalable NoSQL database
- **Cloudinary** - For reliable image hosting
- **Biome** - For fast, reliable code tooling
- **Open Source Community** - For countless amazing libraries

---

## 📞 Support

For questions, issues, or feedback:

- **Email**: hello@sofias.shop
- **Phone**: +61-3-9876-5432
- **GitHub Issues**: [Create an issue](https://github.com/yourusername/sswp-portfolio-at2/issues)

---

**Built with ❤️ by Sofia | 2024-2025**
