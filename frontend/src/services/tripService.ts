import { api } from './api';
import { Trip, TripPayload, TripQueryParams, TripPage, Vehicle } from '../types/trip';

export async function fetchTrips(params: TripQueryParams): Promise<TripPage> {
  const response = await api.get('/trips', { params });
  return response.data as TripPage;
}

export async function fetchTrip(id: string): Promise<Trip> {
  const response = await api.get(`/trips/${id}`);
  return response.data as Trip;
}

export async function createTrip(data: TripPayload): Promise<Trip> {
  const response = await api.post('/trips', data);
  return response.data as Trip;
}

export async function updateTrip(id: string, data: TripPayload): Promise<Trip> {
  const response = await api.put(`/trips/${id}`, data);
  return response.data as Trip;
}

export async function deleteTrip(id: string): Promise<void> {
  await api.delete(`/trips/${id}`);
}

export async function fetchVehicles(): Promise<Vehicle[]> {
  const response = await api.get('/vehicles');
  return response.data as Vehicle[];
}
