// src/app/settings/security/page.tsx
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ShieldCheck } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';

export default function SecuritySettingsPage() {
  const { t } = useLocale();
  const iconSize = "h-2.5 w-2.5"; // Reduced icon size

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold flex items-center gap-2">
            <ShieldCheck className={`${iconSize} text-primary`} /> {/* Icon added */}
            {t('sidebar.security', 'Security Settings')}
        </h1>
        {/* Add action buttons here if needed, e.g., for changing password policies */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{t('security_settings_page.title', 'Security Configuration')}</CardTitle>
          <CardDescription className="text-xs">{t('security_settings_page.description', 'Manage password policies, two-factor authentication, and other security settings.')}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-xs">
            {t('security_settings_page.placeholder', 'Security settings options will be displayed here. (Not Implemented)')}
          </p>
          {/* Example: Add sections for Password Policy, 2FA Settings, Session Management, etc. */}
        </CardContent>
      </Card>
    </div>
  );
}
