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
 * @property {'firestore' | 'memory'} DATA_STORE
 * Selects the data store implementation. Use 'firestore' for production (default) or 'memory' for local/demo.
 * @default 'firestore'
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
 */
const Env = z.object({
  PORT: z.coerce.number().default(4000),
  JWT_SECRET: z.string().min(10),
  // Data store selector: 'firestore' (default) or 'memory' for local/demo
  DATA_STORE: z.enum(['firestore', 'memory']).default('firestore'),

  // Option A: path to service account JSON
  FIREBASE_CREDENTIALS_FILE: z.string().optional(),
  GOOGLE_APPLICATION_CREDENTIALS: z.string().optional(),

  // Option B: raw fields from the service account
  FIREBASE_PROJECT_ID: z.string().optional(),
  FIREBASE_CLIENT_EMAIL: z.string().email().optional(),
  FIREBASE_PRIVATE_KEY: z.string().optional(),
});

export function loadEnv() {
  const parsed = Env.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(`Environment variable validation error:\n${parsed.error.toString()}`);
  }
  return parsed.data;
}
