// src/app/settings/business/pops/page.tsx
'use client';

import * as React from 'react';
import { Button, buttonVariants } from "@/components/ui/button"; // Ensure buttonVariants is imported
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
import { Label } from "@/components/ui/label";
import { PlusCircle, Pencil, Trash2, Loader2, RefreshCw } from "lucide-react"; // Added RefreshCw
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
} from "@/components/ui/select" // Import Select components
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
} from "@/components/ui/alert-dialog"
import { QueryClient, QueryClientProvider, useQuery, useMutation, QueryKey } from '@tanstack/react-query';
// Import MySQL service functions instead of Firestore
import { getPops, addPop, deletePop, updatePop } from '@/services/mysql/pops';
import type { Pop, PopData } from '@/types/pops'; // Import types
import { Skeleton } from '@/components/ui/skeleton';
import { useLocale } from '@/contexts/LocaleContext'; // Import useLocale

// Validation Schema for the PoP form
const popSchema = z.object({
  name: z.string().min(1, 'PoP name is required'),
  location: z.string().min(1, 'Location is required'),
  status: z.enum(['Active', 'Inactive', 'Planned']).default('Active'), // Add status field with enum and default
});

type PopFormData = z.infer<typeof popSchema>;

// Define query key
const popsQueryKey: QueryKey = ['pops'];

// Create a client
const queryClient = new QueryClient();

// Main component wrapped with QueryClientProvider
export default function PoPsPageWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <PoPsPage />
    </QueryClientProvider>
  );
}


function PoPsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const { toast } = useToast();
  const { t } = useLocale(); // Get translation function

  // --- React Query Setup ---
  const { data: pops = [], isLoading: isLoadingPops, error: popsError, refetch: refetchPops } = useQuery<Pop[], Error>({
    queryKey: popsQueryKey, // Use defined query key
    queryFn: getPops, // Use MySQL getPops
  });

  const addPopMutation = useMutation<number, Error, PopData>({ // Return type might be number (ID)
    mutationFn: addPop, // Use MySQL addPop
    onSuccess: (newPopId, variables) => {
      queryClient.invalidateQueries({ queryKey: popsQueryKey }); // Refetch pops list
      toast({
        title: t('pops.add_success_toast_title'),
        description: t('pops.add_success_toast_description', '{name} has been added successfully.').replace('{name}', variables.name),
      });
      form.reset();
      setIsAddDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: t('pops.add_error_toast_title'),
        description: error.message || t('pops.add_error_toast_description'),
        variant: 'destructive',
      });
    },
  });

  const deletePopMutation = useMutation<void, Error, string | number>({ // ID can be string or number
    mutationFn: deletePop, // Use MySQL deletePop
    onSuccess: (_, popId) => {
      queryClient.invalidateQueries({ queryKey: popsQueryKey }); // Refetch pops list
      toast({
        title: t('pops.delete_success_toast_title'),
        description: t('pops.delete_success_toast_description'),
        variant: 'destructive' // Use destructive variant for removal confirmation
      });
    },
    onError: (error) => {
      toast({
        title: t('pops.delete_error_toast_title'),
        description: error.message || t('pops.delete_error_toast_description'),
        variant: 'destructive',
      });
    },
  });

   // --- Update Mutation (Placeholder/Example) ---
   const updatePopMutation = useMutation<void, Error, { id: string | number; data: Partial<PopData> }>({
    mutationFn: ({ id, data }) => updatePop(id, data), // Use MySQL updatePop
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: popsQueryKey });
      toast({
        title: t('pops.update_success_toast_title'),
        description: t('pops.update_success_toast_description'),
      });
      // Close edit dialog if open
      // setIsEditDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: t('pops.update_error_toast_title'),
        description: error.message || t('pops.update_error_toast_description'),
        variant: 'destructive',
      });
    },
  });


  // --- Form Handling ---
  const form = useForm<PopFormData>({
    resolver: zodResolver(popSchema),
    defaultValues: {
      name: '',
      location: '',
      status: 'Active', // Set default value for status
    },
  });

  // Handle adding a new PoP
  const handleAddPopSubmit = (data: PopFormData) => {
    addPopMutation.mutate(data); // Use react-query mutation
  };

  // Handle removing a PoP
  const handleRemovePopConfirm = (id: string | number) => { // ID can be string or number
    deletePopMutation.mutate(id); // Use react-query mutation
  };

  // Handle editing a PoP (placeholder - implement edit modal/logic later)
   const handleEditPop = (pop: Pop) => {
     console.log("Editing PoP:", pop);
     // TODO: Implement edit modal - Open dialog, set form defaults, handle update submission
     // form.reset({ name: pop.name, location: pop.location });
     // setSelectedPopForEdit(pop); // Need state to hold the pop being edited
     // setIsEditDialogOpen(true); // Need an edit dialog state

     // Example: Using update mutation directly (replace with modal logic)
     // updatePopMutation.mutate({ id: pop.id, data: { name: pop.name + ' Updated' } });

     toast({
       title: t('pops.edit_toast_title'),
       description: t('pops.edit_toast_description', 'Editing for "{name}" is not yet implemented.').replace('{name}', pop.name),
     });
   };

    // Handle refresh
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
        <h1 className="text-2xl font-semibold">{t('pops.title')}</h1>

        <div className="flex items-center gap-2"> {/* Wrapper for buttons */}
          {/* Refresh Button */}
          <Button
              variant="default" // Use default blue theme color
              onClick={handleRefresh}
              disabled={isLoadingPops || addPopMutation.isPending || deletePopMutation.isPending || updatePopMutation.isPending}
              className="bg-primary hover:bg-primary/90" // Explicitly use primary theme colors
          >
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoadingPops ? 'animate-spin' : ''}`} />
              {t('pops.refresh_button')}
          </Button>

          {/* Add PoP Dialog */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <PlusCircle className="mr-2 h-4 w-4" /> {t('pops.add_button')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{t('pops.add_dialog_title')}</DialogTitle>
                <DialogDescription>
                  {t('pops.add_dialog_description')}
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAddPopSubmit)} className="grid gap-4 py-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-4 items-center gap-4">
                        <FormLabel className="text-right">{t('pops.form_name_label')}</FormLabel>
                        <FormControl className="col-span-3">
                          <Input placeholder={t('pops.form_name_placeholder')} {...field} disabled={addPopMutation.isPending}/>
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
                          <Input placeholder={t('pops.form_location_placeholder')} {...field} disabled={addPopMutation.isPending}/>
                        </FormControl>
                         <FormMessage className="col-span-4 text-right" />
                      </FormItem>
                    )}
                  />
                  {/* Add Status Field */}
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-4 items-center gap-4">
                        <FormLabel className="text-right">{t('pops.form_status_label')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={addPopMutation.isPending}>
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
                        <Button type="button" variant="outline" disabled={addPopMutation.isPending}>{t('pops.form_cancel_button')}</Button>
                      </DialogClose>
                      <Button type="submit" disabled={addPopMutation.isPending}>
                          {addPopMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          {t('pops.form_save_button')}
                      </Button>
                   </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div> {/* End button wrapper */}

      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('pops.table_title')}</CardTitle>
          <CardDescription>{t('pops.table_description')}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingPops ? (
             <div className="space-y-3">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
             </div>
          ) : popsError ? (
             <p className="text-center text-destructive py-4">{t('pops.loading_error', 'Error loading PoPs: {message}').replace('{message}', popsError.message)}</p>
          ) : pops.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/50">
                  <tr>
                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-16"> {/* Added ID column */}
                       {t('pops.table_header_id')}
                     </th>
                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                       {t('pops.table_header_name')}
                     </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {t('pops.table_header_location')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {t('pops.table_header_status')}
                    </th>
                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-24"> {/* Added Created At */}
                       {t('pops.table_header_created')}
                     </th>
                    <th scope="col" className="relative px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider w-28">
                      {t('pops.table_header_actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-background divide-y divide-border">
                  {pops.map((pop) => (
                    <tr key={pop.id}>
                       <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-muted-foreground"> {/* ID data */}
                        {pop.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                        {pop.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {pop.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            pop.status && pop.status.toLowerCase() === "active" // Handle potential null/undefined status
                              ? "bg-green-100 text-green-800"
                              : pop.status && pop.status.toLowerCase() === "planned"
                                ? "bg-yellow-100 text-yellow-800" // Yellow for Planned
                                : "bg-red-100 text-red-800" // Default to inactive/red
                          }`}
                        >
                          {pop.status ? t(`pops.form_status_${pop.status.toLowerCase()}`, pop.status) : t('pops.status_unknown')} {/* Display localized status or Unknown */}
                        </span>
                      </td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground"> {/* Created At Data */}
                         {/* Check if createdAt is a Date object before calling methods */}
                         {pop.createdAt instanceof Date ? pop.createdAt.toLocaleDateString() : 'N/A'}
                       </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditPop(pop)}>
                           <Pencil className="h-4 w-4" />
                           <span className="sr-only">Edit PoP</span>
                        </Button>
                         {/* Alert Dialog for Delete Confirmation */}
                         <AlertDialog>
                           <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" disabled={deletePopMutation.isPending && deletePopMutation.variables === pop.id}>
                                 {deletePopMutation.isPending && deletePopMutation.variables === pop.id ? <Loader2 className="h-4 w-4 animate-spin"/> : <Trash2 className="h-4 w-4" />}
                                 <span className="sr-only">Remove PoP</span>
                              </Button>
                           </AlertDialogTrigger>
                           <AlertDialogContent>
                             <AlertDialogHeader>
                               <AlertDialogTitle>{t('pops.delete_alert_title')}</AlertDialogTitle>
                               <AlertDialogDescription>
                                 {t('pops.delete_alert_description', 'This action cannot be undone. This will permanently delete the PoP named "{name}" (ID: {id}).')
                                    .replace('{name}', pop.name)
                                    .replace('{id}', pop.id.toString())}
                               </AlertDialogDescription>
                             </AlertDialogHeader>
                             <AlertDialogFooter>
                               <AlertDialogCancel>{t('pops.delete_alert_cancel')}</AlertDialogCancel>
                               <AlertDialogAction
                                 className={buttonVariants({ variant: "destructive" })} // Style action as destructive
                                 onClick={() => handleRemovePopConfirm(pop.id)}
                               >
                                 {t('pops.delete_alert_delete')}
                               </AlertDialogAction>
                             </AlertDialogFooter>
                           </AlertDialogContent>
                         </AlertDialog>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4">{t('pops.no_pops_found')}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
