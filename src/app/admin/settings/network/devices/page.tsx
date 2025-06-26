// src/app/settings/network/devices/page.tsx
'use client';

import * as React from 'react';
import { PlusCircle, Router } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/contexts/LocaleContext';

import { AddDeviceModal } from '@/components/settings/network/devices/AddDeviceModal';
import { UpdateDeviceModal } from '@/components/settings/network/devices/UpdateDeviceModal';
import { RemoveDeviceModal } from '@/components/settings/network/devices/RemoveDeviceModal';
import { ListDevices } from '@/components/settings/network/devices/ListDevices';

export default function NetworkDevicesPage() {
  const { t } = useLocale();
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showUpdateModal, setShowUpdateModal] = React.useState(false);
  const [showRemoveModal, setShowRemoveModal] = React.useState(false);

  const [devices, setDevices] = React.useState<any[]>([]); // Replace `any` with a proper Device type
  const [selectedDevice, setSelectedDevice] = React.useState<any | null>(null);

  const handleEdit = (device: any) => {
    setSelectedDevice(device);
    setShowUpdateModal(true);
  };

  const handleDelete = (device: any) => {
    setSelectedDevice(device);
    setShowRemoveModal(true);
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

      <ListDevices
        devices={devices}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AddDeviceModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={(device) => {
          setDevices(prev => [...prev, device]);
          setShowAddModal(false);
        }}
      />

      <UpdateDeviceModal
        open={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        device={selectedDevice}
        onUpdate={(updatedDevice) => {
          setDevices(prev =>
            prev.map(d => (d.id === updatedDevice.id ? updatedDevice : d))
          );
          setShowUpdateModal(false);
        }}
      />

      <RemoveDeviceModal
        open={showRemoveModal}
        onClose={() => setShowRemoveModal(false)}
        device={selectedDevice}
        onConfirm={() => {
          setDevices(prev => prev.filter(d => d.id !== selectedDevice?.id));
          setShowRemoveModal(false);
        }}
      />
    </div>
  );
}
