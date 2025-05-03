// src/app/settings/business/pops/page.tsx
'use client';

import * as React from 'react';
import { Button } from "@/components/ui/button";
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
import { PlusCircle, Pencil, Trash2, Loader2 } from "lucide-react";
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
import { QueryClient, QueryClientProvider, useQuery, useMutation } from '@tanstack/react-query';
import { getPops, addPop, deletePop, updatePop } from '@/services/firestore/pops'; // Import Firestore service functions
import type { Pop, PopData } from '@/types/pops'; // Import types
import { Skeleton } from '@/components/ui/skeleton';


// Validation Schema for the PoP form
const popSchema = z.object({
  name: z.string().min(1, 'PoP name is required'),
  location: z.string().min(1, 'Location is required'),
});

type PopFormData = z.infer<typeof popSchema>;

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

  // --- React Query Setup ---
  const { data: pops = [], isLoading: isLoadingPops, error: popsError } = useQuery<Pop[], Error>({
    queryKey: ['pops'],
    queryFn: getPops,
  });

  const addPopMutation = useMutation<string, Error, PopData>({
    mutationFn: addPop,
    onSuccess: (newPopId, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pops'] }); // Refetch pops list
      toast({
        title: 'PoP Added',
        description: `${variables.name} has been added successfully.`,
      });
      form.reset();
      setIsAddDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Error Adding PoP',
        description: error.message || 'Could not add the PoP.',
        variant: 'destructive',
      });
    },
  });

  const deletePopMutation = useMutation<void, Error, string>({
    mutationFn: deletePop,
    onSuccess: (_, popId) => {
       // Optimistic update (optional): remove from cache immediately
       // queryClient.setQueryData(['pops'], (oldData: Pop[] | undefined) =>
       //   oldData ? oldData.filter((pop) => pop.id !== popId) : []
       // );
      queryClient.invalidateQueries({ queryKey: ['pops'] }); // Refetch pops list
      toast({
        title: 'PoP Removed',
        description: `PoP has been removed.`,
        variant: 'destructive' // Use default variant for removal confirmation
      });
    },
    onError: (error) => {
      toast({
        title: 'Error Removing PoP',
        description: error.message || 'Could not remove the PoP.',
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
    },
  });

  // Handle adding a new PoP
  const handleAddPopSubmit = (data: PopFormData) => {
    addPopMutation.mutate(data); // Use react-query mutation
  };

  // Handle removing a PoP
  const handleRemovePopConfirm = (id: string) => {
    deletePopMutation.mutate(id); // Use react-query mutation
  };

  // Handle editing a PoP (placeholder - implement edit modal/logic later)
   const handleEditPop = (pop: Pop) => {
     console.log("Editing PoP:", pop);
     // TODO: Implement edit modal
     // Example: Set form defaults, open an edit dialog
     // form.reset({ name: pop.name, location: pop.location });
     // setIsEditDialogOpen(true); // Need an edit dialog state
     toast({
       title: 'Edit PoP (Not Implemented)',
       description: `Editing for "${pop.name}" is not yet implemented.`,
     });
   };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Points of Presence (PoPs)</h1>

        {/* Add PoP Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <PlusCircle className="mr-2 h-4 w-4" /> Add PoP
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Point of Presence</DialogTitle>
              <DialogDescription>
                Enter the details for the new PoP. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddPopSubmit)} className="grid gap-4 py-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right">Name</FormLabel>
                      <FormControl className="col-span-3">
                        <Input placeholder="e.g., Central Hub" {...field} disabled={addPopMutation.isPending}/>
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
                      <FormLabel className="text-right">Location</FormLabel>
                      <FormControl className="col-span-3">
                        <Input placeholder="e.g., 123 Fiber Lane" {...field} disabled={addPopMutation.isPending}/>
                      </FormControl>
                       <FormMessage className="col-span-4 text-right" />
                    </FormItem>
                  )}
                />
                 <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="outline" disabled={addPopMutation.isPending}>Cancel</Button>
                    </DialogClose>
                    <Button type="submit" disabled={addPopMutation.isPending}>
                        {addPopMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save PoP
                    </Button>
                 </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

      </div>

      <Card>
        <CardHeader>
          <CardTitle>Existing PoPs</CardTitle>
          <CardDescription>Manage your network's points of presence.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingPops ? (
             <div className="space-y-3">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
             </div>
          ) : popsError ? (
             <p className="text-center text-destructive py-4">Error loading PoPs: {popsError.message}</p>
          ) : pops.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/50">
                  <tr>
                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                       Name
                     </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Location
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-24"> {/* Added Created At */}
                       Created
                     </th>
                    <th scope="col" className="relative px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider w-28">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-background divide-y divide-border">
                  {pops.map((pop) => (
                    <tr key={pop.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                        {pop.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {pop.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            pop.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {pop.status}
                        </span>
                      </td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground"> {/* Added Created At Data */}
                         {pop.createdAt ? pop.createdAt.toDate().toLocaleDateString() : 'N/A'}
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
                               <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                               <AlertDialogDescription>
                                 This action cannot be undone. This will permanently delete the PoP named "{pop.name}".
                               </AlertDialogDescription>
                             </AlertDialogHeader>
                             <AlertDialogFooter>
                               <AlertDialogCancel>Cancel</AlertDialogCancel>
                               <AlertDialogAction
                                 className={buttonVariants({ variant: "destructive" })} // Style action as destructive
                                 onClick={() => handleRemovePopConfirm(pop.id)}
                               >
                                 Delete
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
            <p className="text-center text-muted-foreground py-4">No PoPs found. Click "Add PoP" to create one.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
