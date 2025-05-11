// src/app/subscribers/profile/[id]/page.tsx
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  User,
  Building,
  Server as ServerIcon,
  DollarSign,
  Wrench,
  Package as PackageIcon,
  Edit,
  Trash2,
  PlusCircle,
  FileText,
  ClipboardList,
  History as HistoryIcon,
  Wifi,
  Tv,
  PhoneCall,
  Smartphone,
  Combine as CombineIcon,
  ListFilter as ListFilterIcon,
  CheckCircle,
  XCircle,
  Clock,
  CalendarClock,
  Handshake, // Added for Promise to Pay
  FileSignature,
  FilePlus2,
  MoreVertical,
  Printer,
  Send,
  Home,
  Mail,
  Fingerprint,
  CalendarDays,
  Briefcase,
  MapPinIcon,
  Landmark,
  Cable,
  Power,
  Box,
  Warehouse,
  Puzzle,
  TowerControl,
  Globe,
  GitFork,
  Code,
  Router as RouterIcon, // Renamed to avoid conflict with NextRouter
  Share2,
  Split,
  Settings as SettingsIcon,
  Loader2,
  ChevronDown, // Added for Actions dropdown
  CalendarIcon, // Added for Promise to Pay modal
  CreditCard, // Added for Receive Payment
  Receipt, // Added for Detailed Invoice
  FileX, // Added for Remove Payment
  Hourglass, // Added for In Progress service call
  List, // Added for All service call
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription as DialogDescriptionComponent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger as PopoverTriggerPrimitive,
} from "@/components/ui/popover";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import type { Pop } from '@/types/pops';
import { Skeleton } from '@/components/ui/skeleton';
import { useLocale } from '@/contexts/LocaleContext';
import { format, type Locale as DateFnsLocale } from 'date-fns';
import { fr as frLocale, ptBR as ptBRLocale, enUS as enUSLocale } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { NewContractWizard } from '@/components/new-contract-wizard';
import type { Subscriber, SubscriberService, BillingDetails, Invoice, PaymentPlan, PromiseToPay, ServiceCall, InventoryItem, Document, Note, HistoryEntry } from '@/types/subscribers';

// Placeholder data functions (replace with actual data fetching)
const getSubscriberData = (id: string | string[] | undefined): Subscriber | null => {
  if (!id) return null;
  const baseData: Subscriber = {
    id: 0,
    subscriberType: 'Residential',
    address: '',
    email: '',
    phoneNumber: '',
    signupDate: new Date(),
    status: 'Active',
    createdAt: new Date(),
    updatedAt: new Date(),
    services: [],
    billing: {
      balance: 0,
      nextBillDate: '',
      pastInvoices: [],
      pendingInvoices: [],
      canceledInvoices: [],
      paymentPlans: [],
      promisesToPay: [],
    },
    serviceCalls: [],
    inventory: [],
    documents: [],
    notes: [],
    history: [],
  };

  if (id === 'sub-1' || id === '1') {
    baseData.id = 1;
    baseData.subscriberType = 'Residential';
    baseData.fullName = 'Alice Wonderland';
    baseData.address = '123 Fantasy Lane, Wonderland, WND 12345';
    baseData.pointOfReference = 'Next to the Mad Hatter Tea Party';
    baseData.email = 'alice@example.com';
    baseData.phoneNumber = '555-1111';
    baseData.mobileNumber = '555-1010';
    baseData.birthday = new Date(1985, 3, 15);
    baseData.taxId = '123.456.789-00';
    (baseData as any).idNumber = 'ID-ALICE-001';
    baseData.signupDate = new Date(2022, 0, 10);
    baseData.status = 'Active';
    baseData.services = [
      { id: 'svc-1', type: 'Internet', plan: 'Fiber 100', popId: 'pop-1', status: 'Active', technology: 'Fiber', downloadSpeed: '100 Mbps', uploadSpeed: '50 Mbps', ipAddress: '203.0.113.10', onlineStatus: 'Online', authenticationType: 'PPPoE', pppoeUsername: 'alice@isp.com', pppoePassword: 'password', xponSn: 'HWTC12345678' },
      { id: 'svc-2', type: 'TV', plan: 'Basic Cable', popId: 'pop-1', status: 'Active' },
    ];
    baseData.billing.balance = 0.00;
    baseData.billing.pendingInvoices =  [
      { id: 'inv-p04', contractId: 'SVC-ALICE-INT-001', dateMade: '2024-08-01', dueDate: '2024-08-20', value: 50.00, wallet: 'Visa **** 1234', status: 'Due' },
      { id: 'inv-p05', contractId: 'SVC-ALICE-TV-001', dateMade: '2024-08-01', dueDate: '2024-08-20', value: 20.00, wallet: 'Visa **** 1234', status: 'Due' },
     ];
    baseData.billing.promisesToPay = [
      { id: 'ptp-alice-01', promiseDate: '2024-08-25', amount: 50.00, status: 'Pending' },
    ];
  } else if (id === 'sub-2' || id === '2') {
    baseData.id = 2;
    baseData.subscriberType = 'Commercial';
    baseData.companyName = 'Bob The Builder Inc.';
    baseData.address = '456 Construction Ave, Builderville, BLD 67890';
    baseData.pointOfReference = 'Yellow crane visible from the street';
    baseData.email = 'bob@example.com';
    baseData.phoneNumber = '555-2222';
    baseData.mobileNumber = '555-2020';
    baseData.establishedDate = new Date(2005, 7, 20);
    baseData.businessNumber = '98.765.432/0001-00';
    baseData.status = 'Suspended';
    baseData.signupDate = new Date(2021, 5, 1);
    baseData.services = [
      { id: 'svc-3', type: 'Internet', plan: 'Business Fiber 1G', popId: 'pop-2', status: 'Active', technology: 'Fiber', downloadSpeed: '1 Gbps', uploadSpeed: '500 Mbps', ipAddress: '203.0.113.20', onlineStatus: 'Online', authenticationType: 'StaticIP', xponSn: 'FHTT98765432' }
    ];
    baseData.billing.balance = 150.75;
    baseData.billing.nextBillDate = '2024-09-01';
    baseData.billing.pendingInvoices = [
      { id: 'inv-p01', contractId: 'SVC-INT-001', dateMade: '2024-08-01', dueDate: '2024-08-15', value: 75.00, wallet: 'Main Bank', status: 'Due' },
      { id: 'inv-p02', contractId: 'SVC-TV-002', dateMade: '2024-08-05', dueDate: '2024-08-20', value: 25.25, wallet: 'Credit Card', status: 'Due' },
    ];
    baseData.billing.paymentPlans = [
      { id: 'pp-1', startDate: '2024-07-01', installments: 3, installmentAmount: 25.00, status: 'Active' },
    ];
    baseData.billing.promisesToPay = [
      { id: 'ptp-1', promiseDate: '2024-08-10', amount: 50.00, status: 'Pending' },
    ];
  } else {
    return null;
  }
  return baseData;
};

const placeholderPops: Pop[] = [
  { id: 'pop-1', name: 'Central Hub', location: '123 Fiber Lane, Anytown', status: 'Active', createdAt: new Date() },
  { id: 'pop-2', name: 'North Branch', location: '456 Network Rd, Anytown', status: 'Planned', createdAt: new Date(Date.now() - 86400000) },
];

const queryClient = new QueryClient();

const dateLocales: Record<string, DateFnsLocale> = {
  en: enUSLocale,
  fr: frLocale,
  pt: ptBRLocale,
};

type ServiceTypeFilter = 'All' | 'Internet' | 'TV' | 'Landline' | 'Mobile' | 'Combo';
type InventoryFilter = 'All' | 'Lent' | 'Sold';
type BillingFilter = 'All' | 'Pending' | 'Paid' | 'Canceled' | 'PaymentPlan' | 'PromiseToPay';
type ContractStatusFilter = 'All' | 'Active' | 'Inactive';
type ServiceCallStatusFilter = 'All' | 'Pending' | 'InProgress' | 'Resolved';


const promiseToPaySchema = z.object({
    promiseDate: z.date({ required_error: "Promise date is required." }),
    promiseAmount: z.coerce.number().positive("Amount must be positive."),
});
type PromiseToPayFormData = z.infer<typeof promiseToPaySchema>;


const OverviewDetailItem: React.FC<{ icon: React.ElementType, labelKey: string, value?: string | null | Date }> = ({ icon: Icon, labelKey, value }) => {
  const { t, locale } = useLocale();
  const iconSize = "h-3 w-3";
  return (
    <div className="flex items-start gap-3">
      <Icon className={`${iconSize} text-muted-foreground mt-1`} />
      <div>
        <p className="text-xs text-muted-foreground">{t(labelKey)}</p>
        <p className="text-xs font-medium">
          {value instanceof Date ? format(value, 'PP', { locale: dateLocales[locale] || enUSLocale }) : value || t('subscriber_profile.not_available')}
        </p>
      </div>
    </div>
  );
};

const OverviewSection: React.FC<{ titleKey: string, icon: React.ElementType, children: React.ReactNode }> = ({ titleKey, icon: Icon, children }) => {
  const { t } = useLocale();
  const iconSize = "h-3 w-3";
  return (
    <fieldset className="border border-border rounded-md p-4 pt-2 space-y-4">
      <legend className="text-sm font-semibold px-2 flex items-center gap-2">
        <Icon className={`${iconSize} text-primary`} />
        {t(titleKey)}
      </legend>
      {children}
    </fieldset>
  );
};

const ServiceDetailItem: React.FC<{ label: string, value?: string | null, children?: React.ReactNode, className?: string }> = ({ label, value, children, className }) => {
  const { t } = useLocale();
  if (!value && !children) return null;
  return (
    <div className={cn("text-xs", className)}>
      <span className="text-muted-foreground">{t(label, label)}: </span>
      {children || <span className="font-medium">{value || t('subscriber_profile.not_available')}</span>}
    </div>
  );
};

const getTechnologyIcon = (technology?: string) => {
  const iconSize = "h-4 w-4 text-primary";
  if (!technology) return <ServerIcon className={iconSize} />;

  switch (technology.toLowerCase()) {
    case 'fiber':
    case 'fiber optic':
      return <Cable className={iconSize} />;
    case 'radio':
      return <Wifi className={iconSize} />;
    case 'utp':
      return <RouterIcon className={iconSize} />;
    case 'satellite':
      return <Globe className={iconSize} />;
    default:
      return <ServerIcon className={iconSize} />;
  }
};

const getStatusBadgeVariant = (status: SubscriberStatus | undefined) => {
    switch (status) {
        case 'Active':
            return 'bg-green-100 text-green-800';
        case 'Suspended':
            return 'bg-yellow-100 text-yellow-800';
        case 'Inactive':
        case 'Canceled':
        case 'Planned':
            return 'bg-gray-100 text-gray-800';
        default:
            return 'bg-secondary text-secondary-foreground';
    }
};


export default function SubscriberProfilePageWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <SubscriberProfilePage />
    </QueryClientProvider>
  );
}

function SubscriberProfilePage() {
  const params = useParams();
  const subscriberId = params.id;
  const { toast } = useToast();
  const { t, locale } = useLocale();
  const router = useRouter();

  const [isAddServiceDialogOpen, setIsAddServiceDialogOpen] = React.useState(false);
  const [isNewContractWizardOpen, setIsNewContractWizardOpen] = React.useState(false);
  const [activeServiceTab, setActiveServiceTab] = React.useState<ServiceTypeFilter>('All');
  const [activeInventoryTab, setActiveInventoryTab] = React.useState<InventoryFilter>('All');
  const [activeBillingTab, setActiveBillingTab] = React.useState<BillingFilter>('Pending');
  const [activeContractTab, setActiveContractTab] = React.useState<ContractStatusFilter>('Active');
  const [activeServiceCallTab, setActiveServiceCallTab] = React.useState<ServiceCallStatusFilter>('All');
  const [isUpdateLoginDialogOpen, setIsUpdateLoginDialogOpen] = React.useState(false);
  const [currentServiceForLoginUpdate, setCurrentServiceForLoginUpdate] = React.useState<SubscriberService | null>(null);
  const [selectedPendingInvoices, setSelectedPendingInvoices] = React.useState<string[]>([]);
  const [isPromiseToPayModalOpen, setIsPromiseToPayModalOpen] = React.useState(false);


  const iconSize = "h-3 w-3";
  const tabIconSize = "h-2.5 w-2.5";

  const subscriber = React.useMemo(() => {
    if (!subscriberId) return null;
    return getSubscriberData(subscriberId);
  }, [subscriberId]);

  const hasOutstandingBalance = React.useMemo(() =>
    (subscriber?.billing?.balance ?? 0) > 0 || (subscriber?.billing?.pendingInvoices?.filter(inv => inv.status === 'Due').length ?? 0) > 0,
    [subscriber?.billing]
  );

  const pppoeForm = useForm<{ pppoeUsername?: string; pppoePassword?: string }>({
    defaultValues: { pppoeUsername: '', pppoePassword: '' },
  });

  const promiseToPayForm = useForm<PromiseToPayFormData>({
    resolver: zodResolver(promiseToPaySchema),
    defaultValues: {
      promiseDate: undefined,
      promiseAmount: 0,
    },
  });

  React.useEffect(() => {
    if (currentServiceForLoginUpdate && currentServiceForLoginUpdate.authenticationType === 'PPPoE') {
      pppoeForm.reset({
        pppoeUsername: currentServiceForLoginUpdate.pppoeUsername || '',
        pppoePassword: currentServiceForLoginUpdate.pppoePassword || '',
      });
    }
  }, [currentServiceForLoginUpdate, pppoeForm]);


  if (!subscriber) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
        <p>{t('subscriber_profile.loading_skeleton')}</p>
      </div>
    );
  }

  const handleEdit = () => {
    toast({
      title: t('subscriber_profile.edit_toast_title'),
      description: t('subscriber_profile.edit_toast_description', 'Editing for {name} is not yet functional.').replace('{name}', subscriber?.fullName || subscriber?.companyName || 'N/A')
    });
  };

  const handleDelete = () => {
    toast({
      title: t('subscriber_profile.delete_toast_title'),
      description: t('subscriber_profile.delete_toast_description', 'Deletion for {name} is not yet functional.').replace('{name}', subscriber?.fullName || subscriber?.companyName || 'N/A'),
      variant: "destructive"
    });
  };

  const handleMakeInvoice = () => {
    toast({
      title: t('subscriber_profile.billing_make_invoice_button_toast_title'),
      description: t('subscriber_profile.billing_make_invoice_button_toast_desc'),
    });
  };

  const handleMakePaymentPlan = () => {
    if (selectedPendingInvoices.length === 0 && activeBillingTab === 'Pending') {
      toast({
        title: t('subscriber_profile.billing_no_invoice_selected_title'),
        description: t('subscriber_profile.billing_no_invoice_selected_desc'),
        variant: 'destructive',
      });
      return;
    }
    toast({
      title: t('subscriber_profile.billing_make_payment_plan_button_toast_title'),
      description: t('subscriber_profile.billing_make_payment_plan_button_toast_desc', 'Creating payment plan for selected invoices: {ids}').replace('{ids}', selectedPendingInvoices.join(', ')),
    });
    setSelectedPendingInvoices([]);
  };

  const handleOpenPromiseToPayModal = () => {
    if (selectedPendingInvoices.length === 0 && activeBillingTab === 'Pending') {
        toast({
            title: t('subscriber_profile.billing_no_invoice_selected_title'),
            description: t('subscriber_profile.promise_to_pay_no_invoice_selected_desc'),
            variant: 'destructive',
        });
        return;
    }
    const selectedAmount = subscriber.billing.pendingInvoices
        .filter(inv => selectedPendingInvoices.includes(inv.id) && inv.status === 'Due')
        .reduce((sum, inv) => sum + inv.value, 0);

    promiseToPayForm.reset({ promiseDate: new Date(), promiseAmount: selectedAmount });
    setIsPromiseToPayModalOpen(true);
  };

  const onPromiseToPaySubmit = (data: PromiseToPayFormData) => {
    console.log("Promise to Pay data:", data, "for invoices:", selectedPendingInvoices);
    toast({
        title: t('subscriber_profile.promise_to_pay_success_title'),
        description: t('subscriber_profile.promise_to_pay_success_desc', 'Promise to pay registered for {amount} until {date}.').replace('{amount}', data.promiseAmount.toString()).replace('{date}', format(data.promiseDate, 'PP')),
    });
    setIsPromiseToPayModalOpen(false);
    setSelectedPendingInvoices([]);
  };


  const handleServiceAction = (action: string, serviceId?: string) => {
    toast({
      title: `Service Action: ${action}`,
      description: `Action '${action}' for service ${serviceId || ''} is not yet implemented.`,
    });
  };

  const handleBillingAction = (action: string, itemId?: string) => {
     toast({
      title: `Billing Action: ${action}`,
      description: `Action '${action}' for item ${itemId || ''} is not yet implemented.`,
    });
  }

  const handleUpdateLogin = (service: SubscriberService) => {
    setCurrentServiceForLoginUpdate(service);
    setIsUpdateLoginDialogOpen(true);
  };

  const onPppoeFormSubmit = (data: { pppoeUsername?: string; pppoePassword?: string }) => {
    console.log("Updating PPPoE credentials for service:", currentServiceForLoginUpdate?.id, "with data:", data);
    toast({
      title: t('subscriber_profile.update_login_success_toast_title'),
      description: t('subscriber_profile.update_login_success_toast_description'),
    });
    setIsUpdateLoginDialogOpen(false);
    setCurrentServiceForLoginUpdate(null);
  };

  const filteredBillingItems = React.useMemo(() => {
    const allItems: (Invoice | PaymentPlan | PromiseToPay)[] = [
      ...(subscriber.billing.pendingInvoices || []).map(inv => ({ ...inv, itemType: 'invoice' as const })),
      ...(subscriber.billing.pastInvoices || []).map(inv => ({ ...inv, itemType: 'invoice' as const })),
      ...(subscriber.billing.canceledInvoices || []).map(inv => ({ ...inv, itemType: 'invoice' as const })),
      ...(subscriber.billing.paymentPlans || []).map(pp => ({ ...pp, itemType: 'paymentPlan' as const })),
      ...(subscriber.billing.promisesToPay || []).map(ptp => ({ ...ptp, itemType: 'promiseToPay' as const })),
    ];

    if (activeBillingTab === 'All') return allItems;
    if (activeBillingTab === 'Pending') return allItems.filter(item => item.itemType === 'invoice' && item.status === 'Due');
    if (activeBillingTab === 'Paid') return allItems.filter(item => item.itemType === 'invoice' && item.status === 'Paid');
    if (activeBillingTab === 'Canceled') return allItems.filter(item => item.itemType === 'invoice' && item.status === 'Canceled');
    if (activeBillingTab === 'PaymentPlan') return allItems.filter(item => item.itemType === 'paymentPlan' && item.status === 'Active');
    if (activeBillingTab === 'PromiseToPay') return allItems.filter(item => item.itemType === 'promiseToPay' && item.status === 'Pending');
    return [];
  }, [subscriber.billing, activeBillingTab]);

  const handleSelectPendingInvoice = (invoiceId: string, checked: boolean) => {
    setSelectedPendingInvoices(prev =>
      checked ? [...prev, invoiceId] : prev.filter(id => id !== invoiceId)
    );
  };

  const isAllPendingSelected = subscriber.billing.pendingInvoices.length > 0 && selectedPendingInvoices.length === subscriber.billing.pendingInvoices.filter(inv => inv.status === 'Due').length;
  const handleSelectAllPending = (checked: boolean) => {
    if (checked) {
      setSelectedPendingInvoices(subscriber.billing.pendingInvoices.filter(inv => inv.status === 'Due').map(inv => inv.id));
    } else {
      setSelectedPendingInvoices([]);
    }
  };
  // The main return of the component
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3"> {/* Increased gap for badge */}
            {subscriber.subscriberType === 'Residential' ? (
              <User className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Building className="h-4 w-4 text-muted-foreground" />
            )}
            <CardTitle className="text-base">{subscriber.subscriberType === 'Residential' ? subscriber.fullName : subscriber.companyName} (ID: {subscriber.id})</CardTitle>
            <Badge variant={subscriber.status === 'Active' ? 'default' : subscriber.status === 'Suspended' ? 'destructive' : 'secondary'} className={cn("text-xs ml-2", getStatusBadgeVariant(subscriber.status))}>
                {t(`list_subscribers.status_${subscriber.status.toLowerCase()}` as any, subscriber.status)}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5 md:grid-cols-9">
          <TabsTrigger value="overview"><User className={`mr-1.5 ${tabIconSize}`} />{t('subscriber_profile.overview_tab')}</TabsTrigger>
          <TabsTrigger value="contracts"><FileSignature className={`mr-1.5 ${tabIconSize}`} />{t('subscriber_profile.contracts_tab')}</TabsTrigger>
          <TabsTrigger value="services"><ServerIcon className={`mr-1.5 ${tabIconSize}`} />{t('subscriber_profile.services_tab')}</TabsTrigger>
          <TabsTrigger value="billing" className="relative">
            <DollarSign className={`mr-1.5 ${tabIconSize}`} />{t('subscriber_profile.billing_tab')}
            {hasOutstandingBalance && (
              <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[0.6rem] font-bold">!</span>
            )}
          </TabsTrigger>
          <TabsTrigger value="service-calls"><Wrench className={`mr-1.5 ${tabIconSize}`} />{t('subscriber_profile.service_calls_tab')}</TabsTrigger>
          <TabsTrigger value="inventory"><PackageIcon className={`mr-1.5 ${tabIconSize}`} />{t('subscriber_profile.inventory_tab')}</TabsTrigger>
          <TabsTrigger value="documents"><FileText className={`mr-1.5 ${tabIconSize}`} />{t('subscriber_profile.documents_tab')}</TabsTrigger>
          <TabsTrigger value="notes"><ClipboardList className={`mr-1.5 ${tabIconSize}`} />{t('subscriber_profile.notes_tab')}</TabsTrigger>
          <TabsTrigger value="history"><HistoryIcon className={`mr-1.5 ${tabIconSize}`} />{t('subscriber_profile.history_tab')}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardContent className="space-y-6 pt-6">
              <OverviewSection
                titleKey="subscriber_profile.personal_info_section"
                icon={subscriber.subscriberType === 'Residential' ? User : Briefcase}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <OverviewDetailItem icon={User} labelKey="subscriber_profile.overview_name" value={subscriber.subscriberType === 'Residential' ? subscriber.fullName : subscriber.companyName} />
                  {subscriber.subscriberType === 'Residential' && subscriber.birthday && (
                    <OverviewDetailItem icon={CalendarDays} labelKey="subscriber_profile.overview_birthday" value={subscriber.birthday} />
                  )}
                  {subscriber.subscriberType === 'Commercial' && subscriber.establishedDate && (
                    <OverviewDetailItem icon={CalendarDays} labelKey="subscriber_profile.overview_established_date" value={subscriber.establishedDate} />
                  )}
                  <OverviewDetailItem icon={Fingerprint} labelKey={subscriber.subscriberType === 'Residential' ? 'subscriber_profile.overview_tax_id' : 'subscriber_profile.overview_business_number'} value={subscriber.subscriberType === 'Residential' ? subscriber.taxId : subscriber.businessNumber} />
                  <OverviewDetailItem icon={Fingerprint} labelKey="subscriber_profile.overview_id_number" value={(subscriber as any).idNumber} />
                  <OverviewDetailItem icon={CalendarDays} labelKey="subscriber_profile.overview_signup_date" value={subscriber.signupDate} />
                </div>
              </OverviewSection>

              <OverviewSection titleKey="subscriber_profile.address_section" icon={MapPinIcon}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <OverviewDetailItem icon={Home} labelKey="subscriber_profile.overview_address" value={subscriber.address} />
                  <OverviewDetailItem icon={Landmark} labelKey="subscriber_profile.overview_point_of_reference" value={subscriber.pointOfReference} />
                </div>
              </OverviewSection>

              <OverviewSection titleKey="subscriber_profile.contact_info_section" icon={PhoneCall}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <OverviewDetailItem icon={PhoneCall} labelKey="subscriber_profile.overview_phone" value={subscriber.phoneNumber} />
                  {subscriber.mobileNumber && <OverviewDetailItem icon={Smartphone} labelKey="subscriber_profile.overview_landline" value={subscriber.mobileNumber} />}
                  <OverviewDetailItem icon={Mail} labelKey="subscriber_profile.overview_email" value={subscriber.email} />
                </div>
              </OverviewSection>
            </CardContent>
            <CardFooter className="border-t pt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={handleEdit}><Edit className={`mr-2 ${iconSize}`} />{t('subscriber_profile.edit_button')}</Button>
              <Button variant="destructive" onClick={handleDelete}><Trash2 className={`mr-2 ${iconSize}`} />{t('subscriber_profile.delete_button')}</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="contracts">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <Tabs defaultValue="Active" value={activeContractTab} onValueChange={(value) => setActiveContractTab(value as ContractStatusFilter)} className="w-full">
                <TabsList className="grid w-full grid-cols-3 h-auto">
                  <TabsTrigger value="All"><ListFilterIcon className={`mr-1.5 ${tabIconSize}`} />{t('subscriber_profile.contracts_filter_all')}</TabsTrigger>
                  <TabsTrigger value="Active"><CheckCircle className={`mr-1.5 ${tabIconSize}`} />{t('subscriber_profile.contracts_filter_active')}</TabsTrigger>
                  <TabsTrigger value="Inactive"><XCircle className={`mr-1.5 ${tabIconSize}`} />{t('subscriber_profile.contracts_filter_inactive')}</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white ml-4 shrink-0" onClick={() => setIsNewContractWizardOpen(true)}>
                <FilePlus2 className={`mr-2 ${iconSize}`} /> {t('subscriber_profile.new_contract_button')}
              </Button>
            </div>
            <Card>
              <CardContent className="pt-6">
                <p className="text-xs text-muted-foreground text-center py-4">{t('subscriber_profile.contracts_none')}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="services">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <Tabs defaultValue="All" value={activeServiceTab} onValueChange={(value) => setActiveServiceTab(value as ServiceTypeFilter)} className="w-full">
                <TabsList className="grid w-full grid-cols-6 h-auto">
                  <TabsTrigger value="All"><ListFilterIcon className={`mr-1.5 ${tabIconSize}`} />{t('subscriber_profile.services_filter_all')}</TabsTrigger>
                  <TabsTrigger value="Internet"><Wifi className={`mr-1.5 ${tabIconSize}`} />{t('subscriber_profile.services_filter_internet')}</TabsTrigger>
                  <TabsTrigger value="TV"><Tv className={`mr-1.5 ${tabIconSize}`} />{t('subscriber_profile.services_filter_tv')}</TabsTrigger>
                  <TabsTrigger value="Landline"><PhoneCall className={`mr-1.5 ${tabIconSize}`} />{t('subscriber_profile.services_filter_landline')}</TabsTrigger>
                  <TabsTrigger value="Mobile"><Smartphone className={`mr-1.5 ${tabIconSize}`} />{t('subscriber_profile.services_filter_mobile')}</TabsTrigger>
                  <TabsTrigger value="Combo"><CombineIcon className={`mr-1.5 ${tabIconSize}`} />{t('subscriber_profile.services_filter_combo')}</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white ml-4 shrink-0" onClick={() => setIsAddServiceDialogOpen(true)}>
                <PlusCircle className={`mr-2 ${iconSize}`} /> {t('subscriber_profile.add_service_button')}
              </Button>
            </div>
            {subscriber.services && subscriber.services.filter(s => activeServiceTab === 'All' || s.type === activeServiceTab).length > 0 ? (
              subscriber.services.filter(s => activeServiceTab === 'All' || s.type === activeServiceTab).map(service => (
                <Card key={service.id}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="flex items-center gap-2">
                      {getTechnologyIcon(service.technology)}
                      <CardTitle className="text-sm">{service.plan}</CardTitle>
                      <Badge variant={service.status === 'Active' ? 'default' : 'secondary'} className={cn(service.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800', 'text-xs')}>{service.status}</Badge>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoreVertical className={iconSize} />
                          <span className="sr-only">{t('subscriber_profile.service_actions_sr')}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleServiceAction('sign_contract', service.id)}>{t('subscriber_profile.service_action_sign')}</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleServiceAction('cancel_contract', service.id)}>{t('subscriber_profile.service_action_cancel')}</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleServiceAction('transfer_contract', service.id)}>{t('subscriber_profile.service_action_transfer_contract')}</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleServiceAction('print_service_contract', service.id)}>{t('subscriber_profile.service_action_print_service_contract')}</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleServiceAction('print_responsibility_term', service.id)}>{t('subscriber_profile.service_action_print_responsibility_term')}</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleServiceAction('print_cancelation_term', service.id)}>{t('subscriber_profile.service_action_print_cancelation_term')}</DropdownMenuItem>
                        {service.type === 'Internet' && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleServiceAction('clear_mac', service.id)}>{t('subscriber_profile.service_action_clear_mac')}</DropdownMenuItem>
                            {service.authenticationType === 'PPPoE' && <DropdownMenuItem onClick={() => handleUpdateLogin(service)}>{t('subscriber_profile.service_action_update_login')}</DropdownMenuItem>}
                            <DropdownMenuItem onClick={() => handleServiceAction('change_billing_date', service.id)}>{t('subscriber_profile.service_action_change_billing_date')}</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleServiceAction('monitor_traffic', service.id)}>{t('subscriber_profile.service_action_monitor_traffic')}</DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-2">
                    <ServiceDetailItem label="subscriber_profile.services_type_internet" value={t(`subscriber_profile.services_type_${service.type.toLowerCase()}` as any, service.type)} />
                    {service.type === 'Internet' && (
                      <>
                        <ServiceDetailItem label="subscriber_profile.services_technology" value={service.technology} />
                        <ServiceDetailItem label="subscriber_profile.services_data_rate" value={`${service.downloadSpeed} / ${service.uploadSpeed}`} />
                        <ServiceDetailItem label="subscriber_profile.services_ip_address" value={service.ipAddress} />
                        <ServiceDetailItem label="subscriber_profile.services_online_status">
                          <Badge variant={service.onlineStatus === 'Online' ? 'default' : 'secondary'} className={cn(service.onlineStatus === 'Online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800', 'text-xs')}>{service.onlineStatus}</Badge>
                        </ServiceDetailItem>
                        <ServiceDetailItem label="subscriber_profile.services_auth_type" value={service.authenticationType} />
                        {service.authenticationType === 'PPPoE' && (
                          <>
                            <ServiceDetailItem label="subscriber_profile.services_pppoe_user" value={service.pppoeUsername} />
                            <ServiceDetailItem label="subscriber_profile.services_pppoe_pass" value="********" />
                          </>
                        )}
                        {service.technology === 'Fiber' && service.xponSn && <ServiceDetailItem label="subscriber_profile.services_xpon_sn" value={service.xponSn} />}
                        {service.technology !== 'Fiber' && service.macAddress && <ServiceDetailItem label="subscriber_profile.services_mac_address" value={service.macAddress} />}

                      </>
                    )}
                    <ServiceDetailItem label="subscriber_profile.services_pop_label" value={placeholderPops.find(p => p.id === service.popId)?.name || 'Unknown PoP'} />
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-xs text-muted-foreground text-center py-4">{t('subscriber_profile.services_none_filtered')}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>


        <TabsContent value="billing">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <Tabs defaultValue="Pending" value={activeBillingTab} onValueChange={(value) => setActiveBillingTab(value as BillingFilter)} className="w-full">
                <TabsList className="grid w-full grid-cols-6 h-auto">
                  <TabsTrigger value="All"><ListFilterIcon className={`mr-1.5 ${tabIconSize}`} />{t('subscriber_profile.billing_filter_all')}</TabsTrigger>
                  <TabsTrigger value="Pending"><Clock className={`mr-1.5 ${tabIconSize}`} />{t('subscriber_profile.billing_filter_pending')}</TabsTrigger>
                  <TabsTrigger value="Paid"><CheckCircle className={`mr-1.5 ${tabIconSize}`} />{t('subscriber_profile.billing_filter_paid')}</TabsTrigger>
                  <TabsTrigger value="Canceled"><XCircle className={`mr-1.5 ${tabIconSize}`} />{t('subscriber_profile.billing_filter_canceled')}</TabsTrigger>
                  <TabsTrigger value="PaymentPlan"><CalendarClock className={`mr-1.5 ${tabIconSize}`} />{t('subscriber_profile.billing_filter_payment_plan')}</TabsTrigger>
                  <TabsTrigger value="PromiseToPay"><Handshake className={`mr-1.5 ${tabIconSize}`} />{t('subscriber_profile.billing_filter_promise_to_pay')}</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="flex items-center gap-2 ml-4 shrink-0">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline">
                      {t('subscriber_profile.billing_actions_button', 'Actions')} <ChevronDown className={`ml-2 ${iconSize}`} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleMakeInvoice}>
                      <FilePlus2 className={`mr-2 ${iconSize}`} /> {t('subscriber_profile.billing_make_invoice_button')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleMakePaymentPlan} disabled={selectedPendingInvoices.length === 0 && activeBillingTab === 'Pending'}>
                      <CalendarClock className={`mr-2 ${iconSize}`} /> {t('subscriber_profile.billing_make_payment_plan_button')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleOpenPromiseToPayModal} disabled={selectedPendingInvoices.length === 0 && activeBillingTab === 'Pending'}>
                        <Handshake className={`mr-2 ${iconSize}`} /> {t('subscriber_profile.billing_make_promise_to_pay_button')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <Card>
              <CardContent className="pt-6">
                {filteredBillingItems.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-10">
                          {activeBillingTab === 'Pending' && (
                            <Checkbox
                              checked={isAllPendingSelected}
                              onCheckedChange={handleSelectAllPending}
                              aria-label={t('subscriber_profile.billing_header_select_all')}
                            />
                          )}
                        </TableHead>
                        <TableHead>{t('subscriber_profile.billing_header_contract_id')}</TableHead>
                        <TableHead>{t('subscriber_profile.billing_header_date_made')}</TableHead>
                        <TableHead>{t('subscriber_profile.billing_header_due_date')}</TableHead>
                        <TableHead className="text-right">{t('subscriber_profile.billing_header_value')}</TableHead>
                        <TableHead>{t('subscriber_profile.billing_header_wallet')}</TableHead>
                        <TableHead className="text-right">{t('subscriber_profile.billing_header_actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBillingItems.map(item => (
                        <TableRow key={item.id}>
                          <TableCell>
                            {item.itemType === 'invoice' && item.status === 'Due' && activeBillingTab === 'Pending' && (
                              <Checkbox
                                checked={selectedPendingInvoices.includes(item.id)}
                                onCheckedChange={(checked) => handleSelectPendingInvoice(item.id, !!checked)}
                                aria-labelledby={`select-invoice-${item.id}`}
                              />
                            )}
                          </TableCell>
                          <TableCell className="text-xs">{(item as Invoice).contractId || '-'}</TableCell>
                          <TableCell className="text-xs">
                            {item.itemType === 'invoice' && (item as Invoice).dateMade ? format(new Date((item as Invoice).dateMade), 'PP', { locale: dateLocales[locale] || enUSLocale }) :
                              item.itemType === 'paymentPlan' && (item as PaymentPlan).startDate ? format(new Date((item as PaymentPlan).startDate), 'PP', { locale: dateLocales[locale] || enUSLocale }) :
                                '-'}
                          </TableCell>
                          <TableCell className="text-xs">
                            {item.itemType === 'invoice' && (item as Invoice).dueDate ? format(new Date((item as Invoice).dueDate), 'PP', { locale: dateLocales[locale] || enUSLocale }) :
                              item.itemType === 'promiseToPay' && (item as PromiseToPay).promiseDate ? format(new Date((item as PromiseToPay).promiseDate), 'PP', { locale: dateLocales[locale] || enUSLocale }) :
                                '-'}
                          </TableCell>
                          <TableCell className="text-xs text-right">
                            {item.itemType === 'invoice' ? (item as Invoice).value.toFixed(2) :
                              item.itemType === 'paymentPlan' ? `${(item as PaymentPlan).installments}x ${(item as PaymentPlan).installmentAmount.toFixed(2)}` :
                                item.itemType === 'promiseToPay' ? (item as PromiseToPay).amount.toFixed(2) :
                                  '-'}
                          </TableCell>
                          <TableCell className="text-xs">{(item as Invoice).wallet || '-'}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7"><MoreVertical className={iconSize} /></Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleBillingAction('receive_payment', item.id)}><CreditCard className={`mr-2 ${iconSize}`} /> {t('subscriber_profile.billing_action_receive_payment')}</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleBillingAction('remove_payment', item.id)}><FileX className={`mr-2 ${iconSize}`} /> {t('subscriber_profile.billing_action_remove_payment')}</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleBillingAction('detailed_invoice', item.id)}><Receipt className={`mr-2 ${iconSize}`} /> {t('subscriber_profile.billing_action_detailed_invoice')}</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleBillingAction('print_pdf', item.id)}><Printer className={`mr-2 ${iconSize}`} /> {t('subscriber_profile.billing_action_print_pdf')}</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleBillingAction('send_email', item.id)}><Send className={`mr-2 ${iconSize}`} /> {t('subscriber_profile.billing_action_send_email')}</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    {activeBillingTab === 'All' && t('subscriber_profile.billing_no_invoices')}
                    {activeBillingTab === 'Pending' && t('subscriber_profile.billing_no_pending_invoices')}
                    {activeBillingTab === 'Paid' && t('subscriber_profile.billing_no_paid_invoices')}
                    {activeBillingTab === 'Canceled' && t('subscriber_profile.billing_no_canceled_invoices')}
                    {activeBillingTab === 'PaymentPlan' && t('subscriber_profile.billing_no_payment_plans')}
                    {activeBillingTab === 'PromiseToPay' && t('subscriber_profile.billing_no_promises_to_pay')}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="service-calls">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <Tabs defaultValue="All" value={activeServiceCallTab} onValueChange={(value) => setActiveServiceCallTab(value as ServiceCallStatusFilter)} className="w-full">
                    <TabsList className="grid w-full grid-cols-4 h-auto">
                        <TabsTrigger value="All"><List className={`mr-1.5 ${tabIconSize}`} />{t('subscriber_profile.service_calls_filter_all')}</TabsTrigger>
                        <TabsTrigger value="Pending"><Clock className={`mr-1.5 ${tabIconSize}`} />{t('subscriber_profile.service_calls_filter_pending')}</TabsTrigger>
                        <TabsTrigger value="InProgress"><Hourglass className={`mr-1.5 ${tabIconSize}`} />{t('subscriber_profile.service_calls_filter_in_progress')}</TabsTrigger>
                        <TabsTrigger value="Resolved"><CheckCircle className={`mr-1.5 ${tabIconSize}`} />{t('subscriber_profile.service_calls_filter_resolved')}</TabsTrigger>
                    </TabsList>
                </Tabs>
                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white ml-4 shrink-0">
                    <PlusCircle className={`mr-2 ${iconSize}`} />{t('subscriber_profile.service_calls_new_button')}
                </Button>
            </div>
            <Card>
              <CardContent className="pt-6">
                <p className="text-xs text-muted-foreground text-center py-4">{t('subscriber_profile.service_calls_none')}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inventory">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <Tabs defaultValue="All" value={activeInventoryTab} onValueChange={(value) => setActiveInventoryTab(value as InventoryFilter)} className="w-full">
                <TabsList className="grid w-full grid-cols-3 h-auto">
                  <TabsTrigger value="All"><ListFilterIcon className={`mr-1.5 ${tabIconSize}`} />{t('subscriber_profile.inventory_filter_all')}</TabsTrigger>
                  <TabsTrigger value="Lent"><PackageIcon className={`mr-1.5 ${tabIconSize}`} />{t('subscriber_profile.inventory_filter_lent')}</TabsTrigger>
                  <TabsTrigger value="Sold"><DollarSign className={`mr-1.5 ${tabIconSize}`} />{t('subscriber_profile.inventory_filter_sold')}</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white ml-4 shrink-0">
                <PlusCircle className={`mr-2 ${iconSize}`} /> {t('subscriber_profile.inventory_assign_button')}
              </Button>
            </div>
            <Card>
              <CardContent className="pt-6">
                <p className="text-xs text-muted-foreground text-center py-4">{t('subscriber_profile.inventory_none')}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <div className="flex flex-col gap-4">
            <div className="flex justify-end">
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white"><PlusCircle className={`mr-2 ${iconSize}`} />{t('subscriber_profile.documents_upload_button')}</Button>
            </div>
            <Card>
              <CardContent className="pt-6">
                <p className="text-xs text-muted-foreground text-center py-4">{t('subscriber_profile.documents_none')}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notes">
          <div className="flex flex-col gap-4">
            <div className="flex justify-end">
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white"><PlusCircle className={`mr-2 ${iconSize}`} />{t('subscriber_profile.notes_add_button')}</Button>
            </div>
            <Card>
              <CardContent className="pt-6">
                <p className="text-xs text-muted-foreground text-center py-4">{t('subscriber_profile.notes_none')}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardContent className="pt-6">
              <p className="text-xs text-muted-foreground text-center py-4">{t('subscriber_profile.history_none')}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {isNewContractWizardOpen && (
        <NewContractWizard
          isOpen={isNewContractWizardOpen}
          onClose={() => setIsNewContractWizardOpen(false)}
          subscriberId={subscriber.id.toString()}
        />
      )}
      <Dialog open={isUpdateLoginDialogOpen} onOpenChange={setIsUpdateLoginDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-sm">{t('subscriber_profile.update_login_dialog_title')}</DialogTitle>
            <DialogDescriptionComponent className="text-xs">
              {t('subscriber_profile.update_login_dialog_description', 'Update PPPoE login credentials for service {serviceId}.').replace('{serviceId}', currentServiceForLoginUpdate?.id || '')}
            </DialogDescriptionComponent>
          </DialogHeader>
          <Form {...pppoeForm}>
            <form onSubmit={pppoeForm.handleSubmit(onPppoeFormSubmit)} className="space-y-4">
              <FormField
                control={pppoeForm.control}
                name="pppoeUsername"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('subscriber_profile.services_pppoe_user')}</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={pppoeForm.control}
                name="pppoePassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('subscriber_profile.services_pppoe_pass')}</FormLabel>
                    <FormControl><Input type="password" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <DialogClose asChild><Button type="button" variant="outline">{t('subscriber_profile.update_login_cancel_button')}</Button></DialogClose>
                <Button type="submit" disabled={pppoeForm.formState.isSubmitting}>
                  {pppoeForm.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t('subscriber_profile.update_login_save_button')}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Promise to Pay Modal */}
       <Dialog open={isPromiseToPayModalOpen} onOpenChange={setIsPromiseToPayModalOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-sm">{t('subscriber_profile.promise_to_pay_modal_title')}</DialogTitle>
                    <DialogDescriptionComponent className="text-xs">{t('subscriber_profile.promise_to_pay_modal_desc')}</DialogDescriptionComponent>
                </DialogHeader>
                <Form {...promiseToPayForm}>
                    <form onSubmit={promiseToPayForm.handleSubmit(onPromiseToPaySubmit)} className="space-y-4 py-4">
                        <FormField
                            control={promiseToPayForm.control}
                            name="promiseDate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>{t('subscriber_profile.promise_to_pay_date_label')}</FormLabel>
                                    <Popover>
                                        <PopoverTriggerPrimitive asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn("pl-3 text-left font-normal text-xs", !field.value && "text-muted-foreground")}
                                                >
                                                    {field.value ? format(field.value, "PPP", { locale: dateLocales[locale] || enUSLocale }) : <span>{t('subscriber_profile.promise_to_pay_date_placeholder')}</span>}
                                                    <CalendarIcon className={`ml-auto ${iconSize} opacity-50`} />
                                                </Button>
                                            </FormControl>
                                        </PopoverTriggerPrimitive>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() -1)) }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={promiseToPayForm.control}
                            name="promiseAmount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('subscriber_profile.promise_to_pay_amount_label')}</FormLabel>
                                    <FormControl><Input type="number" step="0.01" placeholder="0.00" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="outline">{t('subscriber_profile.promise_to_pay_cancel_button')}</Button></DialogClose>
                            <Button type="submit" disabled={promiseToPayForm.formState.isSubmitting}>
                                {promiseToPayForm.formState.isSubmitting && <Loader2 className={`mr-2 ${iconSize} animate-spin`} />}
                                {t('subscriber_profile.promise_to_pay_save_button')}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>

    </div>
  );
}
