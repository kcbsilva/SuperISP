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
    let isMounted = true; // To prevent state updates on unmounted component
    let initialCheckDone = false;

    const handleAuthStateChange = (session: Session | null) => {
      if (!isMounted) return;
      console.log('Auth state changed (listener):', session ? 'Session found' : 'No session');
      const currentUser = session?.user || null;
      setUser(currentUser);
      setIsAuthenticated(!!currentUser);
      if (!initialCheckDone) {
        setIsLoading(false);
        initialCheckDone = true;
      }
    };

    // Attempt to get the current session on initial load
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error("Error getting initial session:", error);
      }
      if (isMounted) { // Check if still mounted before updating state
        handleAuthStateChange(session);
      }
    }).catch(e => {
      console.error("Exception in getInitialSession promise:", e);
      if (isMounted) {
        handleAuthStateChange(null); // Treat as no session
      }
    });

    // Listen for subsequent auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (isMounted && initialCheckDone) { // Only update if initial check is done and component is mounted
          handleAuthStateChange(session);
        } else if (isMounted && !initialCheckDone) { // Handle the very first event if getSession was slow
          handleAuthStateChange(session);
        }
      }
    );

    return () => {
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
      setIsLoading(true); // Indicate login process has started
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        // Check for specific "Email not confirmed" error
        if (error.message.toLowerCase().includes('email not confirmed')) {
          throw new Error('auth.email_not_confirmed'); // Specific key for UI
        }
        throw error; // Rethrow other errors
      }
      // Successful login will trigger onAuthStateChange, which updates state and isLoading
      // router.push(redirectTo); // Consider if redirect here is needed or if LayoutRenderer handles it
    } catch (error: any) {
      console.error('Login failed:', error.message);
      setIsLoading(false); // Reset loading on explicit failure if onAuthStateChange doesn't cover it fast enough
      throw error; // Rethrow to be caught by the calling component
    }
  };

  const logout = async (redirectTo: string = '/admin/login') => {
    // setIsLoading(true); // Set loading true before sign out
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout failed:', error);
      // setIsLoading(false); // Reset loading if logout fails
    }
    // onAuthStateChange will handle setting user to null, isAuthenticated to false.
    // isLoading will be set to false by the onAuthStateChange handler eventually.
    router.push(redirectTo); // Redirect after initiating sign out
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
      // This return null prevents rendering the component if not authenticated,
      // relying on the useEffect above to handle the redirect.
      return null;
    }

    return <WrappedComponent {...props} />;
  };
  ComponentWithAuth.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  return ComponentWithAuth;
};
