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
    if (error?.response?.status === 401) {
      clearStoredAuth();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
