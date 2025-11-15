import { getSystemHealth, type SystemHealth } from '@client/api/clients/admin.api';
import { useQuery } from '@tanstack/react-query';

export function useSystemHealth() {
  return useQuery<SystemHealth>({
    queryKey: ['system', 'health'],
    queryFn: getSystemHealth,
    staleTime: 10_000,
    refetchInterval: 30_000,
    retry: 1,
  });
}

export default useSystemHealth;
