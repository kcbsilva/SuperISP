
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
  const { toast } = useToast(); // Initialize useToast

  // Inactivity Timer
  const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
  const logoutTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleInactivityLogout = React.useCallback(() => {
    // console.log('User inactive, logging out...');
    logout('/admin/login?reason=inactive'); // Pass a reason for potential UI feedback on login page
    toast({
      title: t('auth.session_expired_title', 'Session Expired'),
      description: t('auth.session_expired_desc', 'You have been logged out due to inactivity.'),
      variant: "default",
      duration: 5000, // Show for 5 seconds
    });
  }, [logout, t, toast]);

  const resetLogoutTimer = React.useCallback(() => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }
    if (isAuthenticated && pathname !== '/admin/login') {
      logoutTimerRef.current = setTimeout(handleInactivityLogout, INACTIVITY_TIMEOUT_MS);
    }
  }, [isAuthenticated, pathname, INACTIVITY_TIMEOUT_MS, handleInactivityLogout]);

  React.useEffect(() => {
    setIsMounted(true); // Moved here to ensure it runs once on mount

    const activityEvents: (keyof WindowEventMap)[] = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];

    if (isAuthenticated && pathname !== '/admin/login') {
      resetLogoutTimer(); // Start the timer
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
  }, [isMounted, isAuthenticated, resetLogoutTimer, pathname]);


  React.useEffect(() => {
    if (!isMounted || isAuthLoading) {
      return; // Wait for mount and auth state
    }

    const isAdminPath = pathname.startsWith('/admin');
    const isAdminLoginPath = pathname === '/admin/login';
    const isAdminRootPath = pathname === '/admin';

    if (isAuthenticated) {
      if (isAdminLoginPath || isAdminRootPath) {
        const redirectUrl = searchParams.get('redirect_url');
        router.replace(redirectUrl || '/admin/dashboard');
      }
    } else {
      if (isAdminPath && !isAdminLoginPath && !isAdminRootPath) {
        const redirectUrl = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
        router.replace(`/admin/login?redirect_url=${encodeURIComponent(redirectUrl)}`);
      }
    }
  }, [isMounted, isAuthLoading, isAuthenticated, pathname, router, searchParams, user]);


  if (!isMounted || (isAuthLoading && !user && pathname !== '/admin/login')) {
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
