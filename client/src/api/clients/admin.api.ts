/**
 * Tiny Axios-based client for admin-only backend endpoints. Provides helpers
 * for managing users, fetching audit logs, and retrieving observability
 * payloads (metrics and health) that power the admin dashboard.
 */
import { axiosInstance } from '@client/lib/axios';

export type AdminUser = { id: string; email: string; role: 'user' | 'admin' };

export async function listUsers(): Promise<AdminUser[]> {
  const res = await axiosInstance.get('/admin/users');
  return res.data.data as AdminUser[];
}

export async function deleteUser(id: string): Promise<void> {
  await axiosInstance.delete(`/admin/users/${id}`);
}

export async function promoteUser(id: string): Promise<AdminUser> {
  const res = await axiosInstance.post(`/admin/users/${id}/promote`);
  return res.data.data as AdminUser;
}

export async function demoteUser(id: string): Promise<AdminUser> {
  const res = await axiosInstance.post(`/admin/users/${id}/demote`);
  return res.data.data as AdminUser;
}

export interface SystemMetrics {
  httpRequests: {
    total: number;
    errors: number;
    byStatus: Record<string, number>;
    byMethod: Record<string, number>;
    duration: {
      average: number;
      p95: number;
      p99: number;
    };
  };
  cache: {
    hits: number;
    misses: number;
    hitRate: number;
  };
  database: {
    totalQueries: number;
    averageDuration: number;
    slowQueries: number;
    byOperation: Record<string, number>;
  };
  system?: {
    cpu?: number;
    memory?: {
      used: number;
      total: number;
    };
  };
}

export async function getSystemMetrics(): Promise<SystemMetrics> {
  const res = await axiosInstance.get('/admin/metrics');
  const data = res.data?.data ?? res.data;
  return data as SystemMetrics;
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  services: {
    database: {
      status: 'connected' | 'disconnected';
      responseTime?: number;
    };
    cache: {
      status: 'enabled' | 'disabled' | 'connected' | 'disconnected';
      type?: string;
      responseTime?: number;
    };
  };
  system: {
    memory: {
      used: number;
      total: number;
      percentage: number;
    };
    cpu?: {
      usage: number;
    };
  };
}

export async function getSystemHealth(): Promise<SystemHealth> {
  const res = await axiosInstance.get('/health');
  const data = res.data?.data ?? res.data;
  return data as SystemHealth;
}

export interface AuditLogEntry {
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

export async function getAuditLogs(params?: {
  limit?: number;
  after?: number;
  action?: string;
}): Promise<{ data: AuditLogEntry[]; meta: { nextCursor?: number } }> {
  const res = await axiosInstance.get('/admin/audit-logs', { params });
  return res.data as { data: AuditLogEntry[]; meta: { nextCursor?: number } };
}
