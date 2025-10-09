# Firestore Indexes & Data Model Notes

## Collections

users — documents: { id, email (lowercase), passwordHash, role }
emails — documents keyed by normalized (lowercase) email: { userId, createdAt }
logs — append-only application and HTTP logs
password_resets — password reset tokens (hashed): { userId, createdAt, expiresAt }

## Uniqueness Enforcement

Email uniqueness is enforced transactionally by creating a document in `emails` with the normalized email as the document ID. User creation fails with 409 if the ID already exists.

## First Admin Promotion

`createInitialUser` runs a transaction: if no users exist it provisions the first user with role=admin. Race-safe.

## Potential Composite Indexes (Only add when queries require them)

Currently queries use only simple lookups (by email doc ID) and full collection scans for listing users. No composite indexes are required now. If you later add queries like:

- Filter users by role and order by email → Create composite index on `users(role ASC, email ASC)`.

## TTL / Cleanup Suggestions

- `password_resets`: add a TTL policy on `expiresAt` to auto-delete expired tokens.
- `logs`: consider a TTL (e.g., 30 or 90 days) to control storage costs.

## Security Rules (High-Level Guidance)

Implement Firestore security rules so that:

- Clients cannot read passwordHash or write arbitrary roles.
- Only privileged admin users can list all users or modify roles.
- Password reset tokens are never readable by normal clients.

## Email Normalization

All stored emails are lowercase; always lowercase incoming emails before hand-offs.
