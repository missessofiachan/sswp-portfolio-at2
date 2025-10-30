/**
 * Token revocation service for managing invalidated JWT tokens.
 *
 * Provides the ability to:
 * - Revoke all tokens for a specific user
 * - Check if a token has been revoked
 * - Clean up expired revocations
 *
 * Uses Firestore for persistence.
 */

import { getDb } from '../config/firestore';
import { logInfo, logError } from '../utils/logger';

export interface TokenRevocation {
  userId: string;
  revokedAt: number; // timestamp in ms
  expiresAt: number; // timestamp in ms - when this revocation record can be cleaned up
  reason?: string; // e.g., "password_change", "security_breach", "manual_logout"
}

export const tokenRevocationService = {
  /**
   * Revoke all tokens for a user.
   * Creates a revocation record that will invalidate all tokens issued before this time.
   *
   * @param userId - User ID whose tokens should be revoked
   * @param reason - Reason for revocation (for auditing)
   * @param ttlHours - How long to keep the revocation record (default: 24 hours, should match max token lifetime)
   */
  async revokeAllTokens(
    userId: string,
    reason: string = 'manual',
    ttlHours: number = 24
  ): Promise<void> {
    try {
      const db = getDb();
      const now = Date.now();
      const expiresAt = now + ttlHours * 60 * 60 * 1000;

      const revocation: TokenRevocation = {
        userId,
        revokedAt: now,
        expiresAt,
        reason,
      };

      await db.collection('token_revocations').doc(userId).set(revocation);

      logInfo('Revoked all tokens for user', { userId, reason });
    } catch (error) {
      logError('Failed to revoke tokens', error, { userId });
      throw error;
    }
  },

  /**
   * Check if a token is revoked.
   * A token is considered revoked if:
   * - A revocation record exists for the user
   * - The token was issued before the revocation time
   *
   * @param userId - User ID from the token payload
   * @param tokenIssuedAt - When the token was issued (iat claim in seconds)
   * @returns true if the token is revoked, false otherwise
   */
  async isTokenRevoked(userId: string, tokenIssuedAt: number): Promise<boolean> {
    try {
      const db = getDb();
      const revocationRef = db.collection('token_revocations').doc(userId);
      const revocationSnap = await revocationRef.get();

      if (!revocationSnap.exists) {
        return false; // No revocation record
      }

      const revocation = revocationSnap.data() as TokenRevocation;

      // Check if revocation has expired (cleanup wasn't run yet)
      if (Date.now() > revocation.expiresAt) {
        // Revocation expired, clean it up
        await revocationRef.delete().catch(() => {});
        return false;
      }

      // Token is revoked if it was issued before the revocation time
      const tokenIssuedAtMs = tokenIssuedAt * 1000; // Convert seconds to ms
      return tokenIssuedAtMs < revocation.revokedAt;
    } catch (error) {
      logError('Failed to check token revocation', error, { userId });
      // On error, fail open (don't block access) but log for monitoring
      return false;
    }
  },

  /**
   * Clean up expired revocation records.
   * Should be called periodically via maintenance endpoint.
   *
   * @param limit - Max number of records to clean up in one batch
   * @returns Number of records cleaned up
   */
  async cleanupExpiredRevocations(limit: number = 500): Promise<number> {
    try {
      const db = getDb();
      const now = Date.now();

      const expiredSnap = await db
        .collection('token_revocations')
        .where('expiresAt', '<', now)
        .limit(limit)
        .get();

      if (expiredSnap.empty) {
        return 0;
      }

      const batch = db.batch();
      expiredSnap.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();

      logInfo('Cleaned up expired token revocations', { count: expiredSnap.size });
      return expiredSnap.size;
    } catch (error) {
      logError('Failed to cleanup expired revocations', error);
      throw error;
    }
  },

  /**
   * Get revocation status for a user (for admin/debugging).
   */
  async getRevocationStatus(userId: string): Promise<TokenRevocation | null> {
    try {
      const db = getDb();
      const revocationSnap = await db.collection('token_revocations').doc(userId).get();

      if (!revocationSnap.exists) {
        return null;
      }

      return revocationSnap.data() as TokenRevocation;
    } catch (error) {
      logError('Failed to get revocation status', error, { userId });
      return null;
    }
  },
};
