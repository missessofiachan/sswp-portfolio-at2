// TS types, invariants

export type User = { id: string; email: string; passwordHash: string; role: 'user' | 'admin' };
