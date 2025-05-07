// src/app/finances/entry-categories/page.tsx
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  // CardDescription, // Removed
  // CardHeader, // Removed
  // CardTitle, // Removed
  // CardFooter, // Removed
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
import { PlusCircle, Edit, Trash2, Loader2, RefreshCw, Search } from 'lucide-react'; // Removed Settings2
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
  AlertDialogTrigger, // Added missing import
} from "@/components/ui/alert-dialog";
import { buttonVariants } from '@/components/ui/button';

// Validation Schema for a new category
const categorySchema = z.object({
  name: z.string().min(1, "Category name is required."), // This will be displayed under "Description" header
  type: z.enum(['Income', 'Expense'], { required_error: "Category type is required." }),
  description: z.string().optional(), // Optional description, not shown in table but searchable
  parentCategoryId: z.string().optional().nullable(), //ID of parent category, can be null for top-level
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface EntryCategory extends CategoryFormData {
  id: string;
  createdAt: Date; // Still part of the data model, just not displayed
}

const STATIC_INCOME_ID = 'static-income-root';
const STATIC_EXPENSE_ID = 'static-expense-root';

// Placeholder data - replace with actual data fetching
const placeholderCategories: EntryCategory[] = [
  { id: STATIC_INCOME_ID, name: 'Income', type: 'Income', description: 'Top-level income category. Cannot be edited or deleted.', createdAt: new Date('2023-01-01'), parentCategoryId: null },
  { id: STATIC_EXPENSE_ID, name: 'Expense', type: 'Expense', description: 'Top-level expense category. Cannot be edited or deleted.', createdAt: new Date('2023-01-01'), parentCategoryId: null },
  { id: 'cat-1', name: 'Subscription Revenue', type: 'Income', description: 'Monthly recurring revenue from subscriptions.', createdAt: new Date('2024-01-15'), parentCategoryId: STATIC_INCOME_ID },
  { id: 'cat-2', name: 'Office Supplies', type: 'Expense', description: 'Expenses related to office stationery and supplies.', createdAt: new Date('2024-01-20'), parentCategoryId: STATIC_EXPENSE_ID },
  { id: 'cat-3', name: 'Utilities', type: 'Expense', description: 'Electricity, water, internet bills.', createdAt: new Date('2024-02-01'), parentCategoryId: STATIC_EXPENSE_ID },
  { id: 'cat-4', name: 'Consulting Fees', type: 'Income', description: 'One-time or project-based consulting income.', createdAt: new Date('2024-02-10'), parentCategoryId: STATIC_INCOME_ID },
  { id: 'cat-5', name: 'Software Licenses', type: 'Expense', description: 'Recurring costs for software subscriptions.', createdAt: new Date('2024-03-05'), parentCategoryId: 'cat-2' }, // Example of sub-subcategory
];

export default function EntryCategoriesPage() {
  const { t } = useLocale();
  const { toast } = useToast();
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<EntryCategory | null>(null);
  // const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = React.useState(false); // No longer needed with individual triggers
  const [categoryToDelete, setCategoryToDelete] = React.useState<EntryCategory | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');


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
      setIsAddCategoryDialogOpen(true);
    } else {
      form.reset({ name: '', type: undefined, description: '', parentCategoryId: null });
    }
  }, [editingCategory, form]);

  const handleAddOrUpdateCategorySubmit = (data: CategoryFormData) => {
    // Prevent editing static categories' core fields if somehow attempted
    if (editingCategory && (editingCategory.id === STATIC_INCOME_ID || editingCategory.id === STATIC_EXPENSE_ID)) {
        if (data.name !== editingCategory.name || data.type !== editingCategory.type) {
            toast({
                title: t('entry_categories.static_edit_error_title', 'Edit Error'),
                description: t('entry_categories.static_edit_error_description', 'Static categories "Income" and "Expense" cannot have their name or type changed.'),
                variant: 'destructive',
            });
            return;
        }
    }

    if (editingCategory) {
      console.log("Update Category Data:", data, "for ID:", editingCategory.id);
      toast({
        title: t('entry_categories.update_success_title', 'Category Updated'),
        description: t('entry_categories.update_success_description', 'Category "{name}" has been updated.').replace('{name}', data.name),
      });
    } else {
      console.log("New Category Data:", data);
      toast({
        title: t('entry_categories.add_success_title', 'Category Added'),
        description: t('entry_categories.add_success_description', 'Category "{name}" has been added.').replace('{name}', data.name),
      });
    }
    form.reset();
    setEditingCategory(null);
    setIsAddCategoryDialogOpen(false);
    // refetch categories after adding/updating
  };

  const handleEditCategory = (category: EntryCategory) => {
    setEditingCategory(category);
  };

  const confirmDeleteCategory = () => {
    if (categoryToDelete) {
      if (categoryToDelete.id === STATIC_INCOME_ID || categoryToDelete.id === STATIC_EXPENSE_ID) {
        toast({
          title: t('entry_categories.static_delete_error_title', 'Delete Error'),
          description: t('entry_categories.static_delete_error_description', 'Static categories "Income" and "Expense" cannot be deleted.'),
          variant: 'destructive',
        });
        setCategoryToDelete(null);
        // setIsConfirmDeleteDialogOpen(false); // if controlled dialog was used
        return;
      }
      // TODO: Implement actual API call to delete category
      console.log("Delete Category:", categoryToDelete.id);
      toast({
        title: t('entry_categories.delete_success_title', 'Category Deleted'),
        description: t('entry_categories.delete_success_description', 'Category "{name}" has been deleted.').replace('{name}', categoryToDelete.name),
        variant: 'destructive',
      });
      setCategoryToDelete(null);
      // setIsConfirmDeleteDialogOpen(false); // if controlled dialog was used
      // refetch categories after deleting
    }
  };

  const filteredCategories = React.useMemo(() => {
    return placeholderCategories.filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm]);

  const availableParentCategories = React.useMemo(() => {
    return placeholderCategories.filter(cat => {
      // Exclude the category being edited from its own parent list
      if (editingCategory && cat.id === editingCategory.id) return false;
      // Exclude static expense from being parent of income and vice-versa for new categories or non-static edits
      if (form.getValues('type') === 'Income' && cat.type === 'Expense' && cat.id === STATIC_EXPENSE_ID) return false;
      if (form.getValues('type') === 'Expense' && cat.type === 'Income' && cat.id === STATIC_INCOME_ID) return false;
      // If editing a sub-category, ensure its parent type matches or is a static root of the same type
      if (editingCategory && editingCategory.type === 'Income' && cat.type === 'Expense') return false;
      if (editingCategory && editingCategory.type === 'Expense' && cat.type === 'Income') return false;
      return true;
    });
  }, [editingCategory, form.watch('type')]); // Watch type field

  const getCategoryNumber = (category: EntryCategory, allCategories: EntryCategory[]): string => {
    if (category.id === STATIC_INCOME_ID) return "1";
    if (category.id === STATIC_EXPENSE_ID) return "2";

    const path: string[] = [];
    let current: EntryCategory | undefined = category;
    while(current && current.parentCategoryId) {
        const parent = allCategories.find(c => c.id === current!.parentCategoryId);
        if (parent) {
            // Find index among siblings
            const siblings = allCategories.filter(s => s.parentCategoryId === parent.id && s.type === current!.type);
            const index = siblings.findIndex(s => s.id === current!.id) + 1;
            path.unshift(index.toString());
            current = parent;
        } else {
            // Should not happen if data is consistent
            break;
        }
    }
    if (current?.type === 'Income') {
        path.unshift("1");
    } else if (current?.type === 'Expense') {
        path.unshift("2");
    }
    return path.join('.');
  };


  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center gap-4">
        <h1 className="text-2xl font-semibold">{t('entry_categories.title', 'Entry Categories')}</h1>
        
        <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
            type="search"
            placeholder={t('entry_categories.search_placeholder', 'Search categories...')}
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>

        <div className="flex items-center gap-2 shrink-0">
            <Button variant="default" className="bg-primary hover:bg-primary/90">
                <RefreshCw className="mr-2 h-4 w-4" /> {t('entry_categories.refresh_button', 'Refresh')}
            </Button>
             <Dialog open={isAddCategoryDialogOpen} onOpenChange={(isOpen) => {
                 setIsAddCategoryDialogOpen(isOpen);
                 if (!isOpen) setEditingCategory(null);
             }}>
                <DialogTrigger asChild>
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                        <PlusCircle className="mr-2 h-4 w-4" /> {t('entry_categories.add_category_button', 'Add Category')}
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editingCategory ? t('entry_categories.edit_category_dialog_title', 'Edit Category') : t('entry_categories.add_category_dialog_title', 'Add New Entry Category')}</DialogTitle>
                        <DialogDescription>{editingCategory ? t('entry_categories.edit_category_dialog_description', 'Update the details for this category.') : t('entry_categories.add_category_dialog_description', 'Fill in the details for the new entry category.')}</DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleAddOrUpdateCategorySubmit)} className="grid gap-4 py-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('entry_categories.form_name_label', 'Category Name')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t('entry_categories.form_name_placeholder', 'e.g., Office Rent')} {...field} disabled={editingCategory?.id === STATIC_INCOME_ID || editingCategory?.id === STATIC_EXPENSE_ID} />
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
                                            onValueChange={(value) => {
                                                field.onChange(value);
                                                // If type changes, reset parentCategoryId to a valid one or null
                                                const currentParent = form.getValues('parentCategoryId');
                                                if (currentParent) {
                                                    const parentCategory = placeholderCategories.find(c => c.id === currentParent);
                                                    if (parentCategory && parentCategory.type !== value) {
                                                        form.setValue('parentCategoryId', value === 'Income' ? STATIC_INCOME_ID : STATIC_EXPENSE_ID);
                                                    }
                                                } else {
                                                     form.setValue('parentCategoryId', value === 'Income' ? STATIC_INCOME_ID : STATIC_EXPENSE_ID);
                                                }
                                            }}
                                            defaultValue={field.value}
                                            disabled={editingCategory?.id === STATIC_INCOME_ID || editingCategory?.id === STATIC_EXPENSE_ID}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={t('entry_categories.form_type_placeholder', 'Select category type')} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Income">{t('entry_categories.form_type_income', 'Income')}</SelectItem>
                                                <SelectItem value="Expense">{t('entry_categories.form_type_expense', 'Expense')}</SelectItem>
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
                                        <FormLabel>{t('entry_categories.form_description_label', 'Description (Optional)')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t('entry_categories.form_description_placeholder', 'e.g., Monthly rent payment for office space')} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="parentCategoryId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('entry_categories.form_parent_category_label', 'Parent Category (Optional)')}</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value || undefined} // Handle null for Select
                                            disabled={editingCategory?.id === STATIC_INCOME_ID || editingCategory?.id === STATIC_EXPENSE_ID || !form.getValues('type')}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={!form.getValues('type') ? t('entry_categories.form_select_type_first', 'Select type first') : t('entry_categories.form_parent_category_placeholder', 'Select parent category or leave blank')} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="">{t('entry_categories.form_parent_none', 'None (Top Level)')}</SelectItem>
                                                {availableParentCategories
                                                    .filter(cat => cat.type === form.getValues('type')) // Filter parents by selected type
                                                    .map(cat => (
                                                      <SelectItem key={cat.id} value={cat.id}>
                                                        {getCategoryNumber(cat, placeholderCategories)} - {cat.name}
                                                      </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="outline" disabled={form.formState.isSubmitting}>{t('entry_categories.form_cancel_button', 'Cancel')}</Button>
                                </DialogClose>
                                <Button type="submit" disabled={form.formState.isSubmitting}>
                                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {form.formState.isSubmitting ? t('entry_categories.form_saving_button', 'Saving...') : (editingCategory ? t('entry_categories.form_update_button', 'Update Category') : t('entry_categories.form_save_button', 'Save Category'))}
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
                  <TableHead className="w-32">{t('entry_categories.table_header_category_number', 'Category No.')}</TableHead>
                  <TableHead>{t('entry_categories.table_header_description', 'Description')}</TableHead>
                  <TableHead>{t('entry_categories.table_header_type', 'Type')}</TableHead>
                  <TableHead className="text-right w-28">{t('entry_categories.table_header_actions', 'Actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => {
                    const isStatic = category.id === STATIC_INCOME_ID || category.id === STATIC_EXPENSE_ID;
                    return (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{getCategoryNumber(category, placeholderCategories)}</TableCell>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          category.type === 'Income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {t(`entry_categories.category_type_${category.type.toLowerCase()}` as any, category.type)}
                        </span>
                      </TableCell>
                       <TableCell className="text-right">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditCategory(category)} disabled={isStatic && (category.name === "Income" || category.name === "Expense")}>
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">{t('entry_categories.action_edit', 'Edit')}</span>
                            </Button>
                             <AlertDialog>
                               <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" disabled={isStatic}>
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">{t('entry_categories.action_delete', 'Delete')}</span>
                                </Button>
                               </AlertDialogTrigger>
                               <AlertDialogContent>
                                 <AlertDialogHeader>
                                   <AlertDialogTitle>{t('entry_categories.delete_confirm_title', 'Are you sure?')}</AlertDialogTitle>
                                   <AlertDialogDescription>
                                     {t('entry_categories.delete_confirm_description', 'This action cannot be undone. This will permanently delete the category "{categoryName}".').replace('{categoryName}', category.name || '')}
                                   </AlertDialogDescription>
                                 </AlertDialogHeader>
                                 <AlertDialogFooter>
                                   <AlertDialogCancel onClick={() => { setCategoryToDelete(null); /* setIsConfirmDeleteDialogOpen(false); */ }}>{t('entry_categories.delete_confirm_cancel', 'Cancel')}</AlertDialogCancel>
                                   <AlertDialogAction
                                     className={buttonVariants({ variant: "destructive" })}
                                     onClick={() => {
                                       setCategoryToDelete(category);
                                       confirmDeleteCategory();
                                     }}
                                   >
                                     {t('entry_categories.delete_confirm_delete', 'Delete')}
                                   </AlertDialogAction>
                                 </AlertDialogFooter>
                               </AlertDialogContent>
                             </AlertDialog>
                        </TableCell>
                    </TableRow>
                  )})
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      {searchTerm ? t('entry_categories.no_categories_found_search', 'No categories found matching your search.') : t('entry_categories.no_categories_found', 'No categories configured yet.')}
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

