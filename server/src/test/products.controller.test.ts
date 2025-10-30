import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Request, Response } from 'express';
import type { Product } from '../domain/product';

vi.mock('../services/products.service', () => {
  const list = vi.fn();
  const getById = vi.fn();
  const create = vi.fn();
  const update = vi.fn();
  const remove = vi.fn();
  const stats = vi.fn();
  const timeseries = vi.fn();
  return {
    productsService: { list, getById, create, update, remove, stats, timeseries },
  };
});

vi.mock('../services/cloudinary.service', () => ({
  deleteAssetsByUrls: vi.fn(),
}));

import {
  create,
  getById,
  list,
  remove,
  stats,
  timeseries,
  update,
} from '../api/controllers/products.controller';
import { productsService } from '../services/products.service';
import { deleteAssetsByUrls } from '../services/cloudinary.service';

type MockResponse = Response & {
  status: ReturnType<typeof vi.fn>;
  json: ReturnType<typeof vi.fn>;
  send: ReturnType<typeof vi.fn>;
};

function mockResponse(): MockResponse {
  const res: Partial<Response> = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  res.send = vi.fn().mockReturnValue(res);
  return res as MockResponse;
}

const productsServiceMock = productsService as unknown as {
  list: ReturnType<typeof vi.fn>;
  getById: ReturnType<typeof vi.fn>;
  create: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  remove: ReturnType<typeof vi.fn>;
  stats: ReturnType<typeof vi.fn>;
  timeseries: ReturnType<typeof vi.fn>;
};

const deleteAssetsByUrlsMock = deleteAssetsByUrls as unknown as ReturnType<typeof vi.fn>;

function buildProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 'p1',
    name: 'Widget',
    description: 'Useful widget',
    price: 10,
    stock: 5,
    category: 'tools',
    images: ['http://res.cloudinary.com/demo/image/upload/v1/samples/p1.jpg'],
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z'),
    ...overrides,
  };
}

describe('products.controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('list', () => {
    it('parses query parameters and returns data', async () => {
      productsServiceMock.list.mockResolvedValue({ data: [], total: 0 });
      const req = {
        query: {
          sort: { field: 'price', dir: 'desc' },
          filter: { q: 'widget', category: 'tools', minPrice: '5', maxPrice: '50' },
          page: '2',
          pageSize: '10',
        },
      } as unknown as Request;
      const res = mockResponse();

      await list(req, res);

      expect(productsServiceMock.list).toHaveBeenCalledWith({
        sort: { field: 'price', dir: 'desc' },
        filter: { q: 'widget', category: 'tools', minPrice: 5, maxPrice: 50 },
        page: 2,
        pageSize: 10,
      });
      expect(res.json).toHaveBeenCalledWith({
        data: [],
        meta: { total: 0, page: 2, pageSize: 10 },
      });
    });
  });

  describe('getById', () => {
    it('returns product when found', async () => {
      const product = buildProduct();
      productsServiceMock.getById.mockResolvedValue(product);
      const req = { params: { id: 'p1' } } as unknown as Request;
      const res = mockResponse();

      await getById(req, res);

      expect(res.json).toHaveBeenCalledWith({ data: product });
    });

    it('sends 404 when missing', async () => {
      productsServiceMock.getById.mockResolvedValue(null);
      const req = { params: { id: 'missing' } } as unknown as Request;
      const res = mockResponse();

      await getById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: { message: 'Not found' } });
    });
  });

  describe('create', () => {
    it('creates product and returns 201', async () => {
      const product = buildProduct();
      productsServiceMock.create.mockResolvedValue(product);
      const req = { body: { name: 'Test' } } as unknown as Request;
      const res = mockResponse();

      await create(req, res);

      expect(productsServiceMock.create).toHaveBeenCalledWith({ name: 'Test' });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ data: product });
    });
  });

  describe('update', () => {
    it('updates product and cleans up removed assets', async () => {
      const existing = buildProduct({
        images: [
          'http://res.cloudinary.com/demo/image/upload/v1/samples/p1.jpg',
          'http://res.cloudinary.com/demo/image/upload/v1/samples/p2.jpg',
        ],
      });
      const updated = buildProduct({ images: [existing.images![0]] });
      productsServiceMock.getById.mockResolvedValue(existing);
      productsServiceMock.update.mockResolvedValue(updated);

      const req = {
        params: { id: 'p1' },
        body: { images: [existing.images![0]] },
      } as unknown as Request;
      const res = mockResponse();

      await update(req, res);

      expect(productsServiceMock.update).toHaveBeenCalledWith('p1', {
        images: [existing.images![0]],
      });
      expect(deleteAssetsByUrlsMock).toHaveBeenCalledWith([existing.images![1]]);
      expect(res.json).toHaveBeenCalledWith({ data: updated });
    });

    it('skips cleanup when images unchanged', async () => {
      const existing = buildProduct();
      productsServiceMock.getById.mockResolvedValue(existing);
      productsServiceMock.update.mockResolvedValue(existing);

      const req = { params: { id: 'p1' }, body: { price: 20 } } as unknown as Request;
      const res = mockResponse();

      await update(req, res);

      expect(deleteAssetsByUrlsMock).not.toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ data: existing });
    });
  });

  describe('remove', () => {
    it('deletes product and its assets', async () => {
      const existing = buildProduct({
        images: ['http://res.cloudinary.com/demo/image/upload/v1/samples/p1.jpg'],
      });
      productsServiceMock.getById.mockResolvedValue(existing);
      productsServiceMock.remove.mockResolvedValue(undefined);

      const req = { params: { id: 'p1' } } as unknown as Request;
      const res = mockResponse();

      await remove(req, res);

      expect(productsServiceMock.remove).toHaveBeenCalledWith('p1');
      expect(deleteAssetsByUrlsMock).toHaveBeenCalledWith(existing.images);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('skips asset deletion when none exist', async () => {
      productsServiceMock.getById.mockResolvedValue(null);
      productsServiceMock.remove.mockResolvedValue(undefined);

      const req = { params: { id: 'p1' } } as unknown as Request;
      const res = mockResponse();

      await remove(req, res);

      expect(deleteAssetsByUrlsMock).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(204);
    });
  });

  describe('stats', () => {
    it('returns stats', async () => {
      productsServiceMock.stats.mockResolvedValue({ count: 1, avgPrice: 10 });
      const req = {} as Request;
      const res = mockResponse();

      await stats(req, res);

      expect(res.json).toHaveBeenCalledWith({ data: { count: 1, avgPrice: 10 } });
    });
  });

  describe('timeseries', () => {
    it('calls service with parsed params', async () => {
      productsServiceMock.timeseries.mockResolvedValue([]);
      const req = { query: { interval: 'week', windowDays: '30' } } as unknown as Request;
      const res = mockResponse();

      await timeseries(req, res);

      expect(productsServiceMock.timeseries).toHaveBeenCalledWith({
        interval: 'week',
        windowDays: 30,
      });
      expect(res.json).toHaveBeenCalledWith({ data: [] });
    });
  });
});
