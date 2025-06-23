// src/app/admin/inventory/suppliers/page.tsx
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
import { suppliers as suppliersData } from '@/data/inventory';
import type { Supplier } from '@/types/inventory';

const supplierSchema = z.object({
  name: z.string().min(1, "Supplier name is required."),
});

type SupplierFormData = z.infer<typeof supplierSchema>;

export default function SuppliersPage() {
  const { t } = useLocale();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingSupplier, setEditingSupplier] = React.useState<Supplier | null>(null);
  const [supplierToDelete, setSupplierToDelete] = React.useState<Supplier | null>(null);
  const [suppliers, setSuppliers] = React.useState<Supplier[]>(suppliersData);
  const [searchTerm, setSearchTerm] = React.useState('');
  const iconSize = "h-3 w-3";

  const form = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
    defaultValues: { name: '' },
  });

  React.useEffect(() => {
    if (editingSupplier) {
      form.reset(editingSupplier);
      setIsDialogOpen(true);
    } else {
      form.reset({ name: '' });
    }
  }, [editingSupplier, form]);

  const handleSubmit = (data: SupplierFormData) => {
    if (editingSupplier) {
      setSuppliers(prev => prev.map(man => man.id === editingSupplier.id ? { ...editingSupplier, ...data } : man));
      const idx = suppliersData.findIndex(c => c.id === editingSupplier.id);
      if (idx !== -1) suppliersData[idx] = { ...suppliers[idx], ...data };
      toast({
        title: t('inventory_suppliers.update_success_title', 'Supplier Updated'),
        description: t('inventory_suppliers.update_success_description', 'Supplier "{name}" updated.').replace('{name}', data.name),
      });
    } else {
      const newSupplier: Supplier = { id: `cat-${Date.now()}`, ...data };
      setSuppliers(prev => [...prev, newSupplier]);
      suppliersData.push(newSupplier);
      toast({
        title: t('inventory_suppliers.add_success_title', 'Supplier Added'),
        description: t('inventory_suppliers.add_success_description', 'Supplier "{name}" added.').replace('{name}', data.name),
      });
    }
    setIsDialogOpen(false);
    setEditingSupplier(null);
    form.reset();
  };

  const confirmDelete = () => {
    if (supplierToDelete) {
      setSuppliers(prev => prev.filter(man => man.id !== supplierToDelete.id));
      const idx = suppliersData.findIndex(c => c.id === supplierToDelete.id);
      if (idx !== -1) suppliersData.splice(idx, 1);
      toast({
        title: t('inventory_suppliers.delete_success_title', 'Supplier Deleted'),
        description: t('inventory_suppliers.delete_success_description', 'Supplier "{name}" deleted.').replace('{name}', supplierToDelete.name),
        variant: 'destructive',
      });
      setSupplierToDelete(null);
    }
  };

  const filteredSuppliers = suppliers.filter(man => man.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center gap-4">
        <h1 className="text-base font-semibold">{t('inventory_suppliers.title', 'Suppliers')}</h1>
        <div className="relative flex-1">
          <Search className={`absolute left-2.5 top-2.5 ${iconSize} text-muted-foreground`} />
          <Input
            type="search"
            placeholder={t('inventory_suppliers.search_placeholder', 'Search suppliers...')}
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="default" className="bg-primary hover:bg-primary/90">
            <RefreshCw className={`mr-2 ${iconSize}`} /> {t('inventory_suppliers.refresh_button', 'Refresh')}
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={(isOpen) => { setIsDialogOpen(isOpen); if (!isOpen) setEditingSupplier(null); }}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <PlusCircle className={`mr-2 ${iconSize}`} /> {t('inventory_suppliers.add_supplier_button', 'Add Supplier')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-sm">{editingSupplier ? t('inventory_suppliers.edit_dialog_title', 'Edit Supplier') : t('inventory_suppliers.add_dialog_title', 'Add New Supplier')}</DialogTitle>
                <DialogDescription className="text-xs">{editingSupplier ? t('inventory_suppliers.edit_dialog_description', 'Update supplier details.') : t('inventory_suppliers.add_dialog_description', 'Fill in the details for the new supplier.')}</DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('inventory_suppliers.form_name_label', 'Supplier Name')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('inventory_suppliers.form_name_placeholder', 'e.g., Electronics')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter className="mt-4">
                    <DialogClose asChild>
                      <Button type="button" variant="outline" disabled={form.formState.isSubmitting}>{t('inventory_suppliers.form_cancel_button', 'Cancel')}</Button>
                    </DialogClose>
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                      {form.formState.isSubmitting && <Loader2 className={`mr-2 ${iconSize} animate-spin`} />}
                      {form.formState.isSubmitting ? t('inventory_suppliers.form_saving_button', 'Saving...') : (editingSupplier ? t('inventory_suppliers.form_update_button', 'Update Supplier') : t('inventory_suppliers.form_save_button', 'Save Supplier'))}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
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
                  <TableHead className="w-16 text-xs">{t('inventory_suppliers.table_header_id', 'ID')}</TableHead>
                  <TableHead className="text-xs">{t('inventory_suppliers.table_header_name', 'Name')}</TableHead>
                  <TableHead className="text-right w-28 text-xs">{t('inventory_suppliers.table_header_actions', 'Actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.length > 0 ? (
                  filteredSuppliers.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell className="font-mono text-muted-foreground text-xs">{supplier.id.substring(0,8)}</TableCell>
                      <TableCell className="font-medium text-xs">{supplier.name}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditingSupplier(supplier)}>
                          <Edit className={iconSize} />
                          <span className="sr-only">{t('inventory_suppliers.action_edit', 'Edit')}</span>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10">
                              <Trash2 className={iconSize} />
                              <span className="sr-only">{t('inventory_suppliers.action_delete', 'Delete')}</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>{t('inventory_suppliers.delete_confirm_title', 'Are you sure?')}</AlertDialogTitle>
                              <AlertDialogDescription className="text-xs">
                                {t('inventory_suppliers.delete_confirm_description', 'This will permanently delete supplier "{name}". This action cannot be undone.').replace('{name}', supplier.name)}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setSupplierToDelete(null)}>{t('inventory_suppliers.form_cancel_button', 'Cancel')}</AlertDialogCancel>
                              <AlertDialogAction
                                className={buttonVariants({ variant: 'destructive' })}
                                onClick={() => { setSupplierToDelete(supplier); confirmDelete(); }}
                              >
                                {t('inventory_suppliers.delete_confirm_delete', 'Delete')}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground py-8 text-xs">
                      {searchTerm ? t('inventory_suppliers.no_suppliers_found_search', 'No suppliers found matching your search.') : t('inventory_suppliers.no_suppliers_found', 'No suppliers configured yet.')}
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