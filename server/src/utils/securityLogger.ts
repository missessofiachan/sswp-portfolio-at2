/**
 * Security-focused logging utilities for tracking suspicious activity,
 * authentication failures, and security events.
 */

import { logWarn, logError, logInfo } from './logger';

export interface AuthFailureEvent {
  email: string;
  reason: 'invalid_credentials' | 'account_locked' | 'token_expired' | 'token_revoked';
  ip?: string;
  userAgent?: string;
  correlationId?: string;
}

export interface SuspiciousActivityEvent {
  type: 'rate_limit_hit' | 'invalid_token' | 'unauthorized_access' | 'file_upload_rejected';
  userId?: string;
  email?: string;
  ip?: string;
  path?: string;
  details?: Record<string, any>;
  correlationId?: string;
}

export interface SecurityEvent {
  type: 'password_change' | 'tokens_revoked' | 'role_change' | 'account_deleted';
  userId: string;
  performedBy?: string; // admin ID if done by admin
  details?: Record<string, any>;
  correlationId?: string;
}

/**
 * Log authentication failures for security monitoring
 */
export function logAuthFailure(event: AuthFailureEvent): void {
  logWarn('Authentication failed', {
    category: 'security',
    subCategory: 'auth_failure',
    ...event,
  });
}

/**
 * Log suspicious activity that may indicate an attack
 */
export function logSuspiciousActivity(event: SuspiciousActivityEvent): void {
  logWarn('Suspicious activity detected', {
    category: 'security',
    subCategory: 'suspicious_activity',
    ...event,
  });
}

/**
 * Log security-related events (password changes, role changes, etc.)
 */
export function logSecurityEvent(event: SecurityEvent): void {
  logInfo('Security event', {
    category: 'security',
    subCategory: 'event',
    ...event,
  });
}

/**
 * Log rate limit violations
 */
export function logRateLimitHit(params: {
  ip: string;
  path: string;
  userId?: string;
  correlationId?: string;
}): void {
  logSuspiciousActivity({
    type: 'rate_limit_hit',
    ...params,
  });
}

/**
 * Log file upload rejections (potentially malicious files)
 */
export function logFileRejection(params: {
  filename: string;
  reason: string;
  userId?: string;
  ip?: string;
  correlationId?: string;
}): void {
  logSuspiciousActivity({
    type: 'file_upload_rejected',
    details: params,
  });
}

/**
 * Log unauthorized access attempts
 */
export function logUnauthorizedAccess(params: {
  path: string;
  userId?: string;
  requiredRole?: string;
  userRole?: string;
  ip?: string;
  correlationId?: string;
}): void {
  logSuspiciousActivity({
    type: 'unauthorized_access',
    ...params,
    details: { path: params.path, requiredRole: params.requiredRole, userRole: params.userRole },
  });
}
