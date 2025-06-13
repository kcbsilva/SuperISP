
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
  const isMountedRef = useRef(false); // To track if component is mounted

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const processSession = async (session: Session | null, source: string) => {
      if (!isMountedRef.current) return;

      console.log(`AuthProvider: Processing session from ${source}. Session: ${session ? 'Exists' : 'Null'}. Current isLoadingRef: ${isLoadingRef.current}`);

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
        // processSession will be called by onAuthStateChange with INITIAL_SESSION
        // or if getSession returns a session before INITIAL_SESSION fires.
        // If session is null, onAuthStateChange will also likely fire with INITIAL_SESSION (null).
        // Call processSession here to handle cases where onAuthStateChange might not fire if session is already cached and null.
        if (session) { // Only process if getSession actually returned a session
          await processSession(session, 'initial getSession direct');
        }

      } catch (error) {
        console.error('AuthProvider: Error during initializeAuth catch block:', error);
      } finally {
        // This ensures isLoading is set to false after the initial attempt,
        // regardless of success/failure, if it hasn't been set by processSession yet.
        if (isLoadingRef.current && isMountedRef.current) {
          console.log('AuthProvider (initializeAuth finally): Setting isLoading to false if still true.');
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
      subscription?.unsubscribe();
    };
  }, []); // Empty dependency array ensures this runs once on mount

  const login = async (email?: string, password?: string, redirectTo: string = '/admin/dashboard') => {
    if (!email || !password) {
      console.error("Email and password are required for login.");
      throw new Error("Email and password are required.");
    }

    try {
      // isLoading is already true initially, or should be managed by onAuthStateChange.
      // Avoid setting it true here as it might fight with the main isLoading logic.
      
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        // isLoading state will be handled by onAuthStateChange or initial load
        if (error.message.toLowerCase().includes('email not confirmed')) {
          throw new Error('auth.email_not_confirmed');
        }
        throw error;
      }

      console.log('Login successful, waiting for auth state change...');
      // onAuthStateChange will update isAuthenticated and isLoading.
      // LayoutRenderer will handle redirection.
      
    } catch (error: any) {
      console.error('Login failed:', error.message);
      // isLoading state will be handled by onAuthStateChange or initial load
      throw error;
    }
  };

  const logout = async (redirectTo: string = '/admin/login') => {
    try {
      // isLoading is already true initially, or should be managed by onAuthStateChange.
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout failed:', error);
        // isLoading state will be handled by onAuthStateChange or initial load
        throw error;
      }

      // State will be updated by onAuthStateChange (SIGNED_OUT event)
      // router.push will be handled by LayoutRenderer based on new auth state
      console.log('Logout successful, waiting for auth state change and redirect handled by LayoutRenderer...');
      
    } catch (error) {
      console.error('Logout error:', error);
      // isLoading state will be handled by onAuthStateChange or initial load
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
