import type { Request, Response } from 'express';
import { productsService } from 'server/src/services/products.service';

export async function list(req: Request, res: Response) {
  const { sort } = req.query as any;
  const data = await productsService.list(sort);
  res.json({ data });
}
export async function getById(req: Request, res: Response) {
  const data = await productsService.getById(req.params.id);
  if (!data) return res.status(404).json({ error: { message: 'Not found' } });
  res.json({ data });
}
export async function create(req: Request, res: Response) {
  const data = await productsService.create(req.body);
  res.status(201).json({ data });
}
export async function update(req: Request, res: Response) {
  const data = await productsService.update(req.params.id, req.body);
  res.json({ data });
}
export async function remove(req: Request, res: Response) {
  await productsService.remove(req.params.id);
  res.status(204).send();
}
export async function stats(_req: Request, res: Response) {
  const data = await productsService.stats();
  res.json({ data });
}
