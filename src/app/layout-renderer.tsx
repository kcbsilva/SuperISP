
// src/app/layout-renderer.tsx
'use client';
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
// AdminLayout is applied by Next.js file system for /admin/* routes, so we don't explicitly use it here for wrapping.
// We rely on src/app/admin/layout.tsx to conditionally render the shell.
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
      return; // Wait for mount and auth state
    }

    const isAdminPath = pathname.startsWith('/admin');
    const isAdminLoginPath = pathname === '/admin/login';
    const isAdminRootPath = pathname === '/admin';

    if (isAuthenticated) {
      if (isAdminLoginPath || isAdminRootPath) {
        router.replace('/admin/dashboard');
      }
    } else {
      // Middleware should handle redirecting to login for protected admin paths.
      // This client-side check is a fallback or for SPAs if middleware isn't covering all cases.
      if (isAdminPath && !isAdminLoginPath && !isAdminRootPath) {
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

  // If it's an admin path, the src/app/admin/layout.tsx will be automatically applied by Next.js
  // and will conditionally render the shell. So, LayoutRenderer just passes the content.
  // If user is not authenticated and tries to access a protected admin page,
  // middleware should redirect. If client-side check catches this, show loader.
  if (pathname.startsWith('/admin') && !isAuthenticated && pathname !== '/admin/login' && pathname !== '/admin') {
      return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
  }
  
  // For all paths (admin or non-admin), just render the pageContent.
  // The appropriate layout (e.g., src/app/admin/layout.tsx) will be applied by Next.js.
  return <>{pageContent}</>;
}

    