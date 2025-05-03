// src/app/settings/business/pops/page.tsx
'use client'; // Make this a client component to use state for dialog

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
  DialogClose, // Import DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
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


// Define the Pop data structure
interface Pop {
  id: number;
  name: string;
  location: string;
  status: string;
}

// Validation Schema for the PoP form
const popSchema = z.object({
  name: z.string().min(1, 'PoP name is required'),
  location: z.string().min(1, 'Location is required'),
  // status could be added here if needed in the form
});

type PopFormData = z.infer<typeof popSchema>;

// Placeholder data - replace with actual data fetching later
const initialPops: Pop[] = [
  { id: 1, name: "Main Office POP", location: "123 Main St", status: "Active" },
  { id: 2, name: "Downtown POP", location: "456 Center Ave", status: "Active" },
  { id: 3, name: "Northside POP", location: "789 North Blvd", status: "Inactive" },
];


export default function PoPsPage() {
  const [pops, setPops] = React.useState<Pop[]>(initialPops);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<PopFormData>({
    resolver: zodResolver(popSchema),
    defaultValues: {
      name: '',
      location: '',
    },
  });

  // Handle adding a new PoP (replace with actual API call)
  const handleAddPop = (data: PopFormData) => {
    console.log("Adding PoP:", data);
    const newPop: Pop = {
      id: Date.now(), // Use a temporary ID
      name: data.name,
      location: data.location,
      status: "Active", // Default status for new PoPs
    };
    setPops([...pops, newPop]);
    toast({
      title: 'PoP Added',
      description: `${data.name} has been added successfully.`,
    });
    form.reset(); // Reset form fields
    setIsAddDialogOpen(false); // Close the dialog
  };

  // Handle removing a PoP (replace with actual API call)
  const handleRemovePop = (id: number) => {
    console.log("Removing PoP:", id);
    setPops(pops.filter(pop => pop.id !== id));
    toast({
      title: 'PoP Removed',
      description: `PoP has been removed.`,
      variant: 'destructive'
    });
  };

  // Handle editing a PoP (placeholder - implement edit modal/logic later)
   const handleEditPop = (id: number) => {
     console.log("Editing PoP:", id);
     // Find the PoP data
     const popToEdit = pops.find(pop => pop.id === id);
     if (popToEdit) {
       // For now, just show a toast. Implement edit modal later.
       toast({
         title: 'Edit PoP (Not Implemented)',
         description: `Editing for "${popToEdit.name}" is not yet implemented.`,
       });
     }
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
              <form onSubmit={form.handleSubmit(handleAddPop)} className="grid gap-4 py-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right">Name</FormLabel>
                      <FormControl className="col-span-3">
                        <Input placeholder="e.g., Central Hub" {...field} />
                      </FormControl>
                      <FormMessage className="col-span-4 text-right" /> {/* Ensure message spans */}
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
                        <Input placeholder="e.g., 123 Fiber Lane" {...field} />
                      </FormControl>
                       <FormMessage className="col-span-4 text-right" /> {/* Ensure message spans */}
                    </FormItem>
                  )}
                />
                 <DialogFooter>
                   {/* Use DialogClose for Cancel */}
                    <DialogClose asChild>
                      <Button type="button" variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Save PoP</Button>
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
          {pops.length > 0 ? (
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
                    <th scope="col" className="relative px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider"> {/* Align actions right */}
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
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        {/* Action buttons */}
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditPop(pop.id)}>
                           <Pencil className="h-4 w-4" />
                           <span className="sr-only">Edit PoP</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleRemovePop(pop.id)}>
                           <Trash2 className="h-4 w-4" />
                           <span className="sr-only">Remove PoP</span>
                        </Button>
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
