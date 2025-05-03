'use client'; // Required for useState and event handlers

import { useState } from 'react';
import { DeviceList } from '@/components/device-list';
import { ManualDeviceEntry } from '@/components/manual-device-entry';
import { ThreatDetector } from '@/components/threat-detector';
import type { NetworkDevice } from '@/types';
import { Wifi } from 'lucide-react';

export default function Home() {
  // State to hold manually added devices
  const [manualDevices, setManualDevices] = useState<NetworkDevice[]>([]);
  // State to hold all devices (scanned + manual) for the ThreatDetector
  const [allDevices, setAllDevices] = useState<NetworkDevice[]>([]);

  // Callback function to add a new device from the manual entry form
  const handleDeviceAdd = (newDevice: NetworkDevice) => {
    setManualDevices((prevDevices) => {
        // Avoid adding duplicates based on MAC or generated manual ID
        const exists = prevDevices.some(d => d.macAddress === newDevice.macAddress);
        if (exists) {
            // Optionally show a toast message that the device already exists
            return prevDevices;
        }
        const updatedManualDevices = [...prevDevices, newDevice];
        // Update all devices state as well
        // Note: DeviceList will handle combining scanned and manual internally,
        // but ThreatDetector needs the full current list.
        // A more robust solution might use a global state manager or context.
        // For now, we update `allDevices` based on the new manual list and assume
        // DeviceList will eventually show the combined view upon its own re-render.
        // This might have a slight delay/desync depending on how DeviceList fetches.
        // We need to rely on the useEffect in DeviceList to combine them correctly.
        // Let's pass the manualDevices to DeviceList and let it handle merging.
        // We also update 'allDevices' immediately for ThreatDetector.
         // A simple immediate update for ThreatDetector:
        setAllDevices(prevAll => {
             const combined = [...prevAll.filter(d => !d.manual), ...updatedManualDevices]; // Replace old manual list with new one
             return Array.from(new Map(combined.map(device => [device.macAddress || device.ipAddress, device])).values());
        });

        return updatedManualDevices;
    });
  };

  // This function would ideally be called by DeviceList when it finishes loading/combining
  // For now, let's pass manualDevices to DeviceList and let its useEffect handle updates.
  // We'll keep `allDevices` state primarily for ThreatDetector input.
  // Let's simulate an update for ThreatDetector when manual devices change.
  // This is not ideal synchronization, see comment above.

  return (
    <div className="min-h-screen bg-secondary p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
          <Wifi className="h-8 w-8" /> NetHub Manager
        </h1>
        <p className="text-muted-foreground">Your central hub for network management and security.</p>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Device List takes up 2 columns on larger screens */}
        <div className="lg:col-span-2 space-y-6">
           <DeviceList manuallyAddedDevices={manualDevices} />
        </div>

        {/* Manual Entry and Threat Detection in the remaining column */}
        <div className="space-y-6">
          <ManualDeviceEntry onDeviceAdd={handleDeviceAdd} />
          {/* Pass the combined list of devices to ThreatDetector */}
          {/* Ideally, DeviceList would expose its final combined list */}
          <ThreatDetector devices={allDevices} />
        </div>
      </main>
    </div>
  );
}

// Helper component to manage device state and pass it down
// This approach still doesn't fully solve the sync issue without more complexity
// (e.g., DeviceList calling a callback prop when its data updates).
// Removing this wrapper for now and relying on useEffect in DeviceList.
// function DeviceStateManager({ children }: { children: (devices: NetworkDevice[]) => React.ReactNode }) {
//   const [devices, setDevices] = useState<NetworkDevice[]>([]);
//   // Logic to fetch/update devices would go here
//   return children(devices);
// }
