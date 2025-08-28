// IProductsRepo interface
import type { Product } from '../../domain/product';

export interface ProductsRepo {
  list(params?: { sort?: { field: keyof Product; dir: 'asc' | 'desc' } }): Promise<Product[]>;
  getById(id: string): Promise<Product | null>;
  create(input: Omit<Product, 'id' | 'createdAt'>): Promise<Product>;
  update(id: string, patch: Partial<Product>): Promise<Product>;
  remove(id: string): Promise<void>;
  stats(): Promise<{ count: number; avgPrice: number }>;
}
