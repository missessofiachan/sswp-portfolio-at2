import type { ProductsRepo } from '../data/ports/products.repo';
import { fsProductsRepo } from '../data/firestore/products.repo.fs';
import type { Product } from '../domain/product';

// Select backing repository (Firestore by default; swap with memory for tests)
/**
 * Product service exposing CRUD operations and statistics backed by the repository.
 *
 * Each method delegates to the underlying `repo` implementation and returns whatever
 * the repository returns (synchronous value or Promise, depending on repo).
 *
 * Methods:
 *  - list(sort?)     — Retrieve a list of products, optionally sorted.
 *  - getById(id)     — Retrieve a single product by its identifier.
 *  - create(input)   — Create a new product (input excludes `id` and `createdAt`).
 *  - update(id, patch) — Apply a partial update to an existing product.
 *  - remove(id)      — Remove a product by its identifier.
 *  - stats()         — Retrieve aggregated product statistics.
 *
 * @param list.sort - Optional sort descriptor: { field: string; dir: 'asc' | 'desc' }.
 * @param getById.id - Product identifier.
 * @param create.input - Product input without `id` and `createdAt`.
 * @param update.id - Identifier of the product to update.
 * @param update.patch - Partial<Product> containing fields to update.
 * @param remove.id - Identifier of the product to remove.
 *
 * @returns The result of the corresponding `repo` call for each method.
 *
 * @example
 * // Example usage (repo may return a Promise):
 * const items = await productsService.list({ field: 'name', dir: 'asc' });
 */
export function createProductsService(repo: ProductsRepo) {
  return {
    list: (params?: {
      sort?: { field: keyof Product; dir: 'asc' | 'desc' };
      filter?: { q?: string; category?: string; minPrice?: number; maxPrice?: number };
      page?: number;
      pageSize?: number;
    }) => repo.list(params),
    getById: (id: string) => repo.getById(id),
    create: (input: Omit<Product, 'id' | 'createdAt'>) => repo.create(input),
    update: (id: string, patch: Partial<Product>) => repo.update(id, patch),
    remove: (id: string) => repo.remove(id),
    stats: () => repo.stats(),
    timeseries: (params?: { windowDays?: number; interval?: 'day' | 'week' | 'month' }) =>
      repo.timeseries(params),
  };
}

// Always use Firestore-backed repo (memory implementation removed)
export const productsService = createProductsService(fsProductsRepo);
