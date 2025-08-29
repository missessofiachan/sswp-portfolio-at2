import type { Request, Response } from 'express';
import { authService } from '../../services/auth.service';

export async function register(req: Request, res: Response): Promise<void> {
  const out = await authService.register(req.body);
  res.status(201).json({ data: out });
}

/**
 * Controller that processes a login request.
 *
 * Delegates authentication to authService.login using the request body, then sends a JSON
 * response containing the authentication token and the authenticated user object.
 *
 * @param req - Express Request; expected to carry credentials or login payload in req.body.
 * @param res - Express Response used to send the resulting JSON ({ token, user }).
 * @returns Promise<void> - resolves after a response is sent.
 *
 * @remarks
 * - The implementation currently calls `res.json(...)` twice; the second call is redundant and may
 *   cause an error in some environments. Remove the duplicate call so the response is sent only once.
 * - Errors thrown by `authService.login` will propagate. Ensure an error-handling middleware is in place
 *   or wrap the call in a try/catch to send appropriate error responses (e.g., 400/401/500).
 */
export async function login(req: Request, res: Response): Promise<void> {
  const out = await authService.login(req.body);
  res.json({ token: out.token, user: out.user });
  res.json({ token: out.token, user: out.user });
}
