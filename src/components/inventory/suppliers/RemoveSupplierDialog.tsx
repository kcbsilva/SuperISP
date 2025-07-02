// src/components/inventory/suppliers/RemoveSupplierDialog.tsx
'use client';

import * as React from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Supplier } from '@/types/inventory';
import { useLocale } from '@/contexts/LocaleContext';
import { buttonVariants } from '@/components/ui/button';

interface Props {
  supplier: Supplier | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function RemoveSupplierDialog({ supplier, onConfirm, onCancel }: Props) {
  const { t } = useLocale();

  return (
    <AlertDialog open={!!supplier} onOpenChange={open => !open && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t('inventory_suppliers.delete_confirm_title', 'Are you sure?')}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs">
            {t('inventory_suppliers.delete_confirm_description', 'This will permanently delete supplier "{name}". This action cannot be undone.').replace('{name}', supplier?.name || '')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>
            {t('inventory_suppliers.form_cancel_button', 'Cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: 'destructive' })}
            onClick={onConfirm}
          >
            {t('inventory_suppliers.delete_confirm_delete', 'Delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
