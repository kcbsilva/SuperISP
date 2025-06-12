// src/contexts/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
  const [isLoading, setIsLoading] = useState(true); // Start true
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const processSession = async (session: Session | null, source: string) => {
      if (!isMounted) return;
      
      console.log(`AuthProvider: Processing session from ${source}. Session: ${session ? 'Exists' : 'Null'}`);
      
      const currentUser = session?.user || null;
      setUser(currentUser);
      setIsAuthenticated(!!currentUser);
      
      // Only set isLoading to false once, when the initial check is done or first relevant event.
      if (isLoading) { 
        console.log('AuthProvider: Setting isLoading to false. Source:', source);
        setIsLoading(false);
      }
    };

    // Initial session check
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('AuthProvider: getSession() resolved. Session:', session ? 'Exists' : 'Null', 'Error:', error);
        if (error) console.error('AuthProvider: Error in getSession initial check:', error);
        await processSession(session, error ? 'getSession error' : 'getSession');
      } catch (error) {
        console.error('AuthProvider: Critical error in getSession() promise:', error);
        await processSession(null, 'getSession critical error');
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`AuthProvider: onAuthStateChange event: ${event}, Session: ${session ? 'Exists' : 'Null'}`);
        await processSession(session, `onAuthStateChange (${event})`);
        
        // Removed router.refresh() from here to let LayoutRenderer handle redirection
        // based on context state changes.
      }
    );

    return () => {
      console.log('AuthProvider: Unmounting. Cleaning up subscription.');
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, [isLoading]); // isLoading added to ensure it's correctly set once.

  const login = async (email?: string, password?: string, redirectTo: string = '/admin/dashboard') => {
    if (!email || !password) {
      console.error("Email and password are required for login.");
      throw new Error("Email and password are required.");
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        if (error.message.toLowerCase().includes('email not confirmed')) {
          throw new Error('auth.email_not_confirmed');
        }
        throw error;
      }
      
      console.log('Login successful, waiting for auth state change...');
      
    } catch (error: any) {
      console.error('Login failed:', error.message);
      throw error;
    }
  };

  const logout = async (redirectTo: string = '/admin/login') => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout failed:', error);
    }
    // User and isAuthenticated state will be updated by onAuthStateChange.
    // Redirect after state update is handled by LayoutRenderer.
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
