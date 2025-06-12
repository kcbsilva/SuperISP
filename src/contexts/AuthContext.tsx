// src/contexts/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
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
  const [isLoading, setIsLoading] = useState(true); // Start true
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    console.log('AuthProvider: Mounting. Initial isLoading:', isLoading);

    const processSession = (session: Session | null, source: string) => {
      if (!isMounted) {
        console.log(`AuthProvider: processSession on unmounted component from ${source}.`);
        return;
      }
      console.log(`AuthProvider: Processing session from ${source}. Session: ${session ? 'Exists' : 'Null'}. Current isLoading: ${isLoading}`);
      
      const currentUser = session?.user || null;
      setUser(currentUser);
      setIsAuthenticated(!!currentUser);
      
      // This is the first time we have definitive session info, or a subsequent auth change
      if (isLoading) { 
          console.log('AuthProvider: Setting isLoading to false. Source:', source);
          setIsLoading(false);
      }
    };

    // Initial check
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log('AuthProvider: getSession() resolved. Session:', session ? 'Exists' : 'Null', 'Error:', error);
      if (error) console.error('AuthProvider: Error in getSession initial check:', error);
      // Process session regardless of error (error might mean no session)
      processSession(session, error ? 'getSession error' : 'getSession');
    }).catch(error => {
      // This catch is for network errors or truly unexpected issues with getSession() itself
      console.error('AuthProvider: Critical error in getSession() promise:', error);
      processSession(null, 'getSession critical error');
    });

    // Listener for subsequent changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log(`AuthProvider: onAuthStateChange event: ${_event}, Session: ${session ? 'Exists' : 'Null'}`);
        processSession(session, `onAuthStateChange (${_event})`);
      }
    );

    return () => {
      console.log('AuthProvider: Unmounting. Cleaning up subscription.');
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []); // Empty dependency array ensures this effect runs once on mount and cleans up on unmount.

  const login = async (email?: string, password?: string, redirectTo: string = '/admin/dashboard') => {
    if (!email || !password) {
        console.error("Email and password are required for login.");
        throw new Error("Email and password are required.");
    }
    // No need to set global isLoading here; onAuthStateChange will handle it.
    // A local loading state for the login button itself might be useful in the Login component.
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        if (error.message.toLowerCase().includes('email not confirmed')) {
          throw new Error('auth.email_not_confirmed'); 
        }
        throw error; 
      }
      // Success: onAuthStateChange will trigger processSession.
    } catch (error: any) {

      console.error('Login failed:', error.message);
      // If login fails hard before any auth state change, global isLoading might still be true.
      // However, processSession should have already run from getSession or INITIAL_SESSION.
      // If it's critical to stop a global loader here for some specific login error UI, ensure it's done carefully.
      // For now, relying on the main effect to eventually settle isLoading.
      throw error; 
    }
  };

  const logout = async (redirectTo: string = '/admin/login') => {
    // Similar to login, onAuthStateChange will trigger processSession.
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout failed:', error);
    }
    // After signOut, onAuthStateChange will set isAuthenticated to false.
    // isLoading should already be false by this point from initial load.
    router.push(redirectTo); 
  };
  
  // Log provider re-renders for debugging
  // console.log("AuthProvider rendering/re-rendering. isLoading:", isLoading, "isAuthenticated:", isAuthenticated);

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
    const pathname = usePathname(); // Corrected import

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
