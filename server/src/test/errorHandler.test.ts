import { describe, it, expect, vi } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { errorHandler } from '../api/middleware/error';

function createMockRes() {
  const res: Partial<Response> & { _status?: number; _json?: any } = {};
  (res as any).status = vi.fn().mockImplementation((code: number) => {
    res._status = code;
    return res as any;
  });
  (res as any).json = vi.fn().mockImplementation((payload: any) => {
    res._json = payload;
    return res as any;
  });
  return res as Response & { _status?: number; _json?: any };
}

describe('errorHandler', () => {
  it('maps Firestore failed-precondition (index) errors to 400 with indexUrl', () => {
    const err = {
      code: 'failed-precondition',
      message:
        '9 FAILED_PRECONDITION: The query requires an index. You can create it here: https://console.firebase.google.com/v1/r/...',
    };
    const res = createMockRes();
    errorHandler(err, {} as Request, res, {} as NextFunction);
    expect(res._status).toBe(400);
    expect(res._json?.error?.message).toContain('Firestore index required');
    expect(res._json?.error?.indexUrl).toContain('https://');
  });

  it('maps transaction reads-before-writes error to 400 with friendly message', () => {
    const err = new Error(
      'Firestore transactions require all reads to be executed before all writes.'
    );
    const res = createMockRes();
    errorHandler(err, {} as Request, res, {} as NextFunction);
    expect(res._status).toBe(400);
    expect(res._json?.error?.message).toContain('transaction precondition');
  });

  it('falls back to 500 for generic errors', () => {
    const err = new Error('Unexpected');
    const res = createMockRes();
    errorHandler(err, {} as Request, res, {} as NextFunction);
    expect(res._status).toBe(500);
    expect(res._json?.error?.message).toBe('Unexpected');
  });
});
