
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

  if (pathname.startsWith('/admin/login')) {
    // If user is already authenticated and tries to go to login, redirect to dashboard
    if (isAuthenticated) {
      router.replace('/admin/dashboard'); // Perform client-side redirect
      return ( // Show a loader while redirecting
        <div className="flex h-screen w-full items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }
    return <>{pageContent}</>; // Render login page
  }

  if (pathname.startsWith('/admin')) {
    if (!isAuthenticated) {
      // This case should ideally be handled by middleware redirecting to login.
      // If reached, it means middleware might not have caught it or is disabled.
      // A client-side redirect here is a fallback.
      router.replace('/admin/login');
      return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }
    return <AdminLayout>{pageContent}</AdminLayout>;
  }

  // Example for a potential client-side layout (if you had one at src/app/client/layout.tsx)
  // if (pathname.startsWith('/client')) {
  //   // Add authentication check for client routes if needed
  //   return <ClientLayout>{pageContent}</ClientLayout>;
  // }

  // For other pages (e.g., public root page), render content directly.
  // This includes src/app/page.tsx (your main dashboard for now)
  return <>{pageContent}</>;
}
