// src/components/settings/network/vpn/RemoveVPNModal.tsx
'use client';

import * as React from 'react';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogTitle,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

type Props = {
  id: number;
  name: string;
  onDeleted?: () => void;
};

export function RemoveVPNModal({ id, name, onDeleted }: Props) {
  const handleDelete = async () => {
    const res = await fetch(`/api/settings/network/vpn/remove/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      toast({ title: `VPN "${name}" deleted.` });
      onDeleted?.(); // ✅ Trigger refresh
    } else {
      toast({ title: 'Error deleting VPN', variant: 'destructive' });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete VPN "{name}"?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The VPN connection will be permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
