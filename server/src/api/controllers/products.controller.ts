import type { Request, Response } from 'express';
import { productsService } from '../../services/products.service';
import type { Product } from '../../domain/product';

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
  // Accept query as either structured (sort[field]=price&sort[dir]=asc)
  // or absent. Use a safe cast since express query parsing is untyped.
  const q: any = req.query;
  let sort: { field: keyof Product; dir: 'asc' | 'desc' } | undefined;
  if (q?.sort && typeof q.sort === 'object') {
    const field = q.sort.field as keyof Product;
    const dir = q.sort.dir === 'desc' ? 'desc' : 'asc';
    sort = { field, dir };
  }
  const data = await productsService.list(sort);
  res.json({ data });
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
}

export async function update(req: Request, res: Response): Promise<void> {
  const data = await productsService.update(req.params.id, req.body);
  res.json({ data });
}

export async function remove(req: Request, res: Response): Promise<void> {
  await productsService.remove(req.params.id);
  res.status(204).send();
}

export async function stats(_req: Request, res: Response): Promise<void> {
  const data = await productsService.stats();
  res.json({ data });
}
