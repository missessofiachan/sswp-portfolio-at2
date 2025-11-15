# Setup Guide - Sofia's Shop Portfolio

This guide will help you set up the development environment for this project.

## Prerequisites

- **Node.js**: v18.x or higher
- **Yarn**: v4.x (automatically managed via Corepack)

## Quick Start

### 1. Enable Corepack (for Yarn)

Corepack is included with Node.js 16.10+ and manages package manager versions:

```bash
# Enable Corepack
corepack enable

# Install the project's specified Yarn version
corepack prepare yarn@4.5.3 --activate
```

### 2. Install Dependencies

```bash
# Install all workspace dependencies
yarn install
```

This will install dependencies for both the client and server workspaces.

### 3. Environment Variables

Create `.env` files in both `client/` and `server/` directories:

**server/.env:**
```env
# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# JWT Expiry (optional, defaults to 7d)
JWT_EXPIRY=7d

# CORS (comma-separated allowed origins)
CORS_ORIGIN=http://localhost:5173,http://localhost:3000

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Upload limits
UPLOAD_MAX_MB=5

# Email (SendGrid)
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@yourapp.com

# Error Monitoring (optional)
SENTRY_DSN=https://your-sentry-dsn

# Maintenance (optional)
MAINTENANCE_SECRET=your-maintenance-secret
```

**client/.env:**
```env
# Preferred: explicitly point to your API origin (includes /api/v1 path)
VITE_API_URL=http://localhost:4000/api/v1

# Legacy fallback supported by older docs (optional)
# VITE_API_BASE_URL=http://localhost:4000/api/v1
```

### 4. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing
3. Enable Firestore Database
4. Generate a service account key:
   - Go to Project Settings > Service Accounts
   - Click "Generate New Private Key"
   - Save the JSON file as `test1-795d3-firebase-adminsdk-fbsvc-f8f926dfa7.json` in the project root
5. Create Firestore indexes (see `firestore.indexes.json`)

### 5. Run Development Servers

```bash
# Run both client and server concurrently
yarn dev

# Or run them separately:
yarn dev:client  # Frontend on http://localhost:5173
yarn dev:server  # Backend on http://localhost:4000
```

## Available Scripts

### Root Level Commands

```bash
# Development
yarn dev              # Run both client and server
yarn dev:client       # Run frontend only
yarn dev:server       # Run backend only

# Code Quality
yarn format           # Format code with Biome
yarn format:check     # Check formatting
yarn lint             # Lint code with Biome
yarn lint:fix         # Lint and auto-fix
yarn check            # Run format + lint with auto-fix

# Testing & Building
yarn typecheck        # Type check all workspaces
yarn test             # Run tests in all workspaces
yarn build            # Build all workspaces

# Cleanup
yarn clean            # Remove all node_modules and build artifacts
```

### Client Commands

```bash
cd client

yarn dev              # Start dev server
yarn build            # Build for production
yarn preview          # Preview production build
yarn typecheck        # Type check
yarn test             # Run tests
yarn clean            # Clean build artifacts
```

### Server Commands

```bash
cd server

yarn dev              # Start dev server with nodemon
yarn build            # Compile TypeScript
yarn start            # Run compiled server
yarn typecheck        # Type check
yarn test             # Run tests
yarn seed             # Seed database
yarn clean            # Clean build artifacts

# Firestore utilities
yarn firestore:list   # List all collections
yarn firestore:clear  # Clear all collections
```

## Code Quality Tools

### Biome

This project uses [Biome](https://biomejs.dev/) for formatting and linting (replaces ESLint + Prettier).

**VS Code Integration:**
1. Install the [Biome extension](https://marketplace.visualstudio.com/items?itemName=biomejs.biome)
2. Settings are already configured in `.vscode/settings.json`
3. Format on save is enabled by default

**CLI Usage:**
```bash
# Format files
yarn format

# Check formatting without writing
yarn format:check

# Lint files
yarn lint

# Lint and fix
yarn lint:fix

# Format + lint + fix in one command
yarn check
```

**Configuration:**
- `biome.json` - Biome configuration
- Rules are optimized for React + TypeScript

## Workspace Structure

```
sswp-portfolio-at2/
├── client/                 # React frontend (Vite)
│   ├── src/
│   ├── public/
│   └── package.json
├── server/                 # Express backend (Node.js)
│   ├── src/
│   └── package.json
├── docs/                   # Documentation
├── scripts/                # Utility scripts
├── .yarn/                  # Yarn installation
├── biome.json             # Biome config
├── .yarnrc.yml            # Yarn config
└── package.json           # Root workspace config
```

## Troubleshooting

### Yarn not found

```bash
# Enable Corepack
corepack enable

# Prepare Yarn
corepack prepare yarn@4.5.3 --activate
```

### Biome errors in VS Code

1. Ensure Biome extension is installed
2. Reload VS Code window
3. Check `.vscode/settings.json` is present
4. Run `yarn install` to ensure Biome is installed

### TypeScript errors

```bash
# Check for errors
yarn typecheck

# Rebuild
yarn clean
yarn install
yarn build
```

### Port already in use

```bash
# Change ports in .env files:
# server/.env: PORT=3002
# client/.env: VITE_PORT=5174
```

### Firebase connection issues

1. Verify service account JSON file exists
2. Check environment variables in `server/.env`
3. Ensure Firestore is enabled in Firebase Console
4. Create required indexes (see `firestore.indexes.json`)

## Additional Resources

- [Yarn Documentation](https://yarnpkg.com/)
- [Biome Documentation](https://biomejs.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)

## Next Steps

1. Review `README.md` for project overview
2. Check `TESTING.md` for testing guidelines
3. Read `ACCESSIBILITY.md` for a11y best practices
4. See `QUICK_REFERENCE.md` for development shortcuts

---

**Need Help?** Check the documentation files or create an issue in the repository.

