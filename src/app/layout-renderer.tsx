// src/app/layout-renderer.tsx
'use client';
import React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { useToast } from '@/hooks/use-toast'; // Import useToast

export default function LayoutRenderer({ children: pageContent }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAuthenticated, isLoading: isAuthLoading, user, logout } = useAuth();
  const [isMounted, setIsMounted] = React.useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLocale();
  const { toast } = useToast();

  const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000;
  const logoutTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleInactivityLogout = React.useCallback(() => {
    logout('/admin/login?reason=inactive');
    toast({
      title: t('auth.session_expired_title', 'Session Expired'),
      description: t('auth.session_expired_desc', 'You have been logged out due to inactivity.'),
      variant: "default",
      duration: 5000,
    });
  }, [logout, t, toast]);

  const resetLogoutTimer = React.useCallback(() => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }
    // Check isAuthenticated directly from useAuth for current status
    if (isAuthenticated && pathname !== '/admin/login') {
      logoutTimerRef.current = setTimeout(handleInactivityLogout, INACTIVITY_TIMEOUT_MS);
    }
  }, [isAuthenticated, pathname, INACTIVITY_TIMEOUT_MS, handleInactivityLogout]);


  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Inactivity timer setup
  React.useEffect(() => {
    if (!isMounted) return; // Don't run if not mounted

    const activityEvents: (keyof WindowEventMap)[] = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    
    if (isAuthenticated && pathname !== '/admin/login') {
      resetLogoutTimer(); // Start or reset the timer
      activityEvents.forEach(event => window.addEventListener(event, resetLogoutTimer, { passive: true }));
    } else {
      // If not authenticated or on login page, clear any existing timer
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
  }, [isMounted, isAuthenticated, pathname, resetLogoutTimer]); // Dependencies ensure timer logic re-evaluates correctly

  // Redirection logic
  React.useEffect(() => {
    if (!isMounted || isAuthLoading) { // Wait for mount and auth state to settle *before* redirecting
      return;
    }

    const isAdminPath = pathname.startsWith('/admin');
    const isAdminLoginPath = pathname === '/admin/login';
    const isAdminRootPath = pathname === '/admin';

    if (isAuthenticated) {
      if (isAdminLoginPath || isAdminRootPath) {
        const redirectUrlParam = searchParams.get('redirect_url');
        router.replace(redirectUrlParam || '/admin/dashboard');
      }
    } else {
      // If not authenticated, and trying to access a protected admin path
      if (isAdminPath && !isAdminLoginPath && !isAdminRootPath) {
        const redirectUrl = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
        router.replace(`/admin/login?redirect_url=${encodeURIComponent(redirectUrl)}`);
      }
    }
  }, [isMounted, isAuthLoading, isAuthenticated, pathname, router, searchParams, user]);


  // Loader display condition
  if (!isMounted || isAuthLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-muted-foreground">{t('auth.loading', 'Loading...')}</p>
        </div>
      </div>
    );
  }

  return <>{pageContent}</>;
}
