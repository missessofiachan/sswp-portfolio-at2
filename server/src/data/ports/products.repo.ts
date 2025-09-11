// IProductsRepo interface
import type { Product } from '../../domain/product';

export interface ProductsRepo {
  list(params?: {
    sort?: { field: keyof Product; dir: 'asc' | 'desc' };
    filter?: {
      q?: string; // match name/description substring (best-effort)
      category?: string;
      minPrice?: number;
      maxPrice?: number;
    };
    page?: number;
    pageSize?: number;
  }): Promise<{ data: Product[]; total: number }>;
  getById(id: string): Promise<Product | null>;
  create(input: Omit<Product, 'id' | 'createdAt'>): Promise<Product>;
  update(id: string, patch: Partial<Product>): Promise<Product>;
  remove(id: string): Promise<void>;
  stats(): Promise<{ count: number; avgPrice: number }>;
  timeseries(params?: {
    windowDays?: number; // lookback window
    interval?: 'day' | 'week' | 'month';
  }): Promise<Array<{ t: number; count: number; avgPrice: number }>>;
}
