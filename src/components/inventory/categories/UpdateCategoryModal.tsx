// src/components/inventory/categories/UpdateCategoryModal.tsx
'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Loader2, Edit } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useLocale } from '@/contexts/LocaleContext';
import type { InventoryCategory } from '@/types/inventory';

const iconSize = "h-3 w-3";

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required."),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface Props {
  category: InventoryCategory;
  onUpdate: (category: InventoryCategory) => void;
  onClose: () => void;
}

export function UpdateCategoryModal({ category, onUpdate, onClose }: Props) {
  const { t } = useLocale();

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: category.name },
  });

  const handleSubmit = (data: CategoryFormData) => {
    const updated: InventoryCategory = { ...category, name: data.name };
    onUpdate(updated);
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-sm flex items-center gap-2">
            <Edit className={iconSize} />
            {t('inventory_categories.edit_dialog_title', 'Edit Category')}
          </DialogTitle>
          <DialogDescription className="text-xs">
            {t('inventory_categories.edit_dialog_description', 'Update category details.')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('inventory_categories.form_name_label', 'Category Name')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('inventory_categories.form_name_placeholder', 'e.g., Electronics')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={form.formState.isSubmitting}>
                {t('inventory_categories.form_cancel_button', 'Cancel')}
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className={`mr-2 ${iconSize} animate-spin`} />}
                {form.formState.isSubmitting
                  ? t('inventory_categories.form_saving_button', 'Saving...')
                  : t('inventory_categories.form_update_button', 'Update Category')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
