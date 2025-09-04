import request from 'supertest';
import { app } from '../app';

describe('Server integration: auth, products, uploads', () => {
  let token = '';
  let productId = '';

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
    expect(login.body?.data?.user?.role).toBe('admin'); // first user becomes admin
    token = login.body.data.token;
  });

  it('lists products (empty)', async () => {
    const res = await request(app).get('/api/v1/products').expect(200);
    expect(Array.isArray(res.body?.data)).toBe(true);
    expect(res.body.data.length).toBe(0);
  });

  it('creates, fetches, updates a product', async () => {
    const create = await request(app)
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Sample',
        price: 19.99,
        description: '',
        category: 'demo',
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
  });

  it('returns admin stats with auth', async () => {
    const stats = await request(app)
      .get('/api/v1/products/admin/stats')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(typeof stats.body?.data?.count).toBe('number');
    expect(typeof stats.body?.data?.avgPrice).toBe('number');
    expect(stats.body.data.count).toBeGreaterThanOrEqual(1);
  });

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
    expect(urls[0]).toMatch(/\/api\/v1\/files\//);

    // Should be accessible via static route
    await request(app).get(urls[0]).expect(200);
  });

  it('deletes a product and returns 404 thereafter', async () => {
    await request(app)
      .delete(`/api/v1/products/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);
    await request(app).get(`/api/v1/products/${productId}`).expect(404);
  });
});
