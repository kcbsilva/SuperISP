// src/app/layout-renderer.tsx
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
// Toast related imports removed as failsafe is removed

const PUBLIC_ADMIN_PATHS = [
  '/admin/login',
  '/admin/forgot-password',
  '/admin/update-password'
];

export default function LayoutRenderer({ children: pageContent }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading: isAuthContextLoading, user } = useAuth(); // Removed logout and toast
  const [isMounted, setIsMounted] = useState(false);
  const { t } = useLocale();

  // Inactivity timer and redirect loop failsafe refs removed

  const isPublicPath = PUBLIC_ADMIN_PATHS.includes(pathname);
  const isAdminPath = pathname.startsWith('/admin');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || isAuthContextLoading) return;

    // With auth disabled, isAuthenticated is always true, isLoading false.
    // This will redirect from public admin paths to the dashboard.
    if (isAuthenticated && isPublicPath) {
      console.log(`LayoutRenderer (Auth Disabled): Authenticated and on public path (${pathname}). Redirecting to dashboard.`);
      router.replace('/admin/dashboard');
      return;
    }

    // The condition for redirecting unauthenticated users to login will not be met.

  }, [isMounted, isAuthenticated, isAuthContextLoading, pathname, isPublicPath, router, user]); // user added to deps for log

  // Inactivity timer and redirect loop failsafe useEffects removed

  if (!isMounted || isAuthContextLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-muted-foreground">
            {t('auth.loading', 'Loading...')}
          </p>
        </div>
      </div>
    );
  }

  return <>{pageContent}</>;
}
