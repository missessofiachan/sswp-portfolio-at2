import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listProductsPaged } from '@client/api/clients/products.api';
import { card, btnPrimary } from '@client/app/ui.css';
import { useAuth } from '@client/features/auth/AuthProvider';

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
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input
          value={q}
          onChange={(e) => {
            setPage(1);
            setQ(e.target.value);
          }}
          placeholder="Search..."
          style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc', flex: 1 }}
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as any)}
          style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
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
          style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
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
        {items.map((p) => (
          <article key={p.id} className={card}>
            {Array.isArray(p.images) && p.images[0] && (
              <Link to={`/products/${p.id}`}>
                <img
                  src={p.images[0]}
                  alt={p.name}
                  style={{
                    width: '100%',
                    height: 160,
                    objectFit: 'cover',
                    borderRadius: 8,
                    marginBottom: 8,
                  }}
                  loading="lazy"
                />
              </Link>
            )}
            <h3 style={{ marginTop: 0 }}>
              <Link to={`/products/${p.id}`}>{p.name}</Link>
            </h3>
            <p style={{ margin: 0 }}>${p.price}</p>
          </article>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          style={{ padding: '6px 10px' }}
        >
          Prev
        </button>
        <span>
          Page {page} / {Math.max(1, Math.ceil(total / pageSize))}
        </span>
        <button
          disabled={page >= Math.ceil(total / pageSize)}
          onClick={() => setPage((p) => p + 1)}
          style={{ padding: '6px 10px' }}
        >
          Next
        </button>
        <span style={{ marginLeft: 'auto' }}>{total} items</span>
      </div>
    </section>
  );
}
