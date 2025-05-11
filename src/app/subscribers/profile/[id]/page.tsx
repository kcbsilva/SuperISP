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
  Combine,
  ListFilter as ListFilterIcon,
  CheckCircle,
  XCircle,
  Clock,
  CalendarClock,
  Handshake,
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
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
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
import type { Subscriber } from '@/types/subscribers'; // Assuming this type exists

// Placeholder data functions (replace with actual data fetching)
const getSubscriberData = (id: string | string[] | undefined): Subscriber | null => {
  if (!id) return null;
  // Simulate fetching data
  if (id === 'sub-1' || id === '1') {
    return {
      id: 1,
      subscriberType: 'Residential',
      fullName: 'Alice Wonderland',
      address: '123 Fantasy Lane, Wonderland, WND 12345',
      pointOfReference: 'Next to the Mad Hatter Tea Party',
      email: 'alice@example.com',
      phoneNumber: '555-1111',
      mobileNumber: '555-1010',
      birthday: new Date(1985, 3, 15),
      taxId: '123.456.789-00',
      signupDate: new Date(2022, 0, 10),
      status: 'Active',
      createdAt: new Date(),
      updatedAt: new Date(),
      services: [
        { id: 'svc-1', type: 'Internet', plan: 'Fiber 100', popId: 'pop-1', status: 'Active', technology: 'Fiber', downloadSpeed: '100 Mbps', uploadSpeed: '50 Mbps', ipAddress: '203.0.113.10', onlineStatus: 'Online', authenticationType: 'PPPoE', pppoeUsername: 'alice@isp.com', pppoePassword: 'password', xponSn: 'HWTC12345678' },
        { id: 'svc-2', type: 'TV', plan: 'Basic Cable', popId: 'pop-1', status: 'Active' },
      ],
      billing: {
        balance: 0.00,
        nextBillDate: '2024-09-15',
        pastInvoices: [{ id: 'inv-001', date: '2024-07-15', amount: 50.00, status: 'Paid' }],
        pendingInvoices: [{ id: 'inv-p04', contractId: 'SVC-ALICE-INT-001', dateMade: '2024-08-01', dueDate: '2024-08-20', value: 50.00, wallet: 'Visa **** 1234', status: 'Due' }],
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
  }
  if (id === 'sub-2' || id === '2') {
    return {
        id: 2,
        subscriberType: 'Commercial',
        companyName: 'Bob The Builder Inc.',
        address: '456 Construction Ave, Builderville, BLD 67890',
        pointOfReference: 'Yellow crane visible from the street',
        email: 'bob@example.com',
        phoneNumber: '555-2222',
        mobileNumber: '555-2020',
        establishedDate: new Date(2005, 7, 20),
        businessNumber: '98.765.432/0001-00',
        signupDate: new Date(2021, 5, 1),
        status: 'Active',
        createdAt: new Date(),
        updatedAt: new Date(),
        services: [
          { id: 'svc-3', type: 'Internet', plan: 'Business Fiber 1G', popId: 'pop-2', status: 'Active', technology: 'Fiber', downloadSpeed: '1 Gbps', uploadSpeed: '500 Mbps', ipAddress: '203.0.113.20', onlineStatus: 'Online', authenticationType: 'StaticIP', xponSn: 'FHTT98765432' }
        ],
        billing: {
          balance: 150.75,
          nextBillDate: '2024-09-01',
          pastInvoices: [],
          pendingInvoices: [{ id: 'inv-p02', contractId: 'SVC-BIZ-001', dateMade: '2024-08-01', dueDate: '2024-08-15', value: 150.75, wallet: 'Company Account', status: 'Due' }],
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
  }
  return null;
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

  const iconSize = "h-3 w-3";
  const tabIconSize = "h-2.5 w-2.5";

  const subscriber = React.useMemo(() => {
    if (!subscriberId) return null;
    return getSubscriberData(subscriberId);
  }, [subscriberId]);

  const hasOutstandingBalance = React.useMemo(() =>
    (subscriber?.billing?.balance ?? 0) > 0 || (subscriber?.billing?.pendingInvoices?.length ?? 0) > 0,
    [subscriber?.billing]
  );

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

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            {subscriber.subscriberType === 'Residential' ? (
              <User className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Building className="h-4 w-4 text-muted-foreground" />
            )}
            <div>
              <CardTitle className="text-base">{subscriber.subscriberType === 'Residential' ? subscriber.fullName : subscriber.companyName} (ID: {subscriber.id})</CardTitle>
            </div>
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
                  <OverviewDetailItem icon={Fingerprint} labelKey="subscriber_profile.overview_id_number" value={(subscriber as any).idNumber} /> {/* Assuming idNumber exists */}
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
                    <TabsTrigger value="Combo"><Combine className={`mr-1.5 ${tabIconSize}`} />{t('subscriber_profile.services_filter_combo')}</TabsTrigger>
                    </TabsList>
                </Tabs>
                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white ml-4 shrink-0" onClick={() => setIsAddServiceDialogOpen(true)}>
                    <PlusCircle className={`mr-2 ${iconSize}`} /> {t('subscriber_profile.add_service_button')}
                </Button>
             </div>
            <Card>
              <CardContent className="pt-6">
                <p className="text-xs text-muted-foreground text-center py-4">{t('subscriber_profile.services_none')}</p>
              </CardContent>
            </Card>
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
                 <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white ml-4 shrink-0" onClick={handleMakeInvoice}>
                    <FilePlus2 className={`mr-2 ${iconSize}`} /> {t('subscriber_profile.billing_make_invoice_button')}
                </Button>
            </div>
            <Card>
              <CardContent className="pt-6">
                <p className="text-xs text-muted-foreground text-center py-4">{t('subscriber_profile.billing_no_invoices')}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="service-calls">
          <div className="flex flex-col gap-4">
            <div className="flex justify-end">
                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white"><PlusCircle className={`mr-2 ${iconSize}`} />{t('subscriber_profile.service_calls_new_button')}</Button>
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
    </div>
  );
}
