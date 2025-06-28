// src/components/settings/network/vpn/AddVPNModal.tsx
'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

type Props = {
  children: React.ReactNode;
  onCreated?: () => void;
};

export function AddVPNModal({ children, onCreated }: Props) {
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    name: '',
    remote_address: '',
    local_subnet: '',
    remote_subnet: '',
    pre_shared_key: '',
    enabled: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async () => {
    const res = await fetch('/api/settings/network/vpn/add', {
      method: 'POST',
      body: JSON.stringify(form),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      toast({ title: 'VPN added successfully.' });
      setOpen(false);
      onCreated?.(); // ✅ Trigger list refresh
    } else {
      toast({ title: 'Error adding VPN', variant: 'destructive' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add VPN Connection</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Label>Name</Label>
          <Input name="name" value={form.name} onChange={handleChange} />
          <Label>Remote Address</Label>
          <Input name="remote_address" value={form.remote_address} onChange={handleChange} />
          <Label>Local Subnet</Label>
          <Input name="local_subnet" value={form.local_subnet} onChange={handleChange} />
          <Label>Remote Subnet</Label>
          <Input name="remote_subnet" value={form.remote_subnet} onChange={handleChange} />
          <Label>Pre-Shared Key</Label>
          <Input name="pre_shared_key" type="password" value={form.pre_shared_key} onChange={handleChange} />
          <div className="flex items-center space-x-2">
            <input type="checkbox" name="enabled" checked={form.enabled} onChange={handleChange} />
            <Label>Enabled</Label>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
