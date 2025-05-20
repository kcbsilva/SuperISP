'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { LocaleProvider } from '@/contexts/LocaleContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster'; // Import Toaster here

// Create a single instance of QueryClient here, within the client component module
const queryClient = new QueryClient();

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // You can return a global loading spinner here or null.
    // Returning null avoids rendering providers server-side if they cause issues.
    return null;
  }

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <LocaleProvider>
            <TooltipProvider delayDuration={0}>
              {children}
              <Toaster /> {/* Toaster is rendered here */}
            </TooltipProvider>
          </LocaleProvider>
        </QueryClientProvider>
      </AuthProvider>
    </NextThemesProvider>
  );
}
