/**
 * Prometheus Metrics Service
 *
 * Provides Prometheus metrics collection for HTTP requests, database queries,
 * cache operations, and system resources. Enables monitoring dashboards and
 * alerting capabilities.
 *
 * @fileoverview Prometheus metrics service
 * @module services/metrics
 */

import { Counter, collectDefaultMetrics, Gauge, Histogram, Registry } from 'prom-client';

// Create a custom registry for metrics
export const register = new Registry();

// Collect default Node.js metrics (CPU, memory, event loop, etc.)
collectDefaultMetrics({ register });

// HTTP Request Metrics
export const httpRequestTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
  registers: [register],
});

export const httpErrorsTotal = new Counter({
  name: 'http_errors_total',
  help: 'Total number of HTTP errors (4xx and 5xx)',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

// Database Query Metrics
export const dbQueryTotal = new Counter({
  name: 'database_queries_total',
  help: 'Total number of database queries',
  labelNames: ['operation', 'collection'],
  registers: [register],
});

export const dbQueryDuration = new Histogram({
  name: 'database_query_duration_seconds',
  help: 'Duration of database queries in seconds',
  labelNames: ['operation', 'collection'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
  registers: [register],
});

export const dbSlowQueriesTotal = new Counter({
  name: 'database_slow_queries_total',
  help: 'Total number of slow database queries (>1 second)',
  labelNames: ['operation', 'collection'],
  registers: [register],
});

// Cache Metrics
export const cacheHitsTotal = new Counter({
  name: 'cache_hits_total',
  help: 'Total number of cache hits',
  labelNames: ['cache_type'],
  registers: [register],
});

export const cacheMissesTotal = new Counter({
  name: 'cache_misses_total',
  help: 'Total number of cache misses',
  labelNames: ['cache_type'],
  registers: [register],
});

// System Metrics (custom gauges for application-specific metrics)
export const activeConnections = new Gauge({
  name: 'active_connections',
  help: 'Number of active connections',
  registers: [register],
});

export const ordersInProgress = new Gauge({
  name: 'orders_in_progress',
  help: 'Number of orders currently being processed',
  registers: [register],
});

/**
 * Record a cache hit
 */
export function recordCacheHit(cacheType: string = 'default'): void {
  cacheHitsTotal.inc({ cache_type: cacheType });
}

/**
 * Record a cache miss
 */
export function recordCacheMiss(cacheType: string = 'default'): void {
  cacheMissesTotal.inc({ cache_type: cacheType });
}

/**
 * Record a database query
 */
export function recordDbQuery(
  operation: string,
  collection: string,
  durationSeconds: number
): void {
  dbQueryTotal.inc({ operation, collection });
  dbQueryDuration.observe({ operation, collection }, durationSeconds);

  // Record slow queries (>1 second)
  if (durationSeconds > 1) {
    dbSlowQueriesTotal.inc({ operation, collection });
  }
}

/**
 * Get Prometheus metrics in text format
 */
export async function getMetrics(): Promise<string> {
  return register.metrics();
}

/**
 * Get metrics content type
 */
export function getMetricsContentType(): string {
  return register.contentType;
}
