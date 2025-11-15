/**
 * Product domain service acting as a thin layer over repository implementations.
 * Centralizes CRUD, filtering, statistics, and timeseries access so calling code
 * stays agnostic of the underlying persistence strategy.
 */

import { fsProductsRepo } from '../../data/firestore/products.repo.fs';
import type { ProductsRepo } from '../../data/ports/products.repo';
import type { Product } from '../../domain/product';

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

export const productsService = createProductsService(fsProductsRepo);
