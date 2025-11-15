/**
 * Lightweight client for the public health check endpoint used by the
 * marketing and dashboard experiences to surface API/database availability.
 */
import { axiosInstance } from '@client/lib/axios';

export type HealthResponse = {
  api: {
    ok: true;
    timestamp: string;
    uptimeSec: number;
  };
  database: {
    ok: boolean;
    store: 'firestore' | 'memory';
    latencyMs: number | null;
    error?: string;
  };
};

export async function getHealth(): Promise<HealthResponse> {
  const res = await axiosInstance.get('/health');
  return res.data as HealthResponse;
}
