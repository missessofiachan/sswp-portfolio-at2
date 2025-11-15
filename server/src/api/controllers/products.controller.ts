import { deleteAssetsByUrls } from '@server/services/integrations';
import { auditLogsService } from '@server/services/monitoring';
import { productsService } from '@server/services/products';
import type { Request, Response } from 'express';
import type { Product } from '../../domain/product';

function getActor(req: Request) {
  return (req as any).user as { id?: string; email?: string } | undefined;
}

/**
 * Controller action to list products and send them as a JSON response.
 *
 * Parses the incoming request query for an optional structured `sort` object
 * (e.g. `?sort[field]=price&sort[dir]=asc`) and forwards a safe, typed sort
 * descriptor to `productsService.list`. The parsed `sort` will be of the
 * shape `{ field: keyof Product; dir: 'asc' | 'desc' }` when present.
 *
 * Parsing rules:
 * - The controller accepts `sort` only when `req.query.sort` is an object.
 * - `field` is cast to `keyof Product` (caller must ensure the field name is valid).
 * - `dir` defaults to `'asc'` unless the parsed value strictly equals `'desc'`.
 * - If `sort` is absent or not an object, `undefined` is passed to the service.
 *
 * Behavior:
 * - Calls `productsService.list(sort)` and returns the result in the response body
 *   as a JSON object: `{ data }`.
 * - This function is asynchronous and returns a `Promise<void>`. Any errors thrown
 *   by the service will propagate and should be handled by upstream error-handling
 *   middleware.
 *
 * @param req - Express request object. Expects optional structured query under `req.query.sort`.
 * @param res - Express response object. Sends a JSON response containing `{ data }`.
 * @returns A promise that resolves when the response has been sent.
 *
 * @remarks
 * - The implementation relies on a safe cast because Express's query parsing is untyped.
 * - Validate or sanitize `field` elsewhere if you need to enforce that it is one of a
 *   whitelisted set of product properties.
 *
 * @example
 * // Request: GET /products?sort[field]=price&sort[dir]=desc
 * // Service receives: { field: 'price', dir: 'desc' }
 */
export async function list(req: Request, res: Response): Promise<void> {
  const q: any = req.query;
  let sort: { field: keyof Product; dir: 'asc' | 'desc' } | undefined;
  if (q?.sort && typeof q.sort === 'object') {
    const field = q.sort.field as keyof Product;
    const dir: 'asc' | 'desc' = q.sort.dir === 'desc' ? 'desc' : 'asc';
    sort = { field, dir };
  }
  const filter =
    q?.filter && typeof q.filter === 'object'
      ? {
          q: typeof q.filter.q === 'string' ? q.filter.q : undefined,
          category: typeof q.filter.category === 'string' ? q.filter.category : undefined,
          minPrice: q.filter.minPrice != null ? Number(q.filter.minPrice) : undefined,
          maxPrice: q.filter.maxPrice != null ? Number(q.filter.maxPrice) : undefined,
        }
      : undefined;
  const page = q?.page != null ? Number(q.page) : undefined;
  const pageSize = q?.pageSize != null ? Number(q.pageSize) : undefined;
  const result = await productsService.list({ sort, filter, page, pageSize });
  res.json({
    data: result.data,
    meta: { total: result.total, page: page ?? 1, pageSize: pageSize ?? 20 },
  });
}

export async function getById(req: Request, res: Response): Promise<void> {
  const data = await productsService.getById(req.params.id);
  if (!data) {
    res.status(404).json({ error: { message: 'Not found' } });
    return;
  }
  res.json({ data });
}

export async function create(req: Request, res: Response): Promise<void> {
  const data = await productsService.create(req.body);
  res.status(201).json({ data });
  const actor = getActor(req);
  auditLogsService
    .log({
      action: 'product.create',
      summary: `Created product ${data.id}`,
      actorId: actor?.id,
      actorEmail: actor?.email,
      targetId: data.id,
      targetType: 'product',
      metadata: { name: data.name },
    })
    .catch(() => undefined);
}

export async function update(req: Request, res: Response): Promise<void> {
  const id = req.params.id;
  // If images are changing, compute removed files and clean them up
  const patch = req.body as Partial<Product>;
  let removed: string[] = [];
  if (patch && Object.hasOwn(patch, 'images')) {
    const before = await productsService.getById(id);
    const prev: string[] = Array.isArray(before?.images) ? before!.images! : [];
    const next: string[] = Array.isArray(patch.images) ? patch.images : prev;
    removed = prev.filter((url) => !next.includes(url));
  }
  const data = await productsService.update(id, patch);
  if (removed.length) await deleteAssetsByUrls(removed);
  res.json({ data });
  const actor = getActor(req);
  auditLogsService
    .log({
      action: 'product.update',
      summary: `Updated product ${id}`,
      actorId: actor?.id,
      actorEmail: actor?.email,
      targetId: id,
      targetType: 'product',
      metadata: { updatedFields: Object.keys(patch ?? {}) },
    })
    .catch(() => undefined);
}

export async function remove(req: Request, res: Response): Promise<void> {
  const id = req.params.id;
  // Fetch current to know which local files to clean up
  const existing = await productsService.getById(id);
  await productsService.remove(id);
  const images = Array.isArray(existing?.images) ? existing!.images! : [];
  if (images.length) await deleteAssetsByUrls(images);
  res.status(204).send();
  const actor = getActor(req);
  auditLogsService
    .log({
      action: 'product.delete',
      summary: `Deleted product ${id}`,
      actorId: actor?.id,
      actorEmail: actor?.email,
      targetId: id,
      targetType: 'product',
      metadata: existing ? { name: existing.name } : undefined,
    })
    .catch(() => undefined);
}

export async function stats(_req: Request, res: Response): Promise<void> {
  const data = await productsService.stats();
  res.json({ data });
}

export async function timeseries(req: Request, res: Response): Promise<void> {
  const q: any = req.query;
  const windowDays = q?.windowDays != null ? Number(q.windowDays) : undefined;
  const interval = q?.interval === 'week' || q?.interval === 'month' ? q.interval : 'day';
  const data = await productsService.timeseries({ windowDays, interval });
  res.json({ data });
}
