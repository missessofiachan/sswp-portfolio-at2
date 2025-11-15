/**
 * Order Audit Service
 *
 * Listens to order lifecycle events and logs them to the audit log service.
 * This provides a complete audit trail of order status changes for compliance
 * and debugging purposes.
 */

import { getDb } from '@server/config/firestore';
import type { User } from '@server/domain/user';
import { auditLogsService } from '@server/services/monitoring';
import { logError } from '@server/utils/logger';
import type { OrderEvents } from './order.events';
import { orderEvents } from './order.events';

/**
 * Initialize order event listeners for audit logging.
 * Should be called once during application startup.
 */
export function initializeOrderAuditListeners(): void {
  orderEvents.on('orderStatusChanged', async (payload: OrderEvents['orderStatusChanged']) => {
    const { order, previousStatus, newStatus, actorId, actorEmail, isAdmin } = payload;

    try {
      // If actor info is provided, use it; otherwise use order owner info
      const finalActorId = actorId || order.userId;
      let finalActorEmail = actorEmail || order.userEmail;

      // If we have actorId but no email, try to fetch it
      if (actorId && !actorEmail) {
        try {
          const db = getDb();
          const userSnap = await db.collection('users').doc(actorId).get();
          if (userSnap.exists) {
            const user = userSnap.data() as User;
            finalActorEmail = user.email;
          }
        } catch {
          // Ignore - email fetch is optional
        }
      }

      await auditLogsService.log({
        action: 'order.status_change',
        summary: `Order ${order.id} status changed from ${previousStatus} to ${newStatus}${isAdmin ? ' (by admin)' : ''}`,
        actorId: finalActorId,
        actorEmail: finalActorEmail,
        targetId: order.id,
        targetType: 'order',
        metadata: {
          previousStatus,
          newStatus,
          orderId: order.id,
          totalAmount: order.totalAmount,
          itemCount: order.items.length,
          isAdmin: isAdmin ?? false,
        },
      });
    } catch (error) {
      // Log error but don't throw - audit logging should not break order processing
      logError('Failed to log order status change to audit log', error, {
        orderId: order.id,
        previousStatus,
        newStatus,
      });
    }
  });
}
