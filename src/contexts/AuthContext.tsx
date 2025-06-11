// src/contexts/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation'; // Added usePathname
import { supabase } from '@/services/supabase/db'; // Import your Supabase client
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email?: string, password?: string, redirectTo?: string) => Promise<void>; // Made email/password optional for flexibility
  logout: (redirectTo?: string) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname(); // Get current pathname

  useEffect(() => {
    setIsLoading(true);
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        console.log('Auth state changed:', _event, session);
        const currentUser = session?.user || null;
        setUser(currentUser);
        setIsAuthenticated(!!currentUser);
        
        // If loading was true, set it to false once the first auth state is determined.
        // Subsequent calls won't hit this if isLoading is already false.
        if (isLoading) {
          setIsLoading(false);
        }
      }
    );

    // Check initial session state
    const getInitialSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            setUser(session.user);
            setIsAuthenticated(true);
        }
        // Only set isLoading to false here if not already handled by onAuthStateChange's first fire
        // However, onAuthStateChange usually fires immediately with current state.
        // So, this might be redundant if onAuthStateChange is guaranteed to fire on load.
        // For safety and to ensure isLoading is false after initial check:
        if (isLoading) { // Check isLoading again, as onAuthStateChange might have set it
            setIsLoading(false);
        }
    };

    getInitialSession();

    return () => {
      authListener?.unsubscribe();
    };
  }, [isLoading]); // Added isLoading to dependency array

  const login = async (email?: string, password?: string, redirectTo: string = '/admin/dashboard') => {
    if (!email || !password) {
        // Handle cases where login might be called without credentials,
        // e.g., if trying to restore a session (though Supabase handles this)
        // or if you have other login methods in mind (OAuth).
        // For now, we assume email/password are required for this direct login.
        console.error("Email and password are required for login.");
        // Potentially throw an error or set an error state
        return;
    }
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      // onAuthStateChange will handle setting user and isAuthenticated
      router.push(redirectTo);
    } catch (error: any) {
      console.error('Login failed:', error);
      // Let the login page handle displaying the error
      throw error; // Re-throw to be caught by the calling component
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (redirectTo: string = '/admin/login') => {
    setIsLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout failed:', error);
      // Handle logout error, maybe show a toast
    }
    // onAuthStateChange will set user to null and isAuthenticated to false
    router.push(redirectTo);
    // No need to explicitly set isLoading to false here if relying on onAuthStateChange
    // but if onAuthStateChange doesn't fire immediately or reliably on signOut for UI update:
    setUser(null);
    setIsAuthenticated(false);
    setIsLoading(false);
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
    const pathname = usePathname(); // Get current pathname

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        // Store the current path to redirect back after login
        const currentPath = pathname === '/admin/login' ? '/admin/dashboard' : pathname;
        router.replace(`/admin/login?redirect_url=${encodeURIComponent(currentPath)}`);
      }
    }, [isLoading, isAuthenticated, router, pathname]);

    if (isLoading) {
      return <div>Loading authentication...</div>; // Or a spinner component
    }

    if (!isAuthenticated) {
      // This ideally should not be reached if redirection works, but acts as a fallback.
      // Or it might briefly show while redirecting.
      return <div>Redirecting to login...</div>;
    }

    return <WrappedComponent {...props} />;
  };
  ComponentWithAuth.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  return ComponentWithAuth;
};
