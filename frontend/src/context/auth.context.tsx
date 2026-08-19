// src/context/AuthContext.tsx
import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, LoginCredentials, RegisterCredentials } from '../types/auth.types';
import { authApi } from '../api/auth.api';

export interface IAuthContext {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<IAuthContext | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      if (token) {
        try {
          const userData = await authApi.getMe();
          if (isMounted) setUser(userData);
        } catch {
          if (isMounted) logout();
        }
      }
      if (isMounted) setIsLoading(false);
    };

    initAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const data = await authApi.login(credentials);
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const register = async (credentials: RegisterCredentials) => {
    const data = await authApi.register(credentials);
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const contextValue: IAuthContext = {
    user,
    token,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}