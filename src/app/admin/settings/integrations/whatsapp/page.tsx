// src/app/settings/integrations/whatsapp/page.tsx
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react'; // Using MessageSquare as placeholder
import { useLocale } from '@/contexts/LocaleContext';

export default function WhatsAppIntegrationPage() {
  const { t } = useLocale();
  const iconSize = "h-2.5 w-2.5"; // Reduced icon size

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold flex items-center gap-2">
            <MessageSquare className={`${iconSize} text-primary`} /> {/* Icon added */}
            {t('sidebar.settings_integrations_whatsapp', 'WhatsApp Integration')}
        </h1>
        {/* Add action buttons here if needed, e.g., for connecting/disconnecting */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{t('integrations_whatsapp.title', 'WhatsApp Business API')}</CardTitle>
          <CardDescription className="text-xs">{t('integrations_whatsapp.description', 'Manage your WhatsApp Business API integration for customer communication.')}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-xs">
            {t('integrations_whatsapp.placeholder', 'WhatsApp integration settings and status will be displayed here. (Not Implemented)')}
          </p>
          {/* Example: Add fields for API Key, Phone Number ID, Webhook URL, Status Indicator */}
        </CardContent>
      </Card>
    </div>
  );
}
