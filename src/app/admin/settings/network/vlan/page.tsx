// src/app/settings/network/vlan/page.tsx
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
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
  DialogDescription as DialogDescriptionComponent,
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PlusCircle, Edit, Trash2, Loader2, RefreshCw, Split, Search } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery } from '@tanstack/react-query';
import { getPops } from '@/services/mysql/pops';
import type { Pop } from '@/types/pops';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { cn } from "@/lib/utils";

// Mock participant type (replace with your actual type)
interface Participant {
  id: string;
  name: string;
  email: string;
  company: string;
}

// Mock participants data (replace with actual API call)
const mockParticipants: Participant[] = [
  { id: '1', name: 'John Doe', email: 'john@acmecorp.com', company: 'Acme Corporation' },
  { id: '2', name: 'Jane Smith', email: 'jane@techsolutions.com', company: 'Tech Solutions Inc' },
  { id: '3', name: 'Bob Johnson', email: 'bob@innovatetech.com', company: 'Innovate Tech' },
  { id: '4', name: 'Alice Brown', email: 'alice@globalnet.com', company: 'Global Networks' },
];

// Updated VLAN Schema (removed name and subnet, added assignedTo and availableInHub)
const vlanSchema = z.object({
  vlanId: z.coerce.number().int().min(1, "VLAN ID must be between 1 and 4094.").max(4094, "VLAN ID must be between 1 and 4094."),
  description: z.string().optional(),
  popId: z.string().min(1, "PoP selection is required."),
  isTagged: z.boolean().default(true),
  status: z.enum(['Active', 'Inactive']).default('Active'),
  assignedTo: z.string().min(1, "Assigned to is required."),
  availableInHub: z.boolean().default(false),
  participantId: z.string().optional(),
});

type VlanFormData = z.infer<typeof vlanSchema>;

interface Vlan extends VlanFormData {
  id: string;
  createdAt: Date;
}

const placeholderVlans: Vlan[] = [
  {
    id: 'vlan-1',
    vlanId: 10,
    description: 'Main data network for headquarters',
    popId: '1',
    createdAt: new Date(),
    isTagged: true,
    status: 'Active',
    assignedTo: 'Acme Corporation',
    availableInHub: false,
    participantId: undefined
  },
  {
    id: 'vlan-2',
    vlanId: 20,
    popId: '2',
    createdAt: new Date(Date.now() - 86400000),
    isTagged: false,
    status: 'Active',
    assignedTo: 'Tech Solutions Inc',
    availableInHub: true,
    participantId: '2'
  },
  {
    id: 'vlan-3',
    vlanId: 30,
    description: 'Isolated network for guests',
    popId: '1',
    createdAt: new Date(Date.now() - 172800000),
    isTagged: true,
    status: 'Inactive',
    assignedTo: 'Global Networks',
    availableInHub: false,
    participantId: undefined
  },
];

export default function VlanManagementPage() {
  const { t } = useLocale();
  const { toast } = useToast();
  const [isAddVlanDialogOpen, setIsAddVlanDialogOpen] = React.useState(false);
  const [vlans, setVlans] = React.useState<Vlan[]>(placeholderVlans);
  const [vlanToDelete, setVlanToDelete] = React.useState<Vlan | null>(null);
  const [participantSearch, setParticipantSearch] = React.useState('');
  const iconSize = "h-2.5 w-2.5";

  const { data: pops = [], isLoading: isLoadingPops, error: popsError } = useQuery<Pop[], Error>({
    queryKey: ['pops'],
    queryFn: getPops,
  });

  const form = useForm<VlanFormData>({
    resolver: zodResolver(vlanSchema),
    defaultValues: {
      vlanId: undefined,
      description: '',
      popId: '',
      isTagged: true,
      status: 'Active',
      assignedTo: 'Your Company Name', // Default company name
      availableInHub: false,
      participantId: '',
    },
  });

  const availableInHub = form.watch('availableInHub');
  const selectedParticipantId = form.watch('participantId');

  const filteredParticipants = React.useMemo(() => {
    if (!participantSearch) return mockParticipants;
    return mockParticipants.filter(participant =>
      participant.name.toLowerCase().includes(participantSearch.toLowerCase()) ||
      participant.email.toLowerCase().includes(participantSearch.toLowerCase()) ||
      participant.company.toLowerCase().includes(participantSearch.toLowerCase())
    );
  }, [participantSearch]);

  React.useEffect(() => {
    if (availableInHub && selectedParticipantId) {
      const selectedParticipant = mockParticipants.find(p => p.id === selectedParticipantId);
      if (selectedParticipant) {
        form.setValue('assignedTo', selectedParticipant.company);
      }
    } else if (!availableInHub) {
      form.setValue('assignedTo', 'Your Company Name');
      form.setValue('participantId', '');
    }
  }, [availableInHub, selectedParticipantId, form]);

  const handleAddVlanSubmit = (data: VlanFormData) => {
    console.log("New VLAN Data:", data);
    const newVlan: Vlan = {
        ...data,
        id: `vlan-${Date.now()}`,
        createdAt: new Date(),
    };
    setVlans(prev => [newVlan, ...prev]);
    toast({
      title: t('vlan_page.add_success_title', 'VLAN Added'),
      description: t('vlan_page.add_success_description', 'VLAN {vlanId} has been added and assigned to {company}.').replace('{vlanId}', data.vlanId.toString()).replace('{company}', data.assignedTo),
    });
    form.reset();
    setIsAddVlanDialogOpen(false);
    setParticipantSearch('');
  };

  const handleEditVlan = (vlan: Vlan) => {
    toast({
      title: t('vlan_page.edit_not_implemented_title', 'Edit Not Implemented'),
      description: t('vlan_page.edit_not_implemented_desc', 'Editing VLAN {vlanId} is not yet available.').replace('{vlanId}', vlan.vlanId.toString()),
    });
  };

  const confirmDeleteVlan = () => {
    if (vlanToDelete) {
      setVlans(prev => prev.filter(v => v.id !== vlanToDelete.id));
      toast({
        title: t('vlan_page.delete_success_title', 'VLAN Deleted'),
        description: t('vlan_page.delete_success_description', 'VLAN {vlanId} has been deleted.').replace('{vlanId}', vlanToDelete.vlanId.toString()),
        variant: 'destructive',
      });
      setVlanToDelete(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold flex items-center gap-2">
          <Split className={`${iconSize} text-primary`} />
          {t('vlan_page.title', 'Virtual Local Area Network (VLAN)')}
        </h1>
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
                        <DialogTitle className="text-sm flex items-center gap-2">
                            <PlusCircle className={iconSize} />
                            {t('vlan_page.add_dialog_title', 'New VLAN')}
                        </DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleAddVlanSubmit)} className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
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
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('vlan_page.form_status_label', 'Status')}</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={t('vlan_page.form_status_placeholder', 'Select status')} />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Active">{t('vlan_page.form_status_active', 'Active')}</SelectItem>
                                                    <SelectItem value="Inactive">{t('vlan_page.form_status_inactive', 'Inactive')}</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
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
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('vlan_page.form_description_label', 'Description (Optional)')}</FormLabel>
                                            <FormControl>
                                                <Input placeholder={t('vlan_page.form_description_placeholder', 'e.g., Main network')} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 items-center">
                                <FormField
                                    control={form.control}
                                    name="assignedTo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('vlan_page.form_assigned_to_label', 'Assigned to')}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    disabled={availableInHub}
                                                    className={availableInHub ? 'bg-muted' : ''}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="availableInHub"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm h-full">
                                            <div className="space-y-0.5">
                                                <FormLabel>{t('vlan_page.form_available_in_hub_label', 'Available in Hub')}</FormLabel>
                                                <DialogDescriptionComponent className="text-xs">
                                                    {t('vlan_page.form_available_in_hub_description', 'Make available to Hub participants.')}
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
                            </div>

                            {availableInHub && (
                                <FormField
                                    control={form.control}
                                    name="participantId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('vlan_page.form_participant_label', 'Assign to Participant')}</FormLabel>
                                            <div className="space-y-2">
                                                <div className="relative">
                                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        placeholder={t('vlan_page.form_participant_search_placeholder', 'Search participants...')}
                                                        value={participantSearch}
                                                        onChange={(e) => setParticipantSearch(e.target.value)}
                                                        className="pl-8"
                                                    />
                                                </div>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder={t('vlan_page.form_participant_placeholder', 'Select participant')} />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {filteredParticipants.length > 0 ? (
                                                            filteredParticipants.map((participant) => (
                                                                <SelectItem key={participant.id} value={participant.id}>
                                                                    <div className="flex flex-col">
                                                                        <span className="font-medium">{participant.name}</span>
                                                                        <span className="text-xs text-muted-foreground">{participant.email}</span>
                                                                        <span className="text-xs text-muted-foreground">{participant.company}</span>
                                                                    </div>
                                                                </SelectItem>
                                                            ))
                                                        ) : (
                                                            <div className="p-2 text-center text-muted-foreground text-xs">
                                                                {t('vlan_page.form_participant_none_found', 'No participants found')}
                                                            </div>
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                             <FormField
                                control={form.control}
                                name="isTagged"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                        <div className="space-y-0.5">
                                            <FormLabel>{t('vlan_page.form_is_tagged_label', 'Tagged VLAN')}</FormLabel>
                                            <DialogDescriptionComponent className="text-xs">
                                                {t('vlan_page.form_is_tagged_description', 'Specifies if the VLAN uses 802.1Q tagging.')}
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
        <CardContent className="pt-0">
          {isLoadingPops ? (
             <div className="space-y-3 pt-6">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
             </div>
          ) : vlans.length > 0 ? (
            <div className="overflow-x-auto pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20 text-xs text-center">{t('vlan_page.table_header_vlan_id', 'VLAN ID')}</TableHead>
                    <TableHead className="text-xs text-center">{t('vlan_page.table_header_assigned_to', 'Assigned To')}</TableHead>
                    <TableHead className="text-xs text-center">{t('vlan_page.table_header_description', 'Description')}</TableHead>
                    <TableHead className="text-xs text-center">{t('vlan_page.table_header_hub_available', 'Hub Available')}</TableHead>
                    <TableHead className="text-xs text-center">{t('vlan_page.table_header_tagged', 'Tagged/Untagged')}</TableHead>
                    <TableHead className="text-xs text-center">{t('vlan_page.table_header_status', 'Status')}</TableHead>
                    <TableHead className="text-right w-28 text-xs text-center">{t('vlan_page.table_header_actions', 'Actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vlans.map((vlan) => (
                    <TableRow key={vlan.id}>
                      <TableCell className="font-mono text-muted-foreground text-xs text-center">{vlan.vlanId}</TableCell>
                      <TableCell className="text-muted-foreground text-xs text-center">{vlan.assignedTo}</TableCell>
                      <TableCell className="text-muted-foreground text-xs text-center">{vlan.description || '-'}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={vlan.availableInHub ? 'default' : 'secondary'} className={`text-xs ${vlan.availableInHub ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                           {vlan.availableInHub ? t('vlan_page.hub_available', 'Yes') : t('vlan_page.hub_not_available', 'No')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={vlan.isTagged ? 'default' : 'secondary'} className={`text-xs ${vlan.isTagged ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                           {vlan.isTagged ? t('vlan_page.tagged', 'Tagged') : t('vlan_page.untagged', 'Untagged')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                         <Badge variant={vlan.status === 'Active' ? 'default' : 'secondary'} className={`text-xs ${vlan.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                           {t(`vlan_page.status_${vlan.status.toLowerCase()}` as any, vlan.status)}
                         </Badge>
                      </TableCell>
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
                                     {t('vlan_page.delete_confirm_description', 'This action is irreversible. This will permanently delete VLAN {vlanId}.').replace('{vlanId}', vlan.vlanId.toString())}
                                   </AlertDialogDescription>
                                 </AlertDialogHeader>
                                 <AlertDialogFooter>
                                   <AlertDialogCancel onClick={() => setVlanToDelete(null)}>{t('vlan_page.delete_confirm_cancel', 'Cancel')}</AlertDialogCancel>
                                   <AlertDialogAction
                                     className={buttonVariants({ variant: "destructive" })}
                                     onClick={() => {
                                       setVlanToDelete(vlan);
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
            <p className="text-center text-muted-foreground py-4 text-xs pt-6">{t('vlan_page.no_vlans_found', 'No VLANs configured yet. Click "Add VLAN" to create one.')}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
