import { describe, expect, it, vi } from 'vitest';
import type { Product } from '../domain/product';
import { createProductsService } from '../services/products.service';
import type { ProductsRepo } from '../data/ports/products.repo';

function createRepoMock(): vi.Mocked<ProductsRepo> {
  return {
    list: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    stats: vi.fn(),
    timeseries: vi.fn(),
  };
}

describe('createProductsService', () => {
  it('delegates list calls to the repository', async () => {
    const repo = createRepoMock();
    const product: Product = {
      id: 'p1',
      name: 'Widget',
      description: 'Useful widget',
      price: 10,
      category: 'tools',
      images: [],
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-01T00:00:00Z'),
      stock: 3,
    };
    repo.list.mockResolvedValue({ data: [product], total: 1 });
    const svc = createProductsService(repo);

    const result = await svc.list({
      sort: { field: 'price', dir: 'desc' },
      filter: { q: 'widget', minPrice: 5 },
      page: 2,
      pageSize: 5,
    });

    expect(repo.list).toHaveBeenCalledWith({
      sort: { field: 'price', dir: 'desc' },
      filter: { q: 'widget', minPrice: 5 },
      page: 2,
      pageSize: 5,
    });
    expect(result).toEqual({ data: [product], total: 1 });
  });

  it('forwards CRUD operations to the repository', async () => {
    const repo = createRepoMock();
    const svc = createProductsService(repo);
    const product: Product = {
      id: 'p1',
      name: 'Widget',
      description: 'Useful widget',
      price: 10,
      category: 'tools',
      images: [],
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-01T00:00:00Z'),
      stock: 3,
    };

    repo.getById.mockResolvedValue(product);
    repo.create.mockResolvedValue(product);
    repo.update.mockResolvedValue(product);

    await svc.getById('p1');
    await svc.create({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      images: product.images,
      stock: product.stock,
      updatedAt: product.updatedAt,
      createdAt: product.createdAt,
    } as unknown as Omit<Product, 'id' | 'createdAt'>);
    await svc.update('p1', { price: 15 });
    await svc.remove('p1');
    await svc.stats();
    await svc.timeseries({ interval: 'week' });

    expect(repo.getById).toHaveBeenCalledWith('p1');
    expect(repo.create).toHaveBeenCalled();
    expect(repo.update).toHaveBeenCalledWith('p1', { price: 15 });
    expect(repo.remove).toHaveBeenCalledWith('p1');
    expect(repo.stats).toHaveBeenCalled();
    expect(repo.timeseries).toHaveBeenCalledWith({ interval: 'week' });
  });
});
