/**
 * Service responsible for recording and querying audit log entries.
 * Provides an adapter-friendly factory so different persistence layers
 * can be injected while the rest of the application consumes a single API.
 */

import { fsAuditLogsRepo } from '@server/data/firestore/auditLogs.repo.fs';
import type {
  AuditLogCreateInput,
  AuditLogListParams,
  AuditLogRecord,
  AuditLogsRepo,
} from '@server/data/ports/auditLogs.repo';

export type AuditLogEvent = AuditLogCreateInput;

export function createAuditLogsService(repo: AuditLogsRepo) {
  return {
    async log(event: AuditLogEvent): Promise<void> {
      await repo.add({
        ...event,
        createdAt: event.createdAt ?? Date.now(),
      });
    },

    async list(
      params: AuditLogListParams
    ): Promise<{ data: AuditLogRecord[]; nextCursor?: number }> {
      return repo.list(params);
    },
  };
}

export const auditLogsService = createAuditLogsService(fsAuditLogsRepo);
