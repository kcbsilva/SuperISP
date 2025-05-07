// src/app/settings/network/vlan/page.tsx
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"; // Removed AlertDialogTrigger as it's not used directly here for delete
import { PlusCircle, Edit, Trash2, Loader2, RefreshCw } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { getPops } from '@/services/mysql/pops'; // Assuming PoP service exists
import type { Pop } from '@/types/pops';
import { Skeleton } from '@/components/ui/skeleton';

// VLAN Schema
const vlanSchema = z.object({
  vlanId: z.coerce.number().int().min(1, "VLAN ID must be between 1 and 4094.").max(4094, "VLAN ID must be between 1 and 4094."),
  name: z.string().min(1, "VLAN name is required."),
  description: z.string().optional(),
  popId: z.string().min(1, "PoP selection is required."),
  subnet: z.string().regex(/^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/, "Invalid subnet format (e.g., 192.168.1.0/24)."),
});

type VlanFormData = z.infer<typeof vlanSchema>;

interface Vlan extends VlanFormData {
  id: string; // Or number, depending on backend
  createdAt: Date;
}

const placeholderVlans: Vlan[] = [
  { id: 'vlan-1', vlanId: 10, name: 'Data VLAN - HQ', description: 'Main data network for headquarters', popId: 'sim-1', subnet: '192.168.10.0/24', createdAt: new Date() },
  { id: 'vlan-2', vlanId: 20, name: 'VoIP VLAN - Branch A', popId: 'sim-2', subnet: '10.10.20.0/25', createdAt: new Date(Date.now() - 86400000) },
  { id: 'vlan-3', vlanId: 30, name: 'Guest WiFi', description: 'Isolated network for guests', popId: 'sim-1', subnet: '172.16.30.0/24', createdAt: new Date(Date.now() - 172800000) },
];

const queryClient = new QueryClient();

export default function VlanPageWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <VlanManagementPage />
    </QueryClientProvider>
  );
}

function VlanManagementPage() {
  const { t } = useLocale();
  const { toast } = useToast();
  const [isAddVlanDialogOpen, setIsAddVlanDialogOpen] = React.useState(false);
  const [vlans, setVlans] = React.useState<Vlan[]>(placeholderVlans); // Using state for dynamic updates
  const [vlanToDelete, setVlanToDelete] = React.useState<Vlan | null>(null);
  const iconSize = "h-3 w-3";

  const { data: pops = [], isLoading: isLoadingPops, error: popsError } = useQuery<Pop[], Error>({
    queryKey: ['pops'],
    queryFn: getPops,
  });

  const form = useForm<VlanFormData>({
    resolver: zodResolver(vlanSchema),
    defaultValues: {
      vlanId: undefined,
      name: '',
      description: '',
      popId: '',
      subnet: '',
    },
  });

  const handleAddVlanSubmit = (data: VlanFormData) => {
    console.log("New VLAN Data:", data);
    const newVlan: Vlan = {
        ...data,
        id: `vlan-${Date.now()}`, // Simulate ID generation
        createdAt: new Date(),
    };
    setVlans(prev => [newVlan, ...prev]); // Add to local state
    toast({
      title: t('vlan_page.add_success_title', 'VLAN Added'),
      description: t('vlan_page.add_success_description', 'VLAN {name} ({vlanId}) has been added.').replace('{name}', data.name).replace('{vlanId}', data.vlanId.toString()),
    });
    form.reset();
    setIsAddVlanDialogOpen(false);
  };

  const handleEditVlan = (vlan: Vlan) => {
    // Placeholder for edit functionality
    toast({
      title: t('vlan_page.edit_not_implemented_title', 'Edit Not Implemented'),
      description: t('vlan_page.edit_not_implemented_desc', 'Editing VLAN {name} is not yet available.').replace('{name}', vlan.name),
    });
  };

  const confirmDeleteVlan = () => {
    if (vlanToDelete) {
      setVlans(prev => prev.filter(v => v.id !== vlanToDelete.id)); // Remove from local state
      toast({
        title: t('vlan_page.delete_success_title', 'VLAN Deleted'),
        description: t('vlan_page.delete_success_description', 'VLAN {name} ({vlanId}) has been deleted.').replace('{name}', vlanToDelete.name).replace('{vlanId}', vlanToDelete.vlanId.toString()),
        variant: 'destructive',
      });
      setVlanToDelete(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold">{t('vlan_page.title', 'Virtual Local Area Network (VLAN)')}</h1>
        <div className="flex items-center gap-2">
            <Button variant="default" className="bg-primary hover:bg-primary/90">
                <RefreshCw className={`mr-2 ${iconSize}`} /> {t('vlan_page.refresh_button', 'Refresh')}
            </Button>
             <Dialog open={isAddVlanDialogOpen} onOpenChange={setIsAddVlanDialogOpen}>
                <DialogTrigger asChild>
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                        <PlusCircle className={`mr-2 ${iconSize}`} /> {t('vlan_page.add_button', 'Add VLAN')}
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-sm">{t('vlan_page.add_dialog_title', 'Add New VLAN')}</DialogTitle>
                        <DialogDescription className="text-xs">{t('vlan_page.add_dialog_description', 'Configure a new Virtual LAN.')}</DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleAddVlanSubmit)} className="grid gap-4 py-4">
                            <FormField
                                control={form.control}
                                name="vlanId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('vlan_page.form_vlan_id_label', 'VLAN ID')}</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="1-4094" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('vlan_page.form_name_label', 'Name')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t('vlan_page.form_name_placeholder', 'e.g., Corporate Data')} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('vlan_page.form_description_label', 'Description (Optional)')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t('vlan_page.form_description_placeholder', 'e.g., Main network for company devices')} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="popId"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>{t('vlan_page.form_pop_label', 'Point of Presence (PoP)')}</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingPops || !!popsError}>
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder={isLoadingPops ? t('vlan_page.form_pop_loading', 'Loading PoPs...') : popsError ? t('vlan_page.form_pop_error', 'Error loading PoPs') : t('vlan_page.form_pop_placeholder', 'Select PoP')} />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {!isLoadingPops && !popsError && pops.map((pop) => (
                                          <SelectItem key={pop.id.toString()} value={pop.id.toString()}>
                                            {pop.name} ({pop.location})
                                          </SelectItem>
                                        ))}
                                         {isLoadingPops && <div className="p-2 text-center text-muted-foreground text-xs">{t('vlan_page.form_pop_loading', 'Loading PoPs...')}</div>}
                                         {popsError && <div className="p-2 text-center text-destructive text-xs">{t('vlan_page.form_pop_error', 'Error loading PoPs')}</div>}
                                         {!isLoadingPops && !popsError && pops.length === 0 && <div className="p-2 text-center text-muted-foreground text-xs">{t('vlan_page.form_pop_none', 'No PoPs found')}</div>}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="subnet"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('vlan_page.form_subnet_label', 'Subnet (IP/CIDR)')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., 192.168.1.0/24" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="outline" disabled={form.formState.isSubmitting}>{t('vlan_page.form_cancel_button', 'Cancel')}</Button>
                                </DialogClose>
                                <Button type="submit" disabled={form.formState.isSubmitting}>
                                    {form.formState.isSubmitting && <Loader2 className={`mr-2 ${iconSize} animate-spin`} />}
                                    {form.formState.isSubmitting ? t('vlan_page.form_saving_button', 'Saving...') : t('vlan_page.form_save_button', 'Save VLAN')}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm"></CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingPops ? (
             <div className="space-y-3">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
             </div>
          ) : vlans.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20 text-xs">{t('vlan_page.table_header_vlan_id', 'VLAN ID')}</TableHead>
                    <TableHead className="text-xs">{t('vlan_page.table_header_name', 'Name')}</TableHead>
                    <TableHead className="text-xs">{t('vlan_page.table_header_pop', 'PoP')}</TableHead>
                    <TableHead className="text-xs">{t('vlan_page.table_header_description', 'Description')}</TableHead>
                    <TableHead className="text-right w-28 text-xs">{t('vlan_page.table_header_actions', 'Actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vlans.map((vlan) => (
                    <TableRow key={vlan.id}>
                      <TableCell className="font-mono text-muted-foreground text-xs">{vlan.vlanId}</TableCell>
                      <TableCell className="font-medium text-xs">{vlan.name}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">{pops.find(p => p.id.toString() === vlan.popId)?.name || vlan.popId}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">{vlan.description || '-'}</TableCell>
                      <TableCell className="text-right">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditVlan(vlan)}>
                                <Edit className={iconSize} />
                                <span className="sr-only">{t('vlan_page.action_edit', 'Edit')}</span>
                            </Button>
                             <AlertDialog>
                               <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10">
                                    <Trash2 className={iconSize} />
                                    <span className="sr-only">{t('vlan_page.action_delete', 'Delete')}</span>
                                </Button>
                               </AlertDialogTrigger>
                               <AlertDialogContent>
                                 <AlertDialogHeader>
                                   <AlertDialogTitle>{t('vlan_page.delete_confirm_title', 'Are you sure?')}</AlertDialogTitle>
                                   <AlertDialogDescription className="text-xs">
                                     {t('vlan_page.delete_confirm_description', 'This action cannot be undone. This will permanently delete VLAN {name} ({vlanId}).').replace('{name}', vlan.name).replace('{vlanId}', vlan.vlanId.toString())}
                                   </AlertDialogDescription>
                                 </AlertDialogHeader>
                                 <AlertDialogFooter>
                                   <AlertDialogCancel onClick={() => setVlanToDelete(null)}>{t('vlan_page.delete_confirm_cancel', 'Cancel')}</AlertDialogCancel>
                                   <AlertDialogAction
                                     className={buttonVariants({ variant: "destructive" })}
                                     onClick={() => {
                                       setVlanToDelete(vlan);
                                       // This will trigger the useEffect or a direct call to confirmDeleteVlan
                                       // For simplicity, direct call, but in real app, might use useEffect based on vlanToDelete
                                       confirmDeleteVlan();
                                     }}
                                   >
                                     {t('vlan_page.delete_confirm_delete', 'Delete')}
                                   </AlertDialogAction>
                                 </AlertDialogFooter>
                               </AlertDialogContent>
                             </AlertDialog>
                        </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4 text-xs">{t('vlan_page.no_vlans_found', 'No VLANs configured yet. Click "Add VLAN" to create one.')}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
