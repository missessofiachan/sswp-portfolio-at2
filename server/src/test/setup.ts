// Global test setup for server integration tests.
// - Force in-memory data store
// - Provide a JWT secret
// - Clean uploads directory before/after tests

import fs from 'fs/promises';
import path from 'path';

process.env.DATA_STORE = 'memory';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-1234567890';
process.env.UPLOAD_MAX_MB = process.env.UPLOAD_MAX_MB || '2';

const uploadsDir = path.resolve(process.cwd(), 'uploads');

beforeAll(async () => {
  await fs.rm(uploadsDir, { recursive: true, force: true });
});

afterAll(async () => {
  await fs.rm(uploadsDir, { recursive: true, force: true });
});
