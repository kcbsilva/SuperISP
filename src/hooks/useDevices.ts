// src/hooks/useDevices.ts
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useDevices() {
  const { data, error, isLoading, mutate } = useSWR('/api/settings/network/devices', fetcher);
  return {
    devices: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}
