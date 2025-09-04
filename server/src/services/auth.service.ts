import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { loadEnv } from '../config/env';

/**
 * In-memory user store for demo/testing only.
 * NOTE: Data is ephemeral and will reset on process restart.
 */
const users = new Map<
  string,
  { id: string; email: string; passwordHash: string; role: 'user' | 'admin' }
>();

export const authService = {
  /**
   * Register a new user.
   * - The very first registered user becomes an admin (for demo/testing).
   * - Stores only a bcrypt password hash.
   *
   * @param email User's email (unique key in the in-memory store)
   * @param password Plaintext password (will be hashed)
   * @returns Basic user identity (id and email)
   */
  async register({ email, password }: { email: string; password: string }) {
    const id = randomUUID();
    const passwordHash = await bcrypt.hash(password, 10);
    // Make the very first registered user an admin (for demo/testing)
    const role: 'user' | 'admin' = users.size === 0 ? 'admin' : 'user';
    const user = { id, email, passwordHash, role };
    users.set(email, user);
    return { id, email };
  },
  /**
   * Authenticate a user with email and password.
   *
   * @param email User's email
   * @param password Plaintext password
   * @throws Error with status 401 on invalid credentials
   * @returns A signed JWT (15m) and minimal user info (id, role)
   */
  async login({ email, password }: { email: string; password: string }) {
    const user = users.get(email);
    if (!user) throw Object.assign(new Error('Invalid credentials'), { status: 401 });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw Object.assign(new Error('Invalid credentials'), { status: 401 });
    const token = jwt.sign({ sub: user.id, role: user.role }, loadEnv().JWT_SECRET, {
      expiresIn: '15m',
    });
    return { token, user: { id: user.id, role: user.role } };
  },
  /**
   * List users (admin view). Returns non-sensitive fields only.
   */
  async listUsers(): Promise<Array<{ id: string; email: string; role: 'user' | 'admin' }>> {
    return Array.from(users.values()).map((u) => ({ id: u.id, email: u.email, role: u.role }));
  },
  /**
   * Remove a user by id (admin action).
   */
  async removeUser(id: string): Promise<void> {
    // Find by id (map is keyed by email)
    for (const [email, u] of users.entries()) {
      if (u.id === id) {
        users.delete(email);
        break;
      }
    }
  },
};
