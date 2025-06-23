// src/app/admin/inventory/categories/page.tsx
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
import { inventoryCategories } from '@/data/inventory';
import type { InventoryCategory } from '@/types/inventory';

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required."),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export default function CategoriesPage() {
  const { t } = useLocale();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<InventoryCategory | null>(null);
  const [categoryToDelete, setCategoryToDelete] = React.useState<InventoryCategory | null>(null);
  const [categories, setCategories] = React.useState<InventoryCategory[]>(inventoryCategories);
  const [searchTerm, setSearchTerm] = React.useState('');
  const iconSize = "h-3 w-3";

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: '' },
  });

  React.useEffect(() => {
    if (editingCategory) {
      form.reset(editingCategory);
      setIsDialogOpen(true);
    } else {
      form.reset({ name: '' });
    }
  }, [editingCategory, form]);

  const handleSubmit = (data: CategoryFormData) => {
    if (editingCategory) {
      setCategories(prev => prev.map(cat => cat.id === editingCategory.id ? { ...editingCategory, ...data } : cat));
      const idx = inventoryCategories.findIndex(c => c.id === editingCategory.id);
      if (idx !== -1) inventoryCategories[idx] = { ...inventoryCategories[idx], ...data };
      toast({
        title: t('inventory_categories.update_success_title', 'Category Updated'),
        description: t('inventory_categories.update_success_description', 'Category "{name}" updated.').replace('{name}', data.name),
      });
    } else {
      const newCategory: InventoryCategory = { id: `cat-${Date.now()}`, ...data };
      setCategories(prev => [...prev, newCategory]);
      inventoryCategories.push(newCategory);
      toast({
        title: t('inventory_categories.add_success_title', 'Category Added'),
        description: t('inventory_categories.add_success_description', 'Category "{name}" added.').replace('{name}', data.name),
      });
    }
    setIsDialogOpen(false);
    setEditingCategory(null);
    form.reset();
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      setCategories(prev => prev.filter(cat => cat.id !== categoryToDelete.id));
      const idx = inventoryCategories.findIndex(c => c.id === categoryToDelete.id);
      if (idx !== -1) inventoryCategories.splice(idx, 1);
      toast({
        title: t('inventory_categories.delete_success_title', 'Category Deleted'),
        description: t('inventory_categories.delete_success_description', 'Category "{name}" deleted.').replace('{name}', categoryToDelete.name),
        variant: 'destructive',
      });
      setCategoryToDelete(null);
    }
  };

  const filteredCategories = categories.filter(cat => cat.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center gap-4">
        <h1 className="text-base font-semibold">{t('inventory_categories.title', 'Categories')}</h1>
        <div className="relative flex-1">
          <Search className={`absolute left-2.5 top-2.5 ${iconSize} text-muted-foreground`} />
          <Input
            type="search"
            placeholder={t('inventory_categories.search_placeholder', 'Search categories...')}
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="default" className="bg-primary hover:bg-primary/90">
            <RefreshCw className={`mr-2 ${iconSize}`} /> {t('inventory_categories.refresh_button', 'Refresh')}
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={(isOpen) => { setIsDialogOpen(isOpen); if (!isOpen) setEditingCategory(null); }}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <PlusCircle className={`mr-2 ${iconSize}`} /> {t('inventory_categories.add_category_button', 'Add Category')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-sm">{editingCategory ? t('inventory_categories.edit_dialog_title', 'Edit Category') : t('inventory_categories.add_dialog_title', 'Add New Category')}</DialogTitle>
                <DialogDescription className="text-xs">{editingCategory ? t('inventory_categories.edit_dialog_description', 'Update category details.') : t('inventory_categories.add_dialog_description', 'Fill in the details for the new category.')}</DialogDescription>
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
                      <Button type="button" variant="outline" disabled={form.formState.isSubmitting}>{t('inventory_categories.form_cancel_button', 'Cancel')}</Button>
                    </DialogClose>
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                      {form.formState.isSubmitting && <Loader2 className={`mr-2 ${iconSize} animate-spin`} />}
                      {form.formState.isSubmitting ? t('inventory_categories.form_saving_button', 'Saving...') : (editingCategory ? t('inventory_categories.form_update_button', 'Update Category') : t('inventory_categories.form_save_button', 'Save Category'))}
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
                  <TableHead className="w-16 text-xs">{t('inventory_categories.table_header_id', 'ID')}</TableHead>
                  <TableHead className="text-xs">{t('inventory_categories.table_header_name', 'Name')}</TableHead>
                  <TableHead className="text-right w-28 text-xs">{t('inventory_categories.table_header_actions', 'Actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-mono text-muted-foreground text-xs">{category.id.substring(0,8)}</TableCell>
                      <TableCell className="font-medium text-xs">{category.name}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditingCategory(category)}>
                          <Edit className={iconSize} />
                          <span className="sr-only">{t('inventory_categories.action_edit', 'Edit')}</span>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10">
                              <Trash2 className={iconSize} />
                              <span className="sr-only">{t('inventory_categories.action_delete', 'Delete')}</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>{t('inventory_categories.delete_confirm_title', 'Are you sure?')}</AlertDialogTitle>
                              <AlertDialogDescription className="text-xs">
                                {t('inventory_categories.delete_confirm_description', 'This will permanently delete category "{name}". This action cannot be undone.').replace('{name}', category.name)}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setCategoryToDelete(null)}>{t('inventory_categories.form_cancel_button', 'Cancel')}</AlertDialogCancel>
                              <AlertDialogAction
                                className={buttonVariants({ variant: 'destructive' })}
                                onClick={() => { setCategoryToDelete(category); confirmDelete(); }}
                              >
                                {t('inventory_categories.delete_confirm_delete', 'Delete')}
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
                      {searchTerm ? t('inventory_categories.no_categories_found_search', 'No categories found matching your search.') : t('inventory_categories.no_categories_found', 'No categories configured yet.')}
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