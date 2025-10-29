import { describe, expect, it, vi } from 'vitest';

const { uploadMock, deleteMock } = vi.hoisted(() => {
  const upload = vi.fn(async (_buffer: Buffer, filename: string) => {
    const sanitized = filename.replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase() || 'asset';
    const url = `https://res.cloudinary.com/test-cloud/image/upload/v123/${sanitized}.png`;
    return { url, publicId: `test-folder/${sanitized}` };
  });
  const remove = vi.fn(async () => {
    // no-op mock for Cloudinary deletion cleanup
  });
  return { uploadMock: upload, deleteMock: remove };
});

vi.mock('../services/cloudinary.service', () => ({
  uploadImageBuffer: uploadMock,
  deleteAssetsByUrls: deleteMock,
  extractPublicIdFromUrl: (url: string) => url,
}));

import request from 'supertest';
import { app } from '../app';
import { authService } from '../services/auth.service';

describe('Server integration: auth, products, uploads', () => {
  let token = '';
  let productId = '';
  let orderId = '';

  it('registers and logs in a user (admin)', async () => {
    const email = `user+${Date.now()}@example.com`;
    const password = 'password123';

    const reg = await request(app)
      .post('/api/v1/auth/register')
      .send({ email, password })
      .expect(201);
    expect(reg.body?.data?.email).toBe(email);
    expect(typeof reg.body?.data?.id).toBe('string');

    const login = await request(app)
      .post('/api/v1/auth/login')
      .send({ email, password })
      .expect(200);
    expect(typeof login.body?.data?.token).toBe('string');
    expect(login.body?.data?.user?.id).toBeDefined();
    if (login.body?.data?.user?.role !== 'admin') {
      await authService.setRole(login.body.data.user.id, 'admin');
      const adminLogin = await request(app)
        .post('/api/v1/auth/login')
        .send({ email, password })
        .expect(200);
      expect(adminLogin.body?.data?.user?.role).toBe('admin');
      expect(typeof adminLogin.body?.data?.token).toBe('string');
      token = adminLogin.body.data.token;
    } else {
      token = login.body.data.token;
    }
  }, 20000);

  it('lists products (empty)', async () => {
    const res = await request(app).get('/api/v1/products').expect(200);
    expect(Array.isArray(res.body?.data)).toBe(true);
    expect(res.body.data.length).toBe(0);
  }, 20000);

  it('creates, fetches, updates a product', async () => {
    const create = await request(app)
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Sample',
        price: 19.99,
        description: '',
        category: 'demo',
        stock: 5,
      })
      .expect(201);

    const p = create.body?.data;
    expect(p?.id).toBeDefined();
    expect(p?.name).toBe('Sample');
    expect(p?.price).toBe(19.99);
    productId = p.id;

    const get = await request(app).get(`/api/v1/products/${productId}`).expect(200);
    expect(get.body?.data?.id).toBe(productId);

    const upd = await request(app)
      .put(`/api/v1/products/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ price: 24.5 })
      .expect(200);
    expect(upd.body?.data?.price).toBe(24.5);
  }, 20000);

  it('returns admin stats with auth', async () => {
    const stats = await request(app)
      .get('/api/v1/products/admin/stats')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(typeof stats.body?.data?.count).toBe('number');
    expect(typeof stats.body?.data?.avgPrice).toBe('number');
    expect(stats.body.data.count).toBeGreaterThanOrEqual(1);
  }, 20000);

  it('uploads an image and serves it', async () => {
    // Tiny fake PNG buffer
    const buf = Buffer.from([
      0x89,
      0x50,
      0x4e,
      0x47,
      0x0d,
      0x0a,
      0x1a,
      0x0a, // PNG header
      0x00,
      0x00,
      0x00,
      0x00,
    ]);

    const up = await request(app)
      .post('/api/v1/uploads')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', buf, { filename: 'tiny.png', contentType: 'image/png' })
      .expect(201);
    const urls: string[] = up.body?.urls;
    expect(Array.isArray(urls)).toBe(true);
    expect(urls.length).toBe(1);
    expect(urls[0]).toMatch(/^https:\/\/res\.cloudinary\.com\/test-cloud\/image\/upload\//);
    expect(uploadMock).toHaveBeenCalledOnce();
  }, 20000);

  it('creates and fetches an order', async () => {
    const create = await request(app)
      .post('/api/v1/orders')
      .set('Authorization', 'Bearer ' + token)
      .send({
        items: [{ productId, quantity: 1 }],
        paymentMethod: 'credit_card',
        shippingAddress: {
          fullName: 'Integration Tester',
          street: '123 Test Street',
          city: 'Testville',
          state: 'TS',
          postalCode: '99999',
          country: 'Testland',
          phone: '555-0101',
        },
        notes: 'Please leave at the door.',
      })
      .expect(201);

    const order = create.body?.data;
    expect(order?.id).toBeDefined();
    expect(order?.status).toBe('pending');
    orderId = order.id;

    const mine = await request(app)
      .get('/api/v1/orders/my')
      .set('Authorization', 'Bearer ' + token);
    if (mine.status !== 200) {
      // Surface the failure for easier debugging
      // eslint-disable-next-line no-console
      console.error('getMyOrders failed', mine.status, mine.body);
    }
    expect(mine.status).toBe(200);
    expect(Array.isArray(mine.body?.data)).toBe(true);
    const orderFromList = (mine.body?.data as Array<{ id: string }> | undefined)?.find(
      (o) => o.id === orderId
    );
    expect(orderFromList).toBeDefined();

    const fetched = await request(app)
      .get(`/api/v1/orders/${orderId}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(200);
    expect(fetched.body?.data?.id).toBe(orderId);
  }, 20000);

  it('cancels the order and returns order stats', async () => {
    const cancel = await request(app)
      .post(`/api/v1/orders/${orderId}/cancel`)
      .set('Authorization', 'Bearer ' + token)
      .expect(200);
    expect(cancel.body?.data?.status).toBe('cancelled');

    const stats = await request(app)
      .get('/api/v1/orders/stats')
      .set('Authorization', 'Bearer ' + token)
      .expect(200);
    expect(typeof stats.body?.data?.totalOrders).toBe('number');
    expect(stats.body.data.totalOrders).toBeGreaterThanOrEqual(1);
  }, 20000);
  it('deletes a product and returns 404 thereafter', async () => {
    await request(app)
      .delete(`/api/v1/products/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);
    await request(app).get(`/api/v1/products/${productId}`).expect(404);
    // deleteMock is only called if product has images; our test product has no images
  }, 20000);

  it('supports password reset flow with rate limiting', async () => {
    const email = `reset+${Date.now()}@example.com`;
    const password = 'initialPass123';
    // Register a new (non-admin) user
    await request(app).post('/api/v1/auth/register').send({ email, password }).expect(201);
    // Request reset (test env returns token)
    const req1 = await request(app)
      .post('/api/v1/auth/password/request')
      .send({ email })
      .expect(202);
    const token1 = req1.body?.data?.token;
    expect(typeof token1).toBe('string');
    // Second immediate request should be rate limited (returns accepted true but no token)
    const req2 = await request(app)
      .post('/api/v1/auth/password/request')
      .send({ email })
      .expect(202);
    expect(req2.body?.data?.token).toBeUndefined();
    // Perform reset
    const newPassword = 'newPass456!';
    await request(app)
      .post('/api/v1/auth/password/reset')
      .send({ token: token1, newPassword })
      .expect(200);
    // Old password fails
    await request(app).post('/api/v1/auth/login').send({ email, password }).expect(401);
    // New password works
    await request(app)
      .post('/api/v1/auth/login')
      .send({ email, password: newPassword })
      .expect(200);
  }, 20000);
});
