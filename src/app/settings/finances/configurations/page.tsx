// src/app/settings/finances/configurations/page.tsx
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from '@/components/ui/switch';
import { PlusCircle, Trash2, Loader2, CalendarIcon, RefreshCw, ChevronRight, ChevronLeft } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { enUS, fr, ptBR } from 'date-fns/locale';
import { cn } from "@/lib/utils";
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { getPops } from '@/services/mysql/pops';
import type { Pop } from '@/types/pops';
import { Skeleton } from '@/components/ui/skeleton';

const dateLocales: Record<string, typeof enUS> = {
    en: enUS,
    fr: fr,
    pt: ptBR,
};

const billingDateSchema = z.object({
  date: z.date({ required_error: "Date is required." }),
  status: z.boolean().default(true),
  permittedPopIds: z.array(z.string()).min(1, "At least one PoP must be permitted."),
});

type BillingDateFormData = z.infer<typeof billingDateSchema>;

interface BillingDate extends BillingDateFormData {
  id: string;
  activeContracts: number; // Placeholder
}

const placeholderBillingDates: BillingDate[] = [
  { id: 'bd-1', date: new Date(2024, 0, 1), status: true, permittedPopIds: ['sim-1'], activeContracts: 120 },
  { id: 'bd-2', date: new Date(2024, 0, 15), status: true, permittedPopIds: ['sim-1', 'sim-2'], activeContracts: 85 },
  { id: 'bd-3', date: new Date(2024, 0, 28), status: false, permittedPopIds: ['sim-3'], activeContracts: 0 },
];

const queryClient = new QueryClient();

export default function FinancialConfigurationsPageWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <FinancialConfigurationsPage />
    </QueryClientProvider>
  );
}

function FinancialConfigurationsPage() {
  const { t, locale } = useLocale();
  const { toast } = useToast();
  const [billingDates, setBillingDates] = React.useState<BillingDate[]>(placeholderBillingDates);
  const [isAddDateModalOpen, setIsAddDateModalOpen] = React.useState(false);
  const [dateToDelete, setDateToDelete] = React.useState<BillingDate | null>(null);

  const iconSize = "h-3 w-3";

  const { data: pops = [], isLoading: isLoadingPops, error: popsError } = useQuery<Pop[], Error>({
    queryKey: ['pops'],
    queryFn: getPops,
  });

  const addDateForm = useForm<BillingDateFormData>({
    resolver: zodResolver(billingDateSchema),
    defaultValues: {
      date: new Date(),
      status: true,
      permittedPopIds: [],
    },
  });

  const handleAddDateSubmit = (data: BillingDateFormData) => {
    const newBillingDate: BillingDate = {
      ...data,
      id: `bd-${Date.now()}`,
      activeContracts: 0, // New dates start with 0 contracts
    };
    setBillingDates(prev => [newBillingDate, ...prev].sort((a,b) => a.date.getTime() - b.date.getTime()));
    toast({
      title: t('financial_configs.add_date_success_title'),
      description: t('financial_configs.add_date_success_description', 'Billing date {date} added.').replace('{date}', format(data.date, "PP", { locale: dateLocales[locale] || enUS })),
    });
    addDateForm.reset();
    setIsAddDateModalOpen(false);
  };

  const confirmDeleteDate = () => {
    if (dateToDelete) {
      setBillingDates(prev => prev.filter(d => d.id !== dateToDelete.id));
      toast({
        title: t('financial_configs.delete_date_success_title'),
        description: t('financial_configs.delete_date_success_description', 'Billing date {date} deleted.').replace('{date}', format(dateToDelete.date, "PP", { locale: dateLocales[locale] || enUS })),
        variant: 'destructive',
      });
      setDateToDelete(null);
    }
  };

  const toggleBillingDateStatus = (id: string, currentStatus: boolean) => {
    setBillingDates(prev => prev.map(bd => bd.id === id ? { ...bd, status: !currentStatus } : bd));
    toast({
      title: t('financial_configs.status_change_toast_title'),
      description: t('financial_configs.status_change_toast_description', 'Status updated.'),
    });
  };
  
  const [selectedAvailablePop, setSelectedAvailablePop] = React.useState<string | null>(null);
  const [selectedPermittedPop, setSelectedPermittedPop] = React.useState<string | null>(null);

  const availablePops = React.useMemo(() => {
    const permittedIds = addDateForm.watch('permittedPopIds') || [];
    return pops.filter(pop => !permittedIds.includes(pop.id.toString()));
  }, [pops, addDateForm.watch('permittedPopIds')]);

  const permittedPopsDetails = React.useMemo(() => {
    const permittedIds = addDateForm.watch('permittedPopIds') || [];
    return pops.filter(pop => permittedIds.includes(pop.id.toString()));
  }, [pops, addDateForm.watch('permittedPopIds')]);

  const handleAddPopToPermitted = () => {
    if (selectedAvailablePop) {
      const currentPermitted = addDateForm.getValues('permittedPopIds') || [];
      addDateForm.setValue('permittedPopIds', [...currentPermitted, selectedAvailablePop], { shouldValidate: true });
      setSelectedAvailablePop(null);
    }
  };

  const handleRemovePopFromPermitted = () => {
    if (selectedPermittedPop) {
      const currentPermitted = addDateForm.getValues('permittedPopIds') || [];
      addDateForm.setValue('permittedPopIds', currentPermitted.filter(id => id !== selectedPermittedPop), { shouldValidate: true });
      setSelectedPermittedPop(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-base font-semibold">{t('sidebar.finances_config')}</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{t('financial_configs.billing_dates_title')}</CardTitle>
          <CardDescription className="text-xs">{t('financial_configs.billing_dates_description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md min-h-[200px] p-4">
            {billingDates.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">{t('financial_configs.table_header_date')}</TableHead>
                    <TableHead className="text-xs text-center">{t('financial_configs.table_header_active_contracts')}</TableHead>
                    <TableHead className="text-xs">{t('financial_configs.table_header_status')}</TableHead>
                    <TableHead className="text-right w-20 text-xs">{t('financial_configs.table_header_actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {billingDates.map((bd) => (
                    <TableRow key={bd.id}>
                      <TableCell className="text-xs">{format(bd.date, "PP", { locale: dateLocales[locale] || enUS })}</TableCell>
                      <TableCell className="text-xs text-center">{bd.activeContracts}</TableCell>
                      <TableCell className="text-xs">
                        <Switch
                          checked={bd.status}
                          onCheckedChange={() => toggleBillingDateStatus(bd.id, bd.status)}
                          aria-label={t('financial_configs.toggle_status_aria_label')}
                        />
                         <span className="ml-2 text-xs">{bd.status ? t('financial_configs.status_active') : t('financial_configs.status_inactive')}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive">
                              <Trash2 className={iconSize} />
                              <span className="sr-only">{t('financial_configs.action_delete')}</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>{t('financial_configs.delete_confirm_title')}</AlertDialogTitle>
                              <AlertDialogDescription className="text-xs">
                                {t('financial_configs.delete_confirm_description', 'This will permanently delete the billing date {date}.').replace('{date}', format(bd.date, "PP", { locale: dateLocales[locale] || enUS}))}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setDateToDelete(null)}>{t('financial_configs.delete_confirm_cancel')}</AlertDialogCancel>
                              <AlertDialogAction
                                className={buttonVariants({ variant: "destructive" })}
                                onClick={() => {
                                  setDateToDelete(bd);
                                  confirmDeleteDate();
                                }}
                              >
                                {t('financial_configs.delete_confirm_delete')}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-muted-foreground py-4 text-xs">{t('financial_configs.no_billing_dates')}</p>
            )}
          </div>
          <div className="mt-4">
            <Dialog open={isAddDateModalOpen} onOpenChange={setIsAddDateModalOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <PlusCircle className={`mr-2 ${iconSize}`} /> {t('financial_configs.add_date_button')}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-sm">{t('financial_configs.add_date_modal_title')}</DialogTitle>
                  <DialogDescription className="text-xs">{t('financial_configs.add_date_modal_description')}</DialogDescription>
                </DialogHeader>
                <Form {...addDateForm}>
                  <form onSubmit={addDateForm.handleSubmit(handleAddDateSubmit)} className="grid gap-4 py-4">
                    <FormField
                      control={addDateForm.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>{t('financial_configs.form_date_label')}</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "pl-3 text-left font-normal text-xs",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? format(field.value, "PPP", { locale: dateLocales[locale] || enUS }) : <span>{t('financial_configs.form_date_placeholder')}</span>}
                                  <CalendarIcon className={`ml-auto ${iconSize} opacity-50`} />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={addDateForm.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                           <div className="space-y-0.5">
                             <FormLabel>{t('financial_configs.form_status_label')}</FormLabel>
                             <DialogDescription className="text-xs">
                               {field.value ? t('financial_configs.form_status_active_desc') : t('financial_configs.form_status_inactive_desc')}
                             </DialogDescription>
                           </div>
                           <FormControl>
                             <Switch
                               checked={field.value}
                               onCheckedChange={field.onChange}
                             />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Permitted PoPs Selection */}
                    <FormField
                      control={addDateForm.control}
                      name="permittedPopIds"
                      render={({ field }) => ( // field is not directly used here, but necessary for FormField
                        <FormItem>
                           <FormLabel>{t('financial_configs.form_permitted_pops_label')}</FormLabel>
                           <div className="grid grid-cols-3 items-center gap-2">
                             <div className="col-span-1 border rounded-md p-2 h-40 overflow-y-auto">
                               <p className="text-xs font-medium mb-1">{t('financial_configs.form_available_pops_label')}</p>
                               {isLoadingPops ? <Skeleton className="h-20 w-full" /> : popsError ? <p className="text-destructive text-xs">{t('financial_configs.form_pops_load_error')}</p> : (
                                 availablePops.length > 0 ? availablePops.map(pop => (
                                   <div key={pop.id.toString()}
                                     className={cn("p-1.5 text-xs rounded-sm cursor-pointer hover:bg-muted", selectedAvailablePop === pop.id.toString() && "bg-accent text-accent-foreground")}
                                     onClick={() => setSelectedAvailablePop(pop.id.toString())}>
                                     {pop.name}
                                   </div>
                                 )) : <p className="text-xs text-muted-foreground text-center pt-4">{t('financial_configs.form_no_available_pops')}</p>
                               )}
                             </div>
                             <div className="col-span-1 flex flex-col items-center justify-center gap-2">
                               <Button type="button" size="icon" variant="outline" onClick={handleAddPopToPermitted} disabled={!selectedAvailablePop || isLoadingPops}>
                                 <ChevronRight className={iconSize} />
                                 <span className="sr-only">{t('financial_configs.form_add_pop_button_sr')}</span>
                               </Button>
                               <Button type="button" size="icon" variant="outline" onClick={handleRemovePopFromPermitted} disabled={!selectedPermittedPop || isLoadingPops}>
                                 <ChevronLeft className={iconSize} />
                                 <span className="sr-only">{t('financial_configs.form_remove_pop_button_sr')}</span>
                               </Button>
                             </div>
                             <div className="col-span-1 border rounded-md p-2 h-40 overflow-y-auto">
                               <p className="text-xs font-medium mb-1">{t('financial_configs.form_selected_pops_label')}</p>
                               {permittedPopsDetails.length > 0 ? permittedPopsDetails.map(pop => (
                                  <div key={pop.id.toString()}
                                    className={cn("p-1.5 text-xs rounded-sm cursor-pointer hover:bg-muted", selectedPermittedPop === pop.id.toString() && "bg-accent text-accent-foreground")}
                                    onClick={() => setSelectedPermittedPop(pop.id.toString())}>
                                    {pop.name}
                                  </div>
                               )) : <p className="text-xs text-muted-foreground text-center pt-4">{t('financial_configs.form_no_selected_pops')}</p>}
                             </div>
                           </div>
                           <FormMessage /> {/* For permittedPopIds validation error */}
                        </FormItem>
                      )}
                    />
                    
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" variant="outline" disabled={addDateForm.formState.isSubmitting}>{t('financial_configs.form_cancel_button')}</Button>
                      </DialogClose>
                      <Button type="submit" disabled={addDateForm.formState.isSubmitting}>
                        {addDateForm.formState.isSubmitting && <Loader2 className={`mr-2 ${iconSize} animate-spin`} />}
                        {t('financial_configs.form_save_button')}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
