import { getDb } from '../../config/firestore';
import type { FavoriteRecord, FavoritesRepo } from '../ports/favorites.repo';
import { favoritesCollection } from '../ports/favorites.repo';

export const fsFavoritesRepo: FavoritesRepo = {
  async list(userId: string): Promise<FavoriteRecord[]> {
    const db = getDb();
    const snap = await favoritesCollection(db, userId).orderBy('createdAt', 'desc').get();
    return snap.docs.map((doc) => {
      const data = doc.data() as FavoriteRecord | undefined;
      return {
        productId: data?.productId ?? doc.id,
        createdAt: data?.createdAt ?? Date.now(),
      };
    });
  },

  async add(userId: string, productId: string): Promise<void> {
    const db = getDb();
    const ref = favoritesCollection(db, userId).doc(productId);
    await ref.set(
      {
        productId,
        createdAt: Date.now(),
      },
      { merge: true }
    );
  },

  async remove(userId: string, productId: string): Promise<void> {
    const db = getDb();
    await favoritesCollection(db, userId)
      .doc(productId)
      .delete()
      .catch(() => undefined);
  },

  async exists(userId: string, productId: string): Promise<boolean> {
    const db = getDb();
    const snap = await favoritesCollection(db, userId).doc(productId).get();
    return snap.exists;
  },
};
