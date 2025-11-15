import { auditLogsService } from '@server/services/monitoring';
import type { Request, Response } from 'express';

export async function list(req: Request, res: Response): Promise<void> {
  const q: any = req.query;
  const limit = q?.limit != null ? Number(q.limit) : undefined;
  const after = q?.after != null ? Number(q.after) : undefined;
  const action = typeof q?.action === 'string' ? q.action : undefined;

  const result = await auditLogsService.list({
    limit,
    after,
    action,
  });

  res.json({
    data: result.data,
    meta: {
      nextCursor: result.nextCursor,
    },
  });
}
