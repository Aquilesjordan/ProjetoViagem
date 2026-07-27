import { createContext, useMemo, useState } from 'react';
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

const AUTHENTICATED_USER: User = {
  id: 0,
  name: 'Usuário autenticado',
  email: '',
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
      return AUTHENTICATED_USER;
    }
    return null;
  });

  const login = async (credentials: AuthCredentials) => {
    const response = await loginRequest(credentials);
    setStoredAuth({ token: response.token });
    api.defaults.headers.common.Authorization = `Bearer ${response.token}`;
    setUser(AUTHENTICATED_USER);
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
