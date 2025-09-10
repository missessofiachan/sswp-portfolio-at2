const admin = require('firebase-admin');
const path = require('path');

// Safety: require explicit confirmation flag or FORCE env var
const confirmed = process.argv.includes('--yes') || process.env.FORCE === '1';
if (!confirmed) {
  console.error('Refusing to run without confirmation. Pass --yes or set FORCE=1 to confirm.');
  process.exit(3);
}

// Adjust path to your service account key
const keyPath = path.resolve(
  __dirname,
  '..',
  '..',
  'test1-795d3-firebase-adminsdk-fbsvc-f8f926dfa7.json'
);

try {
  const serviceAccount = require(keyPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} catch (err) {
  console.error('Failed to load service account key at', keyPath);
  console.error(err.message);
  process.exit(2);
}

const db = admin.firestore();

async function deleteCollection(colRef, batchSize = 500) {
  const query = colRef.limit(batchSize);
  while (true) {
    const snapshot = await query.get();
    if (snapshot.size === 0) break;
    const batch = db.batch();
    snapshot.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
  }
}

(async function clearRootCollections() {
  try {
    const collections = await db.listCollections();
    if (!collections.length) {
      console.log('No root collections to delete.');
      return;
    }
    for (const c of collections) {
      console.log('Clearing collection', c.id);
      await deleteCollection(c);
    }
    console.log(
      'Done clearing root collections. Note: nested subcollections under documents may remain.'
    );
  } catch (err) {
    console.error('Error clearing collections:', err);
    process.exit(1);
  }
})();
