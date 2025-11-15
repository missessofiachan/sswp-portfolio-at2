/**
 * Infinite query hook for paginating admin audit logs.
 */

import { type AuditLogEntry, getAuditLogs } from '@client/api/clients/admin.api';
import { useInfiniteQuery } from '@tanstack/react-query';

interface UseAuditLogsParams {
  action?: string;
  limit?: number;
}

export function useAuditLogs(params: UseAuditLogsParams = {}) {
  return useInfiniteQuery<{ data: AuditLogEntry[]; meta: { nextCursor?: number } }>({
    queryKey: ['admin', 'auditLogs', params],
    queryFn: ({ pageParam }) =>
      getAuditLogs({
        ...params,
        after: pageParam,
      }),
    getNextPageParam: (last) => last.meta?.nextCursor,
    initialPageParam: undefined,
    staleTime: 30_000,
  });
}

export default useAuditLogs;
