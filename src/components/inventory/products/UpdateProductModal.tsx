// /src/components/inventory/products/UpdateProductModal.tsx
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale } from '@/contexts/LocaleContext';
import { useToast } from '@/hooks/use-toast';
import * as z from 'zod';
import { inventoryCategories, manufacturers, suppliers } from '@/data/inventory';
import type { Product } from '@/types/inventory';

const productSchema = z.object({
  patrimonialNumber: z.string().min(1),
  name: z.string().min(1),
  categoryId: z.string().min(1),
  manufacturerId: z.string().min(1),
  supplierId: z.string().min(1),
});

type ProductFormData = z.infer<typeof productSchema>;

interface Props {
  product: Product | null;
  open: boolean;
  setOpen: (value: boolean) => void;
  onUpdateProduct: (updated: Product) => void;
}

export function UpdateProductModal({ product, open, setOpen, onUpdateProduct }: Props) {
  const { t } = useLocale();
  const { toast } = useToast();

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      patrimonialNumber: '',
      name: '',
      categoryId: '',
      manufacturerId: '',
      supplierId: '',
    },
  });

  React.useEffect(() => {
    if (product) {
      form.reset(product);
    }
  }, [product, form]);

  const handleSubmit = (data: ProductFormData) => {
    if (!product) return;

    const updated = { ...product, ...data };
    onUpdateProduct(updated);
    setOpen(false);
    toast({
      title: t('inventory_products.update_success_title', 'Product Updated'),
      description: t('inventory_products.update_success_description', 'Product "{name}" updated.').replace('{name}', data.name),
    });
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-sm">
            {t('inventory_products.edit_dialog_title', 'Edit Product')}
          </DialogTitle>
          <DialogDescription className="text-xs">
            {t('inventory_products.edit_dialog_description', 'Update product details.')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="patrimonialNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('inventory_products.form_patrimonial_label', 'Patrimonial Number')}</FormLabel>
                  <FormControl>
                    <Input placeholder="PN-0001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('inventory_products.form_name_label', 'Product Name')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('inventory_products.form_name_placeholder', 'e.g., Router')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('inventory_products.form_category_label', 'Category')}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {inventoryCategories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
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
              name="manufacturerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('inventory_products.form_manufacturer_label', 'Manufacturer')}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {manufacturers.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.businessName}
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
              name="supplierId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('inventory_products.form_supplier_label', 'Supplier')}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {suppliers.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.businessName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={form.formState.isSubmitting}>
                  {t('inventory_products.form_cancel_button', 'Cancel')}
                </Button>
              </DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (
                  <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                )}
                {t('inventory_products.form_update_button', 'Update Product')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
