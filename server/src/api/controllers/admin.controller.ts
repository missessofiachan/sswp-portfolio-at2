import type { Request, Response } from 'express';
import { authService } from '../../services/auth.service';

export async function listUsers(_req: Request, res: Response): Promise<void> {
  const users = await authService.listUsers();
  res.json({ data: users });
}

export async function removeUser(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  await authService.removeUser(id);
  res.status(204).send();
}

export async function promoteUser(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const user = await authService.setRole(id, 'admin');
  res.json({ data: user });
}

export async function demoteUser(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const user = await authService.setRole(id, 'user');
  res.json({ data: user });
}
