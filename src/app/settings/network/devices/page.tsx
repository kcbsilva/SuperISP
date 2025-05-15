// src/app/settings/network/devices/page.tsx
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { PlusCircle, Router } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';

export default function NetworkDevicesPage() {
  const { t } = useLocale();
  const iconSize = "h-2.5 w-2.5"; // Reduced icon size

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold flex items-center gap-2">
            <Router className={`${iconSize} text-primary`} /> {/* Icon added */}
            {t('sidebar.network_devices', 'Network Devices')}
        </h1>
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          <PlusCircle className={`mr-2 ${iconSize}`} /> {t('network_devices_page.add_device_button', 'Add Device')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{t('network_devices_page.registered_devices_title', 'Registered Network Devices')}</CardTitle>
          <CardDescription className="text-xs">{t('network_devices_page.registered_devices_description', 'Manage routers, switches, and other network equipment.')}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-xs">
            {t('network_devices_page.no_devices_found', 'No network devices registered yet. Click "Add Device" to create one.')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
