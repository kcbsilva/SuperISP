// src/contexts/AuthContext.tsx
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
  const [isLoading, setIsLoading] = useState(true); // Start true
  const router = useRouter();
  const isLoadingRef = useRef(true); // Ref to track initial loading state

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

    // Supabase client automatically performs an initial session check which will
    // trigger onAuthStateChange with INITIAL_SESSION.
    // We don't need a separate initializeAuth() call here for getSession().
    
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
  }, []); // Empty dependency array ensures this effect runs only once on mount

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
