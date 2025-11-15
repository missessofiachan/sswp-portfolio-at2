/**
 * Admin dashboard panel that surfaces live system health metrics including
 * service connectivity, resource consumption, and uptime details. Consumers
 * can render the component to give operators a snapshot of backend status
 * with built-in loading/error states and manual refresh support.
 */

import { vars } from '@client/app/theme.css';
import { Button } from '@client/components/ui/Button';
import ErrorDisplay from '@client/components/ui/ErrorDisplay';
import Loading from '@client/components/ui/Loading';
import { useSystemHealth } from '@client/lib/hooks/useSystemHealth';
import { memo } from 'react';
import {
  card,
  grid,
  headerRow,
  label,
  metricCard,
  progressBar,
  progressTrack,
  statusBadge,
  title,
  value,
} from './SystemHealthPanel.css';

function formatUptime(seconds: number) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

function clampPct(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, value));
}

function statusColor(status: string) {
  if (status === 'healthy') return '#55CDFC';
  if (status === 'degraded') return '#facc15';
  return '#F7A8B8';
}

function cacheStatusText(status: string) {
  if (status === 'connected' || status === 'enabled') return '✓ Connected';
  if (status === 'disabled') return '○ Disabled';
  return '✗ Disconnected';
}

function cacheStatusColor(status: string) {
  if (status === 'connected' || status === 'enabled') return '#55CDFC';
  if (status === 'disabled') return vars.color.textMuted;
  return '#F7A8B8';
}

function memoryBarColor(percentage: number) {
  if (percentage < 70) return '#55CDFC';
  if (percentage < 85) return '#facc15';
  return '#F7A8B8';
}

export const SystemHealthPanel = memo(function SystemHealthPanel() {
  const { data, isLoading, error, refetch, isFetching } = useSystemHealth();

  if (isLoading) {
    return <Loading message="Checking system health..." />;
  }

  if (error || !data) {
    return (
      <ErrorDisplay
        error={error ?? new Error('Unable to load system health')}
        title="System Health"
        onDismiss={() => refetch()}
      />
    );
  }

  return (
    <section className={card} aria-label="System Health">
      <div className={headerRow}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <h2 className={title}>System Health</h2>
          <span
            className={statusBadge}
            style={{ backgroundColor: statusColor(data.status), color: '#121212' }}
          >
            {data.status.toUpperCase()}
          </span>
        </div>
        <Button variant="secondary" onClick={() => refetch()} disabled={isFetching}>
          {isFetching ? 'Refreshing…' : 'Refresh'}
        </Button>
      </div>

      <div className={grid}>
        <article className={metricCard}>
          <span className={label}>Database</span>
          <span
            className={value}
            style={{ color: data.services.database.status === 'connected' ? '#55CDFC' : '#F7A8B8' }}
          >
            {data.services.database.status === 'connected' ? '✓ Connected' : '✗ Disconnected'}
          </span>
          {data.services.database.responseTime != null && (
            <span className={value}>Response time: {data.services.database.responseTime}ms</span>
          )}
        </article>

        <article className={metricCard}>
          <span className={label}>Cache</span>
          <span className={value} style={{ color: cacheStatusColor(data.services.cache.status) }}>
            {cacheStatusText(data.services.cache.status)}
          </span>
          {data.services.cache.type && (
            <span className={value}>Type: {data.services.cache.type}</span>
          )}
          {data.services.cache.responseTime != null && (
            <span className={value}>Response time: {data.services.cache.responseTime}ms</span>
          )}
        </article>

        <article className={metricCard}>
          <span className={label}>Memory Usage</span>
          <span className={value}>{clampPct(data.system.memory.percentage).toFixed(1)}%</span>
          <div className={progressTrack}>
            <div
              className={progressBar}
              style={{
                width: `${clampPct(data.system.memory.percentage)}%`,
                backgroundColor: memoryBarColor(data.system.memory.percentage),
              }}
            />
          </div>
          <span className={value}>
            {formatBytes(data.system.memory.used)} / {formatBytes(data.system.memory.total)}
          </span>
        </article>

        <article className={metricCard}>
          <span className={label}>System Info</span>
          <span className={value}>Uptime: {formatUptime(data.uptime)}</span>
          <span className={value}>Version: {data.version}</span>
          {data.system?.cpu?.usage != null && (
            <span className={value}>CPU usage: {clampPct(data.system.cpu.usage).toFixed(1)}%</span>
          )}
        </article>
      </div>
    </section>
  );
});

export default SystemHealthPanel;
