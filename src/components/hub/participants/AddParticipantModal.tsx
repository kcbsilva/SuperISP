'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export function AddParticipantModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [companyName, setCompanyName] = useState('');
  const [businessNumber, setBusinessNumber] = useState('');
  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      const res = await fetch('/api/admin/hub/participants/create', {
        method: 'POST',
        body: JSON.stringify({ companyName, businessNumber }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error();
      toast({ title: 'Participant created successfully' });
      onClose();
    } catch {
      toast({ title: 'Error creating participant', variant: 'destructive' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Participant</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input placeholder="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
          <Input placeholder="Business Number" value={businessNumber} onChange={(e) => setBusinessNumber(e.target.value)} />
          <Button onClick={handleSubmit}>Create</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
