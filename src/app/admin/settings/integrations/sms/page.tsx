// src/app/settings/integrations/sms/page.tsx
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Text } from 'lucide-react'; // Using Text icon for SMS
import { useLocale } from '@/contexts/LocaleContext';

export default function SmsIntegrationPage() {
  const { t } = useLocale();
  const iconSize = "h-2.5 w-2.5"; // Reduced icon size

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold flex items-center gap-2">
            <Text className={`${iconSize} text-primary`} /> {/* Icon added */}
            {t('sidebar.settings_integrations_sms', 'SMS Gateway Integration')}
        </h1>
        {/* Add action buttons here if needed, e.g., for configuring gateway */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{t('integrations_sms.title', 'SMS Gateway Configuration')}</CardTitle>
          <CardDescription className="text-xs">{t('integrations_sms.description', 'Manage your SMS gateway integration for sending text message notifications.')}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-xs">
            {t('integrations_sms.placeholder', 'SMS gateway settings (API Key, Sender ID, etc.) will be displayed here. (Not Implemented)')}
          </p>
          {/* Example: Add fields for API Key, API Secret, Sender ID, Balance Check, Status Indicator */}
        </CardContent>
      </Card>
    </div>
  );
}
