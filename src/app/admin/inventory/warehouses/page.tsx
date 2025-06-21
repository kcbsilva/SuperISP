// src/app/inventory/warehouses/page.tsx
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import { PlusCircle, Edit, Trash2, Loader2, RefreshCw, Search, Home } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';

const warehouseSchema = z.object({
  name: z.string().min(1, "Warehouse name is required."),
  address: z.string().min(1, "Address is required."),
  isMain: z.boolean().default(false),
  notes: z.string().optional(),
});

type WarehouseFormData = z.infer<typeof warehouseSchema>;

interface Warehouse extends WarehouseFormData {
  id: string;
  createdAt: Date;
  itemCount: number; // Placeholder for number of items in warehouse
}

export default function WarehousesPage() {
  const { t } = useLocale();
  const { toast } = useToast();
  const [isAddWarehouseDialogOpen, setIsAddWarehouseDialogOpen] = React.useState(false);
  const [editingWarehouse, setEditingWarehouse] = React.useState<Warehouse | null>(null);
  const [warehouseToDelete, setWarehouseToDelete] = React.useState<Warehouse | null>(null);
  const [warehouses, setWarehouses] = React.useState<Warehouse[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const iconSize = "h-3 w-3";

  const form = useForm<WarehouseFormData>({
    resolver: zodResolver(warehouseSchema),
    defaultValues: {
      name: '',
      address: '',
      isMain: false,
      notes: '',
    },
  });

  React.useEffect(() => {
    if (editingWarehouse) {
      form.reset(editingWarehouse);
      setIsAddWarehouseDialogOpen(true);
    } else {
      form.reset({ name: '', address: '', isMain: false, notes: '' });
    }
  }, [editingWarehouse, form]);

  const handleAddOrUpdateWarehouseSubmit = (data: WarehouseFormData) => {
    if (editingWarehouse) {
      setWarehouses(prev => prev.map(wh => wh.id === editingWarehouse.id ? { ...editingWarehouse, ...data } : wh));
      toast({
        title: t('inventory_warehouses.update_success_title', 'Warehouse Updated'),
        description: t('inventory_warehouses.update_success_description', 'Warehouse "{name}" updated.').replace('{name}', data.name),
      });
    } else {
      const newWarehouse: Warehouse = {
        ...data,
        id: `wh-${Date.now()}`,
        createdAt: new Date(),
        itemCount: 0,
      };
      setWarehouses(prev => [newWarehouse, ...prev]);
      toast({
        title: t('inventory_warehouses.add_success_title', 'Warehouse Added'),
        description: t('inventory_warehouses.add_success_description', 'Warehouse "{name}" added.').replace('{name}', data.name),
      });
    }
    form.reset();
    setEditingWarehouse(null);
    setIsAddWarehouseDialogOpen(false);
  };

  const handleEditWarehouse = (warehouse: Warehouse) => {
    setEditingWarehouse(warehouse);
  };

  const confirmDeleteWarehouse = () => {
    if (warehouseToDelete) {
      setWarehouses(prev => prev.filter(wh => wh.id !== warehouseToDelete.id));
      toast({
        title: t('inventory_warehouses.delete_success_title', 'Warehouse Deleted'),
        description: t('inventory_warehouses.delete_success_description', 'Warehouse "{name}" deleted.').replace('{name}', warehouseToDelete.name),
        variant: 'destructive',
      });
      setWarehouseToDelete(null);
    }
  };

  const filteredWarehouses = React.useMemo(() => {
    return warehouses.filter(wh =>
      wh.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wh.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [warehouses, searchTerm]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center gap-4">
        <h1 className="text-base font-semibold">{t('inventory_warehouses.title', 'Warehouses')}</h1>
        
        <div className="relative flex-1">
            <Search className={`absolute left-2.5 top-2.5 ${iconSize} text-muted-foreground`} />
            <Input
            type="search"
            placeholder={t('inventory_warehouses.search_placeholder', 'Search warehouses...')}
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>

        <div className="flex items-center gap-2 shrink-0">
            <Button variant="default" className="bg-primary hover:bg-primary/90">
                <RefreshCw className={`mr-2 ${iconSize}`} /> {t('inventory_warehouses.refresh_button', 'Refresh')}
            </Button>
             <Dialog open={isAddWarehouseDialogOpen} onOpenChange={(isOpen) => {
                 setIsAddWarehouseDialogOpen(isOpen);
                 if (!isOpen) setEditingWarehouse(null);
             }}>
                <DialogTrigger asChild>
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                        <PlusCircle className={`mr-2 ${iconSize}`} /> {t('inventory_warehouses.add_warehouse_button', 'Add Warehouse')}
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-sm">{editingWarehouse ? t('inventory_warehouses.edit_dialog_title', 'Edit Warehouse') : t('inventory_warehouses.add_dialog_title', 'Add New Warehouse')}</DialogTitle>
                        <DialogDescription className="text-xs">{editingWarehouse ? t('inventory_warehouses.edit_dialog_description', 'Update warehouse details.') : t('inventory_warehouses.add_dialog_description', 'Fill in the details for the new warehouse.')}</DialogDescription> 
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleAddOrUpdateWarehouseSubmit)} className="grid gap-4 py-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('inventory_warehouses.form_name_label', 'Warehouse Name')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t('inventory_warehouses.form_name_placeholder', 'e.g., Central Storage')} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('inventory_warehouses.form_address_label', 'Address')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t('inventory_warehouses.form_address_placeholder', 'e.g., 123 Main St, Anytown')} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="isMain"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                        <div className="space-y-0.5">
                                            <FormLabel>{t('inventory_warehouses.form_is_main_label', 'Main Warehouse')}</FormLabel>
                                        </div>
                                        <FormControl>
                                            <input type="checkbox" checked={field.value} onChange={field.onChange} className="form-checkbox h-4 w-4 text-primary rounded focus:ring-primary" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="notes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('inventory_warehouses.form_notes_label', 'Notes (Optional)')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t('inventory_warehouses.form_notes_placeholder', 'e.g., Forklift access available')} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="outline" disabled={form.formState.isSubmitting}>{t('inventory_warehouses.form_cancel_button', 'Cancel')}</Button>
                                </DialogClose>
                                <Button type="submit" disabled={form.formState.isSubmitting}>
                                    {form.formState.isSubmitting && <Loader2 className={`mr-2 ${iconSize} animate-spin`} />}
                                    {form.formState.isSubmitting ? t('inventory_warehouses.form_saving_button', 'Saving...') : (editingWarehouse ? t('inventory_warehouses.form_update_button', 'Update Warehouse') : t('inventory_warehouses.form_save_button', 'Save Warehouse'))}
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
                  <TableHead className="w-16 text-xs">{t('inventory_warehouses.table_header_id', 'ID')}</TableHead>
                  <TableHead className="text-xs">{t('inventory_warehouses.table_header_name', 'Name')}</TableHead>
                  <TableHead className="text-xs">{t('inventory_warehouses.table_header_address', 'Address')}</TableHead>
                  <TableHead className="text-xs">{t('inventory_warehouses.table_header_is_main', 'Main')}</TableHead>
                  <TableHead className="text-xs">{t('inventory_warehouses.table_header_items', 'Items')}</TableHead>
                  <TableHead className="text-right w-28 text-xs">{t('inventory_warehouses.table_header_actions', 'Actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWarehouses.length > 0 ? (
                  filteredWarehouses.map((warehouse) => (
                    <TableRow key={warehouse.id}>
                      <TableCell className="font-mono text-muted-foreground text-xs">{warehouse.id.substring(0,8)}</TableCell>
                      <TableCell className="font-medium text-xs">
                        {warehouse.name}
                        {warehouse.isMain && <Home className="inline-block ml-2 h-3 w-3 text-primary" />}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">{warehouse.address}</TableCell>
                      <TableCell className="text-center">
                         {warehouse.isMain && <Badge variant="default" className="bg-primary/10 text-primary text-xs">{t('inventory_warehouses.yes_indicator', 'Yes')}</Badge>}
                      </TableCell>
                      <TableCell className="text-center text-xs">{warehouse.itemCount}</TableCell>
                      <TableCell className="text-right">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditWarehouse(warehouse)}>
                                <Edit className={iconSize} />
                                <span className="sr-only">{t('inventory_warehouses.action_edit', 'Edit')}</span>
                            </Button>
                             <AlertDialog>
                               <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10">
                                    <Trash2 className={iconSize} />
                                    <span className="sr-only">{t('inventory_warehouses.action_delete', 'Delete')}</span>
                                </Button>
                               </AlertDialogTrigger>
                               <AlertDialogContent>
                                 <AlertDialogHeader>
                                   <AlertDialogTitle>{t('inventory_warehouses.delete_confirm_title', 'Are you sure?')}</AlertDialogTitle>
                                   <AlertDialogDescription className="text-xs">
                                     {t('inventory_warehouses.delete_confirm_description', 'This will permanently delete warehouse "{name}". This action cannot be undone.').replace('{name}', warehouse.name)}
                                   </AlertDialogDescription>
                                 </AlertDialogHeader>
                                 <AlertDialogFooter>
                                   <AlertDialogCancel onClick={() => setWarehouseToDelete(null)}>{t('inventory_warehouses.form_cancel_button', 'Cancel')}</AlertDialogCancel>
                                   <AlertDialogAction
                                     className={buttonVariants({ variant: "destructive" })}
                                     onClick={() => {
                                       setWarehouseToDelete(warehouse);
                                       confirmDeleteWarehouse();
                                     }}
                                   >
                                     {t('inventory_warehouses.delete_confirm_delete', 'Delete')}
                                   </AlertDialogAction>
                                 </AlertDialogFooter>
                               </AlertDialogContent>
                             </AlertDialog>
                        </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8 text-xs">
                      {searchTerm ? t('inventory_warehouses.no_warehouses_found_search', 'No warehouses found matching your search.') : t('inventory_warehouses.no_warehouses_found', 'No warehouses configured yet.')}
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
