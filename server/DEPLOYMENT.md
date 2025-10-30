# Deployment Guide

## Environment Variables - Security Checklist

### 🔴 Critical - Required for Production

#### CORS Configuration
- **CORS_ORIGIN**: Comma-separated list of allowed origins (REQUIRED in production)
  - Example: `https://yourapp.com,https://www.yourapp.com`
  - ⚠️ **NEVER** use `*` or leave empty in production
  - For development: can be omitted (defaults to `http://localhost:5173`)
  
#### Authentication
- **JWT_SECRET**: Secure random string (minimum 32 characters recommended)
  - Generate with: `openssl rand -base64 32`
  - ⚠️ **Rotate periodically** (every 90 days recommended)
  - Store securely (use secrets manager in production)

- **JWT_EXPIRES_IN**: Token lifetime (default: `15m`)
  - Recommended: `15m` to `1h` for web apps
  - Shorter is more secure but requires more frequent logins

#### Database (Firebase/Firestore)
Option A - Service Account File:
- **FIREBASE_CREDENTIALS_FILE**: Path to service account JSON
  - OR **GOOGLE_APPLICATION_CREDENTIALS**: Alternative path variable
  
Option B - Raw Credentials:
- **FIREBASE_PROJECT_ID**: Your Firebase project ID
- **FIREBASE_CLIENT_EMAIL**: Service account email
- **FIREBASE_PRIVATE_KEY**: Service account private key (with actual newlines)

#### File Uploads
- **CLOUDINARY_URL**: Format `cloudinary://<api_key>:<api_secret>@<cloud_name>`
  - Get from Cloudinary dashboard
  - ⚠️ Keep secret, never commit to version control

### 🟡 Recommended

#### Email Service (Currently stub - implement for production)
- **EMAIL_PROVIDER**: (to be implemented) `sendgrid`, `ses`, `smtp`
- **EMAIL_API_KEY**: Provider API key
- **EMAIL_FROM**: Sender email address

#### Security
- **MAINTENANCE_SECRET**: Required to access `/api/v1/maintenance` endpoints
  - Generate: `openssl rand -hex 32`
  - Only set if using maintenance endpoints

- **UPLOAD_MAX_MB**: Maximum file upload size (default: 5)
  - Recommended: 5-10 MB for images
  - Match with frontend validation

#### Logging
- **LOG_LEVEL**: `debug`, `info`, `warn`, `error` (default: `info` in production)
- **LOG_TO_FILE**: `true`/`false` (default: `true`)
- **LOG_DIR**: Directory for log files (default: `./logs`)
- **LOG_MAX_SIZE**: Max log file size in bytes
- **LOG_MAX_FILES**: Max number of log files to retain

#### Rate Limiting
- **PASSWORD_RESET_TTL_MINUTES**: Password reset token lifetime (default: 60)
- **PASSWORD_RESET_RATE_LIMIT_MINUTES**: Min time between reset requests (default: 5)

## Production Deployment Steps

### 1. Pre-deployment Security Audit
- [ ] Set strong `JWT_SECRET` (32+ chars, random)
- [ ] Configure `CORS_ORIGIN` with actual domain(s)
- [ ] Verify Firebase credentials are valid and scoped properly
- [ ] Set `MAINTENANCE_SECRET` if using maintenance endpoints
- [ ] Review all `*.env` files - ensure no secrets in version control

### 2. Environment Setup
```bash
# Copy example env and fill in production values
cp .env.example .env.production

# Edit with secure values
nano .env.production
```

### 3. Build
```bash
# Backend
cd server
npm run build

# Frontend
cd client
npm run build
```

### 4. Start Production Server
```bash
# Backend (with production env)
cd server
NODE_ENV=production npm start

# Frontend - serve static build via nginx/CDN
```

### 5. Post-deployment Verification
- [ ] Test authentication flow
- [ ] Verify CORS is blocking unauthorized origins
- [ ] Check file upload limits are enforced
- [ ] Confirm logs are being written
- [ ] Test error handling (should not leak stack traces)

## Security Best Practices

### CORS
- **Production**: Only allow specific trusted origins
- **Development**: Use `http://localhost:5173` or configure for your dev setup
- **Never**: Use `*` wildcard in production

### Secrets Management
- Use environment variables, never hardcode
- Use cloud provider's secrets manager (AWS Secrets Manager, Google Secret Manager, etc.)
- Rotate secrets regularly
- Audit access logs

### File Uploads
- Always validate file content (magic numbers), not just extension
- Enforce size limits at both application and reverse proxy level
- Scan uploads for malware in high-security environments
- Store uploads on CDN/cloud storage, not on app server

### Authentication
- Use short-lived JWT tokens
- Implement refresh tokens for longer sessions (to be added)
- Monitor for suspicious login patterns
- Implement account lockout after failed attempts (to be added)

## Monitoring

### Recommended Tools
- **Error Tracking**: Sentry, Rollbar
- **Logging**: CloudWatch, Datadog, Loggly
- **Uptime**: UptimeRobot, Pingdom
- **Performance**: New Relic, AppDynamics

### Key Metrics to Monitor
- Request latency (p50, p95, p99)
- Error rates by endpoint
- Authentication failures
- File upload success/failure rates
- Database query performance

