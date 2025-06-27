// src/components/finances/entry-categories/RemoveCategoryDialog.tsx
'use client';

import * as React from 'react';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { EntryCategory } from './types';
import { useLocale } from '@/contexts/LocaleContext';
import { buttonVariants } from '@/components/ui/button';

type Props = {
  category: EntryCategory;
  onDelete: () => void;
  disabled?: boolean;
};

export function RemoveCategoryDialog({ category, onDelete, disabled }: Props) {
  const { t } = useLocale();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-destructive hover:text-destructive"
          disabled={disabled}
        >
          <Trash2 className="h-3 w-3" />
          <span className="sr-only">{t('entry_categories.action_delete', 'Delete')}</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t('entry_categories.delete_confirm_title', 'Are you sure?')}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs">
            {t('entry_categories.delete_confirm_description', 'This action cannot be undone. This will permanently delete the category "{categoryName}".').replace(
              '{categoryName}',
              category.name,
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('entry_categories.delete_confirm_cancel', 'Cancel')}</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: 'destructive' })}
            onClick={onDelete}
          >
            {t('entry_categories.delete_confirm_delete', 'Delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
