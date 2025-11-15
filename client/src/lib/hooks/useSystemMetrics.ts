import { getSystemMetrics, type SystemMetrics } from '@client/api/clients/admin.api';
import { useQuery } from '@tanstack/react-query';

export function useSystemMetrics() {
  return useQuery<SystemMetrics>({
    queryKey: ['admin', 'metrics'],
    queryFn: getSystemMetrics,
    staleTime: 30_000,
    refetchInterval: 60_000,
    retry: 1,
  });
}

export default useSystemMetrics;
