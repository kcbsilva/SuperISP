
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
  const { isAuthenticated, isLoading: isAuthContextLoading, user, logout } = useAuth(); // Renamed to avoid clash, added logout
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLocale();
  const { toast } = useToast();

  // LOGGING THE CONTEXT VALUE DIRECTLY
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

  useEffect(() => {
    console.log(
      `LayoutRenderer Effect (Redirection Logic): isMounted=${isMounted}, isAuthContextLoading=${isAuthContextLoading}, isAuthenticated=${isAuthenticated}, pathname=${pathname}, user: ${JSON.stringify(user?.id)}`
    );

    if (!isMounted || isAuthContextLoading) {
      console.log('LayoutRenderer Effect: Skipping redirect logic, not mounted or auth is loading.');
      return;
    }

    const isAdminPath = pathname.startsWith(ADMIN_ROOT_PATH);
    
    if (isAuthenticated) {
      console.log('LayoutRenderer Effect: User is authenticated.');
      // If authenticated and on login, admin root, or forgot password, redirect to dashboard
      if (pathname === ADMIN_LOGIN_PATH || pathname === ADMIN_ROOT_PATH || pathname === ADMIN_FORGOT_PASSWORD_PATH) {
        console.log(`LayoutRenderer Effect: Authenticated and on public/root admin page (${pathname}). Redirecting to dashboard.`);
        router.replace(ADMIN_DASHBOARD_PATH);
      } else if (pathname === ADMIN_UPDATE_PASSWORD_PATH) {
        // If authenticated on update-password, it might be PASSWORD_RECOVERY flow (token in URL hash).
        // Supabase client handles this. The onAuthStateChange should have set the session.
        // If it's a regular logged-in user navigating here, the page itself should ideally handle (e.g., show error or redirect).
        // For now, we allow it, assuming the update-password page logic is robust.
        console.log('LayoutRenderer Effect: Authenticated on update-password, allowing. Page logic should handle if session is not PW_RECOVERY.');
      } else {
        console.log('LayoutRenderer Effect: Authenticated and on a protected admin page or non-admin page. No redirect needed by this effect based on this condition.');
      }
    } else {
      // User is NOT authenticated
      console.log('LayoutRenderer Effect: User is NOT authenticated.');
      const isPublicAdminPage = pathname === ADMIN_LOGIN_PATH || 
                               pathname === ADMIN_ROOT_PATH || // Admin root can be public (redirects to login)
                               pathname === ADMIN_FORGOT_PASSWORD_PATH || 
                               pathname === ADMIN_UPDATE_PASSWORD_PATH;

      if (isAdminPath && !isPublicAdminPage) {
        // Not authenticated and on a protected admin path
        console.log('LayoutRenderer Effect: User NOT authenticated and on protected admin path. Redirecting to login.');
        const redirectUrl = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
        router.replace(`${ADMIN_LOGIN_PATH}?redirect_url=${encodeURIComponent(redirectUrl)}`);
      } else {
        console.log('LayoutRenderer Effect: User NOT authenticated but on public admin page or non-admin path. No redirect needed by this effect.');
      }
    }
  // Ensure all dependencies that could trigger redirection logic are included.
  }, [isMounted, isAuthContextLoading, isAuthenticated, pathname, router, searchParams, user]);


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
