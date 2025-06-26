// src/components/settings/network/devices/ListDevices.tsx
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { Device } from './AddDeviceModal';

interface Props {
  devices: Device[];
  onEdit: (device: Device) => void;
  onDelete: (device: Device) => void;
}

export function ListDevices({ devices, onEdit, onDelete }: Props) {
  const { t } = useLocale();

  if (devices.length === 0) {
    return (
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
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {devices.map((device) => (
        <Card key={device.id}>
          <CardHeader>
            <CardTitle className="text-sm">{device.name}</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">IP: {device.ip}</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-end gap-2">
            <Button variant="ghost" size="icon" onClick={() => onEdit(device)}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => onDelete(device)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
