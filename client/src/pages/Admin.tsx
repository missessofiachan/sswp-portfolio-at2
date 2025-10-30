import { useEffect, useState } from 'react';
import ProductCreate from '@client/pages/ProductCreate';
import { getProductStats, listProducts, deleteProduct } from '@client/api/clients/products.api';
import { listUsers, deleteUser, type AdminUser } from '@client/api/clients/admin.api';
import { card, btnOutline, btnPrimary, photoFrame, sepiaPhoto } from '@client/app/ui.css';
import { resolveImageUrl, PLACEHOLDER_SRC } from '@client/lib/images';
import ErrorAlert from '@client/components/ui/ErrorAlert';

/**
 * Admin Dashboard
 * - Product stats
 * - Users list (admin-only) with delete
 * - Products list with delete and edit links
 * - Create Product form (moved here from the standalone page)
 */
export default function Admin() {
  const [stats, setStats] = useState<{ count: number; avgPrice: number } | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [statsErrorDetails, setStatsErrorDetails] = useState<any>(null);
  const [statsErrorIndexUrl, setStatsErrorIndexUrl] = useState<string | undefined>(undefined);

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [usersErrorDetails, setUsersErrorDetails] = useState<any>(null);
  const [usersErrorIndexUrl, setUsersErrorIndexUrl] = useState<string | undefined>(undefined);

  const [products, setProducts] = useState<any[]>([]);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [productsErrorDetails, setProductsErrorDetails] = useState<any>(null);
  const [productsErrorIndexUrl, setProductsErrorIndexUrl] = useState<string | undefined>(undefined);

  async function refreshStats() {
    try {
      setStatsError(null);
      setStatsErrorDetails(null);
      setStatsErrorIndexUrl(undefined);
      const s = await getProductStats();
      setStats(s);
    } catch (e: any) {
      console.error('Error fetching product stats:', e);
      setStatsError(e?.message || 'Error');
      setStatsErrorDetails(e?.details);
      setStatsErrorIndexUrl(e?.indexUrl);
    }
  }

  async function refreshUsers() {
    try {
      setUsersError(null);
      setUsersErrorDetails(null);
      setUsersErrorIndexUrl(undefined);
      const u = await listUsers();
      setUsers(u);
    } catch (e: any) {
      console.error('Error fetching users:', e);
      setUsersError(e?.message || 'Error');
      setUsersErrorDetails(e?.details);
      setUsersErrorIndexUrl(e?.indexUrl);
    }
  }

  async function refreshProducts() {
    try {
      setProductsError(null);
      setProductsErrorDetails(null);
      setProductsErrorIndexUrl(undefined);
      const p = await listProducts();
      setProducts(p);
    } catch (e: any) {
      console.error('Error fetching products:', e);
      setProductsError(e?.message || 'Error');
      setProductsErrorDetails(e?.details);
      setProductsErrorIndexUrl(e?.indexUrl);
    }
  }

  useEffect(() => {
    refreshStats();
    refreshUsers();
    refreshProducts();
  }, []);

  return (
    <section style={{ display: 'grid', gap: 28 }}>
      <div className={card}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0 }}>Admin Stats</h2>
          <button className={btnOutline} onClick={refreshStats}>
            Refresh
          </button>
        </div>
        {statsError && (
          <ErrorAlert
            message={statsError}
            details={statsErrorDetails}
            indexUrl={statsErrorIndexUrl}
          />
        )}
        {stats ? (
          <ul>
            <li>Total products: {stats.count}</li>
            <li>Average price: ${stats.avgPrice != null ? stats.avgPrice.toFixed(2) : 'N/A'}</li>
          </ul>
        ) : (
          !statsError && <p>Loading.</p>
        )}
      </div>

      <div className={card}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0 }}>Users</h2>
          <button className={btnOutline} onClick={refreshUsers}>
            Refresh
          </button>
        </div>
        {usersError && (
          <ErrorAlert
            message={usersError}
            details={usersErrorDetails}
            indexUrl={usersErrorIndexUrl}
          />
        )}
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: 10 }}>Email</th>
              <th style={{ textAlign: 'left', padding: 10 }}>Role</th>
              <th style={{ textAlign: 'right', padding: 10 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td style={{ padding: 10 }}>{u.email}</td>
                <td style={{ padding: 10 }}>{u.role}</td>
                <td style={{ padding: 10, textAlign: 'right' }}>
                  <button
                    className={btnOutline}
                    onClick={async () => {
                      if (!confirm(`Delete user ${u.email}?`)) return;
                      try {
                        await deleteUser(u.id);
                        await refreshUsers();
                      } catch (e) {
                        alert('Failed to delete user');
                        console.error(e);
                      }
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={3} style={{ padding: 12, color: '#6d5b45' }}>
                  No users yet. Register to create users.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className={card}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0 }}>Products</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className={btnOutline} onClick={refreshProducts}>
              Refresh
            </button>
          </div>
        </div>
        {productsError && (
          <ErrorAlert
            message={productsError}
            details={productsErrorDetails}
            indexUrl={productsErrorIndexUrl}
          />
        )}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 16,
          }}
        >
          {products.map((p) => {
            const stockLevel = typeof p.stock === 'number' ? p.stock : 0;
            const isOutOfStock = stockLevel <= 0;
            const isLowStock = stockLevel > 0 && stockLevel <= 5;
            return (
              <article key={p.id} className={card}>
                {Array.isArray(p.images) && p.images[0] && (
                  <img
                    src={resolveImageUrl(p.images[0])}
                    alt={p.name}
                    className={`${photoFrame} ${sepiaPhoto}`}
                    style={{
                      height: 140,
                      objectFit: 'cover',
                      marginBottom: 12,
                    }}
                    loading="lazy"
                    onError={(e) => {
                      const t = e.currentTarget as HTMLImageElement;
                      if (t.src !== PLACEHOLDER_SRC) t.src = PLACEHOLDER_SRC;
                    }}
                  />
                )}
                <h3 style={{ marginTop: 0 }}>{p.name}</h3>
                <p style={{ margin: '4px 0' }}>${p.price}</p>
                <div style={{ margin: '4px 0 12px', fontSize: '0.9rem' }}>
                  {isOutOfStock ? (
                    <span style={{ color: '#dc2626', fontWeight: '600' }}>⚠️ Out of Stock</span>
                  ) : isLowStock ? (
                    <span style={{ color: '#f59e0b', fontWeight: '600' }}>
                      ⚡ Low Stock ({stockLevel})
                    </span>
                  ) : (
                    <span style={{ color: '#059669' }}>✓ {stockLevel} in stock</span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <a className={btnOutline} href={`/products/${p.id}/edit`}>
                    Edit
                  </a>
                  <button
                    className={btnPrimary}
                    onClick={async () => {
                      if (!confirm(`Delete product ${p.name}?`)) return;
                      try {
                        await deleteProduct(p.id);
                        await refreshProducts();
                        await refreshStats();
                      } catch (e) {
                        alert('Failed to delete product');
                        console.error(e);
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </article>
            );
          })}
        </div>
        {products.length === 0 && !productsError && <p>No products found.</p>}
      </div>

      <div className={card}>
        <h2 style={{ marginTop: 0 }}>New Product</h2>
        <p style={{ marginTop: 0, color: '#6d5b45' }}>
          Create a product directly from the admin dashboard.
        </p>
        {/* Reuse the existing creation form */}
        <ProductCreate />
      </div>
    </section>
  );
}
