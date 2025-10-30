import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import { axiosInstance } from '../src/lib/axios';

let mock: MockAdapter;

describe('axios error normalization', () => {
  beforeEach(() => {
    mock = new MockAdapter(axiosInstance);
  });

  afterEach(() => {
    mock.restore();
  });

  it('normalizes server error with details and indexUrl', async () => {
    mock.onGet('/test').reply(400, {
      error: {
        message: 'Firestore index required for this query',
        details: [{ field: 'status', message: 'requires index' }],
        indexUrl: 'https://console.firebase.google.com/...',
      },
    });

    try {
      await axiosInstance.get('/test');
      throw new Error('Expected request to fail');
    } catch (e: any) {
      expect(e).toBeInstanceOf(Error);
      expect(e.message).toContain('Firestore index required');
      expect(e.status).toBe(400);
      expect(e.details).toBeTruthy();
      expect(Array.isArray(e.details) || typeof e.details === 'object').toBe(true);
      expect(e.indexUrl).toContain('https://');
    }
  });
});
