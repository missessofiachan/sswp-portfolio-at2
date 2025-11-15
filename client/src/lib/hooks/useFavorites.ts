/**
 * React Query hooks for listing, checking, and toggling user favorites.
 */

import {
  addFavorite,
  type FavoriteItem,
  isFavorite,
  listFavorites,
  removeFavorite,
} from '@client/api/clients/favorites.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const FAVORITES_LIST_KEY = ['favorites', 'list'];
const favoriteStatusKey = (productId: string) => ['favorites', 'status', productId];

export function useFavoritesList() {
  return useQuery<FavoriteItem[]>({
    queryKey: FAVORITES_LIST_KEY,
    queryFn: listFavorites,
    staleTime: 60_000,
  });
}

export function useFavoriteStatus(productId: string | null | undefined) {
  const queryClient = useQueryClient();
  return useQuery<boolean>({
    queryKey: productId ? favoriteStatusKey(productId) : ['favorites', 'status', 'unknown'],
    queryFn: () => isFavorite(productId as string),
    enabled: Boolean(productId),
    staleTime: 30_000,
    initialData: () => {
      if (!productId) return undefined;
      const cached = queryClient.getQueryData<FavoriteItem[]>(FAVORITES_LIST_KEY);
      if (!cached) return undefined;
      return cached.some((fav) => fav.product.id === productId);
    },
  });
}

export function useFavoriteToggle(productId: string | null | undefined) {
  const queryClient = useQueryClient();
  const statusQuery = useFavoriteStatus(productId);

  const addMutation = useMutation({
    mutationFn: () => addFavorite(productId as string),
    onSuccess: async () => {
      if (!productId) return;
      queryClient.invalidateQueries({ queryKey: FAVORITES_LIST_KEY });
      queryClient.setQueryData(favoriteStatusKey(productId), true);
    },
  });

  const removeMutation = useMutation({
    mutationFn: () => removeFavorite(productId as string),
    onSuccess: async () => {
      if (!productId) return;
      queryClient.invalidateQueries({ queryKey: FAVORITES_LIST_KEY });
      queryClient.setQueryData(favoriteStatusKey(productId), false);
    },
  });

  const toggle = async () => {
    if (!productId || statusQuery.isLoading) return;
    if (statusQuery.data) {
      await removeMutation.mutateAsync();
    } else {
      await addMutation.mutateAsync();
    }
  };

  return {
    isFavorite: statusQuery.data ?? false,
    isLoading: statusQuery.isLoading || addMutation.isLoading || removeMutation.isLoading,
    toggle,
    add: addMutation.mutateAsync,
    remove: removeMutation.mutateAsync,
    statusQuery,
  };
}
