import { getDb } from '../../config/firestore';
import type { Product } from '../../domain/product';
import type { ProductsRepo } from '../ports/products.repo';

const COLLECTION = 'products';

/**
 * Firestore-backed implementation of the ProductsRepo interface.
 *
 * Uses getDb() and a COLLECTION constant to interact with a Firestore collection
 * of product documents. All methods perform simple, promise-based Firestore
 * operations and convert Firestore documents into Product objects with an `id`
 * property added from the document ID.
 *
 * @remarks
 * - Sorting: list() accepts an optional sort descriptor; when combined with
 *   filters in Firestore you may need to create composite indexes in your
 *   Firebase project.
 * - Timestamps: create() adds a `createdAt` timestamp using Date.now() (a
 *   numeric milliseconds value).
 * - Concurrency: update() reads the document first and throws when it does not
 *   exist; it then applies a patch via update() and returns the freshly-read
 *   document. If strong concurrency control is required, consider using
 *   transactions or optimistic concurrency patterns (e.g. version fields).
 * - stats(): computes count and average price by fetching all documents and
 *   aggregating in-memory; for large collections prefer a server-side
 *   aggregation strategy.
 *
 * Methods:
 * - list(params?): Promise<Product[]>
 *   - params.sort?: { field: string; dir: 'asc' | 'desc' }
 *   - Returns all products (optionally ordered). Each product includes its
 *     Firestore doc id under `id`.
 *
 * - getById(id: string): Promise<Product | null>
 *   - Returns the product for the given id or null if not found.
 *
 * - create(input: Partial<Product>): Promise<Product>
 *   - Adds a new product document to Firestore with a `createdAt` timestamp.
 *   - Returns the created product including its generated `id`.
 *
 * - update(id: string, patch: Partial<Product>): Promise<Product>
 *   - Applies a patch to an existing product. Throws an Error when the target
 *     document does not exist. Returns the updated product object as stored in
 *     Firestore after the update.
 *
 * - remove(id: string): Promise<void>
 *   - Deletes the product document with the specified id.
 *
 * - stats(): Promise<{ count: number; avgPrice: number }>
 *   - Fetches all products and returns a simple aggregate: count of products
 *     and average price (0 when there are no products).
 *
 * @example
 * // list with sorting
 * const products = await fsProductsRepo.list({ sort: { field: 'price', dir: 'asc' } });
 *
 * @throws Error
 * - update(): when the provided id does not exist in the Firestore collection.
 */
export const fsProductsRepo: ProductsRepo = {
  async list(params) {
    const db = getDb();
    let q: FirebaseFirestore.Query = db.collection(COLLECTION);
    const { sort, filter, page = 1, pageSize = 20 } = params || {};
    // Apply server-side filters when feasible (category, price). Text search is in-memory fallback.
    if (filter?.category) q = q.where('category', '==', filter.category);
    if (filter?.minPrice != null) q = q.where('price', '>=', filter.minPrice);
    if (filter?.maxPrice != null) q = q.where('price', '<=', filter.maxPrice);
    if (sort) q = q.orderBy(sort.field as string, sort.dir);
    const snap = await q.get();
    let items = snap.docs
      .map((d) => d.data() && ({ id: d.id, ...(d.data() as any) } as Product))
      .filter((p): p is Product => Boolean(p));
    // Client text filter fallback
    if (filter?.q) {
      const qlc = filter.q.toLowerCase();
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(qlc) || (p.description || '').toLowerCase().includes(qlc)
      );
    }
    const total = items.length;
    const start = Math.max(0, (page - 1) * pageSize);
    const end = start + pageSize;
    const data = items.slice(start, end);
    return { data, total };
  },

  async getById(id) {
    const d = await getDb().collection(COLLECTION).doc(id).get();
    return d.exists ? ({ id: d.id, ...(d.data() as any) } as Product) : null;
  },

  async create(input) {
    const now = Date.now();
    const payload: Omit<Product, 'id'> = {
      // ensure images defaults to [] if omitted
      ...(input as any),
      images: (input as any)?.images ?? [],
      createdAt: now,
    } as any;
    const ref = await getDb()
      .collection(COLLECTION)
      .add(payload as any);
    return { id: ref.id, ...(payload as any) } as Product;
  },

  async update(id, patch) {
    const ref = getDb().collection(COLLECTION).doc(id);
    const snap = await ref.get();
    if (!snap.exists) throw new Error(`Product with id ${id} does not exist.`);
    await ref.update(patch);
    const updated = await ref.get();
    return { id: updated.id, ...(updated.data() as any) } as Product;
  },

  async remove(id) {
    await getDb().collection(COLLECTION).doc(id).delete();
  },

  async stats() {
    // Fetch and compute; avoids referencing this.list to keep types simple
    const snap = await getDb().collection(COLLECTION).get();
    const products: Product[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
    const count = products.length;
    const avgPrice = count ? products.reduce((sum, p) => sum + (p.price || 0), 0) / count : 0;
    return { count, avgPrice };
  },

  async timeseries(params) {
    const { windowDays = 30, interval = 'day' } = params || {};
    const since = Date.now() - windowDays * 24 * 60 * 60 * 1000;
    const snap = await getDb()
      .collection(COLLECTION)
      .where('createdAt', '>=', since)
      .orderBy('createdAt', 'asc')
      .get();
    const items: Product[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
    const buckets = new Map<number, { count: number; sum: number }>();
    function bucketKey(ts: number): number {
      const d = new Date(ts);
      if (interval === 'week') {
        // Monday-based week start
        const day = d.getUTCDay();
        const diff = (day + 6) % 7; // 0..6 (Mon=0)
        const start =
          Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) - diff * 86400000;
        return start;
      }
      if (interval === 'month') return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1);
      return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
    }
    for (const p of items) {
      const k = bucketKey(p.createdAt);
      const b = buckets.get(k) || { count: 0, sum: 0 };
      b.count += 1;
      b.sum += p.price || 0;
      buckets.set(k, b);
    }
    const rows = Array.from(buckets.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([t, v]) => ({ t, count: v.count, avgPrice: v.count ? v.sum / v.count : 0 }));
    return rows;
  },
};
