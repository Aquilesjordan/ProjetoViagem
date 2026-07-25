import { useQuery } from '@tanstack/react-query';
import { fetchDashboard } from '../services/dashboardService';

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboard,
  });
}