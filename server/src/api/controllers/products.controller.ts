import type { Request, Response } from 'express';
import { productsService } from '../../services/products.service';

export async function list(req: Request, res: Response): Promise<void> {
  const { sort } = req.query as any;
  const data = await productsService.list(sort);
  res.json({ data });
  return;
}
export async function getById(req: Request, res: Response): Promise<void> {
  const data = await productsService.getById(req.params.id);
  if (!data) {
    res.status(404).json({ error: { message: 'Not found' } });
    return;
  }
  res.json({ data });
  return;
}
export async function create(req: Request, res: Response): Promise<void> {
  const data = await productsService.create(req.body);
  res.status(201).json({ data });
  return;
}
export async function update(req: Request, res: Response): Promise<void> {
  const data = await productsService.update(req.params.id, req.body);
  res.json({ data });
  return;
}
export async function remove(req: Request, res: Response): Promise<void> {
  await productsService.remove(req.params.id);
  res.status(204).send();
  return;
}
export async function stats(_req: Request, res: Response): Promise<void> {
  const data = await productsService.stats();
  return res.json({ data }) as any;
}
