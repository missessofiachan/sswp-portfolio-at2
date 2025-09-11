import { useEffect, useState } from 'react';
import { card, btnOutline, btnPrimary } from '@client/app/ui.css';
import { listProductsPaged, deleteProduct } from '@client/api/clients/products.api';

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<'createdAt-desc' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc'>(
    'createdAt-desc'
  );
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [total, setTotal] = useState(0);
  async function refresh() {
    try {
      setError(null);
      const [field, dir] = sort.split('-') as [string, 'asc' | 'desc'];
      const res = await listProductsPaged({
        sort: { field, dir },
        filter: q ? { q } : undefined,
        page,
        pageSize,
      });
      setProducts(res.data);
      setTotal(res.meta.total);
    } catch (e: any) {
      setError(e?.response?.data?.error?.message || 'Error');
    }
  }
  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, sort, page, pageSize]);
  return (
    <div className={card}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ margin: 0 }}>Products</h2>
        <button className={btnOutline} onClick={refresh}>
          Refresh
        </button>
      </div>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
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
          <option value="createdAt-desc">Newest</option>
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
          gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))',
          gap: 12,
        }}
      >
        {products.map((p) => (
          <article key={p.id} className={card}>
            {Array.isArray(p.images) && p.images[0] && (
              <img
                src={p.images[0]}
                alt={p.name}
                style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 8 }}
              />
            )}
            <h3 style={{ marginTop: 8 }}>{p.name}</h3>
            <p style={{ margin: '4px 0 12px' }}>${p.price}</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <a className={btnOutline} href={`/products/${p.id}/edit`}>
                Edit
              </a>
              <button
                className={btnPrimary}
                onClick={async () => {
                  if (!confirm(`Delete product ${p.name}?`)) return;
                  await deleteProduct(p.id);
                  await refresh();
                }}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
      {products.length === 0 && !error && <p>No products found.</p>}
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
    </div>
  );
}
