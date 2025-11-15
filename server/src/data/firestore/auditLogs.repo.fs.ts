import { getDb } from '../../config/firestore';
import type {
  AuditLogCreateInput,
  AuditLogListParams,
  AuditLogRecord,
  AuditLogsRepo,
} from '../ports/auditLogs.repo';

const COLLECTION = 'auditLogs';

export const fsAuditLogsRepo: AuditLogsRepo = {
  async add(entry: AuditLogCreateInput): Promise<AuditLogRecord> {
    const db = getDb();
    const createdAt = entry.createdAt ?? Date.now();
    const docRef = await db.collection(COLLECTION).add({
      ...entry,
      createdAt,
    });
    return {
      id: docRef.id,
      ...entry,
      createdAt,
    };
  },

  async list(params: AuditLogListParams): Promise<{ data: AuditLogRecord[]; nextCursor?: number }> {
    const db = getDb();
    const limit = Math.max(1, Math.min(100, params.limit ?? 25));
    let query = db.collection(COLLECTION).orderBy('createdAt', 'desc');

    if (params.action) {
      query = query.where('action', '==', params.action);
    }

    if (params.after) {
      query = query.startAfter(params.after);
    }

    query = query.limit(limit);

    const snap = await query.get();

    const data: AuditLogRecord[] = snap.docs.map((doc) => {
      const payload = doc.data();
      return {
        id: doc.id,
        action: payload.action,
        summary: payload.summary,
        actorId: payload.actorId,
        actorEmail: payload.actorEmail,
        targetId: payload.targetId,
        targetType: payload.targetType,
        metadata: payload.metadata,
        ip: payload.ip,
        correlationId: payload.correlationId,
        createdAt: payload.createdAt ?? Date.now(),
      };
    });

    const last = snap.docs[snap.docs.length - 1];
    const nextCursor = last ? last.data()?.createdAt : undefined;

    return { data, nextCursor };
  },
};
