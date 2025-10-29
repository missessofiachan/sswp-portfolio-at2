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

/**
 * Products component
 *
 * Fetches and displays a list of products sorted by price (ascending).
 *
 * On mount, this component invokes `listProducts({ sort: { field: 'price', dir: 'asc' } })`
 * and stores the returned items in local state. It uses `useAuth()` to determine whether
 * a user is authenticated; when a `token` is present, a "Create Product" action link is shown.
 *
 * Render:
 * - A section containing a header and (conditionally) a "Create Product" link for authenticated users.
 * - A responsive grid of product cards. Each card links to the product detail page and displays
 *   the product name and price.
 *
 * Expectations:
 * - Each product object in `items` should include at least `id`, `name`, and `price` properties.
 * - The effect runs once on mount (empty dependency array).
 *
 * Notes:
 * - State uses `any[]` for items; consider replacing with a typed Product interface for stronger typing.
 * - Network errors from `listProducts` are not handled in this component and should be considered
 *   for robustness (loading and error states).
 *
 * @returns {JSX.Element} The rendered Products section
 */
export default function Products() {
  const [items, setItems] = useState<any[]>([]);
  const setAddToCart = useSetAtom(addToCartAtom);
  const setCartOpen = useSetAtom(isCartOpenAtom);
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<'price-asc' | 'price-desc' | 'name-asc' | 'name-desc'>(
    'price-asc'
  );
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [total, setTotal] = useState(0);
  const { isAdmin } = useAuth();
  async function load() {
    const [field, dir] = sort.split('-') as [string, 'asc' | 'desc'];
    const res = await listProductsPaged({
      sort: { field, dir },
      filter: q ? { q } : undefined,
      page,
      pageSize,
    });
    setItems(res.data);
    setTotal(res.meta.total);
  }
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, sort, page, pageSize]);
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
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <input
          value={q}
          onChange={(e) => {
            setPage(1);
            setQ(e.target.value);
          }}
          placeholder="Search..."
          className={inputField}
          style={{ flex: 1 }}
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as any)}
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
          onChange={(e) => {
            setPage(1);
            setPageSize(Number(e.target.value));
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
        {items.map((p) => {
          const hasRating = typeof p.rating === 'number' && !Number.isNaN(p.rating);
          const clampedRating = hasRating ? Math.max(0, Math.min(5, Number(p.rating))) : null;
          const roundedStars = clampedRating !== null ? Math.round(clampedRating) : null;
          const descriptionPreview = p.description
            ? `${p.description.slice(0, 120)}${p.description.length > 120 ? '…' : ''}`
            : 'No description yet.';

          const stockLevel = typeof p.stock === 'number' ? p.stock : 0;
          const isOutOfStock = stockLevel <= 0;
          const isLowStock = stockLevel > 0 && stockLevel <= 5;

          return (
            <article key={p.id} className={card}>
              {Array.isArray(p.images) && p.images[0] && (
                <Link to={`/products/${p.id}`} style={{ display: 'block', marginBottom: 12 }}>
                  <img
                    src={resolveImageUrl(p.images[0])}
                    alt={p.name}
                    className={`${photoFrame} ${sepiaPhoto}`}
                    style={{
                      height: 160,
                      objectFit: 'cover',
                    }}
                    loading="lazy"
                    onError={(e) => {
                      const t = e.currentTarget as HTMLImageElement;
                      if (t.src !== PLACEHOLDER_SRC) t.src = PLACEHOLDER_SRC;
                    }}
                  />
                </Link>
              )}
              <h3 style={{ marginTop: 0 }}>
                <Link to={`/products/${p.id}`}>{p.name}</Link>
              </h3>
              <p style={{ margin: '4px 0', color: '#6d5b45', fontSize: '0.95rem' }}>
                {p.category ? `Category: ${p.category}` : 'Category: Uncategorised'}
              </p>
              {clampedRating !== null && (
                <p style={{ margin: '4px 0', fontSize: '0.95rem' }}>
                  Rating: {clampedRating.toFixed(1)} / 5{' '}
                  <span aria-hidden="true" style={{ color: '#d49a6a' }}>
                    {'★'.repeat(roundedStars!)}
                    {'☆'.repeat(5 - roundedStars!)}
                  </span>
                </p>
              )}
              <p style={{ margin: '4px 0 8px', fontSize: '0.95rem' }}>{descriptionPreview}</p>
              <div style={{ margin: '4px 0 8px', fontSize: '0.9rem' }}>
                {isOutOfStock ? (
                  <span style={{ color: '#dc2626', fontWeight: '600' }}>⚠️ Out of Stock</span>
                ) : isLowStock ? (
                  <span style={{ color: '#f59e0b', fontWeight: '600' }}>
                    ⚡ Only {stockLevel} left
                  </span>
                ) : (
                  <span style={{ color: '#059669' }}>✓ {stockLevel} in stock</span>
                )}
              </div>
              <p style={{ margin: 0, fontWeight: 600 }}>${Number(p.price).toFixed(2)}</p>
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
                    setAddToCart(p, 1);
                    setCartOpen(true);
                  }
                }}
              >
                {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </article>
          );
        })}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16 }}>
        <button
          className={btnOutline}
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Prev
        </button>
        <span>
          Page {page} / {Math.max(1, Math.ceil(total / pageSize))}
        </span>
        <button
          className={btnOutline}
          disabled={page >= Math.ceil(total / pageSize)}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
        <span style={{ marginLeft: 'auto' }}>{total} items</span>
      </div>
    </section>
  );
}
