// src/components/inventory/suppliers/AddSupplierModal.tsx
'use client';

import * as React from 'react';
import {
  Dialog,
  DialogTrigger,
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
import { PlusCircle, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useLocale } from '@/contexts/LocaleContext';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email required'),
  telephone: z.string().min(6, 'Telephone is required'),
});

export type AddSupplierFormData = z.infer<typeof schema>;

interface Props {
  onSubmit: (data: AddSupplierFormData) => void;
}

export function AddSupplierModal({ onSubmit }: Props) {
  const { t } = useLocale();
  const [open, setOpen] = React.useState(false);

  const form = useForm<AddSupplierFormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', telephone: '' },
  });

  const handleFormSubmit = (data: AddSupplierFormData) => {
    onSubmit(data);
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          <PlusCircle className="mr-2 h-3 w-3" />
          {t('inventory_suppliers.add_supplier_button', 'Add Supplier')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-sm">
            {t('inventory_suppliers.add_dialog_title', 'Add New Supplier')}
          </DialogTitle>
          <DialogDescription className="text-xs">
            {t('inventory_suppliers.add_dialog_description', 'Fill in the details for the new supplier.')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="grid gap-4 py-4">
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
                {t('inventory_suppliers.form_save_button', 'Save')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
