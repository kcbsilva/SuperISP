
'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/app/admin/layout'; // Default export from admin/layout.tsx
// import ClientLayout from '@/app/client/layout'; // Uncomment if you create a client layout
import { Loader2 } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext'; // Import useLocale for translations

export default function LayoutRenderer({ children: pageContent }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [isMounted, setIsMounted] = React.useState(false);
  const router = useRouter();
  const { t } = useLocale(); // For potential translated loading messages

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Effect for handling redirects
  React.useEffect(() => {
    if (!isMounted || isAuthLoading) {
      return; // Don't do anything until mounted and auth state is resolved
    }

    if (pathname.startsWith('/admin/login')) {
      if (isAuthenticated) {
        router.replace('/admin/dashboard');
      }
    } else if (pathname.startsWith('/admin')) {
      if (!isAuthenticated) {
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

  // If we are in the process of redirecting (e.g., authenticated user on /admin/login),
  // show a loader. This prevents rendering the login page content briefly before redirect.
  if (pathname.startsWith('/admin/login') && isAuthenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  // Similarly, if on an admin page and not authenticated, show loader during redirect.
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login') && !isAuthenticated) {
     return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }


  if (pathname.startsWith('/admin/login')) {
    // Login page content is rendered directly without AdminLayout if not authenticated
    return <>{pageContent}</>;
  }

  if (pathname.startsWith('/admin')) {
    // For all other /admin routes, if authenticated, use AdminLayout
    return <AdminLayout>{pageContent}</AdminLayout>;
  }

  // Example for a potential client-side layout (if you had one at src/app/client/layout.tsx)
  // if (pathname.startsWith('/client')) {
  //   // Add authentication check for client routes if needed
  //   return <ClientLayout>{pageContent}</ClientLayout>;
  // }

  // For other pages (e.g., public root page), render content directly.
  return <>{pageContent}</>;
}
