import { api } from './api';
import { AuthCredentials, AuthResponse } from '../types/auth';

export async function loginRequest(credentials: AuthCredentials): Promise<AuthResponse> {
  const response = await api.post('/auth', credentials);
  return response.data as AuthResponse;
}
