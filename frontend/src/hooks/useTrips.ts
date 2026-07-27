import { useQuery } from '@tanstack/react-query';
import { fetchTrips } from '../services/tripService';
import { TripQueryParams } from '../types/trip';

export function useTrips(params: TripQueryParams) {
  return useQuery({
    queryKey: ['trips', params],
    queryFn: () => fetchTrips(params),
  });
}
