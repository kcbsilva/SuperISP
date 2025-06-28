// src/app/settings/network/vpn/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { AddVPNModal } from '@/components/settings/network/vpn/AddVPNModal';
import { UpdateVPNModal } from '@/components/settings/network/vpn/UpdateVPNModal';
import { RemoveVPNModal } from '@/components/settings/network/vpn/RemoveVPNModal';
import { ListVPNConnections } from '@/components/settings/network/vpn/ListVPNConnections';
import { VPNConnection } from '@/types/vpn';

export default function VPNSettingsPage() {
  const [vpns, setVpns] = useState<VPNConnection[] | null>(null);

  const fetchData = async () => {
    const res = await fetch('/api/settings/network/vpn/list');
    const data = await res.json();
    setVpns(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">VPN Connections</h2>
        <AddVPNModal onCreated={fetchData}>
          <Button>
            <PlusCircle className="w-4 h-4 mr-2" />
            Add VPN
          </Button>
        </AddVPNModal>
      </div>

      <ListVPNConnections vpns={vpns} onRefresh={fetchData} />
    </div>
  );
}
