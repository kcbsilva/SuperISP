// src/components/inventory/categories/AddCategoryModal.tsx
'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
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
import { PlusCircle, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useLocale } from '@/contexts/LocaleContext';
import type { InventoryCategory } from '@/types/inventory';

const iconSize = "h-3 w-3";

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required."),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface Props {
  onAdd: (category: InventoryCategory) => void;
}

export function AddCategoryModal({ onAdd }: Props) {
  const { toast } = useToast();
  const { t } = useLocale();
  const [isOpen, setIsOpen] = React.useState(false);

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: '' },
  });

  const handleSubmit = (data: CategoryFormData) => {
    const newCategory: InventoryCategory = {
      id: `cat-${Date.now()}`,
      name: data.name,
    };
    onAdd(newCategory);
    toast({
      title: t('inventory_categories.add_success_title', 'Category Added'),
      description: t('inventory_categories.add_success_description', 'Category "{name}" added.').replace('{name}', newCategory.name),
    });
    form.reset();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          <PlusCircle className={`mr-2 ${iconSize}`} />
          {t('inventory_categories.add_category_button', 'Add Category')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-sm flex items-center gap-2">
            <PlusCircle className={iconSize} />
            {t('inventory_categories.add_dialog_title', 'Add New Category')}
          </DialogTitle>
          <DialogDescription className="text-xs">
            {t('inventory_categories.add_dialog_description', 'Fill in the details for the new category.')}
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
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={form.formState.isSubmitting}>
                  {t('inventory_categories.form_cancel_button', 'Cancel')}
                </Button>
              </DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className={`mr-2 ${iconSize} animate-spin`} />}
                {form.formState.isSubmitting
                  ? t('inventory_categories.form_saving_button', 'Saving...')
                  : t('inventory_categories.form_save_button', 'Save Category')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
