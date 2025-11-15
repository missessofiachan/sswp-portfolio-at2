import type { Request, Response } from 'express';
import { favoritesService } from '../../services/products/favorites.service';

function getUserId(req: Request): string {
  const user = (req as any).user as { id?: string } | undefined;
  if (!user?.id) {
    const err = new Error('Unauthenticated');
    (err as any).status = 401;
    throw err;
  }
  return user.id;
}

export async function list(req: Request, res: Response): Promise<void> {
  const userId = getUserId(req);
  const data = await favoritesService.list(userId);
  res.json({ data });
}

export async function add(req: Request, res: Response): Promise<void> {
  const userId = getUserId(req);
  const { productId } = req.params;
  if (!productId) {
    res.status(400).json({ error: { message: 'productId is required' } });
    return;
  }
  await favoritesService.add(userId, productId);
  res.status(201).json({ data: { productId } });
}

export async function remove(req: Request, res: Response): Promise<void> {
  const userId = getUserId(req);
  const { productId } = req.params;
  if (!productId) {
    res.status(400).json({ error: { message: 'productId is required' } });
    return;
  }
  await favoritesService.remove(userId, productId);
  res.status(204).send();
}

export async function status(req: Request, res: Response): Promise<void> {
  const userId = getUserId(req);
  const { productId } = req.params;
  if (!productId) {
    res.status(400).json({ error: { message: 'productId is required' } });
    return;
  }
  const favorite = await favoritesService.isFavorite(userId, productId);
  res.json({ data: { favorite } });
}
