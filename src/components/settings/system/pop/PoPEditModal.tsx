// src/components/settings/system/pop/PoPEditModal.tsx
'use client';

import * as React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import PoPProfile from './PoPProfile';
import type { Pop, PopData } from '@/types/pops';

interface PoPEditModalProps {
  pop: Pop;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (pop: Pop) => void;
}

export default function PoPEditModal({ pop, open, onOpenChange, onUpdate }: PoPEditModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <PoPProfile
          mode="edit"
          defaultValues={pop}
          onSave={(data) => onUpdate({ ...pop, ...data })}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
