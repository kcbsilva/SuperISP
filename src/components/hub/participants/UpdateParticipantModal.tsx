'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface Props {
  open: boolean;
  onClose: () => void;
  participant: { id: string; companyName: string; businessNumber: string };
}

export function UpdateParticipantModal({ open, onClose, participant }: Props) {
  const [companyName, setCompanyName] = useState(participant.companyName);
  const [businessNumber, setBusinessNumber] = useState(participant.businessNumber);
  const { toast } = useToast();

  useEffect(() => {
    setCompanyName(participant.companyName);
    setBusinessNumber(participant.businessNumber);
  }, [participant]);

  const handleUpdate = async () => {
    try {
      const res = await fetch(`/api/admin/hub/participants/update/${participant.id}`, {
        method: 'PUT',
        body: JSON.stringify({ companyName, businessNumber }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error();
      toast({ title: 'Participant updated successfully' });
      onClose();
    } catch {
      toast({ title: 'Error updating participant', variant: 'destructive' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Participant</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input placeholder="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
          <Input placeholder="Business Number" value={businessNumber} onChange={(e) => setBusinessNumber(e.target.value)} />
          <Button onClick={handleUpdate}>Update</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
