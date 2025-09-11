import { getDb } from '../../config/firestore';
import type { User } from '../../domain/user';

const USERS_COL = 'users';
const EMAILS_COL = 'emails'; // docs keyed by normalized email => { userId, createdAt }

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export interface UsersRepo {
  createInitialUser(input: { email: string; passwordHash: string }): Promise<User>;
  createUser(input: { email: string; passwordHash: string }): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  list(): Promise<Array<Pick<User, 'id' | 'email' | 'role'>>>;
  remove(id: string): Promise<void>;
  setRole(id: string, role: 'user' | 'admin'): Promise<User>;
  updatePassword(id: string, passwordHash: string): Promise<void>;
}

export const fsUsersRepo: UsersRepo = {
  async createInitialUser({ email, passwordHash }) {
    const db = getDb();
    const norm = normalizeEmail(email);
    const out = await db.runTransaction(async (tx) => {
      // If any user exists, abort and return null (will fallback to normal createUser)
      const existingUserSnap = await tx.get(db.collection(USERS_COL).limit(1));
      if (!existingUserSnap.empty) return null;
      // Ensure email not reserved
      const emailRef = db.collection(EMAILS_COL).doc(norm);
      const emailSnap = await tx.get(emailRef);
      if (emailSnap.exists) throw Object.assign(new Error('Email already registered'), { status: 409 });
      const userRef = db.collection(USERS_COL).doc();
      const user: User = { id: userRef.id, email: norm, passwordHash, role: 'admin' };
      tx.set(userRef, user);
      tx.set(emailRef, { userId: userRef.id, createdAt: Date.now() });
      return user;
    });
    if (out) return out;
    return this.createUser({ email: norm, passwordHash });
  },
  async createUser({ email, passwordHash }) {
    const db = getDb();
    const norm = normalizeEmail(email);
    return db.runTransaction(async (tx) => {
      const emailRef = db.collection(EMAILS_COL).doc(norm);
      const emailSnap = await tx.get(emailRef);
      if (emailSnap.exists) throw Object.assign(new Error('Email already registered'), { status: 409 });
      const userRef = db.collection(USERS_COL).doc();
      const user: User = { id: userRef.id, email: norm, passwordHash, role: 'user' };
      tx.set(userRef, user);
      tx.set(emailRef, { userId: userRef.id, createdAt: Date.now() });
      return user;
    });
  },
  async findByEmail(email: string) {
    const db = getDb();
    const norm = normalizeEmail(email);
    // Look up email doc to get userId quickly
    const emailRef = db.collection(EMAILS_COL).doc(norm);
    const emailSnap = await emailRef.get();
    if (!emailSnap.exists) return null;
    const { userId } = emailSnap.data() as { userId: string };
    const userSnap = await db.collection(USERS_COL).doc(userId).get();
    if (!userSnap.exists) return null;
    return userSnap.data() as User;
  },
  async list() {
    const db = getDb();
    const snap = await db.collection(USERS_COL).get();
    return snap.docs.map((d) => {
      const { id, email, role } = d.data() as User;
      return { id, email, role };
    });
  },
  async remove(id: string) {
    const db = getDb();
    // Need to find email doc referencing this user
    const userRef = db.collection(USERS_COL).doc(id);
    const userSnap = await userRef.get();
    if (!userSnap.exists) return;
    const { email } = userSnap.data() as User;
    await Promise.all([
      userRef.delete(),
      db.collection(EMAILS_COL).doc(email).delete().catch(() => {}),
    ]);
  },
  async setRole(id: string, role: 'user' | 'admin') {
    const db = getDb();
    const ref = db.collection(USERS_COL).doc(id);
    const snap = await ref.get();
    if (!snap.exists) throw Object.assign(new Error('User not found'), { status: 404 });
    await ref.update({ role });
    const data = snap.data() as User;
    return { ...data, role };
  },
  async updatePassword(id: string, passwordHash: string) {
    const db = getDb();
    await db.collection(USERS_COL).doc(id).update({ passwordHash });
  },
};
