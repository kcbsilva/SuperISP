'use client'; // Required for useState and event handlers

import { useState, useEffect } from 'react';
import { DeviceList } from '@/components/device-list';
import { ManualDeviceEntry } from '@/components/manual-device-entry';
import { ThreatDetector } from '@/components/threat-detector';
import type { NetworkDevice } from '@/types';
import { useToast } from '@/hooks/use-toast'; // Import useToast

export default function Home() {
  // State to hold manually added devices
  const [manualDevices, setManualDevices] = useState<NetworkDevice[]>([]);
  // State to hold all devices (scanned + manual) for the ThreatDetector and DeviceList
  const [allDevices, setAllDevices] = useState<NetworkDevice[]>([]);
  const { toast } = useToast(); // Initialize toast

  // Callback function to add a new device from the manual entry form
  const handleDeviceAdd = (newDevice: NetworkDevice) => {
    setManualDevices((prevDevices) => {
      // Check if device with the same IP or MAC already exists (including scanned devices)
      const exists = allDevices.some(d =>
        (d.ipAddress === newDevice.ipAddress) ||
        (d.macAddress && newDevice.macAddress && d.macAddress === newDevice.macAddress && d.macAddress !== `manual-${Date.now()}`) // Avoid matching generated IDs
      );

      if (exists) {
          toast({
              title: 'Device Exists',
              description: `A device with IP ${newDevice.ipAddress} or MAC ${newDevice.macAddress} already exists.`,
              variant: 'destructive',
          });
          return prevDevices; // Don't add if it exists
      }

      const updatedManualDevices = [...prevDevices, newDevice];

      // Immediately update the 'allDevices' state used by both components
      setAllDevices(prevAll => {
         // Combine existing scanned devices with the *new* full list of manual devices
         const scanned = prevAll.filter(d => !d.manual);
         const combined = [...scanned, ...updatedManualDevices];
         // Ensure uniqueness again just in case (though the check above should prevent it)
         return Array.from(new Map(combined.map(device => [device.macAddress || device.ipAddress, device])).values());
      });

      return updatedManualDevices;
    });
  };

  // Callback for DeviceList to update the combined list
  const handleDevicesUpdate = (updatedDevices: NetworkDevice[]) => {
      // Ensure uniqueness based on MAC or IP
      const uniqueDevices = Array.from(new Map(updatedDevices.map(device => [device.macAddress || device.ipAddress, device])).values());
      setAllDevices(uniqueDevices);
  };


  // Effect to merge initial manual devices into allDevices on mount
  // This handles the case where DeviceList might load its own data initially
  useEffect(() => {
      setAllDevices(prevAll => {
           const scanned = prevAll.filter(d => !d.manual);
           const combined = [...scanned, ...manualDevices];
           return Array.from(new Map(combined.map(device => [device.macAddress || device.ipAddress, device])).values());
      });
  }, []); // Run only once on mount


  return (
    // Remove top-level padding as it's handled by layout/SidebarInset
    <div className="min-h-full"> {/* Use min-h-full to fill space within SidebarInset */}
      {/* Header is removed, now part of AppHeader in layout.tsx */}
      {/* <header className="mb-8"> ... </header> */}

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Device List takes up 2 columns on larger screens */}
        <div className="lg:col-span-2 space-y-6">
           {/* Pass the callback to DeviceList */}
           <DeviceList
             manuallyAddedDevices={manualDevices}
             onDevicesUpdate={handleDevicesUpdate}
           />
        </div>

        {/* Manual Entry and Threat Detection in the remaining column */}
        <div className="space-y-6">
          <ManualDeviceEntry onDeviceAdd={handleDeviceAdd} />
          {/* Pass the combined list of devices to ThreatDetector */}
          <ThreatDetector devices={allDevices} />
        </div>
      </main>
    </div>
  );
}
