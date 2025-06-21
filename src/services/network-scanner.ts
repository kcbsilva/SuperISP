import type { NetworkDevice } from '@/types';

/**
 * Asynchronously scans the network and returns a list of connected devices.
 *
 * @returns A promise that resolves to an array of NetworkDevice objects.
 */
export async function scanNetwork(): Promise<NetworkDevice[]> {
  // TODO: Implement this by calling an API.

   await new Promise(resolve => setTimeout(resolve, 1500));

   // Returning an empty array until a real implementation is added
   return [];
}
