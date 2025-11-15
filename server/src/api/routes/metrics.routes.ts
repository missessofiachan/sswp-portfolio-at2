/**
 * Metrics Routes
 *
 * Express router for Prometheus metrics endpoint.
 * Exposes metrics in Prometheus format for monitoring dashboards.
 *
 * @fileoverview Metrics API routes
 * @module api/routes/metrics
 */

import { type Router as ExpressRouter, Router } from 'express';
import { getMetrics, getMetricsContentType } from '../../services/monitoring/metrics.service';
import { logError } from '../../utils/logger';

/**
 * Express router for metrics endpoints
 */
export const router: ExpressRouter = Router();

/**
 * @route GET /metrics
 * @desc Get Prometheus metrics in text format
 * @access Public (but should be protected in production)
 * @returns {string} Prometheus metrics in text format
 */
router.get('/', async (_req, res) => {
  try {
    const metrics = await getMetrics();
    res.setHeader('Content-Type', getMetricsContentType());
    res.end(metrics);
  } catch (error) {
    logError(
      'Failed to generate metrics',
      error instanceof Error ? error : new Error(String(error))
    );
    res.status(500).json({ error: { message: 'Failed to generate metrics' } });
  }
});

export default router;
