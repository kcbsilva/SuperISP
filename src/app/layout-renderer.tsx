// src/app/layout-renderer.tsx

'use client';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { useToast } from '@/hooks/use-toast';

const ADMIN_LOGIN_PATH = '/admin/login';
const ADMIN_DASHBOARD_PATH = '/admin/dashboard';
const ADMIN_ROOT_PATH = '/admin';
const ADMIN_FORGOT_PASSWORD_PATH = '/admin/forgot-password';
const ADMIN_UPDATE_PASSWORD_PATH = '/admin/update-password';

// Public paths that don't require authentication
const PUBLIC_ADMIN_PATHS = [
  ADMIN_LOGIN_PATH,
  ADMIN_FORGOT_PASSWORD_PATH,
  ADMIN_UPDATE_PASSWORD_PATH
];

export default function LayoutRenderer({ children: pageContent }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAuthenticated, isLoading: isAuthContextLoading, logout } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();
  const { t } = useLocale();
  const { toast } = useToast();

  const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000;
  const logoutTimerRef = useRef<NodeJS.Timeout | null>(null);

  const isPublicPath = PUBLIC_ADMIN_PATHS.includes(pathname);
  const isAdminPath = pathname.startsWith('/admin');

  console.log(`LayoutRenderer - TOP LEVEL RENDER: isAuthContextLoading=${isAuthContextLoading}, isAuthenticated=${isAuthenticated}, pathname=${pathname}`);

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
    if (isAuthenticated && !isPublicPath) {
      logoutTimerRef.current = setTimeout(handleInactivityLogout, INACTIVITY_TIMEOUT_MS);
    }
  }, [isAuthenticated, isPublicPath, handleInactivityLogout]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const activityEvents: (keyof WindowEventMap)[] = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];

    if (isAuthenticated && !isPublicPath) {
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
  }, [isMounted, isAuthenticated, isPublicPath, resetLogoutTimer]);

  useEffect(() => {
    if (!isMounted || isAuthContextLoading) {
      console.log(`LayoutRenderer Effect (Redirection Logic): SKIPPING - isMounted=${isMounted}, isAuthContextLoading=${isAuthContextLoading}`);
      return;
    }

    console.log(`LayoutRenderer Effect (Redirection Logic): isMounted=${isMounted}, isAuthContextLoading=${isAuthContextLoading}, isAuthenticated=${isAuthenticated}, pathname=${pathname}, user: "${user?.id}"`);
    let didRedirect = false;

    if (isAuthenticated) {
      console.log('LayoutRenderer Effect: User is authenticated.');
      if (pathname === ADMIN_ROOT_PATH) {
        console.log('LayoutRenderer Effect: Authenticated on ADMIN_ROOT_PATH, redirecting to dashboard');
        router.replace(ADMIN_DASHBOARD_PATH);
        didRedirect = true;
      } else if (isPublicPath) {
        console.log(`LayoutRenderer Effect: Authenticated on PUBLIC_ADMIN_PATH (${pathname}), redirecting to dashboard`);
        router.replace(ADMIN_DASHBOARD_PATH);
        didRedirect = true;
      }
    } else {
      console.log('LayoutRenderer Effect: User is NOT authenticated.');
      if (isAdminPath && !isPublicPath && pathname !== ADMIN_ROOT_PATH) {
        console.log(`LayoutRenderer Effect: Unauthenticated on protected admin path (${pathname}), redirecting to login`);
        router.replace(ADMIN_LOGIN_PATH);
        didRedirect = true;
      }
    }

    if (didRedirect) {
      setIsRedirecting(true);
    } else if (isRedirecting) { // If no redirect happened but we were in redirecting state
      console.log("LayoutRenderer Effect: No redirect performed, clearing redirecting state.");
      setIsRedirecting(false);
    }

  // NOTE: `user` object from useAuth() was added to console.log for debugging, but not added to dependency array to avoid excessive re-runs.
  // Key dependencies are isAuthenticated, isAuthContextLoading, pathname, and router object itself.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted, isAuthContextLoading, isAuthenticated, pathname, router, isAdminPath, isPublicPath]);


  if (!isMounted || isAuthContextLoading || isRedirecting) {
    const loadingMessage = isRedirecting
      ? (isAuthenticated ? t('auth.redirecting_dashboard', 'Redirecting to dashboard...') : t('auth.redirecting_login', 'Redirecting to login...'))
      : t('auth.loading', 'Loading authentication...');
    console.log(`LayoutRenderer RENDER: Showing LOADER - isMounted=${isMounted}, isAuthContextLoading=${isAuthContextLoading}, isRedirecting=${isRedirecting}, Message: ${loadingMessage}`);
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-muted-foreground">{loadingMessage}</p>
        </div>
      </div>
    );
  }

  console.log(`LayoutRenderer RENDER: Showing PAGE CONTENT for ${pathname}`);
  return <>{pageContent}</>;
}
