import { AuthResponse } from '../types/auth';

const STORAGE_KEY = 'viagens_auth';

export function setStoredAuth(value: AuthResponse) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}

export function getStoredAuth(): AuthResponse | null {
  const value = window.localStorage.getItem(STORAGE_KEY);
  if (!value) return null;
  try {
    return JSON.parse(value) as AuthResponse;
  } catch {
    return null;
  }
}

export function clearStoredAuth() {
  window.localStorage.removeItem(STORAGE_KEY);
}
