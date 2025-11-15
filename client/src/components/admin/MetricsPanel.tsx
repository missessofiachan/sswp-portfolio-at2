/**
 * Admin dashboard metrics summary that visualizes key performance indicators
 * such as HTTP throughput, latency percentiles, cache efficiency, and
 * database load. Handles loading and error states and exposes a manual
 * refresh action so operators can inspect up-to-date telemetry.
 */

import { Button } from '@client/components/ui/Button';
import ErrorDisplay from '@client/components/ui/ErrorDisplay';
import Loading from '@client/components/ui/Loading';
import { useSystemMetrics } from '@client/lib/hooks/useSystemMetrics';
import { memo } from 'react';
import {
  badge,
  badgeRow,
  grid,
  headerRow,
  infoRow,
  metricCard,
  metricLabel,
  metricValue,
  panel,
  progressBar,
  progressTrack,
  title,
} from './MetricsPanel.css';

function formatNumber(num: number): string {
  return Intl.NumberFormat('en', {
    notation: num >= 1000 ? 'compact' : 'standard',
    maximumFractionDigits: 1,
  }).format(num);
}

function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds)) return '0ms';
  if (seconds < 1) return `${Math.round(seconds * 1000)}ms`;
  return `${seconds.toFixed(2)}s`;
}

function clampPct(value: number) {
  return Math.max(0, Math.min(1, value));
}

export const MetricsPanel = memo(function MetricsPanel() {
  const { data, isLoading, error, refetch, isFetching } = useSystemMetrics();

  if (isLoading) {
    return <Loading message="Loading system metrics..." />;
  }

  if (error || !data) {
    return (
      <ErrorDisplay
        error={error ?? new Error('Metrics unavailable')}
        title="System Metrics"
        onDismiss={() => refetch()}
      />
    );
  }

  const errorRate =
    data.httpRequests.total > 0 ? data.httpRequests.errors / data.httpRequests.total : 0;

  return (
    <section className={panel} aria-label="System Metrics">
      <div className={headerRow}>
        <h2 className={title}>System Metrics</h2>
        <Button variant="secondary" onClick={() => refetch()} disabled={isFetching}>
          {isFetching ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      <div className={grid}>
        <article className={metricCard}>
          <span className={metricLabel}>HTTP Requests</span>
          <span className={metricValue}>{formatNumber(data.httpRequests.total)}</span>
          <div className={infoRow}>
            <span>Errors</span>
            <span>{formatNumber(data.httpRequests.errors)}</span>
          </div>
          <div>
            <div className={infoRow}>
              <span>Error rate</span>
              <span>{(errorRate * 100).toFixed(2)}%</span>
            </div>
            <div className={progressTrack}>
              <div
                className={progressBar}
                style={{
                  width: `${clampPct(errorRate) * 100}%`,
                  backgroundColor:
                    errorRate > 0.05 ? '#F7A8B8' : errorRate > 0.01 ? '#facc15' : '#55CDFC',
                }}
              />
            </div>
          </div>
          {Object.keys(data.httpRequests.byMethod).length > 0 && (
            <div>
              <span className={metricLabel}>By method</span>
              <div className={badgeRow}>
                {Object.entries(data.httpRequests.byMethod)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 4)
                  .map(([method, count]) => (
                    <span key={method} className={badge}>
                      {method}: {formatNumber(count)}
                    </span>
                  ))}
              </div>
            </div>
          )}
        </article>

        <article className={metricCard}>
          <span className={metricLabel}>Response Times</span>
          <div className={infoRow}>
            <span>Average</span>
            <span>{formatDuration(data.httpRequests.duration.average)}</span>
          </div>
          <div className={infoRow}>
            <span>P95</span>
            <span>{formatDuration(data.httpRequests.duration.p95)}</span>
          </div>
          <div className={infoRow}>
            <span>P99</span>
            <span>{formatDuration(data.httpRequests.duration.p99)}</span>
          </div>
        </article>

        <article className={metricCard}>
          <span className={metricLabel}>Cache Performance</span>
          <div className={infoRow}>
            <span>Hit rate</span>
            <span>{(clampPct(data.cache.hitRate) * 100).toFixed(1)}%</span>
          </div>
          <div className={progressTrack}>
            <div
              className={progressBar}
              style={{
                width: `${clampPct(data.cache.hitRate) * 100}%`,
                backgroundColor:
                  data.cache.hitRate > 0.7
                    ? '#55CDFC'
                    : data.cache.hitRate > 0.5
                      ? '#facc15'
                      : '#F7A8B8',
              }}
            />
          </div>
          <div className={infoRow}>
            <span>Hits</span>
            <span>{formatNumber(data.cache.hits)}</span>
          </div>
          <div className={infoRow}>
            <span>Misses</span>
            <span>{formatNumber(data.cache.misses)}</span>
          </div>
        </article>

        <article className={metricCard}>
          <span className={metricLabel}>Database Queries</span>
          <div className={infoRow}>
            <span>Total</span>
            <span>{formatNumber(data.database.totalQueries)}</span>
          </div>
          <div className={infoRow}>
            <span>Avg duration</span>
            <span>{formatDuration(data.database.averageDuration)}</span>
          </div>
          <div className={infoRow}>
            <span>Slow queries</span>
            <span>{formatNumber(data.database.slowQueries)}</span>
          </div>
          {Object.keys(data.database.byOperation).length > 0 && (
            <div>
              <span className={metricLabel}>Top operations</span>
              <div className={badgeRow}>
                {Object.entries(data.database.byOperation)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 3)
                  .map(([operation, count]) => (
                    <span key={operation} className={badge}>
                      {operation}: {formatNumber(count)}
                    </span>
                  ))}
              </div>
            </div>
          )}
        </article>

        {data.system?.memory && (
          <article className={metricCard}>
            <span className={metricLabel}>Memory Usage</span>
            <div className={infoRow}>
              <span>Used</span>
              <span>{formatNumber(data.system.memory.used / (1024 * 1024))} MB</span>
            </div>
            <div className={infoRow}>
              <span>Total</span>
              <span>{formatNumber(data.system.memory.total / (1024 * 1024))} MB</span>
            </div>
          </article>
        )}
      </div>
    </section>
  );
});

export default MetricsPanel;
