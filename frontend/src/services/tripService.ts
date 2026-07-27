import { api } from './api';
import { Trip, TripPayload, TripQueryParams, TripPage, Vehicle } from '../types/trip';

export async function fetchTrips(params: TripQueryParams): Promise<TripPage> {
  const response = await api.get('/api/viagens', { params });
  return response.data as TripPage;
}

export async function fetchTrip(id: number): Promise<Trip> {
  const response = await api.get(`/api/viagens/${id}`);
  return response.data as Trip;
}

export async function createTrip(data: TripPayload): Promise<Trip> {
  const response = await api.post('/api/viagens', data);
  return response.data as Trip;
}

export async function updateTrip(id: number, data: TripPayload): Promise<Trip> {
  const response = await api.put(`/api/viagens/${id}`, data);
  return response.data as Trip;
}

export async function deleteTrip(id: number): Promise<void> {
  await api.delete(`/api/viagens/${id}`);
}

export async function fetchVehicles(): Promise<Vehicle[]> {
  const response = await api.get('/api/veiculos');
  return response.data as Vehicle[];
}
