'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie'; // Using js-cookie for easier cookie management

const AUTH_COOKIE_NAME = 'prolter_auth';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (redirectTo?: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // To handle initial cookie check
  const router = useRouter();

  useEffect(() => {
    // Check for auth cookie on initial load
    const authCookie = Cookies.get(AUTH_COOKIE_NAME);
    if (authCookie === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = (redirectTo: string = '/') => {
    Cookies.set(AUTH_COOKIE_NAME, 'true', { expires: 7, path: '/' }); // Cookie expires in 7 days
    setIsAuthenticated(true);
    router.push(redirectTo);
  };

  const logout = () => {
    Cookies.remove(AUTH_COOKIE_NAME, { path: '/' });
    setIsAuthenticated(false);
    router.push('/admin/login'); // Redirect to login on logout
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading }}>
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
export const withAuth = (Component: React.ComponentType) => {
  return function AuthenticatedComponent(props: any) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter(); // Import and use useRouter

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.push('/admin/login'); // Redirect to login if not authenticated
      }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading) {
      return <div>Loading...</div>; // Show a loading state while checking auth
    }

    if (!isAuthenticated) {
      // This state will likely not be reached if useEffect redirects,
      // but it's a fallback or can be a loading/message state during redirection.
      return <div>Loading...</div>; // Or a message like "Redirecting to login..."
    }

    return <Component {...props} />;
  };
};
// Usage in a page component
// import { withAuth } from '@/contexts/AuthContext';