import { describe, expect, it, vi } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { requireAuth, requireRole } from '../api/middleware/auth';

const verifyMock = vi.hoisted(() => vi.fn());
const loadEnvMock = vi.hoisted(() => vi.fn(() => ({ JWT_SECRET: 'test-secret' })));

vi.mock('jsonwebtoken', () => ({
  default: { verify: verifyMock },
}));

vi.mock('../config/env', () => ({
  loadEnv: loadEnvMock,
}));

function createResponse() {
  const res: Partial<Response> = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res as Response & {
    status: ReturnType<typeof vi.fn>;
    json: ReturnType<typeof vi.fn>;
  };
}

describe('requireAuth middleware', () => {
  it('responds 401 when no token is provided', () => {
    const req = { headers: {} } as Request;
    const res = createResponse();
    const next = vi.fn();

    requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: { message: 'Unauthenticated' } });
    expect(next).not.toHaveBeenCalled();
  });

  it('responds 401 when token verification fails', () => {
    verifyMock.mockImplementationOnce(() => {
      throw new Error('bad token');
    });
    const req = { headers: { authorization: 'Bearer token' } } as Request;
    const res = createResponse();
    const next = vi.fn();

    requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: { message: 'Invalid token' } });
  });

  it('responds 401 when payload lacks required claims', () => {
    verifyMock.mockReturnValueOnce({ sub: 'user-1' });
    const req = { headers: { authorization: 'Bearer token' } } as Request;
    const res = createResponse();
    const next = vi.fn();

    requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: { message: 'Invalid token' } });
  });

  it('attaches user to request and calls next on success', () => {
    verifyMock.mockReturnValueOnce({
      id: 'user-1',
      role: 'admin',
      email: 'user@example.com',
    });
    const req: any = { headers: { authorization: 'Bearer token' } };
    const res = createResponse();
    const next = vi.fn();

    requireAuth(req, res, next);

    expect(req.user).toEqual({
      id: 'user-1',
      role: 'admin',
      email: 'user@example.com',
    });
    expect(next).toHaveBeenCalledTimes(1);
  });
});

describe('requireRole middleware', () => {
  it('rejects when user missing', () => {
    const guard = requireRole('admin');
    const req = {} as Request;
    const res = createResponse();
    const next = vi.fn();

    guard(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: { message: 'Forbidden' } });
    expect(next).not.toHaveBeenCalled();
  });

  it('rejects when role does not match', () => {
    const guard = requireRole('admin');
    const req = { user: { id: '1', role: 'user' } } as unknown as Request;
    const res = createResponse();
    const next = vi.fn();

    guard(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: { message: 'Forbidden' } });
  });

  it('allows matching roles', () => {
    const guard = requireRole('admin');
    const req = { user: { id: '1', role: 'admin' } } as unknown as Request;
    const res = createResponse();
    const next = vi.fn();

    guard(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
