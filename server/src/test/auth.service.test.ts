import { beforeEach, describe, expect, it, vi } from 'vitest';
import crypto from 'crypto';
import { authService } from '../services/auth.service';

const hashMock = vi.hoisted(() => vi.fn());
const compareMock = vi.hoisted(() => vi.fn());
const signMock = vi.hoisted(() => vi.fn());
const usersRepoMock = vi.hoisted(() => ({
  createInitialUser: vi.fn(),
  findByEmail: vi.fn(),
  list: vi.fn(),
  remove: vi.fn(),
  setRole: vi.fn(),
  updatePassword: vi.fn(),
}));
const getDbMock = vi.hoisted(() => vi.fn());
const sendPasswordResetMock = vi.hoisted(() => vi.fn());
const sendOrderStatusUpdateMock = vi.hoisted(() => vi.fn());
const loadEnvMock = vi.hoisted(() =>
  vi.fn(() => ({
    JWT_SECRET: 'secret',
    JWT_EXPIRES_IN: '15m',
    PASSWORD_RESET_TTL_MINUTES: 60,
    PASSWORD_RESET_RATE_LIMIT_MINUTES: 5,
  }))
);

vi.mock('bcrypt', () => ({
  default: { hash: hashMock, compare: compareMock },
  hash: hashMock,
  compare: compareMock,
}));

vi.mock('jsonwebtoken', () => ({
  default: { sign: signMock },
  sign: signMock,
}));

vi.mock('../data/firestore/users.repo.fs', () => ({
  fsUsersRepo: usersRepoMock,
}));

vi.mock('../config/firestore', () => ({
  getDb: getDbMock,
}));

vi.mock('../services/email.service', () => ({
  emailService: { sendPasswordReset: sendPasswordResetMock },
}));

vi.mock('../config/env', () => ({
  loadEnv: loadEnvMock,
}));

describe('authService', () => {
  beforeEach(() => {
    hashMock.mockReset().mockResolvedValue('hashed-password');
    compareMock.mockReset().mockResolvedValue(true);
    signMock.mockReset().mockReturnValue('jwt-token');
    loadEnvMock.mockReset().mockReturnValue({
      JWT_SECRET: 'secret',
      JWT_EXPIRES_IN: '15m',
      PASSWORD_RESET_TTL_MINUTES: 60,
      PASSWORD_RESET_RATE_LIMIT_MINUTES: 5,
    });
    (Object.values(usersRepoMock) as vi.Mock[]).forEach((fn) => fn.mockReset());
    getDbMock.mockReset();
    sendPasswordResetMock.mockReset();
  });

  describe('register', () => {
    it('hashes password and delegates to repository', async () => {
      usersRepoMock.createInitialUser.mockResolvedValue({
        id: 'user-1',
        email: 'user@example.com',
        passwordHash: 'hashed-password',
        role: 'admin',
      });

      const result = await authService.register({
        email: 'user@example.com',
        password: 'plain',
      });

      expect(hashMock).toHaveBeenCalledWith('plain', 10);
      expect(usersRepoMock.createInitialUser).toHaveBeenCalledWith({
        email: 'user@example.com',
        passwordHash: 'hashed-password',
      });
      expect(result).toEqual({ id: 'user-1', email: 'user@example.com' });
    });
  });

  describe('login', () => {
    it('throws when user does not exist', async () => {
      usersRepoMock.findByEmail.mockResolvedValue(null);

      await expect(
        authService.login({ email: 'missing@example.com', password: 'plain' })
      ).rejects.toMatchObject({ message: 'Invalid credentials', status: 401 });
    });

    it('throws when password mismatch', async () => {
      usersRepoMock.findByEmail.mockResolvedValue({
        id: 'user-1',
        email: 'user@example.com',
        passwordHash: 'hashed-password',
        role: 'user',
      });
      compareMock.mockResolvedValue(false);

      await expect(
        authService.login({ email: 'user@example.com', password: 'wrong' })
      ).rejects.toMatchObject({ message: 'Invalid credentials', status: 401 });
    });

    it('returns token and user data on success', async () => {
      usersRepoMock.findByEmail.mockResolvedValue({
        id: 'user-1',
        email: 'user@example.com',
        passwordHash: 'hashed-password',
        role: 'user',
      });

      const result = await authService.login({ email: 'user@example.com', password: 'plain' });

      expect(compareMock).toHaveBeenCalledWith('plain', 'hashed-password');
      expect(signMock).toHaveBeenCalledWith(
        {
          sub: 'user-1',
          id: 'user-1',
          email: 'user@example.com',
          role: 'user',
        },
        'secret',
        { expiresIn: '15m' }
      );
      expect(result).toEqual({
        token: 'jwt-token',
        user: { id: 'user-1', email: 'user@example.com', role: 'user' },
      });
    });
  });

  describe('user management wrappers', () => {
    it('lists users from repository', async () => {
      const users = [{ id: '1', email: 'a@example.com', role: 'user' }];
      usersRepoMock.list.mockResolvedValue(users);

      const result = await authService.listUsers();

      expect(result).toBe(users);
    });

    it('removes users via repository', async () => {
      await authService.removeUser('user-1');
      expect(usersRepoMock.remove).toHaveBeenCalledWith('user-1');
    });

    it('updates user roles via repository', async () => {
      usersRepoMock.setRole.mockResolvedValue({
        id: 'user-1',
        email: 'user@example.com',
        role: 'admin',
        passwordHash: '',
      });

      const result = await authService.setRole('user-1', 'admin');

      expect(usersRepoMock.setRole).toHaveBeenCalledWith('user-1', 'admin');
      expect(result.role).toBe('admin');
    });
  });

  describe('requestPasswordReset', () => {
    it('returns silently when user not found', async () => {
      usersRepoMock.findByEmail.mockResolvedValue(null);

      const result = await authService.requestPasswordReset('missing@example.com');

      expect(result).toBeUndefined();
      expect(getDbMock).not.toHaveBeenCalled();
    });

    it('creates reset token when allowed', async () => {
      const now = 1_000_000;
      const dateSpy = vi.spyOn(Date, 'now').mockReturnValue(now);
      const randomSpy = vi.spyOn(crypto, 'randomBytes').mockReturnValue(Buffer.alloc(32, 1));

      const rlDoc = {
        get: vi.fn().mockResolvedValue({ exists: false }),
        set: vi.fn().mockResolvedValue(undefined),
      };
      const resetDoc = {
        set: vi.fn().mockResolvedValue(undefined),
      };
      const collections: Record<string, { doc: (id: string) => any }> = {
        password_reset_rl: { doc: vi.fn(() => rlDoc) },
        password_resets: { doc: vi.fn(() => resetDoc) },
      };
      getDbMock.mockReturnValue({
        collection: vi.fn((name: string) => collections[name]),
      });
      usersRepoMock.findByEmail.mockResolvedValue({
        id: 'user-1',
        email: 'user@example.com',
        passwordHash: 'hash',
        role: 'user',
      });

      const result = await authService.requestPasswordReset('user@example.com');

      expect(result?.token).toHaveLength(64);
      expect(resetDoc.set).toHaveBeenCalled();
      expect(rlDoc.set).toHaveBeenCalledWith({ nextAllowedAt: now + 5 * 60_000 });

      randomSpy.mockRestore();
      dateSpy.mockRestore();
    });

    it('rate limits repeated requests', async () => {
      const now = 1_000_000;
      const dateSpy = vi.spyOn(Date, 'now').mockReturnValue(now);
      usersRepoMock.findByEmail.mockResolvedValue({
        id: 'user-1',
        email: 'user@example.com',
        passwordHash: 'hash',
        role: 'user',
      });
      const rlDoc = {
        get: vi.fn().mockResolvedValue({
          exists: true,
          data: () => ({ nextAllowedAt: now + 1 }),
        }),
        set: vi.fn(),
      };
      const resetDoc = { set: vi.fn() };
      getDbMock.mockReturnValue({
        collection: vi.fn((name: string) =>
          name === 'password_reset_rl'
            ? { doc: vi.fn(() => rlDoc) }
            : { doc: vi.fn(() => resetDoc) }
        ),
      });

      const result = await authService.requestPasswordReset('user@example.com');

      expect(result).toBeUndefined();
      expect(resetDoc.set).not.toHaveBeenCalled();

      dateSpy.mockRestore();
    });
  });

  describe('resetPassword', () => {
    it('throws when token missing', async () => {
      const ref = {
        get: vi.fn().mockResolvedValue({ exists: false }),
        delete: vi.fn(),
      };
      getDbMock.mockReturnValue({
        collection: vi.fn(() => ({ doc: vi.fn(() => ref) })),
      });

      await expect(authService.resetPassword('token', 'newpass')).rejects.toMatchObject({
        message: 'Invalid or expired reset token',
        status: 400,
      });
    });

    it('throws when token expired', async () => {
      const now = 1_000_000;
      const dateSpy = vi.spyOn(Date, 'now').mockReturnValue(now);
      const deleteFn = vi.fn().mockResolvedValue(undefined);
      const ref = {
        get: vi.fn().mockResolvedValue({
          exists: true,
          data: () => ({ userId: 'user-1', expiresAt: now - 1 }),
        }),
        delete: deleteFn,
      };
      getDbMock.mockReturnValue({
        collection: vi.fn(() => ({ doc: vi.fn(() => ref) })),
      });

      await expect(authService.resetPassword('token', 'newpass')).rejects.toMatchObject({
        message: 'Invalid or expired reset token',
        status: 400,
      });
      expect(deleteFn).toHaveBeenCalled();

      dateSpy.mockRestore();
    });

    it('updates password and deletes token', async () => {
      const now = 1_000_000;
      const dateSpy = vi.spyOn(Date, 'now').mockReturnValue(now);
      const deleteFn = vi.fn().mockResolvedValue(undefined);
      const ref = {
        get: vi.fn().mockResolvedValue({
          exists: true,
          data: () => ({ userId: 'user-1', expiresAt: now + 1_000 }),
        }),
        delete: deleteFn,
      };
      getDbMock.mockReturnValue({
        collection: vi.fn(() => ({ doc: vi.fn(() => ref) })),
      });
      hashMock.mockResolvedValueOnce('new-hash');

      await authService.resetPassword('token', 'newpass123');

      expect(hashMock).toHaveBeenCalledWith('newpass123', 10);
      expect(usersRepoMock.updatePassword).toHaveBeenCalledWith('user-1', 'new-hash');
      expect(deleteFn).toHaveBeenCalled();

      dateSpy.mockRestore();
    });
  });
});
