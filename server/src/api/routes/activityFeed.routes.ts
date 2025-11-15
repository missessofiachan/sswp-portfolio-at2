/**
 * Activity Feed Routes
 *
 * Express router configuration for the consolidated activity feed endpoint.
 * Merges favorites, orders, and audit log entries into a unified feed.
 *
 * @fileoverview Activity feed API routes
 * @module api/routes/activityFeed
 */

import { type Router as ExpressRouter, Router } from 'express';
import { getActivityFeed } from '../controllers/activityFeed.controller';
import { requireAuth } from '../middleware/auth';

/**
 * Express router for activity feed endpoints
 */
export const router: ExpressRouter = Router();

/**
 * @route GET /api/activity-feed
 * @desc Get consolidated activity feed (favorites, orders, audit logs)
 * @access Private
 * @query {number} [limit] - Number of items to return (default: 25, max: 100)
 * @query {number} [after] - Timestamp cursor for pagination
 * @query {string[]} [types] - Filter by activity types: favorite, order, audit
 * @query {string} [userId] - Filter by user ID (admin only)
 */
router.get('/', requireAuth, getActivityFeed);

export default router;
