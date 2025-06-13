
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
  const isLoadingRef = useRef(true); // Ref to track loading state internally
  const initializationRef = useRef(false); // Ref to ensure initialization runs once
  const isMountedRef = useRef(false);

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
        if (session) { 
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
  }, []);

  const login = async (email?: string, password?: string, redirectTo: string = '/admin/dashboard') => {
    if (!email || !password) {
      console.error("Email and password are required for login.");
      throw new Error("Email and password are required.");
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
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
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        // Check for specific error indicating no session or already logged out
        if (error.name === 'AuthSessionMissingError' || error.message.toLowerCase().includes('auth session missing') || error.message.toLowerCase().includes('no active session')) {
          console.warn('Logout called but no active session found by Supabase client. Proceeding with client-side logout state changes.', error);
          // Don't throw; onAuthStateChange will eventually handle the (already) logged-out state.
          // Manually update client state if onAuthStateChange doesn't fire quickly enough or if already null
          if (isMountedRef.current) {
            setUser(null);
            setIsAuthenticated(false);
          }
        } else {
          console.error('Logout failed:', error);
          throw error; // Re-throw other errors
        }
      }
      // If no error, onAuthStateChange (SIGNED_OUT event) will handle state updates.
      console.log('Logout process initiated, waiting for auth state change and redirect handled by LayoutRenderer...');
      
    } catch (error) {
      console.error('Logout error (outer catch):', error);
      // Ensure client state is logged out even if Supabase throws an unexpected error
      if (isMountedRef.current) {
        setUser(null);
        setIsAuthenticated(false);
      }
      // We might still want to throw if it's not an AuthSessionMissingError caught above
      if (!(error instanceof Error && (error.name === 'AuthSessionMissingError' || error.message.toLowerCase().includes('auth session missing')))) {
          throw error;
      }
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
