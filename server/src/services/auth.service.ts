import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { loadEnv } from '../config/env';

const users = new Map<
  string,
  { id: string; email: string; passwordHash: string; role: 'user' | 'admin' }
>();

export const authService = {
  async register({ email, password }: { email: string; password: string }) {
    const id = crypto.randomUUID();
    const passwordHash = await bcrypt.hash(password, 10);
    // Make the very first registered user an admin (for demo/testing)
    const role: 'user' | 'admin' = users.size === 0 ? 'admin' : 'user';
    const user = { id, email, passwordHash, role };
    users.set(email, user);
    return { id, email };
  },
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
};
