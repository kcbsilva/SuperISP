// src/app/admin/inventory/products/page.tsx
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { PlusCircle, Edit, Trash2, Loader2, RefreshCw, Search } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from '@/components/ui/button';
import { products as productsData, inventoryCategories, manufacturers as manufacturersData, suppliers as suppliersData } from '@/data/inventory';
import type { Product } from '@/types/inventory';

const productSchema = z.object({
  patrimonialNumber: z.string().min(1, 'Patrimonial number is required.'),
  name: z.string().min(1, 'Product name is required.'),
  categoryId: z.string().min(1, 'Category is required.'),
  manufacturerId: z.string().min(1, 'Manufacturer is required.'),
  supplierId: z.string().min(1, 'Supplier is required.'),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function ProductsPage() {
  const { t } = useLocale();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = React.useState<Product | null>(null);
  const [products, setProducts] = React.useState<Product[]>(productsData);
  const [searchTerm, setSearchTerm] = React.useState('');
  const iconSize = "h-3 w-3";

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: { patrimonialNumber: '', name: '', categoryId: '', manufacturerId: '', supplierId: '' },
  });

  React.useEffect(() => {
    if (editingProduct) {
      form.reset(editingProduct);
      setIsDialogOpen(true);
    } else {
      form.reset({ patrimonialNumber: '', name: '', categoryId: '', manufacturerId: '', supplierId: '' });
    }
  }, [editingProduct, form]);

  const handleSubmit = (data: ProductFormData) => {
    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...editingProduct, ...data } : p));
      const idx = productsData.findIndex(p => p.id === editingProduct.id);
      if (idx !== -1) productsData[idx] = { ...productsData[idx], ...data };
      toast({
        title: t('inventory_products.update_success_title', 'Product Updated'),
        description: t('inventory_products.update_success_description', 'Product "{name}" updated.').replace('{name}', data.name),
      });
    } else {
      const newProduct: Product = { id: `prod-${Date.now()}`, quantity: 0, ...data };
      setProducts(prev => [...prev, newProduct]);
      productsData.push(newProduct);
      toast({
        title: t('inventory_products.add_success_title', 'Product Added'),
        description: t('inventory_products.add_success_description', 'Product "{name}" added.').replace('{name}', data.name),
      });
    }
    setIsDialogOpen(false);
    setEditingProduct(null);
    form.reset();
  };

  const confirmDelete = () => {
    if (productToDelete) {
      setProducts(prev => prev.filter(p => p.id !== productToDelete.id));
      const idx = productsData.findIndex(p => p.id === productToDelete.id);
      if (idx !== -1) productsData.splice(idx, 1);
      toast({
        title: t('inventory_products.delete_success_title', 'Product Deleted'),
        description: t('inventory_products.delete_success_description', 'Product "{name}" deleted.').replace('{name}', productToDelete.name),
        variant: 'destructive',
      });
      setProductToDelete(null);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.patrimonialNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const canAddProduct = inventoryCategories.length > 0 && manufacturersData.length > 0 && suppliersData.length > 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center gap-4">
        <h1 className="text-base font-semibold">{t('inventory_products.title', 'Products')}</h1>
        <div className="relative flex-1">
          <Search className={`absolute left-2.5 top-2.5 ${iconSize} text-muted-foreground`} />
          <Input
            type="search"
            placeholder={t('inventory_products.search_placeholder', 'Search products...')}
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="default" className="bg-primary hover:bg-primary/90">
            <RefreshCw className={`mr-2 ${iconSize}`} /> {t('inventory_products.refresh_button', 'Refresh')}
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={(isOpen) => { setIsDialogOpen(isOpen); if (!isOpen) setEditingProduct(null); }}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700 text-white" disabled={!canAddProduct}>
                <PlusCircle className={`mr-2 ${iconSize}`} /> {t('inventory_products.add_product_button', 'Add Product')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-sm">{editingProduct ? t('inventory_products.edit_dialog_title', 'Edit Product') : t('inventory_products.add_dialog_title', 'Add New Product')}</DialogTitle>
                <DialogDescription className="text-xs">{editingProduct ? t('inventory_products.edit_dialog_description', 'Update product details.') : t('inventory_products.add_dialog_description', 'Fill in the details for the new product.')}</DialogDescription>
              </DialogHeader>
              {canAddProduct ? (
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
                            {inventoryCategories.map(cat => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}
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
                            {manufacturersData.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
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
                            {suppliersData.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter className="mt-4">
                    <DialogClose asChild>
                      <Button type="button" variant="outline" disabled={form.formState.isSubmitting}>{t('inventory_products.form_cancel_button', 'Cancel')}</Button>
                    </DialogClose>
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                      {form.formState.isSubmitting && <Loader2 className={`mr-2 ${iconSize} animate-spin`} />}
                      {form.formState.isSubmitting ? t('inventory_products.form_saving_button', 'Saving...') : (editingProduct ? t('inventory_products.form_update_button', 'Update Product') : t('inventory_products.form_save_button', 'Save Product'))}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
              ) : (
                <p className="text-xs text-muted-foreground py-4">{t('inventory_products.dependency_warning', 'Please add at least one category, manufacturer, and supplier before adding products.')}</p>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16 text-xs">{t('inventory_products.table_header_id', 'ID')}</TableHead>
                  <TableHead className="text-xs">{t('inventory_products.table_header_patrimonial', 'Patrimonial')}</TableHead>
                  <TableHead className="text-xs">{t('inventory_products.table_header_name', 'Name')}</TableHead>
                  <TableHead className="text-xs">{t('inventory_products.table_header_category', 'Category')}</TableHead>
                  <TableHead className="text-xs">{t('inventory_products.table_header_manufacturer', 'Manufacturer')}</TableHead>
                  <TableHead className="text-xs">{t('inventory_products.table_header_supplier', 'Supplier')}</TableHead>
                  <TableHead className="text-right w-28 text-xs">{t('inventory_products.table_header_actions', 'Actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-mono text-muted-foreground text-xs">{product.id.substring(0,8)}</TableCell>
                      <TableCell className="text-xs">{product.patrimonialNumber}</TableCell>
                      <TableCell className="font-medium text-xs">{product.name}</TableCell>
                      <TableCell className="text-xs">{inventoryCategories.find(c => c.id === product.categoryId)?.name}</TableCell>
                      <TableCell className="text-xs">{manufacturersData.find(m => m.id === product.manufacturerId)?.name}</TableCell>
                      <TableCell className="text-xs">{suppliersData.find(s => s.id === product.supplierId)?.name}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditingProduct(product)}>
                          <Edit className={iconSize} />
                          <span className="sr-only">{t('inventory_products.action_edit', 'Edit')}</span>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10">
                              <Trash2 className={iconSize} />
                              <span className="sr-only">{t('inventory_products.action_delete', 'Delete')}</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>{t('inventory_products.delete_confirm_title', 'Are you sure?')}</AlertDialogTitle>
                              <AlertDialogDescription className="text-xs">
                                {t('inventory_products.delete_confirm_description', 'This will permanently delete product "{name}". This action cannot be undone.').replace('{name}', product.name)}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setProductToDelete(null)}>{t('inventory_products.form_cancel_button', 'Cancel')}</AlertDialogCancel>
                              <AlertDialogAction
                                className={buttonVariants({ variant: 'destructive' })}
                                onClick={() => { setProductToDelete(product); confirmDelete(); }}
                              >
                                {t('inventory_products.delete_confirm_delete', 'Delete')}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8 text-xs">
                      {searchTerm ? t('inventory_products.no_products_found_search', 'No products found matching your search.') : t('inventory_products.no_products_found', 'No products configured yet.')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}