// TS types, invariants

/**
 * Represents a user of the application.
 *
 * @remarks
 * Instances of this type contain identifying and authentication-related data.
 * The `passwordHash` must be a securely hashed representation of the user's password;
 * plaintext passwords must never be stored or logged.
 *
 * @property id - Unique identifier for the user (e.g., UUID or database ID).
 * @property email - User's email address; used for authentication and communication.
 * @property passwordHash - Secure hash of the user's password.
 * @property role - Authorization role; 'user' for standard users and 'admin' for administrators.
 */
export type User = { id: string; email: string; passwordHash: string; role: 'user' | 'admin' };
