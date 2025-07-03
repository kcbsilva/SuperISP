// /src/components/inventory/products/AddProductModal.tsx
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
  DialogTrigger,
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
import { PlusCircle, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale } from '@/contexts/LocaleContext';
import { useToast } from '@/hooks/use-toast';
import * as z from 'zod';
import { inventoryCategories, manufacturers, suppliers } from '@/data/inventory';
import type { Product } from '@/types/inventory';

const productSchema = z.object({
  patrimonialNumber: z.string().min(1, 'Patrimonial number is required.'),
  name: z.string().min(1, 'Product name is required.'),
  categoryId: z.string().min(1, 'Category is required.'),
  manufacturerId: z.string().min(1, 'Manufacturer is required.'),
  supplierId: z.string().min(1, 'Supplier is required.'),
});

type ProductFormData = z.infer<typeof productSchema>;

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  onAddProduct: (product: Product) => void;
}

export function AddProductModal({ open, setOpen, onAddProduct }: Props) {
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

  const canAdd = inventoryCategories.length > 0 && manufacturers.length > 0 && suppliers.length > 0;

  const handleSubmit = (data: ProductFormData) => {
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      quantity: 0,
      ...data,
    };
    onAddProduct(newProduct);
    setOpen(false);
    form.reset();
    toast({
      title: t('inventory_products.add_success_title', 'Product Added'),
      description: t('inventory_products.add_success_description', 'Product "{name}" added.').replace('{name}', data.name),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700 text-white" disabled={!canAdd}>
          <PlusCircle className="h-3 w-3 mr-2" />
          {t('inventory_products.add_product_button', 'Add Product')}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-sm">
            {t('inventory_products.add_dialog_title', 'Add New Product')}
          </DialogTitle>
          <DialogDescription className="text-xs">
            {t('inventory_products.add_dialog_description', 'Fill in the details for the new product.')}
          </DialogDescription>
        </DialogHeader>

        {canAdd ? (
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
                  {t('inventory_products.form_save_button', 'Save Product')}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <p className="text-xs text-muted-foreground py-4">
            {t(
              'inventory_products.dependency_warning',
              'Please add at least one category, manufacturer, and supplier before adding products.'
            )}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
