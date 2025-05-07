// src/app/subscribers/profile/[id]/page.tsx
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Building, Server as ServerIcon, DollarSign, Wrench, Package, Edit, Trash2, PlusCircle, Loader2, FileText, ClipboardList, History as HistoryIcon, Filter, CheckCircle, XCircle, Clock, Combine, Home, Phone, Mail, Fingerprint, CalendarDays, Briefcase, MapPinIcon, MoreVertical, CalendarClock, Handshake, Wifi, Tv, Smartphone, PhoneCall, ListFilter as ListFilterIcon, BadgeDollarSign, CircleDollarSign, FileWarning } from 'lucide-react'; // Added ListFilterIcon
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator, // Import Separator
} from "@/components/ui/dropdown-menu"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { getPops } from '@/services/mysql/pops';
import type { Pop } from '@/types/pops';
import { Skeleton } from '@/components/ui/skeleton';
import { useLocale } from '@/contexts/LocaleContext';
import { format, type Locale as DateFnsLocale } from 'date-fns'; // Keep format import, import Locale as DateFnsLocale
import { fr as frLocale, ptBR as ptBRLocale, enUS as enUSLocale } from 'date-fns/locale'; // Corrected import path for locales
import { Badge } from '@/components/ui/badge';


// Validation Schema for the Add Service form
const addServiceSchema = z.object({
  serviceType: z.enum(['Internet', 'TV', 'Phone', 'Mobile', 'Combo', 'Other'], {
    required_error: 'Service type is required',
  }),
  popId: z.string().min(1, 'PoP selection is required'),
});

type AddServiceFormData = z.infer<typeof addServiceSchema>;

// Types for service filtering
type ServiceTypeFilter = 'All' | 'Internet' | 'TV' | 'Landline' | 'Mobile' | 'Combo';
// Types for inventory filtering
type InventoryFilter = 'All' | 'Lent' | 'Sold';
// Types for billing filtering - Added 'All', Renamed 'Past' to 'Paid'
type BillingFilter = 'All' | 'Pending' | 'Paid' | 'Canceled' | 'PaymentPlan' | 'PromiseToPay';


// Placeholder data - replace with actual data fetching based on ID
const getSubscriberData = (id: string | string[]) => {
    console.log("Fetching data for subscriber ID:", id);
    const baseData = {
        id: id.toString(),
        name: `Subscriber ${id}`,
        type: 'Residential',
        status: 'Active',
        address: '123 Placeholder St, Anytown, USA 12345',
        email: `subscriber${id}@example.com`,
        phone: `555-0${id}`,
        landline: `555-1${id}`,
        birthday: new Date(1990, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        taxId: `XXX.XXX.XXX-${Math.floor(Math.random() * 90) + 10}`,
        idNumber: `ID-${Math.floor(Math.random() * 100000)}`,
        signupDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        companyName: '',
        establishedDate: null as Date | null,
        businessNumber: '',
        services: [
            { id: 'svc-1', type: 'Internet', plan: 'Fiber 100', popId: 'sim-1', status: 'Active' },
            { id: 'svc-2', type: 'TV', plan: 'Basic Cable', popId: 'sim-1', status: 'Active' },
            { id: 'svc-4', type: 'Landline', plan: 'Unlimited Local', popId: 'sim-1', status: 'Active' },
            { id: 'svc-5', type: 'Mobile', plan: '5GB Data Plan', popId: 'sim-1', status: 'Inactive' },
            { id: 'svc-6', type: 'Combo', plan: 'Internet + TV Basic', popId: 'sim-1', status: 'Active' },
        ],
        billing: {
            balance: 50.00,
            nextBillDate: '2024-08-15',
            pastInvoices: [ // These are now considered "Paid" invoices
                { id: 'inv-001', date: '2024-07-15', amount: 50.00, status: 'Paid' },
                { id: 'inv-002', date: '2024-06-15', amount: 50.00, status: 'Paid' },
            ],
            canceledInvoices: [
                { id: 'inv-c01', date: '2024-05-20', amount: 25.00, reason: 'Service change', status: 'Canceled' },
            ],
            pendingInvoices: [
                 { id: 'inv-p01', date: '2024-08-15', amount: 50.00, status: 'Due' }
            ],
            paymentPlans: [
                {id: 'pp-1', startDate: '2024-07-01', installments: 3, installmentAmount: 25.00, status: 'Active'},
            ],
            promisesToPay: [
                {id: 'ptp-1', promiseDate: '2024-08-10', amount: 50.00, status: 'Pending'},
            ]
        },
        serviceCalls: [
            { id: 'sc-1', date: '2024-07-10', issue: 'Slow internet', status: 'Resolved' },
        ],
        inventory: [
            { id: 'inv-1', type: 'Router', model: 'Netgear R7000', serial: 'XYZ123', status: 'Lent' },
            { id: 'inv-2', type: 'Modem', model: 'Arris SB8200', serial: 'ABC789', status: 'Lent' },
            { id: 'inv-3', type: 'Remote', model: 'Basic', serial: 'DEF456', status: 'Sold' },
        ],
        documents: [
             { id: 'doc-1', name: 'Contract Agreement.pdf', uploaded: '2024-01-15' },
        ],
        notes: [
             { id: 'note-1', text: 'Called regarding billing query on 2024-07-20.', author: 'Support Agent', date: '2024-07-20' },
        ],
        history: [
            { id: 'hist-1', event: 'Subscriber Created', user: 'Admin', timestamp: '2024-01-10 10:00:00' },
            { id: 'hist-2', event: 'Service Added: Internet', user: 'System', timestamp: '2024-01-10 10:05:00' },
        ],
    };

    if (id === 'sub-1') {
        baseData.name = 'Alice Wonderland';
        baseData.address = '123 Fantasy Lane, Wonderland, WND 12345';
        baseData.email = 'alice@example.com';
        baseData.phone = '555-1111';
        baseData.landline = '555-1010';
        baseData.birthday = new Date(1985, 3, 15);
        baseData.taxId = '123.456.789-00';
        baseData.idNumber = 'ID-ALICE-001';
        baseData.signupDate = new Date(2022, 0, 10);
        baseData.billing.balance = 0.00;
        baseData.billing.pendingInvoices = [];
    } else if (id === 'sub-2') {
        baseData.name = 'Bob The Builder Inc.';
        baseData.type = 'Commercial';
        baseData.companyName = 'Bob The Builder Inc.';
        baseData.address = '456 Construction Ave, Builderville, BLD 67890';
        baseData.email = 'bob@example.com';
        baseData.phone = '555-2222';
        baseData.landline = '555-2020';
        baseData.establishedDate = new Date(2005, 7, 20);
        baseData.businessNumber = '98.765.432/0001-00';
        baseData.idNumber = 'ID-BOBINC-002';
        baseData.signupDate = new Date(2021, 5, 1);
        baseData.birthday = null as Date | null;
        baseData.taxId = '';
        baseData.services = [
             { id: 'svc-3', type: 'Internet', plan: 'Business Fiber 1G', popId: 'sim-2', status: 'Active' }
        ];
        baseData.billing.balance = 150.75;
        baseData.billing.pendingInvoices = [
             { id: 'inv-p02', date: '2024-08-15', amount: 150.75, status: 'Due' }
        ]
    }

    return baseData;
};

const queryClient = new QueryClient();

export default function SubscriberProfilePageWrapper() {
    return (
        <QueryClientProvider client={queryClient}>
            <SubscriberProfilePage />
        </QueryClientProvider>
    );
}

const dateLocales: Record<string, DateFnsLocale> = {
  en: enUSLocale,
  fr: frLocale,
  pt: ptBRLocale,
};

const OverviewDetailItem: React.FC<{icon: React.ElementType, label: string, value?: string | null | Date}> = ({icon: Icon, label, value}) => {
  const { t, locale } = useLocale();
  const iconSize = "h-3 w-3"; // Reduced icon size for detail items
  return (
    <div className="flex items-start gap-3">
        <Icon className={`${iconSize} text-muted-foreground mt-1`} />
        <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-xs font-medium"> {/* Main value font size to text-xs */}
                {value instanceof Date ? format(value, 'PP', { locale: dateLocales[locale] || enUSLocale }) : value || t('subscriber_profile.not_available')}
            </p>
        </div>
    </div>
  );
};

const OverviewSection: React.FC<{title: string, icon: React.ElementType, children: React.ReactNode}> = ({title, icon: Icon, children}) => {
    const iconSize = "h-3 w-3"; // Reduced icon size for section icon
    return (
        <fieldset className="border border-border rounded-md p-4 pt-2 space-y-4">
            <legend className="text-sm font-semibold px-2 flex items-center gap-2"> {/* Reduced legend font size */}
                <Icon className={`${iconSize} text-primary`} />
                {title}
            </legend>
            {children}
        </fieldset>
    );
};


function SubscriberProfilePage() {
  const params = useParams();
  const subscriberId = params.id;
  const { toast } = useToast();
  const { t, locale } = useLocale();
  const [isAddServiceDialogOpen, setIsAddServiceDialogOpen] = React.useState(false);
  const [activeServiceTab, setActiveServiceTab] = React.useState<ServiceTypeFilter>('All');
  const [activeInventoryTab, setActiveInventoryTab] = React.useState<InventoryFilter>('All');
  const [activeBillingTab, setActiveBillingTab] = React.useState<BillingFilter>('Pending'); // Default to pending
  const iconSize = "h-3 w-3"; // Reduced icon size for general use
  const tabIconSize = "h-2.5 w-2.5"; // Even smaller for tabs, reduced


  const { data: pops = [], isLoading: isLoadingPops, error: popsError } = useQuery<Pop[], Error>({
    queryKey: ['pops'],
    queryFn: getPops,
  });

  const addServiceForm = useForm<AddServiceFormData>({
    resolver: zodResolver(addServiceSchema),
    defaultValues: {
      serviceType: undefined,
      popId: '',
    },
  });

  const subscriber = React.useMemo(() => getSubscriberData(subscriberId), [subscriberId]);

  const hasOutstandingBalance = React.useMemo(() =>
    (subscriber?.billing?.balance ?? 0) > 0 || (subscriber?.billing?.pendingInvoices?.length ?? 0) > 0,
  [subscriber?.billing]);

  const handleEdit = () => {
    console.log("Edit subscriber:", subscriberId);
    toast({
      title: t('subscriber_profile.edit_toast_title'),
      description: t('subscriber_profile.edit_toast_description', 'Editing for {name} is not yet functional.').replace('{name}', subscriber.name)
    });
  };

  const handleDelete = () => {
    console.log("Delete subscriber:", subscriberId);
    toast({
      title: t('subscriber_profile.delete_toast_title'),
      description: t('subscriber_profile.delete_toast_description', 'Deletion for {name} is not yet functional.').replace('{name}', subscriber.name),
      variant: "destructive"
    });
  };

  const handleAddServiceSubmit = (data: AddServiceFormData) => {
    console.log('Add Service Data:', data, 'for subscriber:', subscriberId);
    addServiceForm.reset();
    setIsAddServiceDialogOpen(false);
    toast({
      title: t('subscriber_profile.add_service_success_toast_title'),
      description: t('subscriber_profile.add_service_success_toast_description', '{serviceType} service added for {name}.')
        .replace('{serviceType}', data.serviceType)
        .replace('{name}', subscriber.name),
    });
  };

  const handleServiceAction = (action: 'sign' | 'cancel' | 'print_service_contract' | 'print_responsibility_term' | 'print_cancelation_term' | 'transfer_contract', serviceId: string) => {
    console.log(`${action} for service ${serviceId}`);
    toast({
      title: `${t(`subscriber_profile.service_action_${action}` as any, action.replace(/_/g, ' '))} (Simulated)`,
      description: `Action for service ${serviceId} is not yet implemented.`,
    });
  };

  const filteredServices = React.useMemo(() => {
    if (!subscriber?.services) return [];
    if (activeServiceTab === 'All') return subscriber.services;
    return subscriber.services.filter(service => service.type === activeServiceTab);
  }, [subscriber?.services, activeServiceTab]);

  const filteredInventory = React.useMemo(() => {
    if (!subscriber?.inventory) return [];
    if (activeInventoryTab === 'All') return subscriber.inventory;
    return subscriber.inventory.filter(item => item.status === activeInventoryTab);
  }, [subscriber?.inventory, activeInventoryTab]);

  // Combine all invoices for the "All" tab
  const allInvoices = React.useMemo(() => {
    if (!subscriber?.billing) return [];
    return [
      ...(subscriber.billing.pendingInvoices || []),
      ...(subscriber.billing.pastInvoices || []), // These are "Paid" invoices
      ...(subscriber.billing.canceledInvoices || []),
    ];
  }, [subscriber?.billing]);

  const filteredBillingItems = React.useMemo(() => {
    if (!subscriber?.billing) return [];
    switch (activeBillingTab) {
      case 'All':
        return allInvoices;
      case 'Pending':
        return subscriber.billing.pendingInvoices || [];
      case 'Paid':
        return subscriber.billing.pastInvoices || []; // "Past" is now "Paid"
      case 'Canceled':
        return subscriber.billing.canceledInvoices || [];
      case 'PaymentPlan':
        return subscriber.billing.paymentPlans || [];
      case 'PromiseToPay':
        return subscriber.billing.promisesToPay || [];
      default:
        return [];
    }
  }, [subscriber?.billing, activeBillingTab, allInvoices]);

  const getInvoiceStatusBadge = (status?: string) => {
    if (!status) return null;
    switch (status.toLowerCase()) {
      case 'paid':
        return <Badge variant="default" className="bg-green-100 text-green-800 text-xs">{t('subscriber_profile.invoice_status_paid', 'Paid')}</Badge>;
      case 'due':
        return <Badge variant="destructive" className="text-xs">{t('subscriber_profile.invoice_status_due', 'Due')}</Badge>;
      case 'canceled':
        return <Badge variant="secondary" className="text-xs">{t('subscriber_profile.invoice_status_canceled', 'Canceled')}</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{status}</Badge>;
    }
  };


  if (!subscriber) {
    return (
        <div className="flex flex-col gap-6">
             <Skeleton className="h-24 w-full" />
             <Skeleton className="h-10 w-full" />
             <Skeleton className="h-64 w-full" />
             <p>{t('subscriber_profile.loading_skeleton', 'Loading...')}</p>
        </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            {subscriber.type === 'Residential' ? (
              <User className="h-4 w-4 text-muted-foreground" /> {/* Main profile icon size reduced */}
            ) : (
              <Building className="h-4 w-4 text-muted-foreground" />
            )}
            <div>
              <CardTitle className="text-base">{subscriber.type === 'Residential' ? subscriber.name : subscriber.companyName}  (ID: {subscriber.id})</CardTitle> {/* Title font size reduced */}
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 md:grid-cols-8">
          <TabsTrigger value="overview">
            <User className={`mr-1.5 ${tabIconSize}`} /> {t('subscriber_profile.overview_tab')}
          </TabsTrigger>
          <TabsTrigger value="services">
             <ServerIcon className={`mr-1.5 ${tabIconSize}`} /> {t('subscriber_profile.services_tab')}
          </TabsTrigger>
          <TabsTrigger value="billing">
             <DollarSign className={`mr-1.5 ${tabIconSize}`} /> {t('subscriber_profile.billing_tab')}
              {hasOutstandingBalance && (
                  <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[0.6rem] font-bold">
                      !
                  </span>
              )}
          </TabsTrigger>
          <TabsTrigger value="service-calls">
             <Wrench className={`mr-1.5 ${tabIconSize}`} /> {t('subscriber_profile.service_calls_tab')}
          </TabsTrigger>
          <TabsTrigger value="inventory">
             <Package className={`mr-1.5 ${tabIconSize}`} /> {t('subscriber_profile.inventory_tab')}
          </TabsTrigger>
          <TabsTrigger value="documents">
             <FileText className={`mr-1.5 ${tabIconSize}`} /> {t('subscriber_profile.documents_tab')}
          </TabsTrigger>
          <TabsTrigger value="notes">
             <ClipboardList className={`mr-1.5 ${tabIconSize}`} /> {t('subscriber_profile.notes_tab')}
          </TabsTrigger>
          <TabsTrigger value="history">
             <HistoryIcon className={`mr-1.5 ${tabIconSize}`} /> {t('subscriber_profile.history_tab')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
            </CardHeader>
            <CardContent className="space-y-6">
              <OverviewSection
                title={t('subscriber_profile.personal_info_section')}
                icon={subscriber.type === 'Residential' ? User : Briefcase}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <OverviewDetailItem icon={User} label={t('subscriber_profile.overview_name')} value={subscriber.name} />
                  {subscriber.type === 'Residential' && subscriber.birthday && (
                    <OverviewDetailItem icon={CalendarDays} label={t('subscriber_profile.overview_birthday')} value={subscriber.birthday} />
                  )}
                  {subscriber.type === 'Commercial' && subscriber.establishedDate && (
                     <OverviewDetailItem icon={CalendarDays} label={t('subscriber_profile.overview_established_date')} value={subscriber.establishedDate} />
                  )}
                  <OverviewDetailItem icon={Fingerprint} label={t(subscriber.type === 'Residential' ? 'subscriber_profile.overview_tax_id' : 'subscriber_profile.overview_business_number')} value={subscriber.type === 'Residential' ? subscriber.taxId : subscriber.businessNumber} />
                  <OverviewDetailItem icon={Fingerprint} label={t('subscriber_profile.overview_id_number')} value={subscriber.idNumber} />
                  <OverviewDetailItem icon={CalendarDays} label={t('subscriber_profile.overview_signup_date')} value={subscriber.signupDate} />
                </div>
              </OverviewSection>

              <OverviewSection
                title={t('subscriber_profile.address_section')}
                icon={MapPinIcon}
              >
                <OverviewDetailItem icon={Home} label={t('subscriber_profile.overview_address')} value={subscriber.address} />
              </OverviewSection>

              <OverviewSection
                title={t('subscriber_profile.contact_info_section')}
                icon={Phone}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <OverviewDetailItem icon={Phone} label={t('subscriber_profile.overview_phone')} value={subscriber.phone} />
                  {subscriber.landline && <OverviewDetailItem icon={PhoneCall} label={t('subscriber_profile.overview_landline')} value={subscriber.landline} />}
                  <OverviewDetailItem icon={Mail} label={t('subscriber_profile.overview_email')} value={subscriber.email} />
                </div>
              </OverviewSection>
            </CardContent>
            <CardFooter className="border-t pt-6 flex justify-end gap-2">
                <Button variant="outline" onClick={handleEdit}>
                   <Edit className={`mr-2 ${iconSize}`} /> {t('subscriber_profile.edit_button')}
                </Button>
                 <Button variant="destructive" onClick={handleDelete}>
                     <Trash2 className={`mr-2 ${iconSize}`} /> {t('subscriber_profile.delete_button')}
                 </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="services">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                {/* Removed CardTitle and CardDescription from here */}
              </div>
                {/* Add Service Dialog Trigger */}
               <Dialog open={isAddServiceDialogOpen} onOpenChange={setIsAddServiceDialogOpen}> {/* Dialog */}
                 <DialogTrigger asChild>
                   <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                        <PlusCircle className={`mr-2 ${iconSize}`} /> {t('subscriber_profile.add_service_button')}
                   </Button>
                 </DialogTrigger>
                 <DialogContent className="sm:max-w-[425px]">
                   <DialogHeader>
                     <DialogTitle>{t('subscriber_profile.add_service_dialog_title')}</DialogTitle>
                     <DialogDescription>
                       {t('subscriber_profile.add_service_dialog_description')}
                     </DialogDescription>
                   </DialogHeader>
                   <Form {...addServiceForm}>
                     <form onSubmit={addServiceForm.handleSubmit(handleAddServiceSubmit)} className="grid gap-4 py-4">
                       <FormField
                        control={addServiceForm.control}
                        name="serviceType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('subscriber_profile.add_service_type_label')}</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={t('subscriber_profile.add_service_type_placeholder')} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Internet">{t('subscriber_profile.add_service_type_internet')}</SelectItem>
                                <SelectItem value="TV">{t('subscriber_profile.add_service_type_tv')}</SelectItem>
                                <SelectItem value="Phone">{t('subscriber_profile.add_service_type_landline')}</SelectItem>
                                <SelectItem value="Mobile">{t('subscriber_profile.add_service_type_mobile')}</SelectItem>
                                <SelectItem value="Combo">{t('subscriber_profile.add_service_type_combo')}</SelectItem>
                                <SelectItem value="Other">{t('subscriber_profile.add_service_type_other')}</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={addServiceForm.control}
                        name="popId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('subscriber_profile.add_service_pop_label')}</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingPops || !!popsError}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={isLoadingPops ? t('subscriber_profile.add_service_pop_loading') : popsError ? t('subscriber_profile.add_service_pop_error') : t('subscriber_profile.add_service_pop_placeholder')} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {!isLoadingPops && !popsError && pops.map((pop) => (
                                  <SelectItem key={pop.id.toString()} value={pop.id.toString()}>
                                    {pop.name} ({pop.location})
                                  </SelectItem>
                                ))}
                                 {isLoadingPops && <div className="p-2 text-center text-muted-foreground">{t('subscriber_profile.add_service_pop_loading')}</div>}
                                 {popsError && <div className="p-2 text-center text-destructive">{t('subscriber_profile.add_service_pop_error')}</div>}
                                 {!isLoadingPops && !popsError && pops.length === 0 && <div className="p-2 text-center text-muted-foreground">{t('subscriber_profile.add_service_pop_none')}</div>}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button type="button" variant="outline" disabled={addServiceForm.formState.isSubmitting}>{t('subscriber_profile.add_service_cancel_button')}</Button>
                        </DialogClose>
                        <Button type="submit" disabled={addServiceForm.formState.isSubmitting}>
                          {addServiceForm.formState.isSubmitting && <Loader2 className={`mr-2 ${iconSize} animate-spin`} />}
                          {addServiceForm.formState.isSubmitting ? t('subscriber_profile.add_service_saving_button') : t('subscriber_profile.add_service_save_button')}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="All" value={activeServiceTab} onValueChange={(value) => setActiveServiceTab(value as ServiceTypeFilter)}>
                 <TabsList className="mb-4 grid w-full grid-cols-6 h-auto">
                   <TabsTrigger value="All"><ListFilterIcon className={`mr-1.5 ${tabIconSize}`} />{t('subscriber_profile.services_filter_all')}</TabsTrigger>
                   <TabsTrigger value="Internet"><Wifi className={`mr-1.5 ${tabIconSize}`} />{t('subscriber_profile.services_filter_internet')}</TabsTrigger>
                   <TabsTrigger value="TV"><Tv className={`mr-1.5 ${tabIconSize}`} />{t('subscriber_profile.services_filter_tv')}</TabsTrigger>
                   <TabsTrigger value="Landline"><PhoneCall className={`mr-1.5 ${tabIconSize}`} />{t('subscriber_profile.services_filter_landline')}</TabsTrigger>
                   <TabsTrigger value="Mobile"><Smartphone className={`mr-1.5 ${tabIconSize}`} />{t('subscriber_profile.services_filter_mobile')}</TabsTrigger>
                   <TabsTrigger value="Combo"><Combine className={`mr-1.5 ${tabIconSize}`} />{t('subscriber_profile.services_filter_combo')}</TabsTrigger>
                 </TabsList>
                 <TabsContent value={activeServiceTab} className="mt-0">
                    {filteredServices.length > 0 ? (
                        <ul className="space-y-3">
                           {filteredServices.map(service => (
                               <li key={service.id} className="flex justify-between items-center p-3 border rounded-md">
                                   <div>
                                       <span className="font-medium text-xs">{t(`subscriber_profile.services_type_${service.type.toLowerCase()}` as any, service.type)}</span> - <span className="text-xs text-muted-foreground">{service.plan}</span> {/* Font sizes adjusted */}
                                   </div>
                                   <div className="flex items-center gap-2">
                                       <span className="text-xs text-muted-foreground">{t('subscriber_profile.services_pop_label')}: {pops.find(p => p.id.toString() === service.popId)?.name || service.popId}</span>
                                       <span className={`text-xs px-2 py-0.5 rounded-full ${service.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                         {t(`list_subscribers.status_${service.status.toLowerCase()}` as any, service.status)}
                                       </span>
                                       <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-7 w-7"> {/* Reduced size */}
                                                    <MoreVertical className={iconSize} />
                                                    <span className="sr-only">{t('subscriber_profile.service_actions_sr', 'Service Actions')}</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleServiceAction('sign', service.id)}>
                                                    {t('subscriber_profile.service_action_sign', 'Sign Contract')}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleServiceAction('cancel', service.id)} className="text-destructive">
                                                    {t('subscriber_profile.service_action_cancel', 'Cancel Contract')}
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => handleServiceAction('print_service_contract', service.id)}>
                                                    {t('subscriber_profile.service_action_print_service_contract', 'Print Service Contract')}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleServiceAction('print_responsibility_term', service.id)}>
                                                    {t('subscriber_profile.service_action_print_responsibility_term', 'Print Term of Responsibility')}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleServiceAction('print_cancelation_term', service.id)}>
                                                    {t('subscriber_profile.service_action_print_cancelation_term', 'Print Term of Cancelation')}
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => handleServiceAction('transfer_contract', service.id)}>
                                                    {t('subscriber_profile.service_action_transfer_contract', 'Transfer Contract')}
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                   </div>
                               </li>
                           ))}
                        </ul>
                    ) : (
                        <p className="text-xs text-muted-foreground text-center py-4">{t('subscriber_profile.services_none_filtered')}</p>
                    )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
           <Card>
             <CardHeader className="flex flex-row items-center justify-between">
                 <div>
                  {/* Removed CardTitle and CardDescription */}
                 </div>
             </CardHeader>
             <CardContent className="space-y-6">
                 <Tabs defaultValue="Pending" value={activeBillingTab} onValueChange={(value) => setActiveBillingTab(value as BillingFilter)}>
                    <TabsList className="mb-4 grid w-full grid-cols-6 h-auto">
                       <TabsTrigger value="All"><ListFilterIcon className={`mr-1.5 ${tabIconSize}`}/>{t('subscriber_profile.billing_filter_all')}</TabsTrigger>
                       <TabsTrigger value="Pending"><Clock className={`mr-1.5 ${tabIconSize}`}/>{t('subscriber_profile.billing_filter_pending')}</TabsTrigger>
                       <TabsTrigger value="Paid"><CheckCircle className={`mr-1.5 ${tabIconSize}`}/>{t('subscriber_profile.billing_filter_paid')}</TabsTrigger>
                       <TabsTrigger value="Canceled"><XCircle className={`mr-1.5 ${tabIconSize}`}/>{t('subscriber_profile.billing_filter_canceled')}</TabsTrigger>
                       <TabsTrigger value="PaymentPlan"><CalendarClock className={`mr-1.5 ${tabIconSize}`}/>{t('subscriber_profile.billing_filter_payment_plan')}</TabsTrigger>
                       <TabsTrigger value="PromiseToPay"><Handshake className={`mr-1.5 ${tabIconSize}`}/>{t('subscriber_profile.billing_filter_promise_to_pay')}</TabsTrigger>
                    </TabsList>

                    <TabsContent value="All" className="mt-0 space-y-2">
                         <h4 className="text-xs font-semibold mb-2 flex items-center gap-2"> {/* Font size reduced */}
                             <ListFilterIcon className={`${tabIconSize} text-primary`} /> {t('subscriber_profile.billing_all_invoices')} ({allInvoices.length})
                         </h4>
                         {allInvoices.length > 0 ? (
                             <ul className="space-y-2 text-xs">
                                 {allInvoices.map(inv => (
                                     <li key={inv.id} className="flex justify-between items-center p-2 border rounded-md">
                                        <div>
                                          <span>{inv.id} - {inv.date}</span>
                                          <span className="ml-2 text-muted-foreground">(${inv.amount.toFixed(2)})</span>
                                        </div>
                                        {getInvoiceStatusBadge(inv.status)}
                                     </li>
                                 ))}
                             </ul>
                         ) : (
                             <p className="text-xs text-muted-foreground">{t('subscriber_profile.billing_no_invoices')}</p>
                         )}
                    </TabsContent>

                    <TabsContent value="Pending" className="mt-0 space-y-2">
                         <h4 className="text-xs font-semibold mb-2 flex items-center gap-2">
                             <Clock className={`${tabIconSize} text-destructive`} /> {t('subscriber_profile.billing_pending_invoices')} ({subscriber.billing?.pendingInvoices?.length ?? 0})
                         </h4>
                         {subscriber.billing?.pendingInvoices?.length > 0 ? (
                             <ul className="space-y-2 text-xs">
                                 {subscriber.billing.pendingInvoices.map(inv => (
                                     <li key={inv.id} className="flex justify-between items-center p-2 border rounded-md bg-destructive/5">
                                         <span>{inv.id} - {inv.date}</span>
                                         <span className="font-medium">${inv.amount.toFixed(2)} ({t('subscriber_profile.invoice_status_due', 'Due')})</span>
                                     </li>
                                 ))}
                             </ul>
                         ) : (
                             <p className="text-xs text-muted-foreground">{t('subscriber_profile.billing_no_pending_invoices')}</p>
                         )}
                    </TabsContent>

                    <TabsContent value="Paid" className="mt-0 space-y-2">
                         <h4 className="text-xs font-semibold mb-2 flex items-center gap-2">
                             <CheckCircle className={`${tabIconSize} text-green-600`} /> {t('subscriber_profile.billing_paid_invoices')} ({subscriber.billing?.pastInvoices?.length ?? 0})
                         </h4>
                         {subscriber.billing?.pastInvoices?.length > 0 ? (
                             <ul className="space-y-2 text-xs">
                                 {subscriber.billing.pastInvoices.map(inv => (
                                     <li key={inv.id} className="flex justify-between items-center p-2 border rounded-md">
                                         <span>{inv.id} - {inv.date}</span>
                                         <span className="text-green-600">${inv.amount.toFixed(2)} ({t('subscriber_profile.invoice_status_paid', 'Paid')})</span>
                                     </li>
                                 ))}
                             </ul>
                         ) : (
                             <p className="text-xs text-muted-foreground">{t('subscriber_profile.billing_no_paid_invoices')}</p>
                         )}
                    </TabsContent>

                    <TabsContent value="Canceled" className="mt-0 space-y-2">
                        <h4 className="text-xs font-semibold mb-2 flex items-center gap-2">
                            <XCircle className={`${tabIconSize} text-muted-foreground`} /> {t('subscriber_profile.billing_canceled_invoices')} ({subscriber.billing?.canceledInvoices?.length ?? 0})
                        </h4>
                        {subscriber.billing?.canceledInvoices?.length > 0 ? (
                            <ul className="space-y-2 text-xs">
                                {subscriber.billing.canceledInvoices.map(inv => (
                                    <li key={inv.id} className="flex justify-between items-center p-2 border rounded-md">
                                        <span>{inv.id} - {inv.date}</span>
                                        <span className="text-muted-foreground">${inv.amount.toFixed(2)} ({inv.reason})</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-xs text-muted-foreground">{t('subscriber_profile.billing_no_canceled_invoices')}</p>
                        )}
                    </TabsContent>
                    <TabsContent value="PaymentPlan" className="mt-0 space-y-2">
                        <h4 className="text-xs font-semibold mb-2 flex items-center gap-2">
                            <CalendarClock className={`${tabIconSize} text-blue-600`} /> {t('subscriber_profile.billing_payment_plans')} ({subscriber.billing?.paymentPlans?.length ?? 0})
                        </h4>
                        {subscriber.billing?.paymentPlans?.length > 0 ? (
                            <ul className="space-y-2 text-xs">
                                {subscriber.billing.paymentPlans.map(plan => (
                                    <li key={plan.id} className="flex justify-between items-center p-2 border rounded-md">
                                        <span>{t('subscriber_profile.billing_payment_plan_start_date')}: {plan.startDate} - {plan.installments} x ${plan.installmentAmount.toFixed(2)}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${plan.status === 'Active' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>{plan.status}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-xs text-muted-foreground">{t('subscriber_profile.billing_no_payment_plans')}</p>
                        )}
                    </TabsContent>
                     <TabsContent value="PromiseToPay" className="mt-0 space-y-2">
                        <h4 className="text-xs font-semibold mb-2 flex items-center gap-2">
                            <Handshake className={`${tabIconSize} text-purple-600`} /> {t('subscriber_profile.billing_promises_to_pay')} ({subscriber.billing?.promisesToPay?.length ?? 0})
                        </h4>
                        {subscriber.billing?.promisesToPay?.length > 0 ? (
                            <ul className="space-y-2 text-xs">
                                {subscriber.billing.promisesToPay.map(promise => (
                                    <li key={promise.id} className="flex justify-between items-center p-2 border rounded-md">
                                        <span>{t('subscriber_profile.billing_promise_date')}: {promise.promiseDate} - ${promise.amount.toFixed(2)}</span>
                                         <span className={`text-xs px-2 py-0.5 rounded-full ${promise.status === 'Pending' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>{promise.status}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-xs text-muted-foreground">{t('subscriber_profile.billing_no_promises_to_pay')}</p>
                        )}
                    </TabsContent>
                 </Tabs>
             </CardContent>
           </Card>
         </TabsContent>


        <TabsContent value="service-calls">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
               <div>
                {/* Removed CardTitle and CardDescription */}
               </div>
                <Button size="sm">
                        <PlusCircle className={`mr-2 ${iconSize}`} /> {t('subscriber_profile.service_calls_new_button')}
                </Button>
            </CardHeader>
            <CardContent>
             {subscriber.serviceCalls && subscriber.serviceCalls.length > 0 ? (
                  <ul className="space-y-3">
                     {subscriber.serviceCalls.map(call => (
                         <li key={call.id} className="flex justify-between items-center p-3 border rounded-md">
                             <div>
                                 <span className="font-medium text-xs">{call.date}</span> - <span className="text-xs text-muted-foreground">{call.issue}</span> {/* Font sizes adjusted */}
                             </div>
                             <span className={`text-xs px-2 py-0.5 rounded-full ${call.status === 'Resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{t(`subscriber_profile.service_call_status_${call.status.toLowerCase()}` as any, call.status)}</span>
                         </li>
                     ))}
                  </ul>
             ) : (
                 <p className="text-xs text-muted-foreground text-center py-4">{t('subscriber_profile.service_calls_none')}</p>
             )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
               <div>
                {/* Removed CardTitle and CardDescription */}
               </div>
               <Button size="sm">
                        <PlusCircle className={`mr-2 ${iconSize}`} /> {t('subscriber_profile.inventory_assign_button')}
               </Button>
            </CardHeader>
            <CardContent>
               <Tabs defaultValue="All" value={activeInventoryTab} onValueChange={(value) => setActiveInventoryTab(value as InventoryFilter)}>
                  <TabsList className="mb-4 grid w-full grid-cols-3 h-auto">
                     <TabsTrigger value="All"><ListFilterIcon className={`mr-1.5 ${tabIconSize}`} />{t('subscriber_profile.inventory_filter_all')}</TabsTrigger>
                     <TabsTrigger value="Lent"><Package className={`mr-1.5 ${tabIconSize}`} />{t('subscriber_profile.inventory_filter_lent')}</TabsTrigger>
                     <TabsTrigger value="Sold"><DollarSign className={`mr-1.5 ${tabIconSize}`} />{t('subscriber_profile.inventory_filter_sold')}</TabsTrigger>
                  </TabsList>
                  <TabsContent value={activeInventoryTab} className="mt-0">
                     {filteredInventory.length > 0 ? (
                         <ul className="space-y-3">
                            {filteredInventory.map(item => (
                                <li key={item.id} className="flex justify-between items-center p-3 border rounded-md">
                                    <div>
                                        <span className="font-medium text-xs">{item.type}</span> - <span className="text-xs text-muted-foreground">{item.model}</span> {/* Font sizes adjusted */}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground">{t('subscriber_profile.inventory_serial_label')}: {item.serial}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${item.status === 'Lent' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {t(`subscriber_profile.inventory_status_${item.status.toLowerCase()}` as any, item.status)}
                                        </span>
                                     </div>
                                </li>
                            ))}
                         </ul>
                     ) : (
                         <p className="text-xs text-muted-foreground text-center py-4">{t('subscriber_profile.inventory_none_filtered')}</p>
                     )}
                  </TabsContent>
               </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                {/* Removed CardTitle and CardDescription */}
              </div>
              <Button size="sm">
                    <PlusCircle className={`mr-2 ${iconSize}`} /> {t('subscriber_profile.documents_upload_button')}
              </Button>
            </CardHeader>
            <CardContent>
              {subscriber.documents && subscriber.documents.length > 0 ? (
                <ul className="space-y-3">
                  {subscriber.documents.map(doc => (
                    <li key={doc.id} className="flex justify-between items-center p-3 border rounded-md">
                      <div>
                        <span className="font-medium text-xs">{doc.name}</span> {/* Font size adjusted */}
                      </div>
                      <span className="text-xs text-muted-foreground">{t('subscriber_profile.documents_uploaded_label')}: {doc.uploaded}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground text-center py-4">{t('subscriber_profile.documents_none')}</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
               <div>
                {/* Removed CardTitle and CardDescription */}
               </div>
                <Button size="sm">
                        <PlusCircle className={`mr-2 ${iconSize}`} /> {t('subscriber_profile.notes_add_button')}
                </Button>
            </CardHeader>
            <CardContent>
              {subscriber.notes && subscriber.notes.length > 0 ? (
                  <ul className="space-y-3">
                     {subscriber.notes.map(note => (
                         <li key={note.id} className="p-3 border rounded-md">
                             <p className="text-xs mb-1">{note.text}</p>
                             <p className="text-xs text-muted-foreground">{t('subscriber_profile.notes_author_label')}: {note.author} - {note.date}</p>
                         </li>
                     ))}
                  </ul>
              ) : (
                  <p className="text-xs text-muted-foreground text-center py-4">{t('subscriber_profile.notes_none')}</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              {/* Removed CardTitle and CardDescription */}
            </CardHeader>
            <CardContent>
              {subscriber.history && subscriber.history.length > 0 ? (
                  <ul className="space-y-3">
                     {subscriber.history.map(entry => (
                         <li key={entry.id} className="flex justify-between items-center p-3 border rounded-md">
                             <div>
                                 <span className="font-medium text-xs">{entry.event}</span> {/* Font size adjusted */}
                             </div>
                             <span className="text-xs text-muted-foreground">{t('subscriber_profile.history_user_label')}: {entry.user} - {entry.timestamp}</span>
                         </li>
                     ))}
                  </ul>
              ) : (
                  <p className="text-xs text-muted-foreground text-center py-4">{t('subscriber_profile.history_none')}</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
