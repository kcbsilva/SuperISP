// src/components/settings/postgres/databases/CreateDatabaseModal.tsx
'use client';

import React from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle
} from '@/components/ui/dialog';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateDatabaseModal({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Database (Coming Soon)</DialogTitle>
        </DialogHeader>
        {/* Form goes here */}
      </DialogContent>
    </Dialog>
  );
}
