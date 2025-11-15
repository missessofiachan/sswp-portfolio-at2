/**
 * Favorites domain service wrapping repository operations with additional
 * product validation/lookup to ensure referenced products exist before
 * persisting user favorites. Supports listing, add/remove toggles, and
 * simple existence checks.
 */

import { fsFavoritesRepo } from '@server/data/firestore/favorites.repo.fs';
import type { FavoritesRepo } from '@server/data/ports/favorites.repo';
import type { Product } from '@server/domain/product';
import { productsService } from './products.service';

export interface FavoriteItem {
  product: Product;
  createdAt: number;
}

export function createFavoritesService(repo: FavoritesRepo) {
  return {
    async list(userId: string): Promise<FavoriteItem[]> {
      const records = await repo.list(userId);
      if (records.length === 0) return [];

      const products = await Promise.all(
        records.map(async (record) => {
          const product = await productsService.getById(record.productId);
          return product ? ({ product, createdAt: record.createdAt } as FavoriteItem) : null;
        })
      );

      return products.filter((item): item is FavoriteItem => item !== null);
    },

    async add(userId: string, productId: string): Promise<void> {
      const product = await productsService.getById(productId);
      if (!product) {
        const err = new Error('Product not found');
        (err as any).status = 404;
        throw err;
      }
      await repo.add(userId, productId);
    },

    async remove(userId: string, productId: string): Promise<void> {
      await repo.remove(userId, productId);
    },

    async isFavorite(userId: string, productId: string): Promise<boolean> {
      return repo.exists(userId, productId);
    },
  };
}

export const favoritesService = createFavoritesService(fsFavoritesRepo);
