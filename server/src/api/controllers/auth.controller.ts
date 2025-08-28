import type { Request, Response } from 'express';
import { authService } from 'server/src/services/auth.service';

export async function register(req: Request, res: Response) {
  const out = await authService.register(req.body);
  res.status(201).json({ data: out });
}

export async function login(req: Request, res: Response) {
  const out = await authService.login(req.body);
  res.json({ token: out.token, user: out.user });
}
