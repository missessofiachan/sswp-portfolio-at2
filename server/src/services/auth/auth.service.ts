/**
 * Authentication service layer responsible for credential workflows, JWT
 * issuance, password resets, and role administration. Wraps Firestore-backed
 * repositories, hashing utilities, and email/token subsystems to expose a
 * cohesive API for controllers.
 */

import { loadEnv } from '@server/config/env';
import { getDb } from '@server/config/firestore';
import { fsUsersRepo } from '@server/data/firestore/users.repo.fs';
import bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { tokenRevocationService } from './tokenRevocation.service';

/**
 * Authentication Service
 *
 * Provides comprehensive authentication and user management functionality
 * for Sofia's Shop. Handles user registration, login, password resets,
 * and admin operations with secure password hashing and JWT tokens.
 *
 * **Features:**
 * - User registration with automatic admin assignment for first user
 * - Secure password hashing with bcrypt
 * - JWT token generation with configurable expiration
 * - Password reset flow with secure token generation
 * - User role management (admin/user)
 * - Account cleanup and user deletion
 *
 * **Security:**
 * - Passwords are hashed with bcrypt (10 rounds)
 * - JWT tokens expire after 15 minutes
 * - Password reset tokens expire after 1 hour
 * - Constant-time comparisons for credentials
 * - Secure random token generation for password resets
 *
 * @namespace authService
 */
export const authService = {
  /**
   * Registers a new user with email and password.
   *
   * The first registered user automatically becomes an admin.
   * Subsequent users are assigned the 'user' role by default.
   *
   * @param {Object} credentials - User registration data
   * @param {string} credentials.email - User's email address
   * @param {string} credentials.password - User's plain text password
   * @returns {Promise<{id: string, email: string}>} Created user data
   * @throws {Error} When email already exists or validation fails
   *
   * @example
   * ```typescript
   * const user = await authService.register({
   *   email: 'user@example.com',
   *   password: 'securePassword123'
   * });
   * console.log(`Created user: ${user.email}`);
   * ```
   */
  async register({ email, password }: { email: string; password: string }) {
    const passwordHash = await bcrypt.hash(password, 10);
    // Attempt to create as initial admin if none exists yet; falls back to normal user.
    const user = await fsUsersRepo.createInitialUser({ email, passwordHash });
    return { id: user.id, email: user.email };
  },

  /**
   * Authenticates a user with email and password, returning a JWT token.
   *
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.email - User's email address
   * @param {string} credentials.password - User's plain text password
   * @returns {Promise<{token: string, user: {id: string, role: string}}>} JWT token and user data
   * @throws {Error} With status 401 when credentials are invalid
   *
   * @example
   * ```typescript
   * try {
   *   const result = await authService.login({
   *     email: 'user@example.com',
   *     password: 'userPassword'
   *   });
   *   console.log(`Token: ${result.token}`);
   *   console.log(`User role: ${result.user.role}`);
   * } catch (error) {
   *   console.error('Login failed:', error.message);
   * }
   * ```
   */
  async login({ email, password }: { email: string; password: string }) {
    const user = await fsUsersRepo.findByEmail(email);
    if (!user) throw Object.assign(new Error('Invalid credentials'), { status: 401 });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw Object.assign(new Error('Invalid credentials'), { status: 401 });
    const env = loadEnv();
    // Include explicit id/email for downstream middleware while preserving standard sub claim.
    const payload = { sub: user.id, id: user.id, email: user.email, role: user.role };
    const signOptions: SignOptions = {
      expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
    };
    const token = jwt.sign(payload, env.JWT_SECRET, signOptions);
    return { token, user: { id: user.id, email: user.email, role: user.role } };
  },

  /**
   * Retrieves a list of all registered users (admin only).
   *
   * @returns {Promise<Array>} Array of user objects with id, email, role
   * @throws {Error} When database access fails
   */
  async listUsers() {
    return fsUsersRepo.list();
  },

  /**
   * Removes a user account by ID (admin only).
   *
   * @param {string} id - User ID to remove
   * @returns {Promise<void>}
   * @throws {Error} When user not found or database error occurs
   */
  async removeUser(id: string) {
    await fsUsersRepo.remove(id);
  },

  /**
   * Updates a user's role (admin only).
   *
   * @param {string} id - User ID to update
   * @param {'user'|'admin'} role - New role to assign
   * @returns {Promise<Object>} Updated user object
   * @throws {Error} When user not found or invalid role provided
   */
  async setRole(id: string, role: 'user' | 'admin') {
    return fsUsersRepo.setRole(id, role);
  },
  /**
   * Initiate a password reset by creating a one-time token (valid 1h) stored hashed in Firestore.
   * Returns the raw token so the caller can deliver it through any approved channel.
   */
  async requestPasswordReset(email: string): Promise<void | { token: string }> {
    const user = await fsUsersRepo.findByEmail(email);
    if (!user) return; // Do not leak existence
    const env = loadEnv();
    const db = getDb();
    const rlRef = db.collection('password_reset_rl').doc(user.id);
    const rlSnap = await rlRef.get();
    const now = Date.now();
    const rateLimitMs = env.PASSWORD_RESET_RATE_LIMIT_MINUTES * 60_000;
    if (rlSnap.exists) {
      const { nextAllowedAt } = rlSnap.data() as { nextAllowedAt: number };
      if (now < nextAllowedAt) return; // silently ignore - rate limited
    }
    const raw = randomBytes(32).toString('hex');
    const hash = createHash('sha256').update(raw).digest('hex');
    const ref = db.collection('password_resets').doc(hash);
    const tokenTtlMs = env.PASSWORD_RESET_TTL_MINUTES * 60_000;
    await Promise.all([
      ref.set({ userId: user.id, createdAt: now, expiresAt: now + tokenTtlMs }),
      rlRef.set({ nextAllowedAt: now + rateLimitMs }),
    ]);
    return { token: raw };
  },
  /**
   * Complete password reset given a raw token and new password.
   * Revokes all existing tokens for the user after password change.
   *
   * @returns The userId whose password was reset (for audit logging)
   */
  async resetPassword(token: string, newPassword: string): Promise<string> {
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

    // Revoke all existing tokens for security
    await tokenRevocationService.revokeAllTokens(data.userId, 'password_change');

    return data.userId;
  },
};
