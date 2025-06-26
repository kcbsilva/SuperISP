// src/app/settings/network/devices/page.tsx
'use client';

import * as React from 'react';
import { PlusCircle, Router } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/contexts/LocaleContext';
import { toast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

import { AddDeviceModal } from '@/components/settings/network/devices/AddDeviceModal';
import { UpdateDeviceModal } from '@/components/settings/network/devices/UpdateDeviceModal';
import { RemoveDeviceModal } from '@/components/settings/network/devices/RemoveDeviceModal';
import { ListDevices } from '@/components/settings/network/devices/ListDevices';
import { useDevices } from '@/hooks/useDevices';
import { Device } from '@/components/settings/network/devices/AddDeviceModal';

export const DEVICE_TYPES = ['Router', 'Switch', 'Access Point', 'NVR', 'Server', 'OLT', 'Other'];
export const CONNECTION_TYPES = ['SSH', 'Web', 'Telnet', 'API'];

export default function NetworkDevicesPage() {
  const { t } = useLocale();
  const { devices, isLoading, mutate } = useDevices();

  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showUpdateModal, setShowUpdateModal] = React.useState(false);
  const [showRemoveModal, setShowRemoveModal] = React.useState(false);
  const [selectedDevice, setSelectedDevice] = React.useState<Device | null>(null);

  const handleAdd = async (device: Device) => {
    try {
      await fetch('/api/settings/network/devices/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(device),
      });
      toast({ title: 'Device added successfully!' });
      mutate();
    } catch {
      toast({ title: 'Failed to add device', variant: 'destructive' });
    }
  };

  const handleUpdate = async (device: Device) => {
    try {
      await fetch(`/api/settings/network/devices/update/${device.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(device),
      });
      toast({ title: 'Device updated successfully!' });
      mutate();
    } catch {
      toast({ title: 'Failed to update device', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!selectedDevice) return;
    try {
      await fetch(`/api/settings/network/devices/delete/${selectedDevice.id}`, {
        method: 'DELETE',
      });
      toast({ title: 'Device removed successfully!' });
      mutate();
    } catch {
      toast({ title: 'Failed to delete device', variant: 'destructive' });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold flex items-center gap-2">
          <Router className="h-4 w-4 text-primary" />
          {t('sidebar.network_devices', 'Network Devices')}
        </h1>
        <Button
          className="bg-green-600 hover:bg-green-700 text-white"
          onClick={() => setShowAddModal(true)}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          {t('network_devices_page.add_device_button', 'Add Device')}
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-4 space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
              <div className="flex justify-end gap-2">
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ListDevices
          devices={devices}
          onEdit={(device) => {
            setSelectedDevice(device);
            setShowUpdateModal(true);
          }}
          onDelete={(device) => {
            setSelectedDevice(device);
            setShowRemoveModal(true);
          }}
        />
      )}

      <AddDeviceModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={(device) => {
          handleAdd(device);
          setShowAddModal(false);
        }}
        types={DEVICE_TYPES}
        connectionTypes={CONNECTION_TYPES}
      />

      <UpdateDeviceModal
        open={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        device={selectedDevice as Device}
        onUpdate={(updatedDevice) => {
          handleUpdate(updatedDevice);
          setShowUpdateModal(false);
        }}
        types={DEVICE_TYPES}
        connectionTypes={CONNECTION_TYPES}
      />

      <RemoveDeviceModal
        open={showRemoveModal}
        onClose={() => setShowRemoveModal(false)}
        device={selectedDevice as Device}
        onConfirm={() => {
          handleDelete();
          setShowRemoveModal(false);
        }}
      />
    </div>
  );
}
