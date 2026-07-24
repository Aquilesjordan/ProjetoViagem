import { api } from './api';
import { DashboardResponse } from '../types/dashboard';

export async function fetchDashboard(): Promise<DashboardResponse> {
  const response = await api.get('/dashboard');
  return response.data as DashboardResponse;
}
