
// src/app/layout-renderer.tsx
'use client';
import React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation'; // Added useSearchParams
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';

export default function LayoutRenderer({ children: pageContent }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAuthenticated, isLoading: isAuthLoading, user } = useAuth(); // Get user
  const [isMounted, setIsMounted] = React.useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLocale();

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    if (!isMounted || isAuthLoading) {
      return; // Wait for mount and auth state
    }

    const isAdminPath = pathname.startsWith('/admin');
    const isAdminLoginPath = pathname === '/admin/login';
    const isAdminRootPath = pathname === '/admin'; // Could be a redirector page

    if (isAuthenticated) {
      // If authenticated and trying to access login page or the admin root (if it's just a redirector)
      if (isAdminLoginPath || isAdminRootPath) {
        const redirectUrl = searchParams.get('redirect_url');
        router.replace(redirectUrl || '/admin/dashboard');
      }
      // For other authenticated admin paths, just let them render
    } else {
      // If not authenticated
      if (isAdminPath && !isAdminLoginPath && !isAdminRootPath) {
        // If trying to access a protected admin page, redirect to login
        // Preserve the intended path to redirect back after login
        const redirectUrl = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
        router.replace(`/admin/login?redirect_url=${encodeURIComponent(redirectUrl)}`);
      }
      // If on /admin/login or /admin (and not authenticated), or any non-admin path, allow rendering
    }
  }, [isMounted, isAuthLoading, isAuthenticated, pathname, router, searchParams, user]);


  if (!isMounted || (isAuthLoading && !user && pathname !== '/admin/login')) { // Show loader if auth is loading AND user is not yet available (unless on login page)
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
