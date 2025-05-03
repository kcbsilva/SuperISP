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
import { Wifi, Laptop, Router, Server, Smartphone, Loader2, Monitor } from 'lucide-react';
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
}

export function DeviceList({ initialDevices = [], manuallyAddedDevices = [] }: DeviceListProps) {
  const [devices, setDevices] = useState<NetworkDevice[]>(initialDevices);
  const [loading, setLoading] = useState(true); // Start loading initially

  useEffect(() => {
    // Only scan if initialDevices is empty, otherwise use initialDevices
    if (initialDevices.length === 0) {
      const fetchDevices = async () => {
        setLoading(true);
        try {
          const scannedDevices = await scanNetwork();
          // Combine scanned and manually added devices, avoiding duplicates based on MAC address
          const combined = [...scannedDevices, ...manuallyAddedDevices];
          const uniqueDevices = Array.from(new Map(combined.map(device => [device.macAddress || device.ipAddress, device])).values());
          setDevices(uniqueDevices);
        } catch (error) {
          console.error("Failed to scan network:", error);
          // Optionally show an error message to the user
          setDevices(manuallyAddedDevices); // Show manual devices even if scan fails
        } finally {
          setLoading(false);
        }
      };
      fetchDevices();
    } else {
        // Combine initial and manually added devices
        const combined = [...initialDevices, ...manuallyAddedDevices];
        const uniqueDevices = Array.from(new Map(combined.map(device => [device.macAddress || device.ipAddress, device])).values());
        setDevices(uniqueDevices);
        setLoading(false); // Data is ready
    }
  }, [initialDevices, manuallyAddedDevices]); // Rerun when manual devices change


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
                  No devices found on the network.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
