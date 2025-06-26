// src/components/finances/cash-book/DeleteEntryDialog.tsx
'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/contexts/LocaleContext';

interface DeleteEntryDialogProps {
  entry: any | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteEntryDialog({ entry, onCancel, onConfirm }: DeleteEntryDialogProps) {
  const { t } = useLocale();

  if (!entry) return null;

  return (
    <Dialog open={!!entry} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('cash_book.delete_entry_title', 'Delete Entry')}</DialogTitle>
          <DialogDescription>
            {t('cash_book.delete_entry_confirm', 'Are you sure you want to delete this entry? This action cannot be undone.')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="destructive" onClick={onConfirm}>
            {t('cash_book.delete', 'Delete')}
          </Button>
          <DialogClose asChild>
            <Button variant="outline">{t('cash_book.cancel', 'Cancel')}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
