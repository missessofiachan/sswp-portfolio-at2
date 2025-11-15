import { authService } from '@server/services/auth';
import { auditLogsService } from '@server/services/monitoring';
import type { Request, Response } from 'express';

function getActor(req: Request) {
  return (req as any).user as { id?: string; email?: string } | undefined;
}

export async function listUsers(_req: Request, res: Response): Promise<void> {
  const users = await authService.listUsers();
  res.json({ data: users });
}

export async function removeUser(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  await authService.removeUser(id);
  const actor = getActor(req);
  auditLogsService
    .log({
      action: 'admin.user.remove',
      summary: `Removed user ${id}`,
      actorId: actor?.id,
      actorEmail: actor?.email,
      targetId: id,
      targetType: 'user',
    })
    .catch(() => undefined);
  res.status(204).send();
}

export async function promoteUser(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const user = await authService.setRole(id, 'admin');
  const actor = getActor(req);
  auditLogsService
    .log({
      action: 'admin.user.promote',
      summary: `Promoted user ${id} to admin`,
      actorId: actor?.id,
      actorEmail: actor?.email,
      targetId: id,
      targetType: 'user',
      metadata: { role: 'admin' },
    })
    .catch(() => undefined);
  res.json({ data: user });
}

export async function demoteUser(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const user = await authService.setRole(id, 'user');
  const actor = getActor(req);
  auditLogsService
    .log({
      action: 'admin.user.demote',
      summary: `Demoted user ${id} to user`,
      actorId: actor?.id,
      actorEmail: actor?.email,
      targetId: id,
      targetType: 'user',
      metadata: { role: 'user' },
    })
    .catch(() => undefined);
  res.json({ data: user });
}
