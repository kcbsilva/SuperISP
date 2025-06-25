// src/components/settings/system/pop/PoPAddModal.tsx
'use client';

import * as React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import PoPProfile from './PoPProfile';
import type { PopData } from '@/types/pops';

interface PoPAddModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (pop: PopData) => void;
}

export default function PoPAddModal({ open, onOpenChange, onAdd }: PoPAddModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <PoPProfile
          mode="add"
          onSave={(data) => {
            onAdd(data);
            onOpenChange(false); // close after saving
          }}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
