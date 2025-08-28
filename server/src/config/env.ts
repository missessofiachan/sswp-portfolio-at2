// load/validate env (zod/joi)
import 'dotenv/config';
import { z } from 'zod';

// Support either a credentials file (preferred for local/dev) or raw fields
// If neither is provided, fall back to Application Default Credentials.
const Env = z.object({
  PORT: z.coerce.number().default(4000),
  JWT_SECRET: z.string().min(10),

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
  if (!parsed.success) throw new Error(parsed.error.message);
  return parsed.data;
}
