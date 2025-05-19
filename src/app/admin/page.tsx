// src/app/admin/page.tsx
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth

export default function AdminRootPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth(); // Use auth state

  React.useEffect(() => {
    if (!isLoading) { // Only redirect if auth state is resolved
      if (isAuthenticated) {
        router.replace('/admin/dashboard');
      } else {
        // If not authenticated for some reason when hitting /admin/, redirect to login
        router.replace('/admin/login');
      }
    }
  }, [router, isAuthenticated, isLoading]);

  // Display a loader while checking auth or redirecting
  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="flex flex-col items-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading admin area...</p>
      </div>
    </div>
  );
}
