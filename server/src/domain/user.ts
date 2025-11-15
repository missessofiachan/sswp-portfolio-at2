/**
 * Domain user model definitions and invariants shared across services.
 */
// TS types, invariants

export type User = { id: string; email: string; passwordHash: string; role: 'user' | 'admin' };
