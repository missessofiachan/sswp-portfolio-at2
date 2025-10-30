import { describe, it, expect, vi } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { errorHandler } from '../api/middleware/error';

function mockRes() {
  const res: Partial<Response> & { statusCode?: number; payload?: any } = {};
  res.status = vi.fn().mockImplementation((code: number) => {
    res.statusCode = code;
    return res as any;
  });
  res.json = vi.fn().mockImplementation((body: any) => {
    res.payload = body;
    return res as any;
  });
  return res as Response & { statusCode?: number; payload?: any };
}

describe('errorHandler', () => {
  it('maps Firestore index error to 400 with indexUrl', () => {
    const err = new Error(
      '9 FAILED_PRECONDITION: The query requires an index. You can create it here: https://console.firebase.google.com/some/link'
    ) as any;
    err.code = 'failed-precondition';

    const res = mockRes();
    errorHandler(err, {} as Request, res, {} as NextFunction);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.payload?.error?.message).toContain('Firestore index required');
    expect(res.payload?.error?.indexUrl).toContain('https://');
  });

  it('maps transaction read-before-write error to 400', () => {
    const err = new Error(
      'Firestore transactions require all reads to be executed before all writes.'
    );
    const res = mockRes();
    errorHandler(err, {} as Request, res, {} as NextFunction);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.payload?.error?.message).toContain('transaction precondition');
  });
});
