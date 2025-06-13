// src/contexts/AuthContext.tsx
'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from 'react';
import { useRouter } // No longer using usePathname here
from 'next/navigation';
// Supabase import removed as we are disabling auth

// User type can be simplified or removed if no user object is needed
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
  // --- Temporarily Disabled Auth ---
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Always true
  const [user, setUser] = useState<User | null>({ id: 'dev-user', email: 'dev@example.com' }); // Dummy user
  const [isLoading, setIsLoading] = useState(false); // Always false
  // --- End Temporarily Disabled Auth ---

  const router = useRouter();

  const login = async (
    email?: string,
    password?: string,
    redirectTo: string = '/admin/dashboard'
  ): Promise<void> => {
    console.warn('AuthContext: Login function called, but auth is temporarily disabled.');
    // Simulate successful login for local state if needed by any component, then redirect
    setIsAuthenticated(true);
    setUser({ id: 'dev-user', email: email || 'dev@example.com' }); // Use provided email or default
    router.push(redirectTo); // Manually redirect
  };

  const logout = async (redirectTo: string = '/admin/login'): Promise<void> => {
    console.warn('AuthContext: Logout function called, but auth is temporarily disabled.');
    // Simulate logout
    setIsAuthenticated(false);
    setUser(null);
    router.push(redirectTo); // Manually redirect
  };

  // The useEffect for Supabase listener and initial session check is removed.
  // The useEffect for redirection logic is also removed as LayoutRenderer will handle it,
  // or it's simplified because isAuthenticated is always true.

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
