// src/contexts/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation'; // usePathname might not be needed here
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

  useEffect(() => {
    let isMounted = true;
    let initialCheckDone = false;
    console.log('AuthProvider: useEffect entered. isMounted:', isMounted, 'initialCheckDone:', initialCheckDone);

    const handleAuthStateChange = (session: Session | null, source: string) => {
      if (!isMounted) {
        console.log(`AuthProvider: handleAuthStateChange called from ${source} on unmounted component. Session:`, session ? 'Exists' : 'Null');
        return;
      }
      console.log(`AuthProvider: handleAuthStateChange called from ${source}. Session:`, session ? 'Exists' : 'Null', 'Current initialCheckDone:', initialCheckDone);
      const currentUser = session?.user || null;
      setUser(currentUser);
      setIsAuthenticated(!!currentUser);
      if (!initialCheckDone) {
        console.log('AuthProvider: Setting isLoading to false via handleAuthStateChange from source:', source);
        setIsLoading(false);
        initialCheckDone = true;
      }
    };

    console.log('AuthProvider: Attempting supabase.auth.getSession()');
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log('AuthProvider: supabase.auth.getSession() promise resolved. Session:', session ? 'Exists' : 'Null', 'Error:', error);
      if (isMounted) {
        if (error) {
          console.error("AuthProvider: Error getting initial session:", error);
          handleAuthStateChange(null, 'getSessionError');
        } else {
          handleAuthStateChange(session, 'getSessionSuccess');
        }
      } else {
        console.log('AuthProvider: supabase.auth.getSession() resolved but component unmounted.');
      }
    }).catch(e => {
      console.error("AuthProvider: Exception in getSession promise:", e);
      if (isMounted) {
        handleAuthStateChange(null, 'getSessionCatch');
      } else {
        console.log('AuthProvider: getSession promise caught exception but component unmounted.');
      }
    });

    console.log('AuthProvider: Setting up onAuthStateChange listener.');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log('AuthProvider: onAuthStateChange event fired. Event:', _event, 'Session:', session ? 'Exists' : 'Null');
        handleAuthStateChange(session, `onAuthStateChange (${_event})`);
      }
    );

    return () => {
      console.log('AuthProvider: useEffect cleanup. Unsubscribing from onAuthStateChange.');
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
      setIsLoading(true); 
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        if (error.message.toLowerCase().includes('email not confirmed')) {
          throw new Error('auth.email_not_confirmed'); 
        }
        throw error; 
      }
    } catch (error: any) {
      console.error('Login failed:', error.message);
      setIsLoading(false); 
      throw error; 
    }
  };

  const logout = async (redirectTo: string = '/admin/login') => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout failed:', error);
    }
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
// This HOC is not currently used in the setup with LayoutRenderer, but kept for completeness.
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
      return <div>Loading authentication...</div>; // Or a more sophisticated loader
    }

    if (!isAuthenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
  ComponentWithAuth.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  return ComponentWithAuth;
};
