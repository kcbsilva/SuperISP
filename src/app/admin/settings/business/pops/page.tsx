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
// Removed MySQL service imports
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

const placeholderPops: Pop[] = [];

export default function PoPsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [editingPop, setEditingPop] = React.useState<Pop | null>(null);
  const [popToDelete, setPopToDelete] = React.useState<Pop | null>(null);
  const [pops, setPops] = React.useState<Pop[]>(placeholderPops); // Use local state
  const [isLoading, setIsLoading] = React.useState(false); // Simulate loading

  const { toast } = useToast();
  const { t } = useLocale();
  const iconSize = "h-2.5 w-2.5";

  const form = useForm<PopFormData>({
    resolver: zodResolver(popSchema),
    defaultValues: {
      name: '',
      location: '',
      status: 'Active',
    },
  });

  // Simulate fetching PoPs
  const refetchPops = () => {
    setIsLoading(true);
    setTimeout(() => {
      setPops(placeholderPops);
      setIsLoading(false);
      toast({
        title: t('pops.refreshing_toast_title'),
        description: t('pops.refreshing_toast_description'),
      });
    }, 500);
  };

  React.useEffect(() => {
    // Initial load simulation
    refetchPops();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleFormSubmit = (data: PopFormData) => {
    setIsLoading(true);
    setTimeout(() => {
      if (editingPop) {
        setPops(prevPops => prevPops.map(p => p.id === editingPop.id ? { ...editingPop, ...data, updatedAt: new Date() } : p));
        toast({
          title: t('pops.update_success_toast_title'),
          description: t('pops.update_success_toast_description'),
        });
      } else {
        const newPop: Pop = {
          id: `pop-${Date.now()}`,
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setPops(prevPops => [newPop, ...prevPops]);
        toast({
          title: t('pops.add_success_toast_title'),
          description: t('pops.add_success_toast_description', '{name} has been added successfully.').replace('{name}', data.name),
        });
      }
      form.reset();
      setEditingPop(null);
      setIsAddModalOpen(false);
      setIsLoading(false);
    }, 500);
  };

  const handleEditPop = (pop: Pop) => {
    setEditingPop(pop);
    form.reset({
      name: pop.name,
      location: pop.location,
      status: pop.status as 'Active' | 'Inactive' | 'Planned',
    });
    setIsAddModalOpen(true);
  };

  const handleDeleteClick = (pop: Pop) => {
    setPopToDelete(pop);
  }

  const handleRemovePopConfirm = () => {
    if (popToDelete) {
      setIsLoading(true);
      setTimeout(() => {
        setPops(prevPops => prevPops.filter(p => p.id !== popToDelete.id));
        toast({
          title: t('pops.delete_success_toast_title'),
          description: t('pops.delete_success_toast_description'),
          variant: 'destructive'
        });
        setPopToDelete(null);
        setIsLoading(false);
      }, 500);
    }
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

  function safeToDate(value: any): Date | null {
    if (!value) return null;
  
    if (value instanceof Date) return value;
  
    // Firestore Timestamp check
    if (typeof value.toDate === 'function') return value.toDate();
  
    // ISO string or number fallback
    try {
      const date = new Date(value);
      return isNaN(date.getTime()) ? null : date;
    } catch {
      return null;
    }
  }
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold">{t('pops.title')}</h1>

        <div className="flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={refetchPops}
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90"
          >
            {isLoading ? <Loader2 className={`mr-2 ${iconSize} animate-spin`} /> : <RefreshCw className={`mr-2 ${iconSize}`} />}
            {t('pops.refresh_button')}
          </Button>

          <Dialog open={isAddModalOpen} onOpenChange={(isOpen) => {
            setIsAddModalOpen(isOpen);
            if (!isOpen) {
              setEditingPop(null);
              form.reset({ name: '', location: '', status: 'Active' });
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
                    <DialogClose asChild><Button type="button" variant="outline" disabled={isLoading}>{t('pops.form_cancel_button')}</Button></DialogClose>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading && <Loader2 className={`mr-2 ${iconSize} animate-spin`} />}
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
          {isLoading && pops.length === 0 ? ( // Show skeleton only on initial load
            <div className="space-y-3 py-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
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
                      <TableCell className="font-mono text-muted-foreground text-xs text-center">{(pop.id as string).toString().substring(0, 8)}</TableCell>
                      <TableCell className="font-medium text-xs text-center">{pop.name}</TableCell>
                      <TableCell className="text-muted-foreground text-xs text-center">{pop.location}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={getStatusBadgeVariant(pop.status)} className="text-xs">
                          {pop.status ? t(`pops.form_status_${pop.status.toLowerCase()}` as any, pop.status) : t('pops.status_unknown')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs text-center">
                        {
                          safeToDate(pop.createdAt)?.toLocaleDateString() ?? 'N/A'
                        }
                      </TableCell>
                      <TableCell className="text-center">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditPop(pop)} disabled={isLoading}>
                          <Pencil className={iconSize} />
                        </Button>
                        <AlertDialog open={!!popToDelete && popToDelete.id === pop.id} onOpenChange={(open) => !open && setPopToDelete(null)}>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDeleteClick(pop)} disabled={isLoading}>
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
                                disabled={isLoading}
                              >
                                {isLoading ? <Loader2 className={`mr-2 ${iconSize} animate-spin`} /> : null}
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
