'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { useRouter } from 'next/navigation';
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
  const isLoadingRef = useRef(true);
  const initializationRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const processSession = async (session: Session | null, source: string) => {
      if (!isMounted) return;

      console.log(`AuthProvider: Processing session from ${source}. Session: ${session ? 'Exists' : 'Null'}`);

      const currentUser = session?.user || null;
      setUser(currentUser);
      setIsAuthenticated(!!currentUser);

      if (isLoadingRef.current) {
        console.log('AuthProvider: Setting isLoading to false. Source:', source);
        setIsLoading(false);
        isLoadingRef.current = false;
      }
    };

    const initializeAuth = async () => {
      if (initializationRef.current) return;
      initializationRef.current = true;

      try {
        console.log('AuthProvider: Getting initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('AuthProvider: Error getting initial session:', error);
        }
        
        await processSession(session, 'initial getSession');
      } catch (error) {
        console.error('AuthProvider: Error during initialization:', error);
        // Even if there's an error, we should stop loading
        if (isLoadingRef.current) {
          setIsLoading(false);
          isLoadingRef.current = false;
        }
      }
    };

    // Initialize auth state immediately
    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`AuthProvider: onAuthStateChange event: ${event}, Session: ${session ? 'Exists' : 'Null'}`);
        await processSession(session, `onAuthStateChange (${event})`);
      }
    );

    return () => {
      console.log('AuthProvider: Unmounting. Cleaning up subscription.');
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (email?: string, password?: string, redirectTo: string = '/admin/dashboard') => {
    if (!email || !password) {
      console.error("Email and password are required for login.");
      throw new Error("Email and password are required.");
    }

    try {
      setIsLoading(true); // Set loading during login attempt
      
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        setIsLoading(false); // Reset loading on error
        if (error.message.toLowerCase().includes('email not confirmed')) {
          throw new Error('auth.email_not_confirmed');
        }
        throw error;
      }

      console.log('Login successful, session:', data.session ? 'Exists' : 'Null');

      // Don't redirect immediately - let the auth state change handle it
      // The onAuthStateChange will update the context and trigger re-renders
      // Let the LayoutRenderer handle the redirect based on auth state
      
    } catch (error: any) {
      console.error('Login failed:', error.message);
      setIsLoading(false); // Reset loading on error
      throw error;
    }
  };

  const logout = async (redirectTo: string = '/admin/login') => {
    try {
      setIsLoading(true); // Set loading during logout
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout failed:', error);
        setIsLoading(false); // Reset loading on error
        throw error;
      }

      // Clear state immediately on successful logout
      setUser(null);
      setIsAuthenticated(false);
      
      console.log('Logout successful, redirecting to:', redirectTo);
      router.push(redirectTo);
      
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoading(false);
      throw error;
    }
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