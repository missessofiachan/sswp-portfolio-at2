import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listProducts } from '@client/api/clients/products.api';
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
  const { token } = useAuth();
  useEffect(() => {
    listProducts({ sort: { field: 'price', dir: 'asc' } }).then(setItems);
  }, []);
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
        {token && (
          <Link className={btnPrimary} to="/products/new">
            Create Product
          </Link>
        )}
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
            <h3 style={{ marginTop: 0 }}>
              <Link to={`/products/${p.id}`}>{p.name}</Link>
            </h3>
            <p style={{ margin: 0 }}>${p.price}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
