
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

const PUBLIC_ADMIN_PATHS = [
  ADMIN_LOGIN_PATH,
  ADMIN_FORGOT_PASSWORD_PATH,
  ADMIN_UPDATE_PASSWORD_PATH
];

export default function LayoutRenderer({ children: pageContent }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAuthenticated, user, isLoading: isAuthContextLoading, logout } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();
  const { t } = useLocale();
  const { toast } = useToast();

  const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
  const REDIRECT_LOOP_BREAK_TIMEOUT_MS = 15 * 1000; // 15 seconds

  const inactivityLogoutTimerRef = useRef<NodeJS.Timeout | null>(null);
  const redirectLoopBreakTimerRef = useRef<NodeJS.Timeout | null>(null);

  const isPublicPath = PUBLIC_ADMIN_PATHS.includes(pathname);
  const isAdminPath = pathname.startsWith('/admin');

  // Initial mount effect
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleInactivityLogout = useCallback(() => {
    logout(ADMIN_LOGIN_PATH + '?reason=inactive');
    toast({
      title: t('auth.session_expired_title', 'Session Expired'),
      description: t('auth.session_expired_desc', 'You have been logged out due to inactivity.'),
      variant: "default",
      duration: 5000,
    });
  }, [logout, t, toast]);

  const resetInactivityTimer = useCallback(() => {
    if (inactivityLogoutTimerRef.current) {
      clearTimeout(inactivityLogoutTimerRef.current);
    }
    if (isAuthenticated && !isPublicPath && isMounted) { // Added isMounted check
      inactivityLogoutTimerRef.current = setTimeout(handleInactivityLogout, INACTIVITY_TIMEOUT_MS);
    }
  }, [isAuthenticated, isPublicPath, handleInactivityLogout, isMounted]);

  // Inactivity timer management
  useEffect(() => {
    if (!isMounted) return;

    const activityEvents: (keyof WindowEventMap)[] = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];

    if (isAuthenticated && !isPublicPath) {
      resetInactivityTimer();
      activityEvents.forEach(event => window.addEventListener(event, resetInactivityTimer, { passive: true }));
    } else {
      if (inactivityLogoutTimerRef.current) {
        clearTimeout(inactivityLogoutTimerRef.current);
      }
    }

    return () => {
      if (inactivityLogoutTimerRef.current) {
        clearTimeout(inactivityLogoutTimerRef.current);
      }
      activityEvents.forEach(event => window.removeEventListener(event, resetInactivityTimer));
    };
  }, [isMounted, isAuthenticated, isPublicPath, resetInactivityTimer]);


  // Redirection and loop breaking logic
  useEffect(() => {
    if (!isMounted || isAuthContextLoading) {
      console.log(`LayoutRenderer Effect (Redirection Logic): SKIPPING - isMounted=${isMounted}, isAuthLoading=${isAuthContextLoading}`);
      return;
    }

    // Clear any previous loop break timer at the start of this effect
    if (redirectLoopBreakTimerRef.current) {
      clearTimeout(redirectLoopBreakTimerRef.current);
      redirectLoopBreakTimerRef.current = null;
    }

    console.log(`LayoutRenderer Effect (Redirection Logic): isMounted=${isMounted}, isAuthLoading=${isAuthContextLoading}, isAuthenticated=${isAuthenticated}, pathname=${pathname}, user: "${user?.id}"`);
    let didRedirectThisPass = false;

    if (isAuthenticated) {
      console.log('LayoutRenderer Effect: User is authenticated.');
      if (pathname === ADMIN_ROOT_PATH) {
        console.log('LayoutRenderer Effect: Authenticated on ADMIN_ROOT_PATH, redirecting to dashboard');
        router.replace(ADMIN_DASHBOARD_PATH);
        didRedirectThisPass = true;
      } else if (isPublicPath) {
        console.log(`LayoutRenderer Effect: Authenticated on PUBLIC_ADMIN_PATH (${pathname}), redirecting to dashboard`);
        router.replace(ADMIN_DASHBOARD_PATH);
        didRedirectThisPass = true;

        // If we are on the login page and authenticated, start the loop break timer
        if (pathname === ADMIN_LOGIN_PATH) {
          console.log('LayoutRenderer Effect: Starting redirect loop break timer.');
          redirectLoopBreakTimerRef.current = setTimeout(() => {
            // Check current conditions *inside* the timeout callback
            // Need to check window.location.pathname because `pathname` in closure might be stale
            if (window.location.pathname === ADMIN_LOGIN_PATH) {
              console.warn('LayoutRenderer: Dashboard redirect appears stuck after 15s. Forcing logout.');
              toast({
                title: t('auth.redirect_stuck_title', 'Redirect Issue'),
                description: t('auth.redirect_stuck_desc', 'Could not reach the dashboard. Logging out to prevent a loop.'),
                variant: 'destructive',
                duration: 7000,
              });
              logout(ADMIN_LOGIN_PATH + '?reason=redirect_loop_broken'); // logout will trigger auth state change
            }
          }, REDIRECT_LOOP_BREAK_TIMEOUT_MS);
        }
      } else {
        // Authenticated and on a protected admin page (not login/forgot/update) or non-admin page.
        // No redirect needed from here, ensure isRedirecting is false.
        if (isRedirecting) setIsRedirecting(false);
      }
    } else { // Not authenticated
      console.log('LayoutRenderer Effect: User is NOT authenticated.');
      if (isAdminPath && !isPublicPath && pathname !== ADMIN_ROOT_PATH) {
        console.log(`LayoutRenderer Effect: Unauthenticated on protected admin path (${pathname}), redirecting to login`);
        router.replace(ADMIN_LOGIN_PATH);
        didRedirectThisPass = true;
      } else {
         // Not authenticated and on a public page or admin root.
         // No redirect needed, ensure isRedirecting is false.
        if (isRedirecting) setIsRedirecting(false);
      }
    }

    if (didRedirectThisPass && !isRedirecting) {
      setIsRedirecting(true);
    } else if (!didRedirectThisPass && isRedirecting) {
      // If no redirect was performed in this pass, but we were in a redirecting state, clear it.
      // This happens if, for example, auth state changes while a redirect was "pending".
      setIsRedirecting(false);
    }
    
    // Cleanup function for the effect
    return () => {
      if (redirectLoopBreakTimerRef.current) {
        clearTimeout(redirectLoopBreakTimerRef.current);
        redirectLoopBreakTimerRef.current = null;
        console.log('LayoutRenderer Effect: Cleared redirect loop break timer on cleanup or re-run.');
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted, isAuthContextLoading, isAuthenticated, pathname, user, router, logout, t, toast]); // isAdminPath, isPublicPath removed as they are derived from pathname


  if (!isMounted || isAuthContextLoading || (isRedirecting && isAuthenticated && pathname === ADMIN_LOGIN_PATH)) {
    // Show loader if:
    // 1. Not mounted yet.
    // 2. Auth context is still loading.
    // 3. We are in a redirecting state FROM the login page while authenticated (meaning we are waiting for the loop break or successful redirect).
    const loadingMessage = isRedirecting
      ? (isAuthenticated ? t('auth.redirecting_dashboard', 'Redirecting to dashboard...') : t('auth.redirecting_login', 'Redirecting to login...'))
      : t('auth.loading', 'Loading authentication...');
    console.log(`LayoutRenderer RENDER: Showing LOADER - isMounted=${isMounted}, isAuthContextLoading=${isAuthContextLoading}, isRedirecting=${isRedirecting}, pathname=${pathname}, Message: ${loadingMessage}`);
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

