import type { Firestore } from '@google-cloud/firestore';

/**
 * Represents a single favorite entry stored for a user.
 */
export interface FavoriteRecord {
  productId: string;
  createdAt: number;
}

/**
 * Repository contract for user favorites.
 *
 * Firestore implementation stores favorites under
 * `users/{userId}/favorites/{productId}` documents.
 */
export interface FavoritesRepo {
  /**
   * List favorite records for the given user.
   */
  list(userId: string): Promise<FavoriteRecord[]>;

  /**
   * Add a product to the user's favorites.
   * Should be idempotent.
   */
  add(userId: string, productId: string): Promise<void>;

  /**
   * Remove a product from the user's favorites.
   * Missing entries should be ignored.
   */
  remove(userId: string, productId: string): Promise<void>;

  /**
   * Determine if a product is currently favorited by the user.
   */
  exists(userId: string, productId: string): Promise<boolean>;
}

/**
 * Utility to build a typed collection reference for favorites.
 */
export function favoritesCollection(db: Firestore, userId: string) {
  return db.collection('users').doc(userId).collection('favorites');
}
