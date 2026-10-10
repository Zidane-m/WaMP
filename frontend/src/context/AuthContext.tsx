import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { api } from '../lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  cartCount: number;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: {
    nama_lengkap: string;
    email: string;
    password: string;
    id_universitas: number;
    nim?: string;
    no_whatsapp: string;
  }) => Promise<void>;
  logout: () => void;
  refreshCartCount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('wk_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [cartCount, setCartCount] = useState<number>(0);

  const refreshCartCount = useCallback(async () => {
    const currentToken = localStorage.getItem('wk_token');
    if (!currentToken) {
      setCartCount(0);
      return;
    }
    try {
      const cart = await api.getCart();
      setCartCount(cart.total_barang);
    } catch {
      // Ignored if unauthenticated
    }
  }, []);

  const loadUserProfile = useCallback(async () => {
    try {
      const profile = await api.getMe();
      setUser(profile);
      await refreshCartCount();
    } catch {
      // Token invalid or expired
      localStorage.removeItem('wk_token');
      setToken(null);
      setUser(null);
      setCartCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [refreshCartCount]);

  useEffect(() => {
    if (token) {
      loadUserProfile();
    } else {
      setIsLoading(false);
    }
  }, [token, loadUserProfile]);

  const login = async (credentials: { email: string; password: string }) => {
    const result = await api.login(credentials);
    localStorage.setItem('wk_token', result.token);
    setToken(result.token);
    setUser(result.user);
    try {
      const cart = await api.getCart();
      setCartCount(cart.total_barang);
    } catch {
      setCartCount(0);
    }
  };

  const register = async (userData: {
    nama_lengkap: string;
    email: string;
    password: string;
    id_universitas: number;
    nim?: string;
    no_whatsapp: string;
  }) => {
    const result = await api.register(userData);
    localStorage.setItem('wk_token', result.token);
    setToken(result.token);
    setUser(result.user);
    setCartCount(0);
  };

  const logout = () => {
    localStorage.removeItem('wk_token');
    setToken(null);
    setUser(null);
    setCartCount(0);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        cartCount,
        login,
        register,
        logout,
        refreshCartCount
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
