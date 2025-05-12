// src/app/service-calls/page.tsx
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

// This page will now redirect to the dashboard.
// The previous content for listing all service calls can be integrated into the dashboard
// or a specific "List View" page if needed later.
export default function ServiceCallsRedirectPage() {
  const router = useRouter();

  React.useEffect(() => {
    router.replace('/service-calls/dashboard');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="ml-2 text-muted-foreground">Redirecting to dashboard...</p>
    </div>
  );
}
