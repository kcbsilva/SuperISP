import type { NetworkDevice } from '@/types';

/**
 * Asynchronously scans the network and returns a list of connected devices.
 *
 * @returns A promise that resolves to an array of NetworkDevice objects.
 */
export async function scanNetwork(): Promise<NetworkDevice[]> {
  // TODO: Implement this by calling an API.

  // Simulate a delay to represent network scanning time
  await new Promise(resolve => setTimeout(resolve, 1500));

  return [
    {
      ipAddress: '192.168.1.1',
      macAddress: '00:1A:2B:3C:4D:5E',
      hostname: 'router.local',
    },
    {
      ipAddress: '192.168.1.100',
      macAddress: 'A0:B1:C2:D3:E4:F5',
      hostname: 'desktop.local',
    },
    {
      ipAddress: '192.168.1.105',
      macAddress: 'B1:C2:D3:E4:F5:A6',
      hostname: 'laptop.local',
    },
  ];
}
