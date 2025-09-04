// IProductsRepo interface
import type { Product } from '../../domain/product';
import type { ProductsRepo } from '../ports/products.repo';

const mem: Product[] = [];

export const memProductsRepo: ProductsRepo = {
  async list() {
    return mem;
  },
  async getById(id) {
    return mem.find((p) => p.id === id) ?? null;
  },
  async create(input: Omit<Product, 'id' | 'createdAt'>) {
    const p: Product = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      images: (input as any)?.images ?? [],
      ...input,
    } as Product;
    mem.push(p);
    return p;
  },
  async update(id, patch) {
    const i = mem.findIndex((p) => p.id === id);
    if (i < 0) throw new Error('not found');
    mem[i] = { ...mem[i], ...patch };
    return mem[i];
  },
  async remove(id) {
    const i = mem.findIndex((p) => p.id === id);
    if (i >= 0) mem.splice(i, 1);
  },
  async stats() {
    const count = mem.length;
    const avgPrice = count ? mem.reduce((s, p) => s + p.price, 0) / count : 0;
    return { count, avgPrice };
  },
};
