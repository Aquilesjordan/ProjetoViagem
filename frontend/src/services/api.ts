import axios from 'axios';
import { clearStoredAuth, getStoredAuth } from '../utils/storage';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8081';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const storedAuth = getStoredAuth();
  if (storedAuth?.token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${storedAuth.token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const requestUrl = String(error?.config?.url ?? '');
    const isAuthRequest = requestUrl.startsWith('/auth');

    if (status === 401 && !isAuthRequest) {
      clearStoredAuth();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
