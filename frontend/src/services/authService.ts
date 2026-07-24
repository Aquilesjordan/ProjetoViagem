import axios from 'axios';
import { api } from './api';
import { AuthCredentials, AuthResponse } from '../types/auth';

export async function loginRequest(credentials: AuthCredentials): Promise<AuthResponse> {
  const response = await api.post('/auth', credentials);
  return response.data as AuthResponse;
}

export async function refreshTokenRequest(refreshToken: string): Promise<AuthResponse> {
  const baseURL = api.defaults.baseURL as string;
  const response = await axios.post(`${baseURL}/auth/refresh`, { refreshToken });
  return response.data as AuthResponse;
}
