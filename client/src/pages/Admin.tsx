import { useEffect, useState } from 'react';
import { getProductStats } from '@client/api/clients/products.api';

export default function Admin() {
  const [stats, setStats] = useState<{ count: number; avgPrice: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    getProductStats()
      .then(setStats)
      .catch((e) => setError(e?.response?.data?.error?.message || 'Error'));
  }, []);
  return (
    <section>
      <h2>Admin Stats</h2>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      {stats ? (
        <ul>
          <li>Total products: {stats.count}</li>
          <li>Average price: ${stats.avgPrice.toFixed(2)}</li>
        </ul>
      ) : (
        !error && <p>Loading…</p>
      )}
    </section>
  );
}
