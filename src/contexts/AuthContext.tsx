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
  const [isLoading, setIsLoading] = useState(true); // Start true, set to false once initial auth state is known
  const router = useRouter();
  // const pathname = usePathname(); // Not directly used here, but available

  useEffect(() => {
    let initialCheckDone = false;

    const handleAuthStateChange = (session: Session | null) => {
      console.log('Auth state changed (listener):', session);
      const currentUser = session?.user || null;
      setUser(currentUser);
      setIsAuthenticated(!!currentUser);
      if (!initialCheckDone) {
        setIsLoading(false);
        initialCheckDone = true;
      }
    };
    
    // Immediately try to get the current session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error("Error getting initial session:", error);
      }
      handleAuthStateChange(session);
    }).catch(e => {
      console.error("Exception in getInitialSession promise:", e);
      handleAuthStateChange(null); // Treat as no session
    });

    // Then, listen for subsequent changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        // The initial getSession() should handle the first load.
        // This listener handles subsequent changes (login, logout, token refresh).
        if (initialCheckDone) { // Only update if initial check is done
            handleAuthStateChange(session);
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []); // Empty dependency array: runs once on mount

  const login = async (email?: string, password?: string, redirectTo: string = '/admin/dashboard') => {
    if (!email || !password) {
        console.error("Email and password are required for login.");
        throw new Error("Email and password are required.");
    }
    try {
      setIsLoading(true); // Indicate login process has started
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      // onAuthStateChange will handle setting user, isAuthenticated, and isLoading to false eventually
      // For a smoother UX, you might redirect here, but LayoutRenderer should also handle it
      // router.push(redirectTo); 
    } catch (error: any) {
      console.error('Login failed:', error);
      setIsLoading(false); // Reset loading on explicit failure
      throw error;
    }
    // Note: isLoading will be set to false by onAuthStateChange or the getSession resolution
  };

  const logout = async (redirectTo: string = '/admin/login') => {
    setIsLoading(true); // Indicate logout process has started
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout failed:', error);
    }
    // onAuthStateChange will handle setting user to null, isAuthenticated to false,
    // and eventually isLoading to false via the listener logic.
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
      return <div>Loading authentication...</div>;
    }

    if (!isAuthenticated) {
      return null; 
    }

    return <WrappedComponent {...props} />;
  };
  ComponentWithAuth.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  return ComponentWithAuth;
};
