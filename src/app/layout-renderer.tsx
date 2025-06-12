
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
  const { isAuthenticated, isLoading: isAuthLoading, user, logout } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLocale();
  const { toast } = useToast();

  const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000;
  const logoutTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleInactivityLogout = useCallback(() => {
    logout(ADMIN_LOGIN_PATH + '?reason=inactive'); // Ensure logout redirects to login
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
      `LayoutRenderer Effect: isMounted=${isMounted}, isAuthLoading=${isAuthLoading}, isAuthenticated=${isAuthenticated}, pathname=${pathname}, user: ${JSON.stringify(user)}`
    );

    if (!isMounted || isAuthLoading) {
      console.log('LayoutRenderer Effect: Skipping redirect logic, not mounted or auth is loading.');
      return;
    }

    const isAdminPath = pathname.startsWith(ADMIN_ROOT_PATH);
    
    if (isAuthenticated) {
      console.log('LayoutRenderer Effect: User is authenticated.');
      if (pathname === ADMIN_LOGIN_PATH || pathname === ADMIN_ROOT_PATH || pathname === ADMIN_FORGOT_PASSWORD_PATH) {
        const redirectUrlParam = searchParams.get('redirect_url');
        const targetRedirect = redirectUrlParam || ADMIN_DASHBOARD_PATH;
        console.log(`LayoutRenderer Effect: Authenticated user on login/root/forgot. Redirecting to ${targetRedirect}.`);
        router.replace(targetRedirect);
      }
      // For ADMIN_UPDATE_PASSWORD_PATH, if authenticated, we assume it's a PASSWORD_RECOVERY session
      // or the page itself will handle if it's a regular session trying to access it.
    } else {
      // If not authenticated, and trying to access a protected admin path
      console.log('LayoutRenderer Effect: User is NOT authenticated.');
      const isPublicPage = pathname === ADMIN_LOGIN_PATH || 
                           pathname === ADMIN_ROOT_PATH || // Admin root might show login or redirect
                           pathname === ADMIN_FORGOT_PASSWORD_PATH || 
                           pathname === ADMIN_UPDATE_PASSWORD_PATH;

      if (isAdminPath && !isPublicPage) {
        console.log('LayoutRenderer Effect: User NOT authenticated and on protected admin path. Redirecting to login.');
        const redirectUrl = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
        router.replace(`${ADMIN_LOGIN_PATH}?redirect_url=${encodeURIComponent(redirectUrl)}`);
      } else {
        console.log('LayoutRenderer Effect: User NOT authenticated but on public admin page or non-admin path. No redirect needed by this effect.');
      }
    }
  // Ensure all dependencies that could trigger redirection logic are included.
  }, [isMounted, isAuthLoading, isAuthenticated, pathname, router, searchParams, user]);


  if (!isMounted || isAuthLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-muted-foreground">{t('auth.loading', 'Loading authentication...')}</p>
        </div>
      </div>
    );
  }

  return <>{pageContent}</>;
}
