import { btnOutline, card } from '@client/app/ui.css';
import ErrorDisplay from '@client/components/ui/ErrorDisplay';
import Loading from '@client/components/ui/Loading';
import { useAuditLogs } from '@client/lib/hooks/useAuditLogs';
import { formatRelative } from 'date-fns';
import { useMemo, useState } from 'react';

function formatTimestamp(ts: number) {
  try {
    return formatRelative(new Date(ts), new Date());
  } catch {
    return new Date(ts).toLocaleString();
  }
}

export default function AuditLogs() {
  const [actionFilter, setActionFilter] = useState('');
  const [appliedFilter, setAppliedFilter] = useState('');

  const query = useAuditLogs(
    useMemo(
      () => ({
        action: appliedFilter || undefined,
        limit: 20,
      }),
      [appliedFilter]
    )
  );

  const logs = query.data?.pages.flatMap((page) => page.data) ?? [];

  if (query.isLoading) {
    return <Loading message="Loading audit logs..." />;
  }

  if (query.error) {
    return (
      <div style={{ maxWidth: 640 }}>
        <ErrorDisplay error={query.error} title="Failed to load audit logs" />
        <button className={btnOutline} style={{ marginTop: 16 }} onClick={() => query.refetch()}>
          Try again
        </button>
      </div>
    );
  }

  return (
    <section style={{ display: 'grid', gap: 16 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>Audit Logs</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="text"
            value={actionFilter}
            onChange={(event) => setActionFilter(event.target.value)}
            placeholder="Filter by action (e.g., admin.user.promote)"
            style={{
              minWidth: 260,
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid #d1d5db',
            }}
          />
          <button
            className={btnOutline}
            onClick={() => setAppliedFilter(actionFilter.trim())}
            disabled={query.isFetching}
          >
            Apply
          </button>
        </div>
      </header>

      <div className={card} style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left' }}>
              <th style={{ padding: '8px 12px', borderBottom: '1px solid #e5e7eb' }}>Time</th>
              <th style={{ padding: '8px 12px', borderBottom: '1px solid #e5e7eb' }}>Action</th>
              <th style={{ padding: '8px 12px', borderBottom: '1px solid #e5e7eb' }}>Summary</th>
              <th style={{ padding: '8px 12px', borderBottom: '1px solid #e5e7eb' }}>Actor</th>
              <th style={{ padding: '8px 12px', borderBottom: '1px solid #e5e7eb' }}>Target</th>
              <th style={{ padding: '8px 12px', borderBottom: '1px solid #e5e7eb' }}>
                Correlation
              </th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  style={{ padding: '24px 12px', textAlign: 'center', color: '#6b7280' }}
                >
                  No audit logs yet.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '12px' }}>{formatTimestamp(log.createdAt)}</td>
                  <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                    {log.action}
                  </td>
                  <td style={{ padding: '12px' }}>{log.summary}</td>
                  <td style={{ padding: '12px' }}>
                    {log.actorEmail ? (
                      <span>
                        {log.actorEmail}
                        {log.actorId ? ` (${log.actorId})` : ''}
                      </span>
                    ) : log.actorId ? (
                      log.actorId
                    ) : (
                      '—'
                    )}
                  </td>
                  <td style={{ padding: '12px' }}>
                    {log.targetType || log.targetId ? (
                      <span>
                        {log.targetType ?? 'target'}
                        {log.targetId ? ` (${log.targetId})` : ''}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td style={{ padding: '12px' }}>{log.correlationId ?? '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {query.hasNextPage && (
        <button
          className={btnOutline}
          onClick={() => query.fetchNextPage()}
          disabled={query.isFetchingNextPage}
          style={{ justifySelf: 'start' }}
        >
          {query.isFetchingNextPage ? 'Loading…' : 'Load more'}
        </button>
      )}
    </section>
  );
}
