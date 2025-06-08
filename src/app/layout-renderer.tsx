// src/app/layout-renderer.tsx
'use client';

import React from 'react'; // Corrected React import
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/app/admin/layout'; // Default export from admin/layout.tsx
import { Loader2 } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';

export default function LayoutRenderer({ children: pageContent }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [isMounted, setIsMounted] = React.useState(false);
  const router = useRouter();
  const { t } = useLocale();

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    if (!isMounted || isAuthLoading) {
      return; // Don't do anything until mounted and auth state is resolved
    }

    const isAdminPath = pathname.startsWith('/admin');
    const isAdminLoginPath = pathname === '/admin/login';
    const isAdminRootPath = pathname === '/admin';

    if (isAuthenticated) {
      if (isAdminLoginPath || isAdminRootPath) {
        router.replace('/admin/dashboard');
      }
    } else {
      if (isAdminPath && !isAdminLoginPath && !isAdminRootPath) { // Also exclude admin root from this redirect
        router.replace('/admin/login');
      }
    }
  }, [isMounted, isAuthLoading, isAuthenticated, pathname, router]);


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

  // Specific handling for admin routes
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login' || pathname === '/admin') { // Login page or admin root (redirector)
      // If authenticated, redirect is in progress (show loader from useEffect logic).
      // If not authenticated, show the page content directly.
      return isAuthenticated && pathname === '/admin/login' ? ( // Only show loader for login if redirecting
        <div className="flex h-screen w-full items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : <>{pageContent}</>;
    }

    // For any other /admin/* page (e.g., /admin/dashboard, /admin/settings)
    if (isAuthenticated) {
      return <AdminLayout>{pageContent}</AdminLayout>; // Apply AdminLayout (shell)
    } else {
      // If not authenticated on a protected admin page, a redirect to login is in progress (or should be triggered by useEffect). Show loader.
      return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }
  }

  // For all non-admin pages (e.g., root '/', '/client/*', etc.)
  return <>{pageContent}</>;
}
