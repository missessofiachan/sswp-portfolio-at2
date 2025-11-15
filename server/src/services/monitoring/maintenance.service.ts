/**
 * Service helpers for toggling the platform-wide maintenance mode flag stored
 * in Firestore. Controllers use this module to check or mutate downtime state
 * along with metadata about the administrator performing the change.
 */
import { getDb } from '@server/config/firestore';

const COLLECTION = 'config';
const DOC_ID = 'maintenance';

export interface MaintenanceState {
  enabled: boolean;
  updatedAt: number;
  updatedBy?: string;
  updatedByEmail?: string;
}

export async function getMaintenanceState(): Promise<MaintenanceState> {
  const db = getDb();
  const snap = await db.collection(COLLECTION).doc(DOC_ID).get();
  if (!snap.exists) {
    return {
      enabled: false,
      updatedAt: 0,
    };
  }
  const data = snap.data() as MaintenanceState;
  return {
    enabled: Boolean(data.enabled),
    updatedAt: typeof data.updatedAt === 'number' ? data.updatedAt : Date.now(),
    updatedBy: data.updatedBy,
    updatedByEmail: data.updatedByEmail,
  };
}

export async function setMaintenanceState(
  enabled: boolean,
  actor?: { id?: string; email?: string }
): Promise<MaintenanceState> {
  const db = getDb();
  const state: MaintenanceState = {
    enabled,
    updatedAt: Date.now(),
    updatedBy: actor?.id,
    updatedByEmail: actor?.email,
  };
  await db.collection(COLLECTION).doc(DOC_ID).set(state, { merge: true });
  return state;
}
