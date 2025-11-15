import { getProductStats, getProductsTimeseries } from '@client/api/clients/products.api';
import { btnOutline, card } from '@client/app/ui.css';
import MetricsPanel from '@client/components/admin/MetricsPanel';
import SystemHealthPanel from '@client/components/admin/SystemHealthPanel';
import MiniArea from '@client/components/charts/MiniArea';
import { useEffect, useState } from 'react';

export default function AdminOverview() {
  const [stats, setStats] = useState<{ count: number; avgPrice: number } | null>(null);
  const [trend, setTrend] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    try {
      setError(null);
      const s = await getProductStats();
      setStats(s);
      const ts = await getProductsTimeseries({ windowDays: 30, interval: 'day' });
      setTrend(ts.map((p) => p.count));
    } catch (e: any) {
      setError(e?.response?.data?.error?.message || 'Error');
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <MetricsPanel />
      <SystemHealthPanel />
      <div className={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0 }}>Overview</h2>
          <button className={btnOutline} onClick={refresh}>
            Refresh
          </button>
        </div>
        {error && <p style={{ color: 'crimson' }}>{error}</p>}
        {stats && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 16,
              alignItems: 'center',
            }}
          >
            <div>
              <ul>
                <li>Total products: {stats.count}</li>
                <li>
                  Average price: ${stats.avgPrice != null ? stats.avgPrice.toFixed(2) : 'N/A'}
                </li>
              </ul>
            </div>
            <MiniArea data={trend} />
          </div>
        )}
      </div>
    </div>
  );
}
