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
import type { Pop, PopData } from '@/types/pops'; 
import { addPop, getPops, updatePop, removePop } from '@/services/mysql/pops'; // Updated import
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';


const popSchema = z.object({
  name: z.string().min(1, 'PoP name is required'),
  location: z.string().min(1, 'Location is required'),
  status: z.enum(['Active', 'Inactive', 'Planned']).default('Active'),
});

type PopFormData = z.infer<typeof popSchema>;


export default function PoPsPageWrapper() {
  const queryClient = useQueryClient(); // Ensure QueryClientProvider is in RootLayout
  return <PoPsPage />;
}


function PoPsPage() {
  const queryClientReact = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [editingPop, setEditingPop] = React.useState<Pop | null>(null); 
  const [popToDelete, setPopToDelete] = React.useState<Pop | null>(null);

  const { toast } = useToast();
  const { t } = useLocale();
  const iconSize = "h-3 w-3";


  const { data: pops = [], isLoading: isLoadingPops, error: popsError, refetch: refetchPops } = useQuery<Pop[], Error>({
    queryKey: ['pops'],
    queryFn: getPops,
  });

  const addPopMutation = useMutation({
    mutationFn: addPop,
    onSuccess: (newPopId) => {
      queryClientReact.invalidateQueries({ queryKey: ['pops'] });
      toast({
        title: t('pops.add_success_toast_title'),
        description: t('pops.add_success_toast_description', '{name} has been added successfully.').replace('{name}', form.getValues('name')),
      });
      form.reset();
      setIsAddDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: t('pops.add_error_toast_title'),
        description: error.message || t('pops.add_error_toast_description'),
        variant: 'destructive',
      });
    },
  });

  const updatePopMutation = useMutation({
    mutationFn: (variables: { id: number | string; data: PopFormData }) => updatePop(variables.id, variables.data),
    onSuccess: () => {
        queryClientReact.invalidateQueries({ queryKey: ['pops'] });
        toast({
            title: t('pops.update_success_toast_title'),
            description: t('pops.update_success_toast_description'),
        });
        form.reset();
        setEditingPop(null);
        setIsAddDialogOpen(false);
    },
    onError: (error: any) => {
        toast({
            title: t('pops.update_error_toast_title'),
            description: error.message || t('pops.update_error_toast_description'),
            variant: 'destructive',
        });
    },
  });

  const removePopMutation = useMutation({
    mutationFn: removePop,
    onSuccess: () => {
        queryClientReact.invalidateQueries({ queryKey: ['pops'] });
        toast({
            title: t('pops.delete_success_toast_title'),
            description: t('pops.delete_success_toast_description'),
            variant: 'destructive'
        });
        setPopToDelete(null);
    },
    onError: (error: any) => {
        toast({
            title: t('pops.delete_error_toast_title'),
            description: error.message || t('pops.delete_error_toast_description'),
            variant: 'destructive',
        });
        setPopToDelete(null);
    },
  });


  const form = useForm<PopFormData>({
    resolver: zodResolver(popSchema),
    defaultValues: {
      name: '',
      location: '',
      status: 'Active',
    },
  });

  const handleFormSubmit = (data: PopFormData) => {
    if (editingPop) {
        updatePopMutation.mutate({ id: editingPop.id, data });
    } else {
        addPopMutation.mutate(data);
    }
  };

  const handleEditPop = (pop: Pop) => {
     setEditingPop(pop); 
     form.reset(pop); 
     setIsAddDialogOpen(true);
   };

  const handleRemovePopConfirm = () => {
    if (popToDelete) {
      removePopMutation.mutate(popToDelete.id);
    }
  };

  const handleRefresh = () => {
      refetchPops();
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
              disabled={isLoadingPops || addPopMutation.isPending || updatePopMutation.isPending || removePopMutation.isPending}
              className="bg-primary hover:bg-primary/90"
          >
              {isLoadingPops ? <Loader2 className={`mr-2 ${iconSize} animate-spin`} /> : <RefreshCw className={`mr-2 ${iconSize}`} />}
              {t('pops.refresh_button')}
          </Button>

          <Dialog open={isAddDialogOpen} onOpenChange={(isOpen) => {
              setIsAddDialogOpen(isOpen);
              if (!isOpen) {
                setEditingPop(null); 
                form.reset({ name: '', location: '', status: 'Active' }); 
              }
            }}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <PlusCircle className={`mr-2 ${iconSize}`} /> {editingPop ? t('pops.edit_dialog_title') : t('pops.add_button')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-sm">{editingPop ? t('pops.edit_dialog_title') : t('pops.add_dialog_title')}</DialogTitle>
                <DialogDescription className="text-xs">
                  {editingPop ? t('pops.edit_dialog_description') : t('pops.add_dialog_description')}
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleFormSubmit)} className="grid gap-4 py-4">
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
                        <Button type="button" variant="outline" disabled={addPopMutation.isPending || updatePopMutation.isPending}>{t('pops.form_cancel_button')}</Button>
                      </DialogClose>
                      <Button type="submit" disabled={addPopMutation.isPending || updatePopMutation.isPending}>
                          {(addPopMutation.isPending || updatePopMutation.isPending) && <Loader2 className={`mr-2 ${iconSize} animate-spin`} />}
                          {editingPop ? t('pops.form_update_button') : t('pops.form_save_button')}
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
          {isLoadingPops ? (
            <div className="space-y-3">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
            </div>
          ) : popsError ? (
             <div className="text-center text-destructive py-4 text-xs">{t('pops.loading_error', { message: popsError.message })}</div>
          ) : pops.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/50">
                  <tr>
                     <TableHead className="w-16">
                       {t('pops.table_header_id')}
                     </TableHead>
                     <TableHead>
                       {t('pops.table_header_name')}
                     </TableHead>
                    <TableHead>
                      {t('pops.table_header_location')}
                    </TableHead>
                    <TableHead>
                      {t('pops.table_header_status')}
                    </TableHead>
                     <TableHead className="w-24">
                       {t('pops.table_header_created')}
                     </TableHead>
                    <TableHead className="relative w-28 text-right">
                      {t('pops.table_header_actions')}
                    </TableHead>
                  </tr>
                </thead>
                <tbody className="bg-background divide-y divide-border">
                  {pops.map((pop) => (
                    <tr key={pop.id}>
                       <TableCell className="px-6 py-4 whitespace-nowrap text-xs font-mono text-muted-foreground">
                        {pop.id.toString().substring(0, 8)}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-xs font-medium text-foreground">
                        {pop.name}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-xs text-muted-foreground">
                        {pop.location}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-xs">
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
                      </TableCell>
                       <TableCell className="px-6 py-4 whitespace-nowrap text-xs text-muted-foreground">
                         {pop.createdAt instanceof Date ? pop.createdAt.toLocaleDateString() : 'N/A'}
                       </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium space-x-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditPop(pop)} disabled={updatePopMutation.isPending}>
                           <Pencil className={iconSize} />
                           <span className="sr-only">Edit PoP</span>
                        </Button>
                         <AlertDialog>
                           <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10" disabled={removePopMutation.isPending}>
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
                                    setPopToDelete(pop); 
                                    handleRemovePopConfirm(); 
                                  }}
                                 disabled={removePopMutation.isPending}
                               >
                                 {removePopMutation.isPending ? <Loader2 className={`mr-2 ${iconSize} animate-spin`} /> : t('pops.delete_alert_delete')}
                               </AlertDialogAction>
                             </AlertDialogFooter>
                           </AlertDialogContent>
                         </AlertDialog>
                      </TableCell>
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

