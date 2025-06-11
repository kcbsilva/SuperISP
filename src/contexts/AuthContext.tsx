// src/contexts/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/services/supabase/db';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email?: string, password?: string, redirectTo?: string) => Promise<void>;
  logout: (redirectTo?: string) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsLoading(true);
    // Correctly destructure to get the subscription object
    const { data: { subscription: authListener } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        console.log('Auth state changed:', _event, session);
        const currentUser = session?.user || null;
        setUser(currentUser);
        setIsAuthenticated(!!currentUser);
        
        if (isLoading) {
          setIsLoading(false);
        }
      }
    );

    const getInitialSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            setUser(session.user);
            setIsAuthenticated(true);
        }
        if (isLoading) {
            setIsLoading(false);
        }
    };

    getInitialSession();

    return () => {
      // Now authListener directly refers to the subscription object
      authListener?.unsubscribe();
    };
  }, [isLoading]);

  const login = async (email?: string, password?: string, redirectTo: string = '/admin/dashboard') => {
    if (!email || !password) {
        console.error("Email and password are required for login.");
        return;
    }
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.push(redirectTo);
    } catch (error: any) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (redirectTo: string = '/admin/login') => {
    setIsLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout failed:', error);
    }
    setUser(null);
    setIsAuthenticated(false);
    setIsLoading(false); // Set loading to false after state updates
    router.push(redirectTo);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
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

// Higher-Order Component for protecting routes (Client-side)
export const withAuth = (WrappedComponent: React.ComponentType<any>) => {
  const ComponentWithAuth = (props: any) => {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        const currentPath = pathname === '/admin/login' ? '/admin/dashboard' : pathname;
        router.replace(`/admin/login?redirect_url=${encodeURIComponent(currentPath)}`);
      }
    }, [isLoading, isAuthenticated, router, pathname]);

    if (isLoading) {
      return <div>Loading authentication...</div>; 
    }

    if (!isAuthenticated) {
      return <div>Redirecting to login...</div>;
    }

    return <WrappedComponent {...props} />;
  };
  ComponentWithAuth.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  return ComponentWithAuth;
};
