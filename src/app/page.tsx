// src/app/page.tsx
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext'; // Import useLocale

export default function RootRedirectPage() {
  const router = useRouter();
  const { t } = useLocale(); // Use t function for any text if needed

  React.useEffect(() => {
    const done = localStorage.getItem('setupComplete') === 'true';
    router.replace(done ? '/admin/login' : '/admin/setup-wizard');
  }, [router]);

  // Display a loader while redirecting
  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="flex flex-col items-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">
          {t('auth.redirecting', 'Redirecting to login...')}
        </p>
      </div>
    </div>
  );
}
