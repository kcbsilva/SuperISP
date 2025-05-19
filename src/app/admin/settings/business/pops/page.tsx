// src/app/settings/business/pops/page.tsx
'use client';

import * as React from 'react';
import { PlusCircle, Pencil, Trash2, Loader2, RefreshCw } from "lucide-react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useLocale } from '@/contexts/LocaleContext';
import type { Pop, PopData } from '@/types/pops';
import { addPop, getPops, updatePop, removePop } from '@/services/mysql/pops';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';


const popSchema = z.object({
  name: z.string().min(1, 'PoP name is required'),
  location: z.string().min(1, 'Location is required'),
  status: z.enum(['Active', 'Inactive', 'Planned']).default('Active'),
});

type PopFormData = z.infer<typeof popSchema>;


export default function PoPsPage() {
  const queryClientReact = useQueryClient();
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [editingPop, setEditingPop] = React.useState<Pop | null>(null);
  const [popToDelete, setPopToDelete] = React.useState<Pop | null>(null);


  const { toast } = useToast();
  const { t } = useLocale();
  const iconSize = "h-2.5 w-2.5"; // Reduced icon size


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
      setIsAddModalOpen(false);
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
        setIsAddModalOpen(false);
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
     setIsAddModalOpen(true);
   };

  const handleDeleteClick = (pop: Pop) => {
    setPopToDelete(pop);
  }

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

  const getStatusBadgeVariant = (status: string | undefined) => {
    if (!status) return 'secondary';
    switch (status.toLowerCase()) {
        case 'active': return 'default'; 
        case 'planned': return 'outline'; 
        case 'inactive': return 'destructive';
        default: return 'secondary';
    }
  };


  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold">{t('pops.title')}</h1>

        <div className="flex items-center gap-2">
          <Button
              variant="default"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoadingPops || addPopMutation.isPending || updatePopMutation.isPending || removePopMutation.isPending}
              className="bg-primary hover:bg-primary/90"
          >
              {isLoadingPops ? <Loader2 className={`mr-2 ${iconSize} animate-spin`} /> : <RefreshCw className={`mr-2 ${iconSize}`} />}
              {t('pops.refresh_button')}
          </Button>

          <Dialog open={isAddModalOpen} onOpenChange={(isOpen) => {
            setIsAddModalOpen(isOpen);
            if (!isOpen) {
              setEditingPop(null);
              form.reset({ name: '', location: '', status: 'Active'});
            }
          }}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                <PlusCircle className={`mr-2 ${iconSize}`} /> {t('pops.add_button')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-sm">{editingPop ? t('pops.edit_dialog_title') : t('pops.add_dialog_title')}</DialogTitle>
                  <DialogDescription className="text-xs">{editingPop ? t('pops.edit_dialog_description') : t('pops.add_dialog_description')}</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleFormSubmit)} className="grid gap-4 py-4">
                        <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>{t('pops.form_name_label')}</FormLabel><FormControl><Input placeholder={t('pops.form_name_placeholder')} {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="location" render={({ field }) => (<FormItem><FormLabel>{t('pops.form_location_label')}</FormLabel><FormControl><Input placeholder={t('pops.form_location_placeholder')} {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="status" render={({ field }) => (<FormItem><FormLabel>{t('pops.form_status_label')}</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder={t('pops.form_status_placeholder')} /></SelectTrigger></FormControl><SelectContent><SelectItem value="Active">{t('pops.form_status_active')}</SelectItem><SelectItem value="Inactive">{t('pops.form_status_inactive')}</SelectItem><SelectItem value="Planned">{t('pops.form_status_planned')}</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="outline" disabled={addPopMutation.isPending || updatePopMutation.isPending}>{t('pops.form_cancel_button')}</Button></DialogClose>
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
        <CardContent className="pt-0">
          {isLoadingPops ? (
            <div className="space-y-3 py-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
            </div>
          ) : popsError ? (
             <div className="text-center text-destructive py-4 text-xs">{t('pops.loading_error', { message: popsError.message })}</div>
          ) : pops.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                     <TableHead className="w-24 text-xs text-center">{t('pops.table_header_id')}</TableHead>
                     <TableHead className="text-xs text-center">{t('pops.table_header_name')}</TableHead>
                    <TableHead className="text-xs text-center">{t('pops.table_header_location')}</TableHead>
                    <TableHead className="text-xs text-center">{t('pops.table_header_status')}</TableHead>
                     <TableHead className="w-32 text-xs text-center">{t('pops.table_header_created')}</TableHead>
                    <TableHead className="w-28 text-xs text-center">{t('pops.table_header_actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pops.map((pop) => (
                    <TableRow key={pop.id}>
                       <TableCell className="font-mono text-muted-foreground text-xs text-center">{(pop.id as string).toString().substring(0,8)}</TableCell>
                      <TableCell className="font-medium text-xs text-center">{pop.name}</TableCell>
                      <TableCell className="text-muted-foreground text-xs text-center">{pop.location}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={getStatusBadgeVariant(pop.status)} className="text-xs">
                          {pop.status ? t(`pops.form_status_${pop.status.toLowerCase()}` as any, pop.status) : t('pops.status_unknown')}
                        </Badge>
                      </TableCell>
                       <TableCell className="text-muted-foreground text-xs text-center">
                         {pop.createdAt instanceof Date ? pop.createdAt.toLocaleDateString() : pop.createdAt ? new Date(pop.createdAt).toLocaleDateString() :'N/A'}
                       </TableCell>
                      <TableCell className="text-center">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditPop(pop)} disabled={updatePopMutation.isPending}>
                           <Pencil className={iconSize} />
                        </Button>
                        <AlertDialog open={!!popToDelete && popToDelete.id === pop.id} onOpenChange={(open) => !open && setPopToDelete(null)}>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDeleteClick(pop)} disabled={removePopMutation.isPending}>
                                    <Trash2 className={iconSize} />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>{t('pops.delete_alert_title')}</AlertDialogTitle>
                                    <AlertDialogDescription className="text-xs">
                                        {t('pops.delete_alert_description', 'This action cannot be undone. This will permanently delete the PoP named "{name}" (ID: {id}).')
                                        .replace('{name}', pop.name || '')
                                        .replace('{id}', pop.id.toString() || '')}
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel onClick={() => setPopToDelete(null)}>{t('pops.delete_alert_cancel')}</AlertDialogCancel>
                                    <AlertDialogAction
                                        className={buttonVariants({ variant: "destructive" })}
                                        onClick={handleRemovePopConfirm}
                                        disabled={removePopMutation.isPending}
                                    >
                                    {removePopMutation.isPending ? <Loader2 className={`mr-2 ${iconSize} animate-spin`} /> : null}
                                    {t('pops.delete_alert_delete')}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4 text-xs">{t('pops.no_pops_found')}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
