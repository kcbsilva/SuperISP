// src/components/settings/network/devices/AddDeviceModal.tsx
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
  onAdd: (device: any) => void;
}

export function AddDeviceModal({ open, onClose, onAdd }: Props) {
  const { t } = useLocale();
  const [name, setName] = React.useState('');
  const [ip, setIp] = React.useState('');

  const handleAdd = () => {
    onAdd({ id: Date.now().toString(), name, ip });
    setName('');
    setIp('');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('network_devices_page.add_device', 'Add New Device')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <Label>{t('network_devices_page.device_name', 'Device Name')}</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
          <Label>{t('network_devices_page.device_ip', 'Device IP')}</Label>
          <Input value={ip} onChange={(e) => setIp(e.target.value)} />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>{t('common.cancel', 'Cancel')}</Button>
          <Button onClick={handleAdd}>{t('common.save', 'Save')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}