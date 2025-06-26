// src/components/settings/network/devices/UpdateDeviceModal.tsx
'use client';

import * as React from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/contexts/LocaleContext';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Device } from './AddDeviceModal';

const deviceSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  ip: z.string().min(1),
  type: z.string().optional(),
  manufacturer: z.string().optional(),
  connectionType: z.string().optional(),
  username: z.string().optional(),
  password: z.string().optional(),
  monitor: z.boolean().optional(),
  readable: z.boolean().optional(),
  radius: z.boolean().optional(),
  provision: z.boolean().optional(),
  backup: z.boolean().optional(),
});

type DeviceForm = z.infer<typeof deviceSchema>;

interface Props {
  open: boolean;
  onClose: () => void;
  onUpdate: (device: Device) => void;
  device: Device;
  types: string[];
  connectionTypes: string[];
}

export function UpdateDeviceModal({
  open,
  onClose,
  onUpdate,
  device,
  types,
  connectionTypes
}: Props) {
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
    defaultValues: device,
  });

  React.useEffect(() => {
    reset(device);
  }, [device, reset]);

  const onSubmit = (data: DeviceForm) => {
    onUpdate({ ...device, ...data });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('network_devices_page.edit_device', 'Edit Device')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <Label>{t('network_devices_page.device_name', 'Device Name')}</Label>
            <Input {...register('name')} />
            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
          </div>
          <div>
            <Label>{t('network_devices_page.device_description', 'Description')}</Label>
            <Input {...register('description')} />
          </div>
          <div>
            <Label>{t('network_devices_page.device_ip', 'Device IP')}</Label>
            <Input {...register('ip')} />
            {errors.ip && <p className="text-red-500 text-xs">{errors.ip.message}</p>}
          </div>
          <div>
            <Label>{t('network_devices_page.device_type', 'Device Type')}</Label>
            <Select
              value={watch('type')}
              onValueChange={(value) => setValue('type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {types.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>{t('network_devices_page.manufacturer', 'Manufacturer')}</Label>
            <Input {...register('manufacturer')} />
          </div>
          <div>
            <Label>{t('network_devices_page.connection_type', 'Connection Type')}</Label>
            <Select
              value={watch('connectionType')}
              onValueChange={(value) => setValue('connectionType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select connection type" />
              </SelectTrigger>
              <SelectContent>
                {connectionTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>{t('network_devices_page.username', 'Username')}</Label>
            <Input {...register('username')} />
          </div>
          <div>
            <Label>{t('network_devices_page.password', 'Password')}</Label>
            <Input type="password" {...register('password')} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <Label>Monitor</Label>
              <Switch checked={watch('monitor')} onCheckedChange={(val) => setValue('monitor', val)} />
            </div>
            <div className="flex items-center justify-between">
              <Label>Readable</Label>
              <Switch checked={watch('readable')} onCheckedChange={(val) => setValue('readable', val)} />
            </div>
            <div className="flex items-center justify-between">
              <Label>Radius</Label>
              <Switch checked={watch('radius')} onCheckedChange={(val) => setValue('radius', val)} />
            </div>
            <div className="flex items-center justify-between">
              <Label>Provision</Label>
              <Switch checked={watch('provision')} onCheckedChange={(val) => setValue('provision', val)} />
            </div>
            <div className="flex items-center justify-between">
              <Label>Backup</Label>
              <Switch checked={watch('backup')} onCheckedChange={(val) => setValue('backup', val)} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" type="button" onClick={onClose}>
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button type="submit">{t('common.save', 'Save')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
