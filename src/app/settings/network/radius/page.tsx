// src/app/settings/network/radius/page.tsx
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { PlusCircle, Server } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';

export default function NetworkRadiusPage() {
  const { t } = useLocale();
  const iconSize = "h-2.5 w-2.5"; // Reduced icon size

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold flex items-center gap-2">
            <Server className={`${iconSize} text-primary`} /> {/* Icon added */}
            {t('sidebar.network_radius', 'RADIUS / NAS')}
        </h1>
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          <PlusCircle className={`mr-2 ${iconSize}`} /> {t('network_radius_page.add_nas_button', 'Add NAS / RADIUS Server')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{t('network_radius_page.configured_nas_title', 'Configured NAS / RADIUS Servers')}</CardTitle>
          <CardDescription className="text-xs">{t('network_radius_page.configured_nas_description', 'Manage your Network Access Servers and RADIUS authentication settings.')}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-xs">
            {t('network_radius_page.no_nas_found', 'No NAS or RADIUS servers configured yet. Click "Add NAS / RADIUS Server" to create one.')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
