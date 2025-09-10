const admin = require('firebase-admin');
const path = require('path');

// Adjust the path to your service account JSON if you keep it elsewhere.
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

(async function listRootCollections() {
  try {
    const collections = await db.listCollections();
    if (!collections.length) {
      console.log('No root collections found.');
      return;
    }
    console.log('Root collections:');
    collections.forEach((c) => console.log('-', c.id));
  } catch (err) {
    console.error('Error listing collections:', err);
    process.exit(1);
  }
})();
