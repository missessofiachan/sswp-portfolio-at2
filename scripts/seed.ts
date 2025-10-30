// scripts/seed.ts  quick data seed (calls server service)
import * as fs from 'fs';
import * as path from 'path';
import { getDb } from '../server/src/config/firestore';

/**
 * Usage:
 *   pnpm --filter server run seed -- [path-to-service-account.json]
 * If a path is provided it will set FIREBASE_CREDENTIALS_FILE for this process.
 */
async function main() {
  try {
    const arg = process.argv[2];
    if (arg) {
      const abs = path.isAbsolute(arg) ? arg : path.resolve(process.cwd(), arg);
      if (!fs.existsSync(abs)) {
        console.error(`Credentials file not found at: ${abs}`);
        process.exit(2);
      }
      process.env.FIREBASE_CREDENTIALS_FILE = abs;
      console.log(`Using credentials file: ${abs}`);
    } else {
      console.log('No credentials file argument provided; using environment or ADC.');
    }

    // Basic env validation: ensure JWT_SECRET present (env loader will enforce length)
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 10) {
      console.error(
        'Missing or invalid JWT_SECRET (must be at least 10 characters). Set JWT_SECRET in environment.'
      );
      process.exit(3);
    }

    const db = getDb();
    const batch = db.batch();

    const items = [
      {
        name: 'Starter Hammer',
        price: 19.99,
        category: 'tools',
        rating: 4.2,
        stock: 50,
        createdAt: Date.now(),
      },
      {
        name: 'Pro Wrench',
        price: 39.5,
        category: 'tools',
        rating: 4.7,
        stock: 35,
        createdAt: Date.now(),
      },
      {
        name: 'Oil Filter',
        price: 15.0,
        category: 'parts',
        rating: 4.1,
        stock: 120,
        createdAt: Date.now(),
      },
    ];

    for (const it of items) {
      const ref = db.collection('products').doc();
      batch.set(ref, it);
    }
    await batch.commit();
    console.log('Seeded products:', items.length);
    process.exit(0);
  } catch (err) {
    console.error('Seed script failed:', (err as Error).message);
    console.error((err as Error).stack);
    process.exit(1);
  }
}

main();
