
// src/app/subscribers/profile/[id]/page.tsx
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"; // Added CardFooter
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Building, Server as ServerIcon, DollarSign, Wrench, Package, Edit, Trash2, PlusCircle, Loader2 } from 'lucide-react'; // Rename Server to avoid conflict, Added Edit, Trash2, PlusCircle, Loader2
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
    toast({ title: "Edit Subscriber (Not Implemented)", description: `Editing for ${subscriber.name} is not yet functional.` });
  };

  const handleDelete = () => {
    // Placeholder for delete action - Add confirmation dialog in real app
    console.log("Delete subscriber:", subscriberId);
    toast({ title: "Delete Subscriber (Not Implemented)", description: `Deletion for ${subscriber.name} is not yet functional.`, variant: "destructive" });
  };

  // Handle adding a new service
  const handleAddServiceSubmit = (data: AddServiceFormData) => {
    console.log('Add Service Data:', data, 'for subscriber:', subscriberId);
    // TODO: Implement actual API call to add the service
    addServiceForm.reset();
    setIsAddServiceDialogOpen(false);
    toast({
      title: "Service Added (Simulated)",
      description: `${data.serviceType} service added for ${subscriber.name}.`,
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
                {subscriber.type} Subscriber - ID: {subscriber.id} - Status: <span className="font-medium text-green-600">{subscriber.status}</span>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        {/* Optional: Add more basic info here if needed outside tabs */}
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
          <TabsTrigger value="overview">
            <User className="mr-2 h-4 w-4" /> Overview
          </TabsTrigger>
          <TabsTrigger value="services">
             <ServerIcon className="mr-2 h-4 w-4" /> Services
          </TabsTrigger>
          <TabsTrigger value="billing">
             <DollarSign className="mr-2 h-4 w-4" /> Billing
              {hasOutstandingBalance && (
                  <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs font-bold">
                      ! {/* Simple indicator */}
                  </span>
              )}
          </TabsTrigger>
          <TabsTrigger value="service-calls">
             <Wrench className="mr-2 h-4 w-4" /> Service Calls
          </TabsTrigger>
          <TabsTrigger value="inventory">
             <Package className="mr-2 h-4 w-4" /> Inventory
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab Content */}
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardDescription>General information about the subscriber.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p><strong>Name:</strong> {subscriber.name}</p>
              <p><strong>Type:</strong> {subscriber.type}</p>
              <p><strong>Status:</strong> {subscriber.status}</p>
              <p><strong>Address:</strong> {subscriber.address}</p>
              <p><strong>Email:</strong> {subscriber.email}</p>
              <p><strong>Phone:</strong> {subscriber.phone}</p>
              {/* Add more details if available, e.g., mobile number, tax ID based on type */}
            </CardContent>
            <CardFooter className="border-t pt-6 flex justify-end gap-2"> {/* Added footer with buttons */}
                <Button variant="outline" onClick={handleEdit}>
                   <Edit className="mr-2 h-4 w-4" /> Edit Client
                </Button>
                 {/* Consider adding an AlertDialog for delete confirmation */}
                 <Button variant="destructive" onClick={handleDelete}>
                     <Trash2 className="mr-2 h-4 w-4" /> Delete Client
                 </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Services Tab Content */}
        <TabsContent value="services">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                  <CardTitle>Services</CardTitle>
                  <CardDescription>Services currently subscribed to by the customer.</CardDescription>
              </div>
               {/* Add Service Dialog Trigger */}
               <Dialog open={isAddServiceDialogOpen} onOpenChange={setIsAddServiceDialogOpen}>
                 <DialogTrigger asChild>
                   <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                     <PlusCircle className="mr-2 h-4 w-4" /> Add Service
                   </Button>
                 </DialogTrigger>
                 <DialogContent className="sm:max-w-[425px]">
                   <DialogHeader>
                     <DialogTitle>Add New Service</DialogTitle>
                     <DialogDescription>
                       Select the service type and the Point of Presence (PoP) for this service.
                     </DialogDescription>
                   </DialogHeader>
                   <Form {...addServiceForm}>
                     <form onSubmit={addServiceForm.handleSubmit(handleAddServiceSubmit)} className="grid gap-4 py-4">
                       <FormField
                         control={addServiceForm.control}
                         name="serviceType"
                         render={({ field }) => (
                           <FormItem>
                             <FormLabel>Service Type</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                               <FormControl>
                                 <SelectTrigger>
                                   <SelectValue placeholder="Select service type" />
                                 </SelectTrigger>
                               </FormControl>
                               <SelectContent>
                                 <SelectItem value="Internet">Internet</SelectItem>
                                 <SelectItem value="TV">TV</SelectItem>
                                 <SelectItem value="Phone">Phone</SelectItem>
                                 <SelectItem value="Other">Other</SelectItem>
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
                             <FormLabel>Point of Presence (PoP)</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingPops || !!popsError}>
                               <FormControl>
                                 <SelectTrigger>
                                   <SelectValue placeholder={isLoadingPops ? "Loading PoPs..." : popsError ? "Error loading PoPs" : "Select PoP"} />
                                 </SelectTrigger>
                               </FormControl>
                               <SelectContent>
                                 {!isLoadingPops && !popsError && pops.map((pop) => (
                                   <SelectItem key={pop.id.toString()} value={pop.id.toString()}>
                                     {pop.name} ({pop.location})
                                   </SelectItem>
                                 ))}
                                  {/* Add message if loading or error */}
                                  {isLoadingPops && <div className="p-2 text-center text-muted-foreground">Loading...</div>}
                                  {popsError && <div className="p-2 text-center text-destructive">Error loading PoPs</div>}
                                  {!isLoadingPops && !popsError && pops.length === 0 && <div className="p-2 text-center text-muted-foreground">No PoPs found</div>}
                               </SelectContent>
                             </Select>
                             <FormMessage />
                           </FormItem>
                         )}
                       />
                       <DialogFooter>
                         <DialogClose asChild>
                           <Button type="button" variant="outline" disabled={addServiceForm.formState.isSubmitting}>Cancel</Button>
                         </DialogClose>
                         <Button type="submit" disabled={addServiceForm.formState.isSubmitting}>
                           {addServiceForm.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                           Add Service
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
                            <span className="text-xs text-muted-foreground">PoP: {pops.find(p => p.id.toString() === service.popId)?.name || service.popId}</span>
                            {/* Add edit/delete buttons per service if needed */}
                        </li>
                    ))}
                 </ul>
             ) : (
                 <p className="text-muted-foreground text-center py-4">No active services found for this subscriber.</p>
             )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab Content */}
        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing</CardTitle>
              <CardDescription>Invoices, payments, and billing history.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <p><strong>Current Balance:</strong> ${subscriber.billing?.balance.toFixed(2) || '0.00'}</p>
               <p><strong>Next Bill Date:</strong> {subscriber.billing?.nextBillDate || 'N/A'}</p>
               <p className="text-muted-foreground pt-4">Detailed invoice history will be displayed here. (Not Implemented)</p>
              {/* Placeholder for invoices table, payment methods, etc. */}
            </CardContent>
             {/* Add Footer for actions like "Make Payment", "View Invoices" */}
            <CardFooter className="border-t pt-6 flex justify-end gap-2">
                <Button variant="outline">View Invoices</Button>
                <Button>Make Payment</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Service Calls Tab Content */}
        <TabsContent value="service-calls">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                 <div>
                     <CardTitle>Service Calls</CardTitle>
                     <CardDescription>History of support tickets and service visits.</CardDescription>
                 </div>
                  <Button size="sm">
                      <PlusCircle className="mr-2 h-4 w-4" /> New Service Call
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
                 <p className="text-muted-foreground text-center py-4">No service call history found.</p>
             )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inventory Tab Content */}
        <TabsContent value="inventory">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
               <div>
                   <CardTitle>Inventory</CardTitle>
                   <CardDescription>Equipment assigned to the subscriber.</CardDescription>
               </div>
                <Button size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" /> Assign Equipment
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
                             <span className="text-xs text-muted-foreground">S/N: {item.serial}</span>
                             {/* Add buttons for actions like "Replace", "Remove" */}
                         </li>
                     ))}
                  </ul>
              ) : (
                  <p className="text-muted-foreground text-center py-4">No equipment assigned to this subscriber.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
