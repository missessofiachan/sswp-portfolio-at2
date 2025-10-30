/**
 * Integration tests for authentication endpoints
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import { app } from '../../src/app';

describe('Authentication Endpoints', () => {
  const testUser = {
    email: `test-${Date.now()}@example.com`,
    password: 'SecurePass123!',
    name: 'Test User',
  };

  let authToken: string;

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app).post('/api/v1/auth/register').send(testUser).expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(testUser.email);
      expect(response.body.user.name).toBe(testUser.name);
      expect(response.body.user).not.toHaveProperty('password');

      authToken = response.body.token;
    });

    it('should reject registration with existing email', async () => {
      const response = await request(app).post('/api/v1/auth/register').send(testUser).expect(400);

      expect(response.body.error).toBeDefined();
      expect(response.body.error.message).toContain('exists');
    });

    it('should reject registration with invalid email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'invalid-email',
          password: 'SecurePass123!',
          name: 'Test',
        })
        .expect(400);

      expect(response.body.error).toBeDefined();
    });

    it('should reject registration with weak password', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: `test-weak-${Date.now()}@example.com`,
          password: '123', // Too short
          name: 'Test',
        })
        .expect(400);

      expect(response.body.error).toBeDefined();
    });

    it('should enforce rate limiting on registration', async () => {
      const promises = [];

      // Make 10 rapid requests (limit is 5 per 15 minutes)
      for (let i = 0; i < 10; i++) {
        promises.push(
          request(app)
            .post('/api/v1/auth/register')
            .send({
              email: `flood-test-${Date.now()}-${i}@example.com`,
              password: 'SecurePass123!',
              name: 'Flood Test',
            })
        );
      }

      const responses = await Promise.all(promises);
      const rateLimited = responses.filter((r) => r.status === 429);

      expect(rateLimited.length).toBeGreaterThan(0);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(testUser.email);
    });

    it('should reject login with invalid password', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword123!',
        })
        .expect(401);

      expect(response.body.error).toBeDefined();
      expect(response.body.error.message).toContain('Invalid');
    });

    it('should reject login with non-existent email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'SecurePass123!',
        })
        .expect(401);

      expect(response.body.error).toBeDefined();
    });

    it('should reject login with missing fields', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: testUser.email })
        .expect(400);

      expect(response.body.error).toBeDefined();
    });
  });

  describe('POST /api/v1/auth/password/request', () => {
    it('should accept password reset request for existing email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/password/request')
        .send({ email: testUser.email })
        .expect(200);

      expect(response.body.message).toBeDefined();
    });

    it('should not reveal if email exists (security)', async () => {
      const response = await request(app)
        .post('/api/v1/auth/password/request')
        .send({ email: 'nonexistent@example.com' })
        .expect(200);

      // Should return success even for non-existent emails
      expect(response.body.message).toBeDefined();
    });

    it('should reject invalid email format', async () => {
      const response = await request(app)
        .post('/api/v1/auth/password/request')
        .send({ email: 'invalid-email' })
        .expect(400);

      expect(response.body.error).toBeDefined();
    });
  });

  describe('Authentication Middleware', () => {
    it('should allow access to protected routes with valid token', async () => {
      const response = await request(app)
        .get('/api/v1/admin/users')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toBeDefined();
    });

    it('should reject access without token', async () => {
      const response = await request(app).get('/api/v1/admin/users').expect(401);

      expect(response.body.error).toBeDefined();
    });

    it('should reject access with invalid token', async () => {
      const response = await request(app)
        .get('/api/v1/admin/users')
        .set('Authorization', 'Bearer invalid.token.here')
        .expect(401);

      expect(response.body.error).toBeDefined();
    });

    it('should reject access with expired token', async () => {
      // Create a token that's already expired
      const expiredToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJpYXQiOjE2MDk0NTkyMDAsImV4cCI6MTYwOTQ1OTIwMX0.test';

      const response = await request(app)
        .get('/api/v1/admin/users')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);

      expect(response.body.error).toBeDefined();
    });
  });

  // Cleanup: In a real test suite, you'd want to delete the test user
  // For this example, we'll leave it in Firestore (or use test Firestore emulator)
});
