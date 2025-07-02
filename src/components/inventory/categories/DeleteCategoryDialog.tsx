// src/components/inventory/categories/DeleteCategoryDialog.tsx
'use client';

import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { buttonVariants } from '@/components/ui/button';
import { useLocale } from '@/contexts/LocaleContext';
import type { InventoryCategory } from '@/types/inventory';

interface Props {
  category: InventoryCategory;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteCategoryDialog({ category, onConfirm, onCancel }: Props) {
  const { t } = useLocale();

  return (
    <AlertDialog open onOpenChange={onCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t('inventory_categories.delete_confirm_title', 'Are you sure?')}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs">
            {t(
              'inventory_categories.delete_confirm_description',
              'This will permanently delete category "{name}". This action cannot be undone.'
            ).replace('{name}', category.name)}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>
            {t('inventory_categories.form_cancel_button', 'Cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: 'destructive' })}
            onClick={onConfirm}
          >
            {t('inventory_categories.delete_confirm_delete', 'Delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
