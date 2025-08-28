import { getDb } from '../../config/firestore';
import type { Product } from '../../domain/product';
import type { ProductsRepo } from '../ports/products.repo';

const COLLECTION = 'products';

export const fsProductsRepo: ProductsRepo = {
  async list(params) {
    const db = getDb();
    let q: FirebaseFirestore.Query = db.collection(COLLECTION);
    if (params?.sort) {
      // Sort key (e.g., price asc) – ensure index exists when combined with filters
      q = q.orderBy(params.sort.field as string, params.sort.dir);
    }
    const snap = await q.get();
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
  },
  async getById(id) {
    const d = await getDb().collection(COLLECTION).doc(id).get();
    return d.exists ? ({ id: d.id, ...(d.data() as any) } as Product) : null;
  },
  async create(input) {
    const now = Date.now();
    const doc = await getDb()
      .collection(COLLECTION)
      .add({ ...input, createdAt: now });
    return { id: doc.id, ...input, createdAt: now } as Product;
  },
  async update(id, patch) {
    await getDb().collection(COLLECTION).doc(id).update(patch);
    const d = await getDb().collection(COLLECTION).doc(id).get();
    return { id: d.id, ...(d.data() as any) } as Product;
  },
  async remove(id) {
    await getDb().collection(COLLECTION).doc(id).delete();
  },
  async stats() {
    const list = await this.list();
    const count = list.length;
    const avgPrice = count ? list.reduce((s, p) => s + p.price, 0) / count : 0;
    return { count, avgPrice };
  },
  // Example: paginate + sort by price
  //const db = getDb();
  //let q = db.collection("products").orderBy("price", "asc").limit(20);
  //if (cursor) q = q.startAfter(cursor);
  // cursor from last doc snapshot
};
