import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { randomBytes, createHash } from 'crypto';
import { loadEnv } from '../config/env';
import { fsUsersRepo } from '../data/firestore/users.repo.fs';
import { getDb } from '../config/firestore';
import { emailService } from './email.service';

// Firestore-backed auth service (no in-memory persistence).
export const authService = {
  async register({ email, password }: { email: string; password: string }) {
    const passwordHash = await bcrypt.hash(password, 10);
    // Attempt to create as initial admin if none exists yet; falls back to normal user.
    const user = await fsUsersRepo.createInitialUser({ email, passwordHash });
    return { id: user.id, email: user.email };
  },
  async login({ email, password }: { email: string; password: string }) {
    const user = await fsUsersRepo.findByEmail(email);
    if (!user) throw Object.assign(new Error('Invalid credentials'), { status: 401 });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw Object.assign(new Error('Invalid credentials'), { status: 401 });
    const token = jwt.sign({ sub: user.id, role: user.role }, loadEnv().JWT_SECRET, {
      expiresIn: '15m',
    });
    return { token, user: { id: user.id, role: user.role } };
  },
  async listUsers() {
    return fsUsersRepo.list();
  },
  async removeUser(id: string) {
    await fsUsersRepo.remove(id);
  },
  async setRole(id: string, role: 'user' | 'admin') {
    return fsUsersRepo.setRole(id, role);
  },
  /**
   * Initiate a password reset: creates a one-time token (valid 1h) stored hashed in Firestore.
   * Returns the raw token (for demo/testing; in production email it to the user).
   */
  async requestPasswordReset(email: string): Promise<void | { token: string }> {
    const user = await fsUsersRepo.findByEmail(email);
    if (!user) return; // Do not leak existence
    const db = getDb();
    const rlRef = db.collection('password_reset_rl').doc(user.id);
    const rlSnap = await rlRef.get();
    const now = Date.now();
    if (rlSnap.exists) {
      const { nextAllowedAt } = rlSnap.data() as { nextAllowedAt: number };
      if (now < nextAllowedAt) return; // silently ignore - rate limited
    }
    const raw = randomBytes(32).toString('hex');
    const hash = createHash('sha256').update(raw).digest('hex');
    const ref = db.collection('password_resets').doc(hash);
    await Promise.all([
      ref.set({ userId: user.id, createdAt: now, expiresAt: now + 3600_000 }),
      rlRef.set({ nextAllowedAt: now + 5 * 60_000 }),
    ]);
    if (process.env.NODE_ENV !== 'test') {
      // Fire and forget email (do not await to keep endpoint fast)
      void emailService.sendPasswordReset({ to: user.email, token: raw }).catch(() => {});
    }
    return { token: raw };
  },
  /**
   * Complete password reset given a raw token and new password.
   */
  async resetPassword(token: string, newPassword: string) {
    const hash = createHash('sha256').update(token).digest('hex');
    const db = getDb();
    const ref = db.collection('password_resets').doc(hash);
    const snap = await ref.get();
    if (!snap.exists)
      throw Object.assign(new Error('Invalid or expired reset token'), { status: 400 });
    const data = snap.data() as { userId: string; expiresAt: number };
    if (Date.now() > data.expiresAt) {
      await ref.delete().catch(() => {});
      throw Object.assign(new Error('Invalid or expired reset token'), { status: 400 });
    }
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await fsUsersRepo.updatePassword(data.userId, passwordHash);
    await ref.delete().catch(() => {});
  },
};
