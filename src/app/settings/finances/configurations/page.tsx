// src/app/settings/finances/configurations/page.tsx
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  // CardDescription, // Removed
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription as DialogDescriptionComponent, // Renamed to avoid conflict with CardDescription
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
// import { Calendar } from "@/components/ui/calendar"; // No longer needed for day of month
// import {
//     Popover,
//     PopoverContent,
//     PopoverTrigger,
// } from "@/components/ui/popover"; // No longer needed for day of month
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
import { PlusCircle, Trash2, Loader2, RefreshCw, ChevronRight, ChevronLeft } from 'lucide-react'; // CalendarIcon removed
import { useLocale } from '@/contexts/LocaleContext';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
// import { format } from 'date-fns'; // Not directly needed for day of month display
// import { enUS, fr, ptBR } from 'date-fns/locale'; // Not directly needed
import { cn } from "@/lib/utils";
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { getPops } from '@/services/mysql/pops'; // Changed to MySQL service
import type { Pop } from '@/types/pops';
import { Skeleton } from '@/components/ui/skeleton';

// const dateLocales: Record<string, typeof enUS> = {
//     en: enUS,
//     fr: fr,
//     pt: ptBR,
// };

const dayOfMonthSchema = z.union([
  z.coerce.number().int().min(1).max(31),
  z.literal('Last Day')
]);

const billingDaySchema = z.object({
  dayOfMonth: dayOfMonthSchema,
  status: z.boolean().default(true),
  permittedPopIds: z.array(z.string()).min(1, "At least one PoP must be permitted."),
});

type BillingDayFormData = z.infer<typeof billingDaySchema>;

interface BillingDay extends BillingDayFormData {
  id: string;
  activeContracts: number; // Added activeContracts
}

const placeholderBillingDays: BillingDay[] = [
  { id: 'bd-1', dayOfMonth: 1, status: true, permittedPopIds: ['1'], activeContracts: 120 }, // Assuming sim-1 is ID 1
  { id: 'bd-2', dayOfMonth: 15, status: true, permittedPopIds: ['1', '2'], activeContracts: 75 }, // Assuming sim-2 is ID 2
  { id: 'bd-3', dayOfMonth: 'Last Day', status: false, permittedPopIds: ['3'], activeContracts: 0 }, // Assuming sim-3 is ID 3
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
  const { t } = useLocale(); // locale removed as date formatting is not the primary display
  const { toast } = useToast();
  const [billingDays, setBillingDays] = React.useState<BillingDay[]>(placeholderBillingDays);
  const [isAddDayModalOpen, setIsAddDayModalOpen] = React.useState(false);
  const [dayToDelete, setDayToDelete] = React.useState<BillingDay | null>(null);

  const iconSize = "h-3 w-3";

  const { data: pops = [], isLoading: isLoadingPops, error: popsError } = useQuery<Pop[], Error>({
    queryKey: ['pops'],
    queryFn: getPops,
  });

  const addDayForm = useForm<BillingDayFormData>({
    resolver: zodResolver(billingDaySchema),
    defaultValues: {
      dayOfMonth: 1, // Default to 1st day
      status: true,
      permittedPopIds: [],
    },
  });

  const handleAddDaySubmit = (data: BillingDayFormData) => {
    const newBillingDay: BillingDay = {
      ...data,
      id: `bd-${Date.now()}`,
      activeContracts: 0, // New days start with 0 active contracts
    };
    setBillingDays(prev => [...prev, newBillingDay].sort((a, b) => {
        const dayA = a.dayOfMonth === 'Last Day' ? 32 : a.dayOfMonth; // Treat 'Last Day' as 32 for sorting
        const dayB = b.dayOfMonth === 'Last Day' ? 32 : b.dayOfMonth;
        return dayA - dayB;
    }));
    toast({
      title: t('financial_configs.add_day_success_title', 'Billing Day Added'),
      description: t('financial_configs.add_day_success_description', 'Billing day "{dayOfMonth}" added.').replace('{dayOfMonth}', data.dayOfMonth.toString()),
    });
    addDayForm.reset();
    setIsAddDayModalOpen(false);
  };

  const confirmDeleteDay = () => {
    if (dayToDelete) {
      setBillingDays(prev => prev.filter(d => d.id !== dayToDelete.id));
      toast({
        title: t('financial_configs.delete_day_success_title', 'Billing Day Deleted'),
        description: t('financial_configs.delete_day_success_description', 'Billing day "{dayOfMonth}" deleted.').replace('{dayOfMonth}', dayToDelete.dayOfMonth.toString()),
        variant: 'destructive',
      });
      setDayToDelete(null);
    }
  };

  const toggleBillingDayStatus = (id: string, currentStatus: boolean) => {
    setBillingDays(prev => prev.map(bd => bd.id === id ? { ...bd, status: !currentStatus } : bd));
    toast({
      title: t('financial_configs.status_change_toast_title'),
      description: t('financial_configs.status_change_toast_description'),
    });
  };
  
  const [selectedAvailablePop, setSelectedAvailablePop] = React.useState<string | null>(null);
  const [selectedPermittedPop, setSelectedPermittedPop] = React.useState<string | null>(null);

  const availablePops = React.useMemo(() => {
    const permittedIds = addDayForm.watch('permittedPopIds') || [];
    return pops.filter(pop => !permittedIds.includes(pop.id.toString()));
  }, [pops, addDayForm.watch('permittedPopIds')]);

  const permittedPopsDetails = React.useMemo(() => {
    const permittedIds = addDayForm.watch('permittedPopIds') || [];
    return pops.filter(pop => permittedIds.includes(pop.id.toString()));
  }, [pops, addDayForm.watch('permittedPopIds')]);

  const handleAddPopToPermitted = () => {
    if (selectedAvailablePop) {
      const currentPermitted = addDayForm.getValues('permittedPopIds') || [];
      addDayForm.setValue('permittedPopIds', [...currentPermitted, selectedAvailablePop], { shouldValidate: true });
      setSelectedAvailablePop(null);
    }
  };

  const handleRemovePopFromPermitted = () => {
    if (selectedPermittedPop) {
      const currentPermitted = addDayForm.getValues('permittedPopIds') || [];
      addDayForm.setValue('permittedPopIds', currentPermitted.filter(id => id !== selectedPermittedPop), { shouldValidate: true });
      setSelectedPermittedPop(null);
    }
  };

  const dayOfMonthOptions = React.useMemo(() => {
    const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
    days.push('Last Day');
    return days;
  }, []);


  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-base font-semibold">{t('sidebar.finances_config')}</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{t('financial_configs.billing_dates_title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md min-h-[200px] p-4">
            {billingDays.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">{t('financial_configs.table_header_day_of_month', 'Day of Month')}</TableHead>
                    <TableHead className="text-xs">{t('financial_configs.table_header_active_contracts', 'Active Contracts')}</TableHead>
                    <TableHead className="text-xs">{t('financial_configs.table_header_status')}</TableHead>
                    <TableHead className="text-right w-20 text-xs">{t('financial_configs.table_header_actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {billingDays.map((bd) => (
                    <TableRow key={bd.id}>
                      <TableCell className="text-xs">
                        {bd.dayOfMonth === 'Last Day' ? t('financial_configs.day_last', 'Last Day') : bd.dayOfMonth}
                      </TableCell>
                      <TableCell className="text-xs text-center">{bd.activeContracts}</TableCell>
                      <TableCell className="text-xs">
                        <Switch
                          checked={bd.status}
                          onCheckedChange={() => toggleBillingDayStatus(bd.id, bd.status)}
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
                                {t('financial_configs.delete_confirm_description_day', 'This will permanently delete the billing day rule for "{dayOfMonth}".').replace('{dayOfMonth}', bd.dayOfMonth.toString())}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setDayToDelete(null)}>{t('financial_configs.delete_confirm_cancel')}</AlertDialogCancel>
                              <AlertDialogAction
                                className={buttonVariants({ variant: "destructive" })}
                                onClick={() => {
                                  setDayToDelete(bd);
                                  confirmDeleteDay();
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
              <p className="text-center text-muted-foreground py-4 text-xs">{t('financial_configs.no_billing_days')}</p>
            )}
          </div>
          <div className="mt-4">
            <Dialog open={isAddDayModalOpen} onOpenChange={setIsAddDayModalOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <PlusCircle className={`mr-2 ${iconSize}`} /> {t('financial_configs.add_day_button', 'Add Billing Day')}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-sm">{t('financial_configs.add_day_modal_title', 'Add New Billing Day')}</DialogTitle>
                  <DialogDescriptionComponent className="text-xs">{t('financial_configs.add_day_modal_description', 'Configure a new day of the month for billing cycles.')}</DialogDescriptionComponent>
                </DialogHeader>
                <Form {...addDayForm}>
                  <form onSubmit={addDayForm.handleSubmit(handleAddDaySubmit)} className="grid gap-4 py-4">
                    <FormField
                      control={addDayForm.control}
                      name="dayOfMonth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('financial_configs.form_day_of_month_label', 'Day of Month')}</FormLabel>
                           <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t('financial_configs.form_day_of_month_placeholder', 'Select a day')} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {dayOfMonthOptions.map(day => (
                                <SelectItem key={day} value={day}>
                                  {day === 'Last Day' ? t('financial_configs.day_last', 'Last Day') : day}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={addDayForm.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                           <div className="space-y-0.5">
                             <FormLabel>{t('financial_configs.form_status_label')}</FormLabel>
                             <DialogDescriptionComponent className="text-xs">
                               {field.value ? t('financial_configs.form_status_active_desc') : t('financial_configs.form_status_inactive_desc')}
                             </DialogDescriptionComponent>
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
                      control={addDayForm.control}
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
                        <Button type="button" variant="outline" disabled={addDayForm.formState.isSubmitting}>{t('financial_configs.form_cancel_button')}</Button>
                      </DialogClose>
                      <Button type="submit" disabled={addDayForm.formState.isSubmitting}>
                        {addDayForm.formState.isSubmitting && <Loader2 className={`mr-2 ${iconSize} animate-spin`} />}
                        {t('financial_configs.form_save_button_day', 'Save Billing Day')}
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

