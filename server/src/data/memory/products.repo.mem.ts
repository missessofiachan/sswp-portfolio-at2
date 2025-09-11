// IProductsRepo interface
import type { Product } from '../../domain/product';
import type { ProductsRepo } from '../ports/products.repo';

const mem: Product[] = [];

export const memProductsRepo: ProductsRepo = {
  async list(params) {
    const { sort, filter, page = 1, pageSize = 20 } = params || {};
    let items = mem.slice();
    if (filter?.category) items = items.filter((p) => p.category === filter.category);
    if (filter?.minPrice != null)
      items = items.filter((p) => p.price >= (filter.minPrice as number));
    if (filter?.maxPrice != null)
      items = items.filter((p) => p.price <= (filter.maxPrice as number));
    if (filter?.q) {
      const q = filter.q.toLowerCase();
      items = items.filter(
        (p) => p.name.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q)
      );
    }
    if (sort) {
      const { field, dir } = sort;
      items.sort((a: any, b: any) => (a[field] > b[field] ? 1 : a[field] < b[field] ? -1 : 0));
      if (dir === 'desc') items.reverse();
    }
    const total = items.length;
    const start = Math.max(0, (page - 1) * pageSize);
    const data = items.slice(start, start + pageSize);
    return { data, total };
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
  async timeseries(params) {
    const { windowDays = 30, interval = 'day' } = params || {};
    const since = Date.now() - windowDays * 86400000;
    const items = mem.filter((p) => p.createdAt >= since).sort((a, b) => a.createdAt - b.createdAt);
    const buckets = new Map<number, { count: number; sum: number }>();
    function bucketKey(ts: number): number {
      const d = new Date(ts);
      if (interval === 'week') {
        const day = d.getUTCDay();
        const diff = (day + 6) % 7;
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
      b.sum += p.price;
      buckets.set(k, b);
    }
    return Array.from(buckets.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([t, v]) => ({ t, count: v.count, avgPrice: v.count ? v.sum / v.count : 0 }));
  },
};
