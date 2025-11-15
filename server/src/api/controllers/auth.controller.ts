import { getDb } from '@server/config/firestore';
import type { User } from '@server/domain/user';
import { authService, tokenRevocationService } from '@server/services/auth';
import { auditLogsService } from '@server/services/monitoring';
import type { Request, Response } from 'express';

export async function register(req: Request, res: Response): Promise<void> {
  const out = await authService.register(req.body);
  res.status(201).json({ data: out });
}

/**
 * Controller that processes a login request.
 * Delegates authentication to authService.login using the request body, then sends a JSON
 * response containing the authentication token and the authenticated user object.
 */
export async function login(req: Request, res: Response): Promise<void> {
  const out = await authService.login(req.body);
  // Standardize response shape to { data: { ... } } like other endpoints
  res.json({ data: { token: out.token, user: out.user } });
}

export async function requestPasswordReset(req: Request, res: Response): Promise<void> {
  const result = await authService.requestPasswordReset(req.body.email);
  // Always return 202 to avoid leaking which emails exist
  const payload: any = { accepted: true };
  // In test environment expose token to allow end-to-end reset flow coverage
  if (process.env.NODE_ENV === 'test' && result?.token) payload.token = result.token;
  res.status(202).json({ data: payload });
}

export async function resetPassword(req: Request, res: Response): Promise<void> {
  const userId = await authService.resetPassword(req.body.token, req.body.newPassword);
  res.status(200).json({ data: { reset: true } });

  // Log token revocation to audit log
  if (userId) {
    try {
      // Fetch user email for audit log
      const db = getDb();
      const userSnap = await db.collection('users').doc(userId).get();
      const user = userSnap.exists ? (userSnap.data() as User) : null;

      auditLogsService
        .log({
          action: 'auth.token_revoke',
          summary: `Tokens revoked due to password reset`,
          actorId: userId,
          actorEmail: user?.email,
          targetId: userId,
          targetType: 'user',
          metadata: { reason: 'password_change' },
          ip: req.ip || req.socket.remoteAddress || undefined,
        })
        .catch(() => undefined);
    } catch {
      // Silently fail audit logging - don't break the password reset flow
    }
  }
}

/**
 * Logout endpoint that revokes all tokens for the authenticated user.
 * Requires authentication middleware to identify the user.
 */
export async function logout(req: Request, res: Response): Promise<void> {
  const actor = (req as any).user as { id?: string; email?: string } | undefined;

  if (!actor?.id) {
    res.status(401).json({ error: { message: 'Unauthenticated' } });
    return;
  }

  await tokenRevocationService.revokeAllTokens(actor.id, 'manual_logout');

  res.status(200).json({ data: { loggedOut: true } });

  // Log token revocation to audit log
  auditLogsService
    .log({
      action: 'auth.token_revoke',
      summary: `Tokens revoked due to manual logout`,
      actorId: actor.id,
      actorEmail: actor.email,
      targetId: actor.id,
      targetType: 'user',
      metadata: { reason: 'manual_logout' },
      ip: req.ip || req.socket.remoteAddress || undefined,
    })
    .catch(() => undefined);
}
