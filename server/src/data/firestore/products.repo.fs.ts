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
    if (params?.sort) {
      // e.g. order by price asc; ensure Firestore indexes exist when combined with filters
      q = q.orderBy(params.sort.field as string, params.sort.dir);
    }
    const snap = await q.get();
    return snap.docs
      .map((d) => d.data() && ({ id: d.id, ...(d.data() as any) } as Product))
      .filter((p): p is Product => Boolean(p));
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
};
