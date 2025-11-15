export interface AuditLogRecord {
  id: string;
  action: string;
  summary: string;
  actorId?: string;
  actorEmail?: string;
  targetId?: string;
  targetType?: string;
  metadata?: Record<string, unknown>;
  ip?: string;
  correlationId?: string;
  createdAt: number;
}

export interface AuditLogCreateInput {
  action: string;
  summary: string;
  actorId?: string;
  actorEmail?: string;
  targetId?: string;
  targetType?: string;
  metadata?: Record<string, unknown>;
  ip?: string;
  correlationId?: string;
  createdAt?: number;
}

export interface AuditLogListParams {
  limit?: number;
  after?: number;
  action?: string;
}

export interface AuditLogsRepo {
  add(entry: AuditLogCreateInput): Promise<AuditLogRecord>;
  list(params: AuditLogListParams): Promise<{ data: AuditLogRecord[]; nextCursor?: number }>;
}
