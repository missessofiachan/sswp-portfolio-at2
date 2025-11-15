/**
 * Consolidated Activity Feed Service
 *
 * Merges favorites, orders, and audit log entries into a unified activity feed
 * for both admin and user-facing UIs. Provides a chronological view of all
 * user activities across the platform.
 */

import type { Order } from '@server/domain/orders';
import { auditLogsService } from '@server/services/monitoring';
import type { OrderService } from '@server/services/orders';
import { favoritesService } from '@server/services/products';

export type ActivityType = 'favorite' | 'order' | 'audit';

export interface ActivityFeedItem {
  type: ActivityType;
  id: string;
  timestamp: number;
  userId?: string;
  userEmail?: string;
  summary: string;
  data: {
    favorite?: {
      productId: string;
      productName?: string;
    };
    order?: {
      orderId: string;
      status: string;
      totalAmount: number;
    };
    audit?: {
      action: string;
      targetType?: string;
      targetId?: string;
      metadata?: Record<string, unknown>;
    };
  };
}

export interface ActivityFeedParams {
  userId?: string; // If provided, only show activities for this user (user-facing)
  limit?: number;
  after?: number; // Timestamp cursor for pagination
  types?: ActivityType[]; // Filter by activity types
}

export interface ActivityFeedResult {
  items: ActivityFeedItem[];
  nextCursor?: number;
  hasMore: boolean;
}

export function createActivityFeedService(orderService: OrderService) {
  return {
    /**
     * Get consolidated activity feed
     *
     * @param params - Feed parameters (userId, limit, after, types)
     * @returns Unified activity feed with items sorted by timestamp (newest first)
     */
    async getFeed(params: ActivityFeedParams = {}): Promise<ActivityFeedResult> {
      const { userId, limit = 25, after, types } = params;
      const effectiveLimit = Math.min(limit, 100); // Cap at 100

      // Fetch data from all sources in parallel
      const [favorites, orders, auditLogs] = await Promise.all([
        this.fetchFavorites(userId, types),
        this.fetchOrders(userId, types, orderService),
        this.fetchAuditLogs(userId, types, after),
      ]);

      // Normalize and merge all activities
      const activities: ActivityFeedItem[] = [...favorites, ...orders, ...auditLogs];

      // Sort by timestamp (newest first)
      activities.sort((a, b) => b.timestamp - a.timestamp);

      // Apply cursor-based pagination
      let filtered = after ? activities.filter((item) => item.timestamp < after) : activities;

      // Apply type filter if specified
      if (types && types.length > 0) {
        filtered = filtered.filter((item) => types.includes(item.type));
      }

      // Apply limit
      const hasMore = filtered.length > effectiveLimit;
      const items = filtered.slice(0, effectiveLimit);

      // Determine next cursor
      const nextCursor = items.length > 0 ? items[items.length - 1].timestamp : undefined;

      return {
        items,
        nextCursor,
        hasMore,
      };
    },

    /**
     * Fetch and normalize favorites
     */
    async fetchFavorites(userId?: string, types?: ActivityType[]): Promise<ActivityFeedItem[]> {
      if (types && !types.includes('favorite')) {
        return [];
      }

      if (!userId) {
        // For admin view, we'd need to fetch all favorites, which could be expensive
        // For now, skip favorites in admin view or implement a more efficient approach
        return [];
      }

      try {
        const favorites = await favoritesService.list(userId);
        return favorites.map((fav) => ({
          type: 'favorite' as ActivityType,
          id: `favorite-${userId}-${fav.product.id}`,
          timestamp: fav.createdAt,
          userId,
          summary: `Favorited ${fav.product.name}`,
          data: {
            favorite: {
              productId: fav.product.id,
              productName: fav.product.name,
            },
          },
        }));
      } catch {
        return [];
      }
    },

    /**
     * Fetch and normalize orders
     */
    async fetchOrders(
      userId: string | undefined,
      types: ActivityType[] | undefined,
      orderService: OrderService
    ): Promise<ActivityFeedItem[]> {
      if (types && !types.includes('order')) {
        return [];
      }

      try {
        const orders: Order[] = userId
          ? await orderService.getUserOrders(userId, 100) // Fetch recent orders
          : await orderService.getAllOrders(100); // Admin: fetch all recent orders

        return orders.map((order) => ({
          type: 'order' as ActivityType,
          id: `order-${order.id}`,
          timestamp: order.createdAt.getTime(),
          userId: order.userId,
          userEmail: order.userEmail,
          summary: `Order ${order.id} - ${order.status} ($${order.totalAmount.toFixed(2)})`,
          data: {
            order: {
              orderId: order.id,
              status: order.status,
              totalAmount: order.totalAmount,
            },
          },
        }));
      } catch {
        return [];
      }
    },

    /**
     * Fetch and normalize audit logs
     */
    async fetchAuditLogs(
      userId: string | undefined,
      types: ActivityType[] | undefined,
      after?: number
    ): Promise<ActivityFeedItem[]> {
      if (types && !types.includes('audit')) {
        return [];
      }

      try {
        const result = await auditLogsService.list({
          limit: 100,
          after: after,
        });

        let logs = result.data;

        // Filter by userId if provided (for user-facing feed)
        if (userId) {
          logs = logs.filter((log) => log.actorId === userId || log.targetId === userId);
        }

        return logs.map((log) => ({
          type: 'audit' as ActivityType,
          id: `audit-${log.id}`,
          timestamp: log.createdAt,
          userId: log.actorId,
          userEmail: log.actorEmail,
          summary: log.summary,
          data: {
            audit: {
              action: log.action,
              targetType: log.targetType,
              targetId: log.targetId,
              metadata: log.metadata,
            },
          },
        }));
      } catch {
        return [];
      }
    },
  };
}
