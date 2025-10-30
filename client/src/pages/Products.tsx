import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listProductsPaged } from '@client/api/clients/products.api';
import { resolveImageUrl, PLACEHOLDER_SRC } from '@client/lib/images';
import {
  card,
  btnPrimary,
  btnOutline,
  input as inputField,
  photoFrame,
  sepiaPhoto,
} from '@client/app/ui.css';
import { useAuth } from '@client/features/auth/AuthProvider';
import { useSetAtom } from 'jotai';
import { addToCartAtom, isCartOpenAtom } from '@client/features/cart/cartAtoms';
import type { Product } from '@client/types/product';
import { ProductSkeleton } from '@client/components/ui/Skeleton';
import { useDebounce } from '@client/lib/hooks/useDebounce';

/**
 * Products component
 *
 * Fetches and displays a list of products sorted by price (ascending).
 * Incorporates loading and error feedback to improve perceived performance.
 */
export default function Products() {
  const [items, setItems] = useState<Product[]>([]);
  const setAddToCart = useSetAtom(addToCartAtom);
  const setCartOpen = useSetAtom(isCartOpenAtom);
  const [q, setQ] = useState('');
  const debouncedQ = useDebounce(q, 300); // Debounce search by 300ms
  const [sort, setSort] = useState<'price-asc' | 'price-desc' | 'name-asc' | 'name-desc'>(
    'price-asc'
  );
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [requestId, setRequestId] = useState(0);
  const { isAdmin } = useAuth();

  const pageCount = Math.max(1, Math.ceil(total / (pageSize || 1)));
  const isLoading = status === 'loading';
  const isError = status === 'error';
  const hasProducts = items.length > 0;

  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      setStatus('loading');
      setErrorMessage(null);
      const [field, dir] = sort.split('-') as [string, 'asc' | 'desc'];

      try {
        const response = await listProductsPaged({
          sort: { field, dir },
          filter: debouncedQ ? { q: debouncedQ } : undefined,
          page,
          pageSize,
        });

        if (cancelled) {
          return;
        }

        const nextPageCount = Math.max(1, Math.ceil(response.meta.total / (pageSize || 1)));
        if (page > nextPageCount) {
          setPage(nextPageCount);
          return;
        }

        setItems(response.data);
        setTotal(response.meta.total);
        setStatus('success');
      } catch (error) {
        if (cancelled) {
          return;
        }
        setStatus('error');
        setErrorMessage(
          error instanceof Error ? error.message : 'Failed to load products. Please try again.'
        );
      }
    }

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [debouncedQ, sort, page, pageSize, requestId]);

  const handleRetry = () => setRequestId((id) => id + 1);

  const gridContent = (() => {
    if (isLoading && !hasProducts) {
      // Show skeleton loaders while loading initial data
      return Array.from({ length: pageSize }).map((_, i) => <ProductSkeleton key={i} />);
    }

    if (isError && !hasProducts) {
      return (
        <div
          style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '40px 0',
            color: '#991b1b',
            display: 'grid',
            gap: 12,
          }}
        >
          <span>{errorMessage ?? 'Failed to load products.'}</span>
          <button className={btnOutline} style={{ margin: '0 auto' }} onClick={handleRetry}>
            Try again
          </button>
        </div>
      );
    }

    if (!isLoading && !isError && items.length === 0) {
      return (
        <div
          style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '40px 0',
            color: '#64748b',
          }}
        >
          No products found. Adjust your filters or try again later.
        </div>
      );
    }

    return items.map((product) => {
      const hasRating = typeof product.rating === 'number' && !Number.isNaN(product.rating);
      const clampedRating = hasRating ? Math.max(0, Math.min(5, Number(product.rating))) : null;
      const roundedStars = clampedRating !== null ? Math.round(clampedRating) : null;
      const filledStars = roundedStars ?? 0;
      const emptyStars = 5 - filledStars;

      const descriptionPreview = product.description
        ? `${product.description.slice(0, 120)}${product.description.length > 120 ? '...' : ''}`
        : 'No description yet.';

      const stockLevel = typeof product.stock === 'number' ? product.stock : 0;
      const isOutOfStock = stockLevel <= 0;
      const isLowStock = stockLevel > 0 && stockLevel <= 5;

      const primaryImage =
        (Array.isArray(product.images) && product.images[0]) ||
        (Array.isArray(product.imageUrls) && product.imageUrls[0]) ||
        null;

      return (
        <article key={product.id} className={card}>
          {primaryImage && (
            <Link to={`/products/${product.id}`} style={{ display: 'block', marginBottom: 12 }}>
              <img
                src={resolveImageUrl(primaryImage)}
                alt={product.name}
                className={`${photoFrame} ${sepiaPhoto}`}
                style={{
                  height: 160,
                  objectFit: 'cover',
                }}
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
          <h3 style={{ marginTop: 0 }}>
            <Link to={`/products/${product.id}`}>{product.name}</Link>
          </h3>
          <p style={{ margin: '4px 0', color: '#6d5b45', fontSize: '0.95rem' }}>
            {product.category ? `Category: ${product.category}` : 'Category: Uncategorised'}
          </p>
          {clampedRating !== null && (
            <p style={{ margin: '4px 0', fontSize: '0.95rem' }}>
              Rating: {clampedRating.toFixed(1)} / 5{' '}
              <span aria-hidden="true" style={{ color: '#d49a6a' }}>
                {'★'.repeat(filledStars)}
                {'☆'.repeat(emptyStars)}
              </span>
            </p>
          )}
          <p style={{ margin: '4px 0 8px', fontSize: '0.95rem' }}>{descriptionPreview}</p>
          <div style={{ margin: '4px 0 8px', fontSize: '0.9rem' }}>
            {isOutOfStock ? (
              <span style={{ color: '#dc2626', fontWeight: 600 }}>⚠️ Out of Stock</span>
            ) : isLowStock ? (
              <span style={{ color: '#f59e0b', fontWeight: 600 }}>⚡ Only {stockLevel} left</span>
            ) : (
              <span style={{ color: '#059669' }}>✓ {stockLevel} in stock</span>
            )}
          </div>
          <p style={{ margin: 0, fontWeight: 600 }}>${Number(product.price).toFixed(2)}</p>
          <button
            className={btnPrimary}
            style={{
              marginTop: 8,
              width: '100%',
              opacity: isOutOfStock ? 0.6 : 1,
              cursor: isOutOfStock ? 'not-allowed' : 'pointer',
            }}
            disabled={isOutOfStock}
            onClick={() => {
              if (!isOutOfStock) {
                setAddToCart(product, 1);
                setCartOpen(true);
              }
            }}
          >
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </article>
      );
    });
  })();

  return (
    <section>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <h2>Products</h2>
        {isAdmin && (
          <Link className={btnPrimary} to="/admin">
            Create Product
          </Link>
        )}
      </div>
      {isError && hasProducts && (
        <div
          style={{
            marginBottom: 16,
            padding: '12px 16px',
            borderRadius: 12,
            backgroundColor: '#fef2f2',
            color: '#b91c1c',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            justifyContent: 'space-between',
          }}
        >
          <span style={{ flex: 1 }}>
            {errorMessage ?? 'There was a problem refreshing the product list.'}
          </span>
          <button className={btnOutline} onClick={handleRetry}>
            Retry
          </button>
        </div>
      )}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <input
          value={q}
          onChange={(event) => {
            setPage(1);
            setQ(event.target.value);
          }}
          placeholder="Search..."
          className={inputField}
          style={{ flex: 1 }}
        />
        <select
          value={sort}
          onChange={(event) => setSort(event.target.value as typeof sort)}
          className={inputField}
          style={{ width: 'auto' }}
        >
          <option value="price-asc">Price ↑</option>
          <option value="price-desc">Price ↓</option>
          <option value="name-asc">Name A-Z</option>
          <option value="name-desc">Name Z-A</option>
        </select>
        <select
          value={pageSize}
          onChange={(event) => {
            setPage(1);
            setPageSize(Number(event.target.value));
          }}
          className={inputField}
          style={{ width: 'auto' }}
        >
          <option value={6}>6</option>
          <option value={12}>12</option>
          <option value={24}>24</option>
        </select>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 16,
        }}
      >
        {gridContent}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16 }}>
        <button
          className={btnOutline}
          disabled={page <= 1 || isLoading}
          onClick={() => setPage((current) => Math.max(1, current - 1))}
        >
          Prev
        </button>
        <span>
          Page {Math.min(page, pageCount)} / {pageCount}
        </span>
        <button
          className={btnOutline}
          disabled={page >= pageCount || isLoading}
          onClick={() => setPage((current) => current + 1)}
        >
          Next
        </button>
        <span style={{ marginLeft: 'auto' }}>{total} items</span>
      </div>
    </section>
  );
}
