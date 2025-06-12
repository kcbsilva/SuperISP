// src/app/layout-renderer.tsx
'use client';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { useToast } from '@/hooks/use-toast';

const ADMIN_LOGIN_PATH = '/admin/login';
const ADMIN_DASHBOARD_PATH = '/admin/dashboard';
const ADMIN_ROOT_PATH = '/admin';
const ADMIN_FORGOT_PASSWORD_PATH = '/admin/forgot-password';
const ADMIN_UPDATE_PASSWORD_PATH = '/admin/update-password';

export default function LayoutRenderer({ children: pageContent }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAuthenticated, isLoading: isAuthContextLoading, user, logout } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLocale();
  const { toast } = useToast();

  console.log(`LayoutRenderer - TOP LEVEL RENDER: isAuthContextLoading=${isAuthContextLoading}, isAuthenticated=${isAuthenticated}, pathname=${pathname}`);

  const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000;
  const logoutTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleInactivityLogout = useCallback(() => {
    logout(ADMIN_LOGIN_PATH + '?reason=inactive');
    toast({
      title: t('auth.session_expired_title', 'Session Expired'),
      description: t('auth.session_expired_desc', 'You have been logged out due to inactivity.'),
      variant: "default",
      duration: 5000,
    });
  }, [logout, t, toast]);

  const resetLogoutTimer = useCallback(() => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }
    if (isAuthenticated && pathname !== ADMIN_LOGIN_PATH && pathname !== ADMIN_FORGOT_PASSWORD_PATH && pathname !== ADMIN_UPDATE_PASSWORD_PATH) {
      logoutTimerRef.current = setTimeout(handleInactivityLogout, INACTIVITY_TIMEOUT_MS);
    }
  }, [isAuthenticated, pathname, INACTIVITY_TIMEOUT_MS, handleInactivityLogout]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Inactivity timer effect
  useEffect(() => {
    if (!isMounted) return;

    const activityEvents: (keyof WindowEventMap)[] = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    
    if (isAuthenticated && pathname !== ADMIN_LOGIN_PATH && pathname !== ADMIN_FORGOT_PASSWORD_PATH && pathname !== ADMIN_UPDATE_PASSWORD_PATH) {
      resetLogoutTimer();
      activityEvents.forEach(event => window.addEventListener(event, resetLogoutTimer, { passive: true }));
    } else {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }
    }

    return () => {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }
      activityEvents.forEach(event => window.removeEventListener(event, resetLogoutTimer));
    };
  }, [isMounted, isAuthenticated, pathname, resetLogoutTimer]);

  // Simplified redirect logic - let middleware handle most of the heavy lifting
  useEffect(() => {
    console.log(
      `LayoutRenderer Effect: isMounted=${isMounted}, isAuthContextLoading=${isAuthContextLoading}, isAuthenticated=${isAuthenticated}, pathname=${pathname}`
    );

    if (!isMounted || isAuthContextLoading) {
      console.log('LayoutRenderer Effect: Skipping redirect logic, not mounted or auth is loading.');
      return;
    }

    // Only handle specific client-side redirects that middleware can't handle
    // Let middleware handle most auth redirects to avoid conflicts
    if (isAuthenticated && pathname === ADMIN_ROOT_PATH) {
      console.log('LayoutRenderer Effect: Authenticated user on admin root. Redirecting to dashboard.');
      router.replace(ADMIN_DASHBOARD_PATH);
    }

  }, [isMounted, isAuthContextLoading, isAuthenticated, pathname, router]);

  if (!isMounted || isAuthContextLoading) {
    console.log(`LayoutRenderer RENDER: Showing LOADING UI. isMounted=${isMounted}, isAuthContextLoading=${isAuthContextLoading}`);
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-muted-foreground">{t('auth.loading', 'Loading authentication...')}</p>
        </div>
      </div>
    );
  }

  console.log(`LayoutRenderer RENDER: Showing PAGE CONTENT for ${pathname}`);
  return <>{pageContent}</>;
}