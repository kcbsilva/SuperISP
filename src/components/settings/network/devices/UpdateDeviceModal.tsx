// src/components/settings/network/devices/UpdateDeviceModal.tsx
'use client';

import * as React from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/contexts/LocaleContext';

interface Props {
  open: boolean;
  onClose: () => void;
  onUpdate: (device: any) => void;
  device: any;
}

export function UpdateDeviceModal({ open, onClose, onUpdate, device }: Props) {
  const { t } = useLocale();
  const [name, setName] = React.useState(device?.name || '');
  const [ip, setIp] = React.useState(device?.ip || '');

  React.useEffect(() => {
    if (device) {
      setName(device.name);
      setIp(device.ip);
    }
  }, [device]);

  const handleUpdate = () => {
    onUpdate({ ...device, name, ip });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('network_devices_page.edit_device', 'Edit Device')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <Label>{t('network_devices_page.device_name', 'Device Name')}</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
          <Label>{t('network_devices_page.device_ip', 'Device IP')}</Label>
          <Input value={ip} onChange={(e) => setIp(e.target.value)} />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>{t('common.cancel', 'Cancel')}</Button>
          <Button onClick={handleUpdate}>{t('common.save', 'Save')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}