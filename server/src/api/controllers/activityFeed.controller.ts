/**
 * Activity Feed Controller
 *
 * Handles requests for the consolidated activity feed endpoint that merges
 * favorites, orders, and audit log entries.
 */

import { FirestoreOrderRepository } from '@server/data/firestore/FirestoreOrderRepository';
import { createActivityFeedService } from '@server/services/monitoring';
import { OrderService } from '@server/services/orders';
import { logError } from '@server/utils/logger';
import type { Request, Response } from 'express';

function getActor(req: Request): { id?: string; email?: string; role?: string } | undefined {
  return (req as any).user;
}

/**
 * Get consolidated activity feed
 *
 * @route GET /api/activity-feed
 * @access Private
 * @param req - Express request with authenticated user
 * @param res - Express response
 */
export async function getActivityFeed(req: Request, res: Response): Promise<void> {
  try {
    const actor = getActor(req);
    if (!actor?.id) {
      res.status(401).json({ error: { message: 'Unauthenticated' } });
      return;
    }

    const isAdmin = actor.role === 'admin';

    // Parse query parameters
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const after = req.query.after ? Number(req.query.after) : undefined;
    const typesParam = req.query.types;
    const types = Array.isArray(typesParam)
      ? (typesParam as string[])
      : typesParam
        ? [typesParam as string]
        : undefined;

    // For user-facing feed, only show their own activities
    // For admin, show all activities (userId can be optionally filtered via query param)
    const filterUserId = isAdmin && req.query.userId ? (req.query.userId as string) : actor.id;

    // Create order service instance (same pattern as order routes)
    const orderRepository = new FirestoreOrderRepository();
    const orderService = new OrderService(orderRepository);

    // Create activity feed service
    const activityFeedService = createActivityFeedService(orderService);

    // Get feed
    // For admin: if userId query param provided, filter by that user; otherwise show all
    // For users: always filter by their own userId
    const result = await activityFeedService.getFeed({
      userId: isAdmin && !req.query.userId ? undefined : filterUserId,
      limit,
      after,
      types: types as any,
    });

    res.json({
      data: result.items,
      meta: {
        count: result.items.length,
        hasMore: result.hasMore,
        nextCursor: result.nextCursor,
      },
    });
  } catch (error) {
    const err = error instanceof Error ? error : new Error('Failed to get activity feed');
    logError('Failed to get activity feed', err, {
      userId: getActor(req)?.id,
    });
    res.status(500).json({ error: { message: err.message } });
  }
}
