// src/components/settings/network/vpn/ListVPNConnections.tsx
'use client';

import { useState } from 'react';
import { VPNConnection } from '@/types/vpn';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { UpdateVPNModal } from './UpdateVPNModal';
import { RemoveVPNModal } from './RemoveVPNModal';
import { DownloadConfigButton } from './DownloadConfigButton';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

type Props = {
  vpns: VPNConnection[] | null;
  onRefresh: () => void;
};

export function ListVPNConnections({ vpns, onRefresh }: Props) {
  const [visibleKeys, setVisibleKeys] = useState<{ [id: number]: boolean }>({});
  const [search, setSearch] = useState('');

  const toggleEnabled = async (id: number, newValue: boolean) => {
    const res = await fetch(`/api/settings/network/vpn/toggle/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled: newValue }),
    });

    if (res.ok) {
      toast({ title: `VPN ${newValue ? 'enabled' : 'disabled'} successfully.` });
      onRefresh();
    } else {
      toast({ title: 'Failed to update VPN status.', variant: 'destructive' });
    }
  };

  const togglePSKVisibility = (id: number) => {
    setVisibleKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredVpns = vpns?.filter((vpn) =>
    vpn.name.toLowerCase().includes(search.toLowerCase()) ||
    vpn.remote_address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card>
      <CardContent className="p-4 overflow-x-auto space-y-4">
        <div className="flex justify-between">
          <Input
            placeholder="Search VPNs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Remote IP</TableHead>
              <TableHead>Local Subnet</TableHead>
              <TableHead>Remote Subnet</TableHead>
              <TableHead>PSK</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Enabled</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vpns ? (
              filteredVpns?.length ? (
                filteredVpns.map((vpn) => (
                  <TableRow key={vpn.id}>
                    <TableCell>{vpn.name}</TableCell>
                    <TableCell>{vpn.remote_address}</TableCell>
                    <TableCell>{vpn.local_subnet}</TableCell>
                    <TableCell>{vpn.remote_subnet}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">
                          {visibleKeys[vpn.id] ? vpn.pre_shared_key : '••••••••'}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => togglePSKVisibility(vpn.id)}
                        >
                          {visibleKeys[vpn.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>{vpn.username}</TableCell>
                    <TableCell>
                      <Switch
                        checked={vpn.enabled}
                        onCheckedChange={(checked) => toggleEnabled(vpn.id, checked)}
                      />
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <DownloadConfigButton vpn={vpn} />
                      <UpdateVPNModal vpn={vpn} onUpdated={onRefresh} />
                      <RemoveVPNModal id={vpn.id} name={vpn.name} onDeleted={onRefresh} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">
                    No results found.
                  </TableCell>
                </TableRow>
              )
            ) : (
              [...Array(3)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-20" /></TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}