import { useEffect, useState } from 'react';
import { getProductStats } from '@client/api/clients/products.api';

/**
 * Admin
 *
 * Renders a small admin dashboard section that displays product statistics.
 *
 * The component:
 * - Fetches product statistics once on mount via `getProductStats()`.
 * - Maintains local state for `stats` (shape: `{ count: number; avgPrice: number } | null`)
 *   and `error` (string | null).
 * - Shows a loading indicator while the request is in progress.
 * - Shows a crimson-colored error message when the request fails (the error message will
 *   attempt to be extracted from an axios-like response shape: `e?.response?.data?.error?.message`).
 * - Logs fetch errors to the console.
 * - When stats are available, displays total product count and average price (formatted to 2 decimals).
 *
 * @remarks
 * - This component has no props and performs its network side-effect in a `useEffect` with an empty dependency array.
 * - `getProductStats()` is expected to return a promise that resolves to an object matching the `stats` shape.
 *
 * @returns JSX.Element - a section containing the admin stats heading, an error message (if any),
 *                        a loading indicator, or the stats list.
 *
 * @example
 * <Admin />
 *
 * @since 1.0.0
 */
export default function Admin() {
  const [stats, setStats] = useState<{ count: number; avgPrice: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProductStats()
      .then(setStats)
      .catch((e) => {
        console.error('Error fetching product stats:', e);
        setError(e?.response?.data?.error?.message || 'Error');
      });
  }, []);

  return (
    <section>
      <h2>Admin Stats</h2>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      {stats ? (
        <ul>
          <li>Total products: {stats.count}</li>
          <li>Average price: ${stats.avgPrice != null ? stats.avgPrice.toFixed(2) : 'N/A'}</li>
        </ul>
      ) : (
        !error && <p>Loading…</p>
      )}
    </section>
  );
}
