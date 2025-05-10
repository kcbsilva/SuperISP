// src/app/settings/business/pops/page.tsx
'use client';

import * as React from 'react';
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import { PlusCircle, Pencil, Trash2, Loader2, RefreshCw } from "lucide-react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
} from "@/components/ui/alert-dialog" // Removed AlertDialogTrigger as it's part of the button
import { useLocale } from '@/contexts/LocaleContext';
import type { Pop, PopData } from '@/types/pops'; // Ensure types are still relevant

const popSchema = z.object({
  name: z.string().min(1, 'PoP name is required'),
  location: z.string().min(1, 'Location is required'),
  status: z.enum(['Active', 'Inactive', 'Planned']).default('Active'),
});

type PopFormData = z.infer<typeof popSchema>;

// Placeholder data for PoPs, as PostgreSQL service is removed
const placeholderPops: Pop[] = [
    { id: 'sim-1', name: 'Central Hub', location: '123 Fiber Lane, Anytown', status: 'Active', createdAt: new Date() },
    { id: 'sim-2', name: 'North Branch', location: '456 Network Rd, Anytown', status: 'Planned', createdAt: new Date(Date.now() - 86400000) },
    { id: 'sim-3', name: 'West End POP', location: '789 Data Dr, Anytown', status: 'Inactive', createdAt: new Date(Date.now() - 172800000) },
];


export default function PoPsPage() {
  const [pops, setPops] = React.useState<Pop[]>(placeholderPops);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [editingPop, setEditingPop] = React.useState<Pop | null>(null); // For potential edit functionality
  const [popToDelete, setPopToDelete] = React.useState<Pop | null>(null);

  const { toast } = useToast();
  const { t } = useLocale();
  const iconSize = "h-3 w-3";


  const form = useForm<PopFormData>({
    resolver: zodResolver(popSchema),
    defaultValues: {
      name: '',
      location: '',
      status: 'Active',
    },
  });

  const handleAddPopSubmit = (data: PopFormData) => {
    const newPop: Pop = {
      id: `pop-${Date.now()}`, // Simple ID generation for local state
      ...data,
      createdAt: new Date(),
    };
    setPops(prevPops => [newPop, ...prevPops]);
    toast({
      title: t('pops.add_success_toast_title'),
      description: t('pops.add_success_toast_description', '{name} has been added successfully.').replace('{name}', data.name),
    });
    form.reset();
    setIsAddDialogOpen(false);
  };

  const handleEditPop = (pop: Pop) => {
     // For now, this is just a placeholder as edit modal is not fully implemented
     // If you were to implement it, you'd likely set form defaultValues with pop data
     // and open a dialog similar to the add dialog.
     setEditingPop(pop); // Store the pop being edited
     form.reset(pop); // Pre-fill form for editing
     setIsAddDialogOpen(true); // Open the same dialog, but in "edit mode"
     // Note: The dialog's submit handler and title would need to adapt based on `editingPop` state.
     console.log("Editing PoP (Local State):", pop);
     // toast({
     //   title: t('pops.edit_toast_title'),
     //   description: t('pops.edit_toast_description', 'Editing for "{name}" is not yet implemented.').replace('{name}', pop.name),
     // });
   };

  const handleRemovePopConfirm = () => {
    if (popToDelete) {
      setPops(prevPops => prevPops.filter(p => p.id !== popToDelete.id));
      toast({
        title: t('pops.delete_success_toast_title'),
        description: t('pops.delete_success_toast_description'),
        variant: 'destructive'
      });
      setPopToDelete(null);
    }
  };

  const handleRefresh = () => {
      // Simulate refresh if needed, or if data source changes later
      toast({
        title: t('pops.refreshing_toast_title'),
        description: t('pops.refreshing_toast_description'),
      });
    };


  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold">{t('pops.title')}</h1>

        <div className="flex items-center gap-2">
          <Button
              variant="default"
              onClick={handleRefresh}
              className="bg-primary hover:bg-primary/90"
          >
              <RefreshCw className={`mr-2 ${iconSize}`} />
              {t('pops.refresh_button')}
          </Button>

          <Dialog open={isAddDialogOpen} onOpenChange={(isOpen) => {
              setIsAddDialogOpen(isOpen);
              if (!isOpen) {
                setEditingPop(null); // Clear editing state when dialog closes
                form.reset({ name: '', location: '', status: 'Active' }); // Reset form
              }
            }}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <PlusCircle className={`mr-2 ${iconSize}`} /> {editingPop ? t('pops.edit_dialog_title', 'Edit PoP') : t('pops.add_button')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-sm">{editingPop ? t('pops.edit_dialog_title', 'Edit PoP') : t('pops.add_dialog_title')}</DialogTitle>
                <DialogDescription className="text-xs">
                  {editingPop ? t('pops.edit_dialog_description', 'Update the PoP details.') : t('pops.add_dialog_description')}
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAddPopSubmit)} className="grid gap-4 py-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-4 items-center gap-4">
                        <FormLabel className="text-right">{t('pops.form_name_label')}</FormLabel>
                        <FormControl className="col-span-3">
                          <Input placeholder={t('pops.form_name_placeholder')} {...field} />
                        </FormControl>
                        <FormMessage className="col-span-4 text-right" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-4 items-center gap-4">
                        <FormLabel className="text-right">{t('pops.form_location_label')}</FormLabel>
                        <FormControl className="col-span-3">
                          <Input placeholder={t('pops.form_location_placeholder')} {...field} />
                        </FormControl>
                         <FormMessage className="col-span-4 text-right" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-4 items-center gap-4">
                        <FormLabel className="text-right">{t('pops.form_status_label')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl className="col-span-3">
                            <SelectTrigger>
                              <SelectValue placeholder={t('pops.form_status_placeholder')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Active">{t('pops.form_status_active')}</SelectItem>
                            <SelectItem value="Inactive">{t('pops.form_status_inactive')}</SelectItem>
                            <SelectItem value="Planned">{t('pops.form_status_planned')}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="col-span-4 text-right" />
                      </FormItem>
                    )}
                  />
                   <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" variant="outline">{t('pops.form_cancel_button')}</Button>
                      </DialogClose>
                      <Button type="submit">
                          {form.formState.isSubmitting && <Loader2 className={`mr-2 ${iconSize} animate-spin`} />}
                          {editingPop ? t('pops.form_update_button', 'Update PoP') : t('pops.form_save_button')}
                      </Button>
                   </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{t('pops.table_title')}</CardTitle>
          <CardDescription className="text-xs">{t('pops.table_description')}</CardDescription>
        </CardHeader>
        <CardContent>
          {pops.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/50">
                  <tr>
                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-16">
                       {t('pops.table_header_id')}
                     </th>
                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                       {t('pops.table_header_name')}
                     </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {t('pops.table_header_location')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {t('pops.table_header_status')}
                    </th>
                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-24">
                       {t('pops.table_header_created')}
                     </th>
                    <th scope="col" className="relative px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider w-28">
                      {t('pops.table_header_actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-background divide-y divide-border">
                  {pops.map((pop) => (
                    <tr key={pop.id}>
                       <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-muted-foreground">
                        {pop.id.toString().substring(0, 8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-foreground">
                        {pop.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-muted-foreground">
                        {pop.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            pop.status && pop.status.toLowerCase() === "active"
                              ? "bg-green-100 text-green-800"
                              : pop.status && pop.status.toLowerCase() === "planned"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {pop.status ? t(`pops.form_status_${pop.status.toLowerCase()}` as any, pop.status) : t('pops.status_unknown')}
                        </span>
                      </td>
                       <td className="px-6 py-4 whitespace-nowrap text-xs text-muted-foreground">
                         {pop.createdAt instanceof Date ? pop.createdAt.toLocaleDateString() : 'N/A'}
                       </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium space-x-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditPop(pop)}>
                           <Pencil className={iconSize} />
                           <span className="sr-only">Edit PoP</span>
                        </Button>
                         <AlertDialog>
                           <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10">
                                <Trash2 className={iconSize} />
                                <span className="sr-only">Remove PoP</span>
                              </Button>
                           </AlertDialogTrigger>
                           <AlertDialogContent>
                             <AlertDialogHeader>
                               <AlertDialogTitle>{t('pops.delete_alert_title')}</AlertDialogTitle>
                               <AlertDialogDescription className="text-xs">
                                 {t('pops.delete_alert_description', 'This action cannot be undone. This will permanently delete the PoP named "{name}" (ID: {id}).')
                                    .replace('{name}', pop.name)
                                    .replace('{id}', pop.id.toString())}
                               </AlertDialogDescription>
                             </AlertDialogHeader>
                             <AlertDialogFooter>
                               <AlertDialogCancel onClick={() => setPopToDelete(null)}>{t('pops.delete_alert_cancel')}</AlertDialogCancel>
                               <AlertDialogAction
                                 className={buttonVariants({ variant: "destructive" })}
                                 onClick={() => {
                                    setPopToDelete(pop); // Set the pop to delete
                                    handleRemovePopConfirm(); // Call confirm which uses popToDelete
                                  }}
                               >
                                 {t('pops.delete_alert_delete')}
                               </AlertDialogAction>
                             </AlertDialogFooter>
                           </AlertDialogContent>
                         </AlertDialog>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4 text-xs">{t('pops.no_pops_found')}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
