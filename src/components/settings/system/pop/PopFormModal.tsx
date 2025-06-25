// src/components/settings/system/pop/PopFormModal.tsx
'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import PoPProfile from './PoPProfile';
import type { PopData } from '@/types/pops';

interface PopFormModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (pop: PopData) => void;
}

export function PopFormModal({ open, onClose, onCreated }: PopFormModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create New PoP</DialogTitle>
        </DialogHeader>

        <PoPProfile
          mode="add"
          onSave={(data) => {
            onCreated(data); // ✅ data is PopData — no 'id' expected
            onClose();
          }}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
