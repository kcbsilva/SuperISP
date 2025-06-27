// src/components/finances/entry-categories/AddCategoryModal.tsx
'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useLocale } from '@/contexts/LocaleContext';
import { EntryCategory } from './types';

const categorySchema = z.object({
  name: z.string().min(1),
  type: z.enum(['Income', 'Expense']),
  description: z.string().optional(),
  parentCategoryId: z.string().nullable().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryFormData) => void;
  editingCategory?: EntryCategory | null;
  availableParents: EntryCategory[];
  getCategoryNumber: (cat: EntryCategory, all: EntryCategory[]) => string;
};

export function AddCategoryModal({
  open,
  onClose,
  onSubmit,
  editingCategory,
  availableParents,
  getCategoryNumber,
}: Props) {
  const { t } = useLocale();

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      type: undefined,
      description: '',
      parentCategoryId: null,
    },
  });

  React.useEffect(() => {
    if (editingCategory) {
      form.reset({
        name: editingCategory.name,
        type: editingCategory.type,
        description: editingCategory.description || '',
        parentCategoryId: editingCategory.parentCategoryId || null,
      });
    } else {
      form.reset();
    }
  }, [editingCategory, form]);

  const handleSubmit = (data: CategoryFormData) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-sm">
            {editingCategory ? t('entry_categories.edit_category_dialog_title', 'Edit Category') : t('entry_categories.add_category_dialog_title', 'Add Entry Category')}
          </DialogTitle>
          <DialogDescription className="text-xs">
            {editingCategory ? t('entry_categories.edit_category_dialog_description', 'Update the category details.') : t('entry_categories.add_category_dialog_description', 'Fill in the details to create a new category.')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('entry_categories.form_name_label', 'Name')}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Software Licenses" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('entry_categories.form_type_label', 'Type')}</FormLabel>
                  <Select
                    onValueChange={(val) => {
                      field.onChange(val);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('entry_categories.form_select_type_first', 'Select type')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Income">{t('entry_categories.category_type_income', 'Income')}</SelectItem>
                      <SelectItem value="Expense">{t('entry_categories.category_type_expense', 'Expense')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="parentCategoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('entry_categories.form_parent_label', 'Parent Category')}</FormLabel>
                  <Select
                    onValueChange={(val) => field.onChange(val)}
                    defaultValue={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('entry_categories.form_parent_category_placeholder', 'Select parent category')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableParents.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {getCategoryNumber(cat, availableParents)} - {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('entry_categories.form_description_label', 'Description')}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Recurring cost for tools" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  {t('entry_categories.form_cancel_button', 'Cancel')}
                </Button>
              </DialogClose>
              <Button type="submit">
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                {editingCategory ? t('entry_categories.form_update_button', 'Update') : t('entry_categories.form_save_button', 'Save')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
