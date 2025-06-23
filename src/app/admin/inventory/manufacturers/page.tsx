// src/app/admin/inventory/manufacturers/page.tsx
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
import { manufacturers as manufacturersData } from '@/data/inventory';
import type { Manufacturer } from '@/types/inventory';

const manufacturerSchema = z.object({
  name: z.string().min(1, "Manufacturer name is required."),
});

type ManufacturerFormData = z.infer<typeof manufacturerSchema>;

export default function ManufacturersPage() {
  const { t } = useLocale();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingManufacturer, setEditingManufacturer] = React.useState<Manufacturer | null>(null);
  const [manufacturerToDelete, setManufacturerToDelete] = React.useState<Manufacturer | null>(null);
  const [manufacturers, setManufacturers] = React.useState<Manufacturer[]>(manufacturersData);
  const [searchTerm, setSearchTerm] = React.useState('');
  const iconSize = "h-3 w-3";

  const form = useForm<ManufacturerFormData>({
    resolver: zodResolver(manufacturerSchema),
    defaultValues: { name: '' },
  });

  React.useEffect(() => {
    if (editingManufacturer) {
      form.reset(editingManufacturer);
      setIsDialogOpen(true);
    } else {
      form.reset({ name: '' });
    }
  }, [editingManufacturer, form]);

  const handleSubmit = (data: ManufacturerFormData) => {
    if (editingManufacturer) {
      setManufacturers(prev => prev.map(man => man.id === editingManufacturer.id ? { ...editingManufacturer, ...data } : man));
      const idx = manufacturersData.findIndex(c => c.id === editingManufacturer.id);
      if (idx !== -1) manufacturersData[idx] = { ...manufacturers[idx], ...data };
      toast({
        title: t('inventory_manufacturers.update_success_title', 'Manufacturer Updated'),
        description: t('inventory_manufacturers.update_success_description', 'Manufacturer "{name}" updated.').replace('{name}', data.name),
      });
    } else {
      const newManufacturer: Manufacturer = { id: `cat-${Date.now()}`, ...data };
      setManufacturers(prev => [...prev, newManufacturer]);
      manufacturersData.push(newManufacturer);
      toast({
        title: t('inventory_manufacturers.add_success_title', 'Manufacturer Added'),
        description: t('inventory_manufacturers.add_success_description', 'Manufacturer "{name}" added.').replace('{name}', data.name),
      });
    }
    setIsDialogOpen(false);
    setEditingManufacturer(null);
    form.reset();
  };

  const confirmDelete = () => {
    if (manufacturerToDelete) {
      setManufacturers(prev => prev.filter(man => man.id !== manufacturerToDelete.id));
      const idx = manufacturersData.findIndex(c => c.id === manufacturerToDelete.id);
      if (idx !== -1) manufacturersData.splice(idx, 1);
      toast({
        title: t('inventory_manufacturers.delete_success_title', 'Manufacturer Deleted'),
        description: t('inventory_manufacturers.delete_success_description', 'Manufacturer "{name}" deleted.').replace('{name}', manufacturerToDelete.name),
        variant: 'destructive',
      });
      setManufacturerToDelete(null);
    }
  };

  const filteredManufacturers = manufacturers.filter(man => man.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center gap-4">
        <h1 className="text-base font-semibold">{t('inventory_manufacturers.title', 'Manufacturers')}</h1>
        <div className="relative flex-1">
          <Search className={`absolute left-2.5 top-2.5 ${iconSize} text-muted-foreground`} />
          <Input
            type="search"
            placeholder={t('inventory_manufacturers.search_placeholder', 'Search manufacturers...')}
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="default" className="bg-primary hover:bg-primary/90">
            <RefreshCw className={`mr-2 ${iconSize}`} /> {t('inventory_manufacturers.refresh_button', 'Refresh')}
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={(isOpen) => { setIsDialogOpen(isOpen); if (!isOpen) setEditingManufacturer(null); }}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <PlusCircle className={`mr-2 ${iconSize}`} /> {t('inventory_manufacturers.add_manufacturer_button', 'Add Manufacturer')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-sm">{editingManufacturer ? t('inventory_manufacturers.edit_dialog_title', 'Edit Manufacturer') : t('inventory_manufacturers.add_dialog_title', 'Add New Manufacturer')}</DialogTitle>
                <DialogDescription className="text-xs">{editingManufacturer ? t('inventory_manufacturers.edit_dialog_description', 'Update manufacturer details.') : t('inventory_manufacturers.add_dialog_description', 'Fill in the details for the new manufacturer.')}</DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('inventory_manufacturers.form_name_label', 'Manufacturer Name')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('inventory_manufacturers.form_name_placeholder', 'e.g., Electronics')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter className="mt-4">
                    <DialogClose asChild>
                      <Button type="button" variant="outline" disabled={form.formState.isSubmitting}>{t('inventory_manufacturers.form_cancel_button', 'Cancel')}</Button>
                    </DialogClose>
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                      {form.formState.isSubmitting && <Loader2 className={`mr-2 ${iconSize} animate-spin`} />}
                      {form.formState.isSubmitting ? t('inventory_manufacturers.form_saving_button', 'Saving...') : (editingManufacturer ? t('inventory_manufacturers.form_update_button', 'Update Manufacturer') : t('inventory_manufacturers.form_save_button', 'Save Manufacturer'))}
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
                  <TableHead className="w-16 text-xs">{t('inventory_manufacturers.table_header_id', 'ID')}</TableHead>
                  <TableHead className="text-xs">{t('inventory_manufacturers.table_header_name', 'Name')}</TableHead>
                  <TableHead className="text-right w-28 text-xs">{t('inventory_manufacturers.table_header_actions', 'Actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredManufacturers.length > 0 ? (
                  filteredManufacturers.map((manufacturer) => (
                    <TableRow key={manufacturer.id}>
                      <TableCell className="font-mono text-muted-foreground text-xs">{manufacturer.id.substring(0,8)}</TableCell>
                      <TableCell className="font-medium text-xs">{manufacturer.name}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditingManufacturer(manufacturer)}>
                          <Edit className={iconSize} />
                          <span className="sr-only">{t('inventory_manufacturers.action_edit', 'Edit')}</span>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10">
                              <Trash2 className={iconSize} />
                              <span className="sr-only">{t('inventory_manufacturers.action_delete', 'Delete')}</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>{t('inventory_manufacturers.delete_confirm_title', 'Are you sure?')}</AlertDialogTitle>
                              <AlertDialogDescription className="text-xs">
                                {t('inventory_manufacturers.delete_confirm_description', 'This will permanently delete manufacturer "{name}". This action cannot be undone.').replace('{name}', manufacturer.name)}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setManufacturerToDelete(null)}>{t('inventory_manufacturers.form_cancel_button', 'Cancel')}</AlertDialogCancel>
                              <AlertDialogAction
                                className={buttonVariants({ variant: 'destructive' })}
                                onClick={() => { setManufacturerToDelete(manufacturer); confirmDelete(); }}
                              >
                                {t('inventory_manufacturers.delete_confirm_delete', 'Delete')}
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
                      {searchTerm ? t('inventory_manufacturers.no_manufacturers_found_search', 'No manufacturers found matching your search.') : t('inventory_manufacturers.no_manufacturers_found', 'No manufacturers configured yet.')}
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