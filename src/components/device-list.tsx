'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { scanNetwork } from '@/services/network-scanner';
import type { NetworkDevice } from '@/types';
import { Wifi, Laptop, Router, Server, Smartphone, Monitor } from 'lucide-react'; // Removed Loader2 as we use Skeleton
import { Skeleton } from '@/components/ui/skeleton';

// Function to get an appropriate icon based on hostname or type (basic)
const getDeviceIcon = (hostname: string): React.ReactNode => {
  const lowerHostname = hostname.toLowerCase();
  if (lowerHostname.includes('router')) return <Router className="h-5 w-5 text-muted-foreground" />;
  if (lowerHostname.includes('laptop')) return <Laptop className="h-5 w-5 text-muted-foreground" />;
  if (lowerHostname.includes('desktop') || lowerHostname.includes('pc')) return <Monitor className="h-5 w-5 text-muted-foreground" />;
  if (lowerHostname.includes('server')) return <Server className="h-5 w-5 text-muted-foreground" />;
  if (lowerHostname.includes('phone') || lowerHostname.includes('mobile')) return <Smartphone className="h-5 w-5 text-muted-foreground" />;
  return <Wifi className="h-5 w-5 text-muted-foreground" />; // Default icon
};

interface DeviceListProps {
  initialDevices?: NetworkDevice[];
  manuallyAddedDevices?: NetworkDevice[];
  onDevicesUpdate?: (devices: NetworkDevice[]) => void; // Callback prop
}

export function DeviceList({
  initialDevices = [],
  manuallyAddedDevices = [],
  onDevicesUpdate
}: DeviceListProps) {
  const [devices, setDevices] = useState<NetworkDevice[]>([]);
  const [loading, setLoading] = useState(true); // Start loading initially

  // Helper function to combine and set devices, and call the update callback
  const updateAndNotify = (scanned: NetworkDevice[], manual: NetworkDevice[]) => {
    const combined = [...scanned, ...manual];
    const uniqueDevices = Array.from(new Map(combined.map(device => [device.macAddress || device.ipAddress, device])).values());
    setDevices(uniqueDevices);
    onDevicesUpdate?.(uniqueDevices); // Call the callback with the updated list
    setLoading(false);
  };

  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates on unmounted component

    // Scan network if initialDevices is empty
    if (initialDevices.length === 0) {
      const fetchDevices = async () => {
        if (!isMounted) return; // Don't proceed if unmounted
        setLoading(true);
        try {
          const scannedDevices = await scanNetwork();
          if (isMounted) {
            updateAndNotify(scannedDevices, manuallyAddedDevices);
          }
        } catch (error) {
          console.error("Failed to scan network:", error);
          if (isMounted) {
            // Show manual devices even if scan fails, and notify
            updateAndNotify([], manuallyAddedDevices);
          }
        }
      };
      fetchDevices();
    } else {
        // Combine initial and manually added devices immediately, and notify
        updateAndNotify(initialDevices, manuallyAddedDevices);
    }

     // Cleanup function
    return () => {
        isMounted = false;
    };
  // Include manuallyAddedDevices in dependency array to react to manual additions
  // Also include onDevicesUpdate to ensure the latest callback is used
  }, [initialDevices, manuallyAddedDevices, onDevicesUpdate]);


  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected Devices</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Icon</TableHead>
              <TableHead>Hostname / Name</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>MAC Address</TableHead>
              <TableHead>Source</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // Skeleton loading state
              Array.from({ length: 3 }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell><Skeleton className="h-5 w-5 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[140px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                </TableRow>
              ))
            ) : devices.length > 0 ? (
              devices.map((device) => (
                <TableRow key={device.macAddress || device.ipAddress}>
                  <TableCell>{getDeviceIcon(device.hostname)}</TableCell>
                  <TableCell>{device.hostname}</TableCell>
                  <TableCell>{device.ipAddress}</TableCell>
                  <TableCell>{device.macAddress || 'N/A'}</TableCell>
                  <TableCell>{device.manual ? 'Manual' : 'Scanned'}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No devices found on the network. Try scanning or adding manually.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
