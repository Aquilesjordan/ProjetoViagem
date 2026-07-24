import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';
import { clearStoredAuth, getStoredAuth, setStoredAuth } from '../utils/storage';
import { refreshTokenRequest } from './authService';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

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

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (error: unknown) => void;
  config: AxiosRequestConfig;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject, config }) => {
    if (error) {
      reject(error);
    } else if (token) {
      if (config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      resolve(axios(config));
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    const status = error?.response?.status;
    const storedAuth = getStoredAuth();

    if (status === 401 && storedAuth?.refreshToken && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      isRefreshing = true;

      try {
        const newAuth = await refreshTokenRequest(storedAuth.refreshToken);
        setStoredAuth(newAuth);
        api.defaults.headers.common.Authorization = `Bearer ${newAuth.token}`;
        processQueue(null, newAuth.token);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearStoredAuth();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (status === 401) {
      clearStoredAuth();
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);
