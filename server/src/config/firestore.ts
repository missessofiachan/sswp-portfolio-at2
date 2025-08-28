// admin.initializeApp + getFirestore()

import admin from 'firebase-admin';
import { loadEnv } from './env';
import fs from 'fs';
import path from 'path';

let db: FirebaseFirestore.Firestore | null = null;

export function getDb() {
  if (db) return db;
  const env = loadEnv();
  if (!admin.apps.length) {
    let credential: admin.credential.Credential;
    const filePath =
      env.FIREBASE_CREDENTIALS_FILE ||
      env.GOOGLE_APPLICATION_CREDENTIALS ||
      process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (filePath) {
      const abs = path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);
      const raw = fs.readFileSync(abs, 'utf-8');
      const sa = JSON.parse(raw);
      credential = admin.credential.cert(sa);
    } else if (env.FIREBASE_PROJECT_ID && env.FIREBASE_CLIENT_EMAIL && env.FIREBASE_PRIVATE_KEY) {
      credential = admin.credential.cert({
        projectId: env.FIREBASE_PROJECT_ID,
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
        privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      });
    } else {
      // Try ADC if nothing else was provided
      credential = admin.credential.applicationDefault();
    }
    admin.initializeApp({ credential });
  }
  db = admin.firestore();
  return db;
}
