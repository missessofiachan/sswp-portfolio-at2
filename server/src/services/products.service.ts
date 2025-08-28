import type { ProductsRepo } from '../data/ports/products.repo';
import { fsProductsRepo } from '../data/firestore/products.repo.fs';
import type { Product } from '../domain/product';

// Select backing repository (Firestore by default; swap with memory for tests)
const repo: ProductsRepo = fsProductsRepo;

export const productsService = {
  list: (sort?: { field: string; dir: 'asc' | 'desc' }) => repo.list({ sort: sort as any }),
  getById: (id: string) => repo.getById(id),
  create: (input: Omit<Product, 'id' | 'createdAt'>) => repo.create(input),
  update: (id: string, patch: Partial<Product>) => repo.update(id, patch),
  remove: (id: string) => repo.remove(id),
  stats: () => repo.stats(),
};
