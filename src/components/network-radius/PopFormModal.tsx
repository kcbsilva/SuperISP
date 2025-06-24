// src/components/network-radius/PopFormModal.tsx (enhanced)
'use client';

import * as React from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Pop } from '@/types/pops';

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: (newPop: Pop) => void;
  defaultValues?: Pop;
};

export function PopFormModal({ open, onClose, onCreated, defaultValues }: Props) {
  const isEdit = !!defaultValues?.id;
  const [name, setName] = React.useState(defaultValues?.name || '');
  const [location, setLocation] = React.useState(defaultValues?.location || '');
  const [description, setDescription] = React.useState(defaultValues?.description || '');
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (defaultValues) {
      setName(defaultValues.name || '');
      setLocation(defaultValues.location || '');
      setDescription(defaultValues.description || '');
    }
  }, [defaultValues]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(isEdit ? '/api/pops/update' : '/api/pops/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: defaultValues?.id, name, location, description }),
      });
      const data = await res.json();
      onCreated(data); // Trigger update in parent
      onClose();
    } catch (err) {
      console.error('Failed to save PoP', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit PoP' : 'Create New PoP'}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>Location</Label>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
          <div>
            <Label>Description</Label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Update PoP' : 'Create PoP'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
