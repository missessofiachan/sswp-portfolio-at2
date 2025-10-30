import { describe, it, expect } from 'vitest';
import { normalizeAxiosError } from '../src/lib/axios';

function makeErr(payload: any) {
  return { response: { status: payload.status ?? 400, data: payload.data } } as any;
}

describe('normalizeAxiosError', () => {
  it('maps message, details and indexUrl from server error envelope', () => {
    const err = makeErr({
      status: 400,
      data: {
        error: {
          message: 'Firestore index required for this query',
          details: [{ field: 'status', message: 'Requires composite index' }],
          indexUrl: 'https://console.firebase.google.com/some/link',
        },
      },
    });
    const e: any = normalizeAxiosError(err);
    expect(e).toBeInstanceOf(Error);
    expect(e.message).toContain('Firestore index required');
    expect(e.status).toBe(400);
    expect(Array.isArray(e.details)).toBe(true);
    expect(e.indexUrl).toContain('https://');
  });

  it('falls back to top-level message when error envelope missing', () => {
    const err = makeErr({ status: 422, data: { message: 'Validation failed' } });
    const e: any = normalizeAxiosError(err);
    expect(e.message).toBe('Validation failed');
    expect(e.status).toBe(422);
  });

  it('uses err.message when no response data', () => {
    const e: any = normalizeAxiosError(new Error('Network error'));
    expect(e.message).toBe('Network error');
    expect(e.status).toBeUndefined();
  });
});
