import { btnOutline, card, photoFrame, sepiaPhoto } from '@client/app/ui.css';
import ErrorDisplay from '@client/components/ui/ErrorDisplay';
import FavoriteButton from '@client/components/ui/FavoriteButton';
import Loading from '@client/components/ui/Loading';
import { useFavoritesList } from '@client/lib/hooks/useFavorites';
import { PLACEHOLDER_SRC, resolveImageUrl } from '@client/lib/images';
import { Link } from 'react-router-dom';

export default function Favorites() {
  const { data, isLoading, error, refetch, isFetching } = useFavoritesList();

  if (isLoading) {
    return <Loading message="Loading your favorites..." />;
  }

  if (error) {
    return (
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <ErrorDisplay error={error} title="Failed to load favorites" />
        <button
          className={btnOutline}
          style={{ marginTop: 16 }}
          onClick={() => refetch()}
          disabled={isFetching}
        >
          {isFetching ? 'Refreshing…' : 'Try again'}
        </button>
      </div>
    );
  }

  const favorites = data ?? [];

  if (favorites.length === 0) {
    return (
      <section style={{ textAlign: 'center', padding: '48px 0' }}>
        <h1>Your favorites</h1>
        <p style={{ color: '#64748b', marginTop: 12 }}>
          You haven&apos;t saved any favorites yet. Browse the{' '}
          <Link to="/products" style={{ textDecoration: 'underline' }}>
            catalog
          </Link>{' '}
          and tap the heart icon to keep items handy.
        </p>
      </section>
    );
  }

  return (
    <section style={{ display: 'grid', gap: 16 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>Your favorites</h1>
        <button className={btnOutline} onClick={() => refetch()} disabled={isFetching}>
          {isFetching ? 'Refreshing…' : 'Refresh'}
        </button>
      </header>
      <div
        style={{
          display: 'grid',
          gap: 16,
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        }}
      >
        {favorites.map(({ product }) => {
          const primaryImage =
            (Array.isArray(product.images) && product.images[0]) ||
            (Array.isArray((product as any).imageUrls) && (product as any).imageUrls[0]) ||
            null;
          return (
            <article key={product.id} className={card} style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: 12, right: 12 }}>
                <FavoriteButton productId={product.id} />
              </div>
              {primaryImage && (
                <Link to={`/products/${product.id}`} style={{ display: 'block', marginBottom: 12 }}>
                  <img
                    src={resolveImageUrl(primaryImage)}
                    alt={product.name}
                    className={`${photoFrame} ${sepiaPhoto}`}
                    style={{ height: 160, objectFit: 'cover' }}
                    loading="lazy"
                    onError={(event) => {
                      const target = event.currentTarget as HTMLImageElement;
                      if (target.src !== PLACEHOLDER_SRC) {
                        target.src = PLACEHOLDER_SRC;
                      }
                    }}
                  />
                </Link>
              )}
              <h2 style={{ margin: '0 0 8px' }}>
                <Link to={`/products/${product.id}`}>{product.name}</Link>
              </h2>
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <strong>${product.price.toFixed(2)}</strong>
                <Link to={`/products/${product.id}`}>View details</Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
