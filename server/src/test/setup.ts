// Global test setup for server integration tests.
// - Force in-memory data store
// - Provide a JWT secret
// - Configure Cloudinary env vars for test doubles

process.env.DATA_STORE = 'memory';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-1234567890';
process.env.UPLOAD_MAX_MB = process.env.UPLOAD_MAX_MB || '2';
process.env.CLOUDINARY_URL = process.env.CLOUDINARY_URL || 'cloudinary://test:test@test-cloud';
process.env.CLOUDINARY_UPLOAD_FOLDER = process.env.CLOUDINARY_UPLOAD_FOLDER || 'test-suite';
