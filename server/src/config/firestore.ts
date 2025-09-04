// admin.initializeApp + getFirestore()

import * as admin from 'firebase-admin';
import { loadEnv } from './env';
import * as fs from 'fs';
import * as path from 'path';

let db: FirebaseFirestore.Firestore | null = null;

/**
 * Returns a singleton Firestore instance, initializing the Firebase Admin SDK on first use.
 *
 * The function uses a cached `db` instance if available. On first invocation it:
 * 1. Loads environment configuration via `loadEnv()`.
 * 2. Determines credentials in the following order:
 *    - A credentials file path from `FIREBASE_CREDENTIALS_FILE`, `GOOGLE_APPLICATION_CREDENTIALS`, or `process.env.GOOGLE_APPLICATION_CREDENTIALS`.
 *      If provided, the file is read and parsed as JSON and passed to `admin.credential.cert(...)`.
 *    - Explicit service account environment variables: `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY`.
 *      The `FIREBASE_PRIVATE_KEY` value has escaped newline sequences (`\n`) replaced with actual newlines before use.
 *    - Otherwise, falls back to Application Default Credentials via `admin.credential.applicationDefault()`.
 * 3. Initializes the Admin SDK (`admin.initializeApp({ credential })`) unless an app is already initialized.
 * 4. Returns `admin.firestore()` and caches it for future calls.
 *
 * Side effects:
 * - May read a credentials file from disk.
 * - May initialize the Firebase Admin SDK (global side effect).
 * - Reads environment variables.
 *
 * @returns The initialized Firestore instance (singleton).
 *
 * @throws Error If a credentials file cannot be read or contains invalid JSON.
 * @throws Error If the Firebase Admin SDK fails to initialize.
 * @throws Error If obtaining the Firestore instance fails.
 *
 * @example
 * const db = getDb();
 * const doc = await db.collection('users').doc('alice').get();
 *
 * @remarks
 * This function expects the presence of `loadEnv`, `admin`, `fs`, and `path` in the module scope
 * and a module-level `db` variable used for caching. It intentionally prefers explicit credentials
 * when provided and only falls back to application default credentials as a last resort.
 */
export function getDb() {
  if (db) return db;
  const env = loadEnv();

  if (!admin.apps.length) {
    let credential: admin.credential.Credential | undefined;

    const filePath =
      env.FIREBASE_CREDENTIALS_FILE ||
      env.GOOGLE_APPLICATION_CREDENTIALS ||
      process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (filePath) {
      const abs = path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);
      let raw: string;
      try {
        raw = fs.readFileSync(abs, 'utf-8');
      } catch (err) {
        throw new Error(
          `Failed to read Firebase credentials file at "${abs}": ${(err as Error).message}`
        );
      }
      try {
        const sa = JSON.parse(raw);
        credential = admin.credential.cert(sa as admin.ServiceAccount);
      } catch (err) {
        throw new Error(`Invalid Firebase credentials JSON at "${abs}": ${(err as Error).message}`);
      }
    } else if (env.FIREBASE_PROJECT_ID && env.FIREBASE_CLIENT_EMAIL && env.FIREBASE_PRIVATE_KEY) {
      credential = admin.credential.cert({
        projectId: env.FIREBASE_PROJECT_ID,
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
        privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      } as admin.ServiceAccount);
    } else {
      // Use Application Default Credentials if nothing explicit provided
      credential = admin.credential.applicationDefault();
    }

    try {
      admin.initializeApp({ credential });
    } catch (err) {
      throw new Error(`Failed to initialize Firebase Admin SDK: ${(err as Error).message}`);
    }
  }

  try {
    db = admin.firestore();
    return db;
  } catch (err) {
    throw new Error(`Failed to get Firestore instance: ${(err as Error).message}`);
  }
}
