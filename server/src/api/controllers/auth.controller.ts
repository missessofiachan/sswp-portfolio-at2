import type { Request, Response } from 'express';
import { authService } from '../../services/auth.service';

export async function register(req: Request, res: Response): Promise<void> {
  const out = await authService.register(req.body);
  res.status(201).json({ data: out });
  return;
}

export async function login(req: Request, res: Response): Promise<void> {
  const out = await authService.login(req.body);
  res.json({ token: out.token, user: out.user });
  return;
}
