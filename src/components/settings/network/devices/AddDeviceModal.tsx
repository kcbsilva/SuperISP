// src/components/settings/network/devices/AddDeviceModal.tsx
'use client';

import * as React from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/contexts/LocaleContext';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
} from '@/components/ui/select';

import { DEVICE_TYPES, CONNECTION_TYPES } from '@/constants/networkDevices';

export type Device = {
  id: string;
  name: string;
  description?: string;
  ip: string;
  type?: string;
  manufacturer?: string;
  popId?: string;
  monitor?: boolean;
  readable?: boolean;
  radius?: boolean;
  provision?: boolean;
  backup?: boolean;
  connectionType?: string;
  username?: string;
  password?: string;
};

const deviceSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  ip: z.string().min(1),
  type: z.string().optional(),
  manufacturer: z.string().optional(),
  popId: z.string().optional(),
  monitor: z.boolean().optional(),
  readable: z.boolean().optional(),
  radius: z.boolean().optional(),
  provision: z.boolean().optional(),
  backup: z.boolean().optional(),
  connectionType: z.string().optional(),
  username: z.string().optional(),
  password: z.string().optional(),
});

type DeviceForm = z.infer<typeof deviceSchema>;

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (device: Device) => void;
  types: string[];
  connectionTypes: string[];
}

export function AddDeviceModal({ open, onClose, onAdd, types, connectionTypes }: Props) {
  const { t } = useLocale();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DeviceForm>({
    resolver: zodResolver(deviceSchema),
    defaultValues: { monitor: false, readable: false, radius: false, provision: false, backup: false },
  });

  const onSubmit = (data: DeviceForm) => {
    onAdd({ ...data, id: Date.now().toString() });
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('network_devices_page.add_device', 'Add New Device')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>{t('network_devices_page.device_name', 'Device Name')}</Label>
            <Input {...register('name')} />
          </div>
          <div>
            <Label>{t('network_devices_page.device_description', 'Description')}</Label>
            <Input {...register('description')} />
          </div>
          <div>
            <Label>{t('network_devices_page.device_ip', 'Device IP')}</Label>
            <Input {...register('ip')} />
          </div>
          <div>
            <Label>{t('network_devices_page.device_type', 'Device Type')}</Label>
            <Select onValueChange={(val) => setValue('type', val)}>
              <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>
                {types.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>{t('network_devices_page.device_manufacturer', 'Manufacturer')}</Label>
            <Input {...register('manufacturer')} />
          </div>
          <div>
            <Label>{t('network_devices_page.connection_type', 'Connection Type')}</Label>
            <Select onValueChange={(val) => setValue('connectionType', val)}>
              <SelectTrigger><SelectValue placeholder="Select connection type" /></SelectTrigger>
              <SelectContent>
                {connectionTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{t('Username')}</Label>
              <Input {...register('username')} />
            </div>
            <div>
              <Label>{t('Password')}</Label>
              <Input type="password" {...register('password')} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Switch checked={watch('monitor')} onCheckedChange={(val) => setValue('monitor', val)} />
              <Label>{t('Monitor')}</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={watch('readable')} onCheckedChange={(val) => setValue('readable', val)} />
              <Label>{t('Read')}</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={watch('radius')} onCheckedChange={(val) => setValue('radius', val)} />
              <Label>{t('Radius')}</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={watch('provision')} onCheckedChange={(val) => setValue('provision', val)} />
              <Label>{t('Provision')}</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={watch('backup')} onCheckedChange={(val) => setValue('backup', val)} />
              <Label>{t('Backup')}</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" type="button" onClick={onClose}>{t('common.cancel', 'Cancel')}</Button>
            <Button type="submit">{t('common.save', 'Save')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
