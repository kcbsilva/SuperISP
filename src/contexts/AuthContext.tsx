// src/contexts/AuthContext.tsx
'use client';

import React, {
  createContext,
  useContext,
  useState,
  // useEffect, // No longer needed for Supabase listener
  ReactNode
} from 'react';
import { useRouter } from 'next/navigation';

interface User { id: string; email?: string; }

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email?: string, password?: string, redirectTo?: string) => Promise<void>;
  logout: (redirectTo?: string) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const login = async (
    email?: string,
    password?: string,
    redirectTo: string = '/admin/dashboard'
  ): Promise<void> => {
    console.warn('AuthContext: login called for', email, '- authentication not implemented.');
    setIsAuthenticated(true);
    setUser(email ? { id: 'dev-user', email } : { id: 'dev-user' });
    router.push(redirectTo);
  };

  const logout = async (redirectTo: string = '/admin/login'): Promise<void> => {
    console.warn('AuthContext: Logout function called, but auth is temporarily disabled (PostgreSQL mode).');
    setIsAuthenticated(false);
    setUser(null);
    router.push(redirectTo);
  };

  // Removed Supabase specific useEffect for onAuthStateChange and initial session check.
  // Redirection logic is handled by LayoutRenderer or simplified due to disabled auth.

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
