// /src/components/inventory/products/RemoveProductDialog.tsx
'use client';

import * as React from 'react';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import type { Product } from '@/types/inventory';

interface Props {
  product: Product | null;
  open: boolean;
  setOpen: (value: boolean) => void;
  onConfirm: (product: Product) => void;
}

export function RemoveProductDialog({ product, open, setOpen, onConfirm }: Props) {
  const { t } = useLocale();

  if (!product) return null;

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t('inventory_products.delete_confirm_title', 'Are you sure?')}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs">
            {t('inventory_products.delete_confirm_description', 'This will permanently delete product "{name}". This action cannot be undone.')
              .replace('{name}', product.name)}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {t('inventory_products.form_cancel_button', 'Cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-white hover:bg-destructive/90"
            onClick={() => {
              onConfirm(product);
              setOpen(false);
            }}
          >
            {t('inventory_products.delete_confirm_delete', 'Delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
