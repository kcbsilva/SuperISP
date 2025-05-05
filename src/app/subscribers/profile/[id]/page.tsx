// src/app/subscribers/profile/[id]/page.tsx
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"; // Added CardFooter
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Building, Server as ServerIcon, DollarSign, Wrench, Package, Edit, Trash2, PlusCircle, Loader2, FileText, ClipboardList, History as HistoryIcon } from 'lucide-react'; // Rename Server to avoid conflict, Added Edit, Trash2, PlusCircle, Loader2, FileText, ClipboardList, HistoryIcon
import { useParams } from 'next/navigation'; // Import useParams to get the ID
import { Button } from '@/components/ui/button'; // Import Button
import { useToast } from '@/hooks/use-toast'; // Import useToast for feedback
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
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'; // Import useQuery and QueryClientProvider
import { getPops } from '@/services/mysql/pops'; // Import PoP service
import type { Pop } from '@/types/pops'; // Import PoP type
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton
import { useLocale } from '@/contexts/LocaleContext'; // Import useLocale

// Validation Schema for the Add Service form
const addServiceSchema = z.object({
  serviceType: z.enum(['Internet', 'TV', 'Phone', 'Other'], {
    required_error: 'Service type is required',
  }),
  popId: z.string().min(1, 'PoP selection is required'), // Assuming PoP ID is a string or number representable as string
});

type AddServiceFormData = z.infer<typeof addServiceSchema>;

// Placeholder data - replace with actual data fetching based on ID
const getSubscriberData = (id: string | string[]) => {
    // Simulate fetching data for the given ID
    console.log("Fetching data for subscriber ID:", id);
    // In a real app, you would fetch this from your backend/database
    // Example using placeholder data based on ID:
    const baseData = {
        id: id.toString(), // Ensure ID is string
        name: `Subscriber ${id}`,
        type: 'Residential', // Default type
        status: 'Active',
        address: '123 Placeholder St',
        email: `subscriber${id}@example.com`,
        phone: `555-0${id}`,
        services: [ // Add sample services
            { id: 'svc-1', type: 'Internet', plan: 'Fiber 100', popId: 'sim-1' },
            { id: 'svc-2', type: 'TV', plan: 'Basic Cable', popId: 'sim-1' },
        ],
        billing: { balance: 50.00, nextBillDate: '2024-08-15' },
        serviceCalls: [
            { id: 'sc-1', date: '2024-07-10', issue: 'Slow internet', status: 'Resolved' },
        ],
        inventory: [
            { id: 'inv-1', type: 'Router', model: 'Netgear R7000', serial: 'XYZ123' },
            { id: 'inv-2', type: 'Modem', model: 'Arris SB8200', serial: 'ABC789' },
        ],
        // Placeholder for new tabs
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

    // Customize based on specific IDs if needed for demo
    if (id === 'sub-1') {
        baseData.name = 'Alice Wonderland';
        baseData.address = '123 Fantasy Lane';
        baseData.email = 'alice@example.com';
        baseData.phone = '555-1111';
        baseData.billing.balance = 0.00; // No outstanding balance for Alice
    } else if (id === 'sub-2') {
        baseData.name = 'Bob The Builder Inc.';
        baseData.type = 'Commercial';
        baseData.address = '456 Construction Ave';
        baseData.email = 'bob@example.com';
        baseData.phone = '555-2222';
        baseData.services = [
             { id: 'svc-3', type: 'Internet', plan: 'Business Fiber 1G', popId: 'sim-2' }
        ];
        baseData.billing.balance = 150.75; // Bob has an outstanding balance
    }

    return baseData;
};

// Create a client
const queryClient = new QueryClient();

// Main component wrapped with QueryClientProvider
export default function SubscriberProfilePageWrapper() {
    return (
        <QueryClientProvider client={queryClient}>
            <SubscriberProfilePage />
        </QueryClientProvider>
    );
}


function SubscriberProfilePage() {
  const params = useParams();
  const subscriberId = params.id; // Get the ID from the route parameters
  const { toast } = useToast();
  const { t } = useLocale(); // Get translation function
  const [isAddServiceDialogOpen, setIsAddServiceDialogOpen] = React.useState(false);

  // --- React Query for PoPs ---
  const { data: pops = [], isLoading: isLoadingPops, error: popsError } = useQuery<Pop[], Error>({
    queryKey: ['pops'], // Unique query key for PoPs
    queryFn: getPops,
  });

  // --- Form Handling for Add Service ---
  const addServiceForm = useForm<AddServiceFormData>({
    resolver: zodResolver(addServiceSchema),
    defaultValues: {
      serviceType: undefined,
      popId: '',
    },
  });

  // Simulate fetching subscriber data
  const subscriber = React.useMemo(() => getSubscriberData(subscriberId), [subscriberId]);

  // Check for outstanding balance
  const hasOutstandingBalance = (subscriber?.billing?.balance ?? 0) > 0;


  const handleEdit = () => {
    // Placeholder for edit action
    console.log("Edit subscriber:", subscriberId);
    toast({
      title: t('subscriber_profile.edit_toast_title'),
      description: t('subscriber_profile.edit_toast_description', 'Editing for {name} is not yet functional.').replace('{name}', subscriber.name)
    });
  };

  const handleDelete = () => {
    // Placeholder for delete action - Add confirmation dialog in real app
    console.log("Delete subscriber:", subscriberId);
    toast({
      title: t('subscriber_profile.delete_toast_title'),
      description: t('subscriber_profile.delete_toast_description', 'Deletion for {name} is not yet functional.').replace('{name}', subscriber.name),
      variant: "destructive"
    });
  };

  // Handle adding a new service
  const handleAddServiceSubmit = (data: AddServiceFormData) => {
    console.log('Add Service Data:', data, 'for subscriber:', subscriberId);
    // TODO: Implement actual API call to add the service
    addServiceForm.reset();
    setIsAddServiceDialogOpen(false);
    toast({
      title: t('subscriber_profile.add_service_success_toast_title'),
      description: t('subscriber_profile.add_service_success_toast_description', '{serviceType} service added for {name}.')
        .replace('{serviceType}', data.serviceType)
        .replace('{name}', subscriber.name),
    });
    // Consider refetching subscriber data or updating local state if necessary
  };


  if (!subscriber) {
    // You might want a more robust loading state, potentially using Skeleton components
    return (
        <div className="flex flex-col gap-6">
             <Skeleton className="h-24 w-full" />
             <Skeleton className="h-10 w-full" />
             <Skeleton className="h-64 w-full" />
             {/* Add localized loading message if needed */}
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
              <User className="h-8 w-8 text-muted-foreground" />
            ) : (
              <Building className="h-8 w-8 text-muted-foreground" />
            )}
            <div>
              <CardTitle>{subscriber.name}</CardTitle>
              <CardDescription>
                {t(`add_subscriber.type_${subscriber.type.toLowerCase()}` as any, subscriber.type)} {t('subscriber_profile.status_label')}: <span className="font-medium text-green-600">{t(`list_subscribers.status_${subscriber.status.toLowerCase()}` as any, subscriber.status)}</span> - ID: {subscriber.id}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        {/* Optional: Add more basic info here if needed outside tabs */}
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 md:grid-cols-8"> {/* Adjusted grid columns */}
          <TabsTrigger value="overview">
            <User className="mr-2 h-4 w-4" /> {t('subscriber_profile.overview_tab')}
          </TabsTrigger>
          <TabsTrigger value="services">
             <ServerIcon className="mr-2 h-4 w-4" /> {t('subscriber_profile.services_tab')}
          </TabsTrigger>
          <TabsTrigger value="billing">
             <DollarSign className="mr-2 h-4 w-4" /> {t('subscriber_profile.billing_tab')}
              {hasOutstandingBalance && (
                  <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs font-bold">
                      ! {/* Simple indicator */}
                  </span>
              )}
          </TabsTrigger>
          <TabsTrigger value="service-calls">
             <Wrench className="mr-2 h-4 w-4" /> {t('subscriber_profile.service_calls_tab')}
          </TabsTrigger>
          <TabsTrigger value="inventory">
             <Package className="mr-2 h-4 w-4" /> {t('subscriber_profile.inventory_tab')}
          </TabsTrigger>
          {/* New Tabs */}
          <TabsTrigger value="documents">
             <FileText className="mr-2 h-4 w-4" /> {t('subscriber_profile.documents_tab')}
          </TabsTrigger>
          <TabsTrigger value="notes">
             <ClipboardList className="mr-2 h-4 w-4" /> {t('subscriber_profile.notes_tab')}
          </TabsTrigger>
          <TabsTrigger value="history">
             <HistoryIcon className="mr-2 h-4 w-4" /> {t('subscriber_profile.history_tab')}
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab Content */}
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>{t('subscriber_profile.overview_card_title')}</CardTitle>
              <CardDescription>{t('subscriber_profile.overview_card_description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p><strong>{t('subscriber_profile.overview_name')}:</strong> {subscriber.name}</p>
              <p><strong>{t('subscriber_profile.overview_type')}:</strong> {t(`add_subscriber.type_${subscriber.type.toLowerCase()}` as any, subscriber.type)}</p>
              <p><strong>{t('subscriber_profile.overview_status')}:</strong> {t(`list_subscribers.status_${subscriber.status.toLowerCase()}` as any, subscriber.status)}</p>
              <p><strong>{t('subscriber_profile.overview_address')}:</strong> {subscriber.address}</p>
              <p><strong>{t('subscriber_profile.overview_email')}:</strong> {subscriber.email}</p>
              <p><strong>{t('subscriber_profile.overview_phone')}:</strong> {subscriber.phone}</p>
              {/* Add more details if available, e.g., mobile number, tax ID based on type */}
            </CardContent>
            <CardFooter className="border-t pt-6 flex justify-end gap-2"> {/* Added footer with buttons */}
                <Button variant="outline" onClick={handleEdit}>
                   <Edit className="mr-2 h-4 w-4" /> {t('subscriber_profile.edit_button')}
                </Button>
                 {/* Consider adding an AlertDialog for delete confirmation */}
                 <Button variant="destructive" onClick={handleDelete}>
                     <Trash2 className="mr-2 h-4 w-4" /> {t('subscriber_profile.delete_button')}
                 </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Services Tab Content */}
        <TabsContent value="services">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                  <CardTitle>{t('subscriber_profile.services_card_title')}</CardTitle>
                  <CardDescription>{t('subscriber_profile.services_card_description')}</CardDescription>
              </div>
               {/* Add Service Dialog Trigger */}
               <Dialog open={isAddServiceDialogOpen} onOpenChange={setIsAddServiceDialogOpen}>
                 <DialogTrigger asChild>
                   <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                     <PlusCircle className="mr-2 h-4 w-4" /> {t('subscriber_profile.add_service_button')}
                   </Button>
                 </DialogTrigger>
                 <DialogContent className="sm:max-w-[425px]">
                   <DialogHeader>
                     <CardTitle>{t('subscriber_profile.add_service_dialog_title')}</CardTitle>
                     <CardDescription>
                       {t('subscriber_profile.add_service_dialog_description')}
                     </CardDescription>
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
                                 <SelectItem value="Phone">{t('subscriber_profile.add_service_type_phone')}</SelectItem>
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
                                  {/* Add message if loading or error */}
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
                           {addServiceForm.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                           {addServiceForm.formState.isSubmitting ? t('subscriber_profile.add_service_saving_button') : t('subscriber_profile.add_service_save_button')}
                         </Button>
                       </DialogFooter>
                     </form>
                   </Form>
                 </DialogContent>
               </Dialog>
            </CardHeader>
            <CardContent>
             {subscriber.services && subscriber.services.length > 0 ? (
                 <ul className="space-y-3">
                    {subscriber.services.map(service => (
                        <li key={service.id} className="flex justify-between items-center p-3 border rounded-md">
                            <div>
                                <span className="font-medium">{service.type}</span> - <span className="text-sm text-muted-foreground">{service.plan}</span>
                            </div>
                             {/* Optionally display PoP name if needed by looking up service.popId in the pops array */}
                            <span className="text-xs text-muted-foreground">{t('subscriber_profile.services_pop_label')}: {pops.find(p => p.id.toString() === service.popId)?.name || service.popId}</span>
                            {/* Add edit/delete buttons per service if needed */}
                        </li>
                    ))}
                 </ul>
             ) : (
                 <p className="text-muted-foreground text-center py-4">{t('subscriber_profile.services_none')}</p>
             )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab Content */}
        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>{t('subscriber_profile.billing_card_title')}</CardTitle>
              <CardDescription>{t('subscriber_profile.billing_card_description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <p><strong>{t('subscriber_profile.billing_balance')}:</strong> ${subscriber.billing?.balance.toFixed(2) || '0.00'}</p>
               <p><strong>{t('subscriber_profile.billing_next_date')}:</strong> {subscriber.billing?.nextBillDate || t('subscriber_profile.billing_not_available')}</p>
               <p className="text-muted-foreground pt-4">{t('subscriber_profile.billing_no_history')}</p>
              {/* Placeholder for invoices table, payment methods, etc. */}
            </CardContent>
             {/* Add Footer for actions like "Make Payment", "View Invoices" */}
            <CardFooter className="border-t pt-6 flex justify-end gap-2">
                <Button variant="outline">{t('subscriber_profile.billing_view_invoices_button')}</Button>
                <Button>{t('subscriber_profile.billing_make_payment_button')}</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Service Calls Tab Content */}
        <TabsContent value="service-calls">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                 <div>
                     <CardTitle>{t('subscriber_profile.service_calls_card_title')}</CardTitle>
                     <CardDescription>{t('subscriber_profile.service_calls_card_description')}</CardDescription>
                 </div>
                  <Button size="sm">
                      <PlusCircle className="mr-2 h-4 w-4" /> {t('subscriber_profile.service_calls_new_button')}
                  </Button>
            </CardHeader>
            <CardContent>
             {subscriber.serviceCalls && subscriber.serviceCalls.length > 0 ? (
                  <ul className="space-y-3">
                     {subscriber.serviceCalls.map(call => (
                         <li key={call.id} className="flex justify-between items-center p-3 border rounded-md">
                             <div>
                                 <span className="font-medium">{call.date}</span> - <span className="text-sm text-muted-foreground">{call.issue}</span>
                             </div>
                             <span className={`text-xs px-2 py-0.5 rounded-full ${call.status === 'Resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{call.status}</span>
                             {/* Add button to view details */}
                         </li>
                     ))}
                  </ul>
             ) : (
                 <p className="text-muted-foreground text-center py-4">{t('subscriber_profile.service_calls_none')}</p>
             )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inventory Tab Content */}
        <TabsContent value="inventory">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
               <div>
                   <CardTitle>{t('subscriber_profile.inventory_card_title')}</CardTitle>
                   <CardDescription>{t('subscriber_profile.inventory_card_description')}</CardDescription>
               </div>
                <Button size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" /> {t('subscriber_profile.inventory_assign_button')}
                </Button>
            </CardHeader>
            <CardContent>
              {subscriber.inventory && subscriber.inventory.length > 0 ? (
                  <ul className="space-y-3">
                     {subscriber.inventory.map(item => (
                         <li key={item.id} className="flex justify-between items-center p-3 border rounded-md">
                             <div>
                                 <span className="font-medium">{item.type}</span> - <span className="text-sm text-muted-foreground">{item.model}</span>
                             </div>
                             <span className="text-xs text-muted-foreground">{t('subscriber_profile.inventory_serial_label')}: {item.serial}</span>
                             {/* Add buttons for actions like "Replace", "Remove" */}
                         </li>
                     ))}
                  </ul>
              ) : (
                  <p className="text-muted-foreground text-center py-4">{t('subscriber_profile.inventory_none')}</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

         {/* Documents Tab Content */}
        <TabsContent value="documents">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{t('subscriber_profile.documents_card_title')}</CardTitle>
                <CardDescription>{t('subscriber_profile.documents_card_description')}</CardDescription>
              </div>
              <Button size="sm">
                 <PlusCircle className="mr-2 h-4 w-4" /> {t('subscriber_profile.documents_upload_button')}
              </Button>
            </CardHeader>
            <CardContent>
              {subscriber.documents && subscriber.documents.length > 0 ? (
                <ul className="space-y-3">
                  {subscriber.documents.map(doc => (
                    <li key={doc.id} className="flex justify-between items-center p-3 border rounded-md">
                      <div>
                        <span className="font-medium">{doc.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{t('subscriber_profile.documents_uploaded_label')}: {doc.uploaded}</span>
                       {/* Add download/delete buttons */}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-center py-4">{t('subscriber_profile.documents_none')}</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notes Tab Content */}
        <TabsContent value="notes">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
               <div>
                 <CardTitle>{t('subscriber_profile.notes_card_title')}</CardTitle>
                 <CardDescription>{t('subscriber_profile.notes_card_description')}</CardDescription>
               </div>
                <Button size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" /> {t('subscriber_profile.notes_add_button')}
                </Button>
            </CardHeader>
            <CardContent>
              {subscriber.notes && subscriber.notes.length > 0 ? (
                  <ul className="space-y-3">
                     {subscriber.notes.map(note => (
                         <li key={note.id} className="p-3 border rounded-md">
                             <p className="text-sm mb-1">{note.text}</p>
                             <p className="text-xs text-muted-foreground">{t('subscriber_profile.notes_author_label')}: {note.author} - {note.date}</p>
                              {/* Add edit/delete buttons */}
                         </li>
                     ))}
                  </ul>
              ) : (
                  <p className="text-muted-foreground text-center py-4">{t('subscriber_profile.notes_none')}</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab Content */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>{t('subscriber_profile.history_card_title')}</CardTitle>
              <CardDescription>{t('subscriber_profile.history_card_description')}</CardDescription>
            </CardHeader>
            <CardContent>
              {subscriber.history && subscriber.history.length > 0 ? (
                  <ul className="space-y-3">
                     {subscriber.history.map(entry => (
                         <li key={entry.id} className="flex justify-between items-center p-3 border rounded-md">
                             <div>
                                 <span className="font-medium">{entry.event}</span>
                             </div>
                             <span className="text-xs text-muted-foreground">{t('subscriber_profile.history_user_label')}: {entry.user} - {entry.timestamp}</span>
                         </li>
                     ))}
                  </ul>
              ) : (
                  <p className="text-muted-foreground text-center py-4">{t('subscriber_profile.history_none')}</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
