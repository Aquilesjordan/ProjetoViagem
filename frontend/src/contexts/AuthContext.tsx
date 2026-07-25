import { createContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, AuthCredentials } from '../types/auth';
import { loginRequest } from '../services/authService';
import { getStoredAuth, setStoredAuth, clearStoredAuth } from '../utils/storage';
import { api } from '../services/api';

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: AuthCredentials) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(() => {
  const storedAuth = getStoredAuth();

  if (storedAuth?.token) {
    api.defaults.headers.common.Authorization = `Bearer ${storedAuth.token}`;

    return {} as User;
  }

  return null;
});

 const login = async (credentials: AuthCredentials) => {
  const response = await loginRequest(credentials);

  setUser({} as User);

  setStoredAuth({
    token: response.token,
  });

  api.defaults.headers.common.Authorization =
    `Bearer ${response.token}`;

  navigate('/dashboard');
};

  const logout = () => {
    clearStoredAuth();
    setUser(null);
    delete api.defaults.headers.common.Authorization;
    navigate('/login');
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
