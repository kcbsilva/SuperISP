// src/components/settings/system/pop/PoPDeleteDialog.tsx
'use client';

import * as React from 'react';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import type { PopData } from '@/types/pops';

interface PoPDeleteDialogProps {
  pop: PopData | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function PoPDeleteDialog({ pop, onConfirm, onCancel }: PoPDeleteDialogProps) {
  return (
    <AlertDialog open={!!pop} onOpenChange={onCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete "{pop?.name}"?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
