// load/validate env (zod/joi)
import 'dotenv/config';
import { z } from 'zod';

// Support either a credentials file (preferred for local/dev) or raw fields
// If neither is provided, fall back to Application Default Credentials.
/**
 * Environment schema for application configuration validated by Zod.
 *
 * @remarks
 * This schema describes the environment variables used by the server, including the HTTP port,
 * JWT secret, datastore selector, and Firebase credentials. Firebase credentials can be provided
 * either as a path to a service account JSON file (Option A) or as raw service-account fields
 * (Option B). When providing FIREBASE_PRIVATE_KEY via environment variables, ensure newline
 * characters are preserved (for example, replace escaped "\n" sequences with actual newlines).
 *
 * @property {number} PORT
 * TCP port the server listens on.
 * @default 4000
 *
 * @property {string} JWT_SECRET
 * Secret used to sign and verify JWTs. Must be at least 10 characters long.
 *
 * @property {string} JWT_EXPIRES_IN
 * Duration string controlling JWT token lifetime (for example "15m" or "1h").
 * @default '15m'
 *
 * @property {'firestore' | 'memory'} DATA_STORE
 * Selects the data store implementation. Use 'firestore' for production (default) or 'memory' for local/demo.
 * @default 'firestore'
 *
 * @property {string | undefined} CORS_ORIGIN
 * Optional allowed origin (or comma-separated list) for CORS requests.
 *
 * @property {string | undefined} MAINTENANCE_SECRET
 * Optional shared secret required by maintenance endpoints when set.
 *
 * @property {string | undefined} FIREBASE_CREDENTIALS_FILE
 * Optional path to a Firebase service account JSON file (Option A).
 *
 * @property {string | undefined} GOOGLE_APPLICATION_CREDENTIALS
 * Optional alternative env var recognized by Firebase SDK that points to a service account JSON file.
 *
 * @property {string | undefined} FIREBASE_PROJECT_ID
 * Optional Firebase project ID when supplying raw credentials (Option B).
 *
 * @property {string | undefined} FIREBASE_CLIENT_EMAIL
 * Optional service account client email when supplying raw credentials. Must be a valid email address.
 *
 * @property {string | undefined} FIREBASE_PRIVATE_KEY
 * Optional service account private key when supplying raw credentials. May contain newline characters;
 * if provided via a single-line env var, convert escaped "\n" sequences into real newlines before use.
 *
 * @example
 * // Option A - provide path to JSON
 * // PORT=4000
 * // JWT_SECRET=supersecretjwt
 * // DATA_STORE=firestore
 * // FIREBASE_CREDENTIALS_FILE=/path/to/serviceAccount.json
 *
 * @example
 * // Option B - provide raw credentials
 * // FIREBASE_PROJECT_ID=my-project
 * // FIREBASE_CLIENT_EMAIL=svc@my-project.iam.gserviceaccount.com
 * // FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEv..."
 *
 * @property {number} UPLOAD_MAX_MB
 * Maximum allowed upload size in megabytes for multipart/form-data payloads.
 * @default 5
 *
 * @property {number} PASSWORD_RESET_TTL_MINUTES
 * Number of minutes password-reset tokens remain valid.
 * @default 60
 *
 * @property {number} PASSWORD_RESET_RATE_LIMIT_MINUTES
 * Number of minutes before a new password-reset request is allowed for the same user.
 * @default 5
 *
 * @property {string | undefined} LOG_TO_FILE
 * Optional toggle controlling whether structured logs are written to disk ("true"/"false"/"0"/"1").
 *
 * @property {string | undefined} LOG_DIR
 * Optional custom log directory (defaults to "./logs").
 *
 * @property {string | undefined} LOG_FILE
 * Optional custom log filename (defaults to "app.log").
 *
 * @property {string | undefined} LOG_LEVEL
 * Optional override for log level (defaults to "debug" in dev and "info" in production).
 *
 * @property {number | undefined} LOG_MAX_SIZE
 * Optional maximum size in bytes for a single log file.
 *
 * @property {number | undefined} LOG_MAX_FILES
 * Optional maximum number of log files to retain.
 */
const Env = z.object({
  PORT: z.coerce.number().default(4000),
  JWT_SECRET: z.string().min(10),
  JWT_EXPIRES_IN: z.string().default('15m'),
  // Data store selector: 'firestore' (default) or 'memory' for local/demo
  DATA_STORE: z.enum(['firestore', 'memory']).default('firestore'),
  CORS_ORIGIN: z.string().optional(),
  UPLOAD_MAX_MB: z.coerce.number().positive('UPLOAD_MAX_MB must be positive').default(5),
  MAINTENANCE_SECRET: z.string().optional(),

  // Option A: path to service account JSON
  FIREBASE_CREDENTIALS_FILE: z.string().optional(),
  GOOGLE_APPLICATION_CREDENTIALS: z.string().optional(),

  // Option B: raw fields from the service account
  FIREBASE_PROJECT_ID: z.string().optional(),
  FIREBASE_CLIENT_EMAIL: z.string().email().optional(),
  FIREBASE_PRIVATE_KEY: z.string().optional(),

  /**
   * Fully-qualified Cloudinary URL (cloudinary://<key>:<secret>@<cloud-name>) used for
   * authenticated uploads and asset management.
   */
  CLOUDINARY_URL: z
    .string()
    .min(1, 'CLOUDINARY_URL is required. Set cloudinary://<key>:<secret>@<cloud-name>')
    .refine((value) => value.startsWith('cloudinary://'), {
      message: 'CLOUDINARY_URL must begin with "cloudinary://"',
    }),
  CLOUDINARY_UPLOAD_FOLDER: z.string().optional(),
  PASSWORD_RESET_TTL_MINUTES: z
    .coerce.number()
    .positive('PASSWORD_RESET_TTL_MINUTES must be positive')
    .default(60),
  PASSWORD_RESET_RATE_LIMIT_MINUTES: z
    .coerce.number()
    .positive('PASSWORD_RESET_RATE_LIMIT_MINUTES must be positive')
    .default(5),
  LOG_TO_FILE: z.string().optional(),
  LOG_DIR: z.string().optional(),
  LOG_FILE: z.string().optional(),
  LOG_LEVEL: z.string().optional(),
  LOG_MAX_SIZE: z
    .preprocess((value) => {
      if (typeof value === 'string' && value.trim() === '') return undefined;
      return value;
    }, z.coerce.number().positive())
    .optional(),
  LOG_MAX_FILES: z
    .preprocess((value) => {
      if (typeof value === 'string' && value.trim() === '') return undefined;
      return value;
    }, z.coerce.number().positive())
    .optional(),
});

export function loadEnv() {
  const parsed = Env.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(`Environment variable validation error:\n${parsed.error.toString()}`);
  }
  return parsed.data;
}
