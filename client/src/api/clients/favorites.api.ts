/**
 * Axios client for customer favorites endpoints. Provides helpers to list,
 * add, remove, and check favorite products so UI components interact with a
 * typed abstraction rather than raw HTTP calls.
 */
import { axiosInstance } from '@client/lib/axios';
import type { Product } from '@client/types/product';

export interface FavoriteItem {
  product: Product;
  createdAt: number;
}

export async function listFavorites(): Promise<FavoriteItem[]> {
  const res = await axiosInstance.get('/favorites');
  return res.data.data as FavoriteItem[];
}

export async function addFavorite(productId: string): Promise<void> {
  await axiosInstance.post(`/favorites/${productId}`);
}

export async function removeFavorite(productId: string): Promise<void> {
  await axiosInstance.delete(`/favorites/${productId}`);
}

export async function isFavorite(productId: string): Promise<boolean> {
  const res = await axiosInstance.get(`/favorites/${productId}`);
  return Boolean(res.data?.data?.favorite);
}
