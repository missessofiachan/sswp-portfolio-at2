import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listProducts } from '@client/api/clients/products.api';
import { card, btnPrimary } from '@client/app/ui.css';
import { useAuth } from '@client/features/auth/AuthProvider';

export default function Products() {
  const [items, setItems] = useState<any[]>([]);
  const { token } = useAuth();
  useEffect(() => {
    listProducts({ sort: { field: 'price', dir: 'asc' } }).then(setItems);
  }, []);
  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>Products</h2>
        {token && (
          <Link className={btnPrimary} to="/products/new">Create Product</Link>
        )}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
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
