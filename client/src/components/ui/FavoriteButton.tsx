import { useAuth } from '@client/features/auth/AuthProvider';
import { useFavoriteToggle } from '@client/lib/hooks/useFavorites';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { button } from './favoriteButton.css';

interface FavoriteButtonProps {
  productId: string;
  className?: string;
  size?: number;
}

export function FavoriteButton({ productId, className, size = 20 }: FavoriteButtonProps) {
  const { token } = useAuth();
  const { isFavorite, isLoading, toggle } = useFavoriteToggle(token ? productId : null);

  if (!token) return null;

  return (
    <button
      type="button"
      className={`${button} ${className ?? ''}`}
      onClick={toggle}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      disabled={isLoading}
      data-active={isFavorite}
    >
      {isFavorite ? (
        <MdFavorite size={size} aria-hidden="true" />
      ) : (
        <MdFavoriteBorder size={size} aria-hidden="true" />
      )}
    </button>
  );
}

export default FavoriteButton;
