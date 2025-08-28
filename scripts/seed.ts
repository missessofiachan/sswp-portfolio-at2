// scripts/seed.ts  quick data seed (calls server service)
import { getDb } from '../server/src/config/firestore.js';

async function main() {
  const db = getDb();
  const batch = db.batch();

  const items = [
    { name: 'Starter Hammer', price: 19.99, category: 'tools', rating: 4.2, createdAt: Date.now() },
    { name: 'Pro Wrench', price: 39.5, category: 'tools', rating: 4.7, createdAt: Date.now() },
    { name: 'Oil Filter', price: 15.0, category: 'parts', rating: 4.1, createdAt: Date.now() },
  ];

  for (const it of items) {
    const ref = db.collection('products').doc();
    batch.set(ref, it);
  }
  await batch.commit();
  console.log('Seeded products:', items.length);
}

main().then(() => process.exit(0));
