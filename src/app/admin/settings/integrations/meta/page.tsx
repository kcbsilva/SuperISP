// src/app/settings/integrations/meta/page.tsx
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react'; // Using MessageSquare as placeholder
import { useLocale } from '@/contexts/LocaleContext';

export default function MetaIntegrationPage() {
  const { t } = useLocale();
  const iconSize = "h-2.5 w-2.5"; // Reduced icon size

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold flex items-center gap-2">
            <MessageSquare className={`${iconSize} text-primary`} /> {/* Icon added */}
            {t('sidebar.settings_integrations_meta', 'Meta Integration (Facebook/Instagram)')}
        </h1>
        {/* Add action buttons here if needed, e.g., for connecting/disconnecting pages */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{t('integrations_meta.title', 'Meta Platform Integration')}</CardTitle>
          <CardDescription className="text-xs">{t('integrations_meta.description', 'Manage your Facebook Page and Instagram integrations for customer engagement.')}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-xs">
            {t('integrations_meta.placeholder', 'Meta integration settings (Facebook Page, Instagram Account) will be displayed here. (Not Implemented)')}
          </p>
          {/* Example: Add sections for Facebook Page connection, Instagram Business Account connection, Status Indicators */}
        </CardContent>
      </Card>
    </div>
  );
}
