// src/components/settings/network/devices/RemoveDeviceModal.tsx
'use client';

import * as React from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/contexts/LocaleContext';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  device: any;
}

export function RemoveDeviceModal({ open, onClose, onConfirm, device }: Props) {
  const { t } = useLocale();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('network_devices_page.remove_device', 'Remove Device')}</DialogTitle>
        </DialogHeader>
        <p className="text-sm">
          {t('network_devices_page.confirm_remove', 'Are you sure you want to remove')} <strong>{device?.name}</strong>?
        </p>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>{t('common.cancel', 'Cancel')}</Button>
          <Button variant="destructive" onClick={onConfirm}>{t('common.remove', 'Remove')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}