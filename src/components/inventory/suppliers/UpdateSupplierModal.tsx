// src/components/inventory/suppliers/UpdateSupplierModal.tsx
'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Supplier } from '@/types/inventory';
import { useLocale } from '@/contexts/LocaleContext';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email required'),
  telephone: z.string().min(6, 'Telephone is required'),
});

export type UpdateSupplierFormData = z.infer<typeof schema>;

interface Props {
  supplier: Supplier | null;
  onSubmit: (data: UpdateSupplierFormData) => void;
  onClose: () => void;
}

export function UpdateSupplierModal({ supplier, onSubmit, onClose }: Props) {
  const { t } = useLocale();
  const form = useForm<UpdateSupplierFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      telephone: '',
    },
  });

  React.useEffect(() => {
    if (supplier) {
      form.reset({
        name: supplier.name,
        email: supplier.email,
        telephone: supplier.telephone,
      });
    }
  }, [supplier, form]);

  if (!supplier) return null;

  const handleSubmit = (data: UpdateSupplierFormData) => {
    onSubmit(data);
    onClose();
    form.reset();
  };

  return (
    <Dialog open={!!supplier} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-sm">
            {t('inventory_suppliers.edit_dialog_title', 'Edit Supplier')}
          </DialogTitle>
          <DialogDescription className="text-xs">
            {t('inventory_suppliers.edit_dialog_description', 'Update supplier details.')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('inventory_suppliers.form_name_label', 'Name')}</FormLabel>
                  <FormControl>
                    <Input placeholder="Supplier Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('inventory_suppliers.form_email_label', 'Email')}</FormLabel>
                  <FormControl>
                    <Input placeholder="email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="telephone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('inventory_suppliers.form_telephone_label', 'Telephone')}</FormLabel>
                  <FormControl>
                    <Input placeholder="+55 88 99859-8235" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={form.formState.isSubmitting}>
                  {t('inventory_suppliers.form_cancel_button', 'Cancel')}
                </Button>
              </DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                {t('inventory_suppliers.form_update_button', 'Update')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
