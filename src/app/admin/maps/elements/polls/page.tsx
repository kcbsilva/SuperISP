// src/app/maps/elements/polls/page.tsx
'use client';

import * as React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from '@/components/ui/button';
import { Power, Edit, Trash2, FileText as FileTextIcon, Loader2, FilePlus2, List, MapPin as MapPinIcon } from 'lucide-react'; // Added MapPinIcon
import { useLocale } from '@/contexts/LocaleContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription as DialogDescriptionComponent,
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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils'; // Added cn

interface CableInfoPoll {
 id: string;
 name: string;
 fiberCount?: number;
}

interface PollHistoryEntry {
 id: string;
 date: string;
 user: string;
 description: string;
 details?: string;
}

interface HydroPoll {
  id: string;
  description: string;
  height: string;
  type: 'Circular' | 'Square';
  address: string;
  gpsCoordinates: string;
  transformer: 'Yes' | 'No';
  project?: string;
  history?: PollHistoryEntry[];
  cablesPassed?: CableInfoPoll[];
  attachedFoscs?: string[];
  attachedFdhs?: string[];
}


const placeholderPolls: HydroPoll[] = [
  { id: 'poll-001', description: 'Main Street - Corner Oak', height: '12m', type: 'Circular', address: '123 Main St, Anytown', gpsCoordinates: '40.7128° N, 74.0060° W', transformer: 'Yes', project: 'Downtown Expansion',
    history: [{id: 'hist-p1', date: '2023-01-10', user: 'Install Team', description: 'Pole installed'}, {id: 'hist-p2', date: '2023-05-20', user: 'Maintenance', description: 'Inspected for storm damage', details: 'Minor cosmetic scuffs'}],
    cablesPassed: [{id: 'cable-p1', name: 'Feeder 1', fiberCount: 144}, {id: 'cable-p2', name: 'Distribution A', fiberCount: 48}],
    attachedFoscs: ['fosc-001'],
    attachedFdhs: []
  },
  { id: 'poll-002', description: 'Park Entrance', height: '10m', type: 'Square', address: '456 Park Ave, Anytown', gpsCoordinates: '40.7135° N, 74.0055° W', transformer: 'No', project: 'City Beautification', cablesPassed: [{id: 'cable-p3', name: 'Feeder 2', fiberCount: 72}], attachedFdhs: ['fdh-002', 'fdh-003'] },
];

const pollTemplateSchema = z.object({
  manufacturer: z.string().optional(),
  material: z.string().min(1, "Material is required."),
  height: z.string().min(1, "Height description is required (e.g., 12m Concrete Pole)."),
  type: z.enum(['Circular', 'Square'], { required_error: "Poll type is required."}),
});
type PollTemplateFormData = z.infer<typeof pollTemplateSchema>;

interface PollTemplate extends PollTemplateFormData {
  id: string;
}

const placeholderPollManufacturers = ["Manufacturer A", "Manufacturer B", "Manufacturer C", "Other"];
const placeholderPollMaterials = ["Concrete", "Wood", "Steel", "Composite"];

const placeholderExistingPollTemplates: PollTemplate[] = [
  { id: 'tpl-poll-1', manufacturer: 'Manufacturer A', material: 'Concrete', height: '12m Reinforced Concrete', type: 'Circular' },
  { id: 'tpl-poll-2', manufacturer: 'Manufacturer B', material: 'Wood', height: '10m Treated Pine', type: 'Square' },
];


export default function HydroPollsPage() {
  const { t } = useLocale();
  const { toast } = useToast();
  const iconSize = "h-3 w-3";
  const modalIconSize = "h-2.5 w-2.5";
  const [isAddTemplateModalOpen, setIsAddTemplateModalOpen] = React.useState(false);
  const [selectedPoll, setSelectedPoll] = React.useState<HydroPoll | null>(null);
  const [isPollModalOpen, setIsPollModalOpen] = React.useState(false);
  const [activePollModalTab, setActivePollModalTab] = React.useState('details');

  const templateForm = useForm<PollTemplateFormData>({
    resolver: zodResolver(pollTemplateSchema),
    defaultValues: {
      manufacturer: '',
      material: '',
      height: '',
      type: undefined,
    },
  });

  const handleAddTemplateSubmit = (data: PollTemplateFormData) => {
    console.log("New Poll Template Data:", data);
    const newTemplate: PollTemplate = { ...data, id: `tpl-poll-${Date.now()}`};
    placeholderExistingPollTemplates.push(newTemplate);
    toast({
      title: t('maps_elements.poll_template_add_success_title', 'Poll Template Added'),
      description: t('maps_elements.poll_template_add_success_desc_new', 'Poll template for {height} {material} poles added.').replace('{height}', data.height).replace('{material}', data.material),
    });
    templateForm.reset();
    setIsAddTemplateModalOpen(false);
  };

  const handlePollIdClick = (poll: HydroPoll) => {
    setSelectedPoll(poll);
    setActivePollModalTab('details');
    setIsPollModalOpen(true);
  };

  const handleEditPoll = (pollId: string) => {
    toast({ title: t('maps_elements.action_edit_poll', 'Edit Poll (Not Implemented)'), description: `Editing poll ${pollId} is not yet available.` });
  };

  const handleDeletePoll = (pollId: string) => {
    toast({ title: t('maps_elements.action_delete_poll', 'Delete Poll (Not Implemented)'), description: `Deleting poll ${pollId} is not yet available.`, variant: 'destructive' });
  };

  const handleSeeInMap = (pollId: string) => {
    toast({ title: t('maps_elements.action_see_in_map', 'See in Map (Not Implemented)'), description: `Showing poll ${pollId} on map is not yet available.` });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold flex items-center gap-2">
            <Power className={`${iconSize} text-primary`} />
            {t('sidebar.maps_elements_polls', 'Hydro Polls')}
        </h1>
        <Dialog open={isAddTemplateModalOpen} onOpenChange={setIsAddTemplateModalOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                    <FileTextIcon className={`mr-2 ${iconSize}`} /> {t('maps_elements.poll_template_button', 'Poll Templates')}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="text-sm">{t('maps_elements.poll_manage_templates_title', 'Manage Poll Templates')}</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
                    <fieldset className="md:col-span-2 border border-border rounded-md p-4 pt-2 space-y-4">
                       <legend className="text-sm font-semibold px-2 flex items-center gap-2">
                            <FilePlus2 className={`${iconSize} text-primary`} />
                            {t('maps_elements.poll_new_template_heading', 'New Poll Template')}
                        </legend>
                        <Form {...templateForm}>
                            <form onSubmit={templateForm.handleSubmit(handleAddTemplateSubmit)} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={templateForm.control}
                                        name="manufacturer"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('maps_elements.poll_template_form_manufacturer_label_optional', 'Manufacturer (Optional)')}</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder={t('maps_elements.poll_template_form_manufacturer_placeholder', 'Select Manufacturer')} />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {placeholderPollManufacturers.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={templateForm.control}
                                        name="material"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('maps_elements.poll_template_form_material_label', 'Material')}</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder={t('maps_elements.poll_template_form_material_placeholder', 'Select Material')} />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {placeholderPollMaterials.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                 <FormField
                                    control={templateForm.control}
                                    name="height"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('maps_elements.poll_template_form_height_label', 'Height Description')}</FormLabel>
                                            <FormControl>
                                                <Input placeholder={t('maps_elements.poll_template_form_height_placeholder', 'e.g., 12m Concrete, 10ft Wood')} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={templateForm.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('maps_elements.poll_template_form_type_label', 'Type')}</FormLabel>
                                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={t('maps_elements.poll_template_form_type_placeholder', 'Select poll type')} />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Circular">{t('maps_elements.poll_type_circular', 'Circular')}</SelectItem>
                                                    <SelectItem value="Square">{t('maps_elements.poll_type_square', 'Square')}</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <DialogFooter className="pt-4">
                                    <DialogClose asChild>
                                        <Button type="button" variant="outline" disabled={templateForm.formState.isSubmitting}>{t('maps_elements.poll_template_form_cancel_button', 'Cancel')}</Button>
                                    </DialogClose>
                                    <Button type="submit" disabled={templateForm.formState.isSubmitting}>
                                        {templateForm.formState.isSubmitting && <Loader2 className={`mr-2 ${iconSize} animate-spin`} />}
                                        {t('maps_elements.poll_template_form_save_button', 'Save Template')}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </fieldset>
                    <fieldset className="md:col-span-1 border border-border rounded-md p-4 pt-2 space-y-2">
                        <legend className="text-sm font-semibold px-2 flex items-center gap-2">
                            <List className={`${iconSize} text-primary`} />
                            {t('maps_elements.existing_poll_templates_list_title', 'Existing Templates')}
                        </legend>
                        <ScrollArea className="h-[260px] bg-muted/50 rounded-md p-2">
                            {placeholderExistingPollTemplates.length > 0 ? (
                                placeholderExistingPollTemplates.map(template => (
                                <div key={template.id} className="text-xs p-1.5 border-b last:border-b-0 hover:bg-background rounded-sm cursor-default">
                                    <div className="font-medium">{template.manufacturer ? `${template.manufacturer} - ` : ''}{template.material} - {template.type}</div>
                                    <div className="text-muted-foreground">
                                    {t('maps_elements.poll_template_info_height_display', 'Height: {height}').replace('{height}', template.height)}
                                    </div>
                                </div>
                                ))
                            ) : (
                                <p className="text-xs text-muted-foreground text-center py-4">{t('maps_elements.no_existing_poll_templates', 'No existing templates.')}</p>
                            )}
                        </ScrollArea>
                    </fieldset>
                </div>
            </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="pt-6">
           {placeholderPolls.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs text-center">ID</TableHead>
                    <TableHead className="text-xs text-center">Description</TableHead>
                    <TableHead className="text-xs text-center">{t('maps_elements.table_header_project', 'Project')}</TableHead>
                    <TableHead className="text-xs text-center">Height</TableHead>
                    <TableHead className="text-xs text-center">Type</TableHead>
                    <TableHead className="text-xs text-center">Address</TableHead>
                    <TableHead className="text-xs text-center">GPS Coordinates</TableHead>
                    <TableHead className="text-xs text-center">Transformer</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {placeholderPolls.map((poll) => (
                    <TableRow key={poll.id}>
                      <TableCell className="font-mono text-muted-foreground text-xs text-center">
                         <Button variant="link" size="sm" className="p-0 h-auto text-xs" onClick={() => handlePollIdClick(poll)}>
                            {poll.id}
                        </Button>
                      </TableCell>
                      <TableCell className="text-xs text-center">{poll.description}</TableCell>
                      <TableCell className="text-xs text-center">{poll.project || '-'}</TableCell>
                      <TableCell className="text-xs text-center">{poll.height}</TableCell>
                      <TableCell className="text-xs text-center">{poll.type}</TableCell>
                      <TableCell className="text-xs text-center">{poll.address}</TableCell>
                      <TableCell className="text-xs text-center">{poll.gpsCoordinates}</TableCell>
                      <TableCell className="text-xs text-center">
                        <Badge variant={poll.transformer === 'Yes' ? 'destructive' : 'default'} className={`text-xs ${poll.transformer === 'Yes' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                          {poll.transformer}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8 text-xs">
              {t('maps_elements.no_polls_found', 'No hydro polls found. They are typically added via the map interface.')}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Poll Profile Modal */}
      <Dialog open={isPollModalOpen} onOpenChange={setIsPollModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm">{t('maps_elements.poll_profile_title', 'Poll Profile: {id}').replace('{id}', selectedPoll?.id || 'N/A')}</DialogTitle>
            <DialogDescriptionComponent className="text-xs">{t('maps_elements.poll_profile_description', 'Details of the selected hydro poll.')}</DialogDescriptionComponent>
          </DialogHeader>
         <Tabs value={activePollModalTab} onValueChange={setActivePollModalTab} className="w-full flex-grow flex flex-col overflow-hidden">
           <TabsList className="grid w-full grid-cols-4 shrink-0">
             <TabsTrigger value="details">{t('maps_elements.poll_modal_tab_details', 'Details')}</TabsTrigger>
             <TabsTrigger value="cables">{t('maps_elements.poll_modal_tab_cables', 'Cables Passed')}</TabsTrigger>
             <TabsTrigger value="enclosures">{t('maps_elements.poll_modal_tab_enclosures', 'Enclosures')}</TabsTrigger>
             <TabsTrigger value="history">{t('maps_elements.poll_modal_tab_history', 'History')}</TabsTrigger>
           </TabsList>
           <TabsContent value="details" className="mt-2 flex-grow overflow-y-auto">
              {selectedPoll && (
               <div className="grid gap-3 py-2 text-xs">
                 <div className="grid grid-cols-3 items-center gap-3">
                   <span className="text-muted-foreground col-span-1">{t('maps_elements.poll_profile_id_label', 'ID')}:</span>
                   <span className="col-span-2 font-medium">{selectedPoll.id}</span>
                 </div>
                 <div className="grid grid-cols-3 items-center gap-3">
                   <span className="text-muted-foreground col-span-1">{t('maps_elements.poll_profile_description_label', 'Description')}:</span>
                   <span className="col-span-2">{selectedPoll.description}</span>
                 </div>
                 <div className="grid grid-cols-3 items-center gap-3">
                   <span className="text-muted-foreground col-span-1">{t('maps_elements.poll_profile_project_label', 'Project')}:</span>
                   <span className="col-span-2">{selectedPoll.project || '-'}</span>
                 </div>
                 <div className="grid grid-cols-3 items-center gap-3">
                   <span className="text-muted-foreground col-span-1">{t('maps_elements.poll_profile_height_label', 'Height')}:</span>
                   <span className="col-span-2">{selectedPoll.height}</span>
                 </div>
                 <div className="grid grid-cols-3 items-center gap-3">
                   <span className="text-muted-foreground col-span-1">{t('maps_elements.poll_profile_type_label', 'Type')}:</span>
                   <span className="col-span-2">{selectedPoll.type}</span>
                 </div>
                 <div className="grid grid-cols-3 items-center gap-3">
                   <span className="text-muted-foreground col-span-1">{t('maps_elements.poll_profile_address_label', 'Address')}:</span>
                   <span className="col-span-2">{selectedPoll.address}</span>
                 </div>
                 <div className="grid grid-cols-3 items-center gap-3">
                   <span className="text-muted-foreground col-span-1">{t('maps_elements.poll_profile_gps_label', 'GPS Coordinates')}:</span>
                   <span className="col-span-2">{selectedPoll.gpsCoordinates}</span>
                 </div>
                 <div className="grid grid-cols-3 items-center gap-3">
                   <span className="text-muted-foreground col-span-1">{t('maps_elements.poll_profile_transformer_label', 'Transformer')}:</span>
                   <span className="col-span-2">
                     <Badge variant={selectedPoll.transformer === 'Yes' ? 'destructive' : 'default'} className={`text-xs ${selectedPoll.transformer === 'Yes' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                       {selectedPoll.transformer}
                     </Badge>
                   </span>
                 </div>
               </div>
             )}
           </TabsContent>
           <TabsContent value="cables" className="mt-2 flex-grow overflow-y-auto text-xs">
              <h3 className="text-sm font-semibold mb-2">{t('maps_elements.poll_modal_cables_passed_heading', 'Cables Passed')}</h3>
             {selectedPoll?.cablesPassed && selectedPoll.cablesPassed.length > 0 ? (
               <Table>
                 <TableHeader>
                   <TableRow>
                     <TableHead className="text-xs text-center">ID/Name</TableHead>
                     <TableHead className="text-xs text-center">Fiber Count</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {selectedPoll.cablesPassed.map(cable => (
                     <TableRow key={cable.id}>
                       <TableCell className="text-xs text-center">{cable.name}</TableCell>
                       <TableCell className="text-xs text-center">{cable.fiberCount || '-'}</TableCell>
                     </TableRow>
                   ))}
                 </TableBody>
               </Table>
             ) : (
                 <p className="text-xs text-muted-foreground text-center py-4">{t('maps_elements.poll_modal_no_cables', 'No cables passed through this poll.')}</p>
             )}
           </TabsContent>
           <TabsContent value="enclosures" className="mt-2 flex-grow overflow-y-auto text-xs">
             <h3 className="text-sm font-semibold mb-2">{t('maps_elements.poll_modal_enclosures_heading', 'Attached Enclosures')}</h3>
             <div className="grid grid-cols-2 gap-4">
               <div>
                 <h4 className="text-xs font-medium mb-1">{t('maps_elements.poll_modal_foscs_heading', 'FOSCs')}:</h4>
                 {selectedPoll?.attachedFoscs && selectedPoll.attachedFoscs.length > 0 ? (
                   <ul className="list-disc list-inside space-y-0.5">
                     {selectedPoll.attachedFoscs.map(foscId => <li key={foscId}>{foscId}</li>)}
                   </ul>
                 ) : (
                     <p className="text-xs text-muted-foreground">{t('maps_elements.poll_modal_no_foscs', 'No FOSCs attached.')}</p>
                 )}
               </div>
               <div>
                 <h4 className="text-xs font-medium mb-1">{t('maps_elements.poll_modal_fdhs_heading', 'FDHs')}:</h4>
                 {selectedPoll?.attachedFdhs && selectedPoll.attachedFdhs.length > 0 ? (
                   <ul className="list-disc list-inside space-y-0.5">
                     {selectedPoll.attachedFdhs.map(fdhId => <li key={fdhId}>{fdhId}</li>)}
                   </ul>
                 ) : (
                     <p className="text-xs text-muted-foreground">{t('maps_elements.poll_modal_no_fdhs', 'No FDHs attached.')}</p>
                 )}
               </div>
             </div>
           </TabsContent>
           <TabsContent value="history" className="mt-2 flex-grow overflow-y-auto text-xs">
               <h3 className="text-sm font-semibold mb-2">{t('maps_elements.poll_modal_history_heading', 'Poll History')}</h3>
             {selectedPoll?.history && selectedPoll.history.length > 0 ? (
               <Table>
                 <TableHeader>
                   <TableRow>
                     <TableHead className="text-xs text-center">{t('maps_elements.poll_modal_history_date', 'Date')}</TableHead>
                     <TableHead className="text-xs text-center">{t('maps_elements.poll_modal_history_user', 'User')}</TableHead>
                     <TableHead className="text-xs text-center">{t('maps_elements.poll_modal_history_description', 'Description')}</TableHead>
                     <TableHead className="text-xs text-center">{t('maps_elements.poll_modal_history_details', 'Details')}</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {selectedPoll.history.map(entry => (
                     <TableRow key={entry.id}>
                       <TableCell className="text-xs text-center">{entry.date}</TableCell>
                       <TableCell className="text-xs text-center">{entry.user}</TableCell>
                       <TableCell className="text-xs text-center">{entry.description}</TableCell>
                       <TableCell className="text-xs text-center">{entry.details || '-'}</TableCell>
                     </TableRow>
                   ))}
                 </TableBody>
               </Table>
             ) : (
                 <p className="text-xs text-muted-foreground text-center py-4">{t('maps_elements.poll_modal_no_history', 'No history entries available.')}</p>
             )}
           </TabsContent>
         </Tabs>
          <DialogFooter className="gap-2 sm:justify-end">
            <Button variant="outline" size="sm" onClick={() => handleEditPoll(selectedPoll?.id || '')} disabled={!selectedPoll}>
                <Edit className={`mr-2 ${iconSize}`} /> {t('maps_elements.action_edit_poll', 'Edit')}
            </Button>
            <Button variant="destructive" size="sm" onClick={() => handleDeletePoll(selectedPoll?.id || '')} disabled={!selectedPoll}>
                <Trash2 className={`mr-2 ${iconSize}`} /> {t('maps_elements.action_delete_poll', 'Delete')}
            </Button>
            <Button variant="secondary" size="sm" onClick={() => handleSeeInMap(selectedPoll?.id || '')} disabled={!selectedPoll}>
                <MapPinIcon className={`mr-2 ${iconSize}`} /> {t('maps_elements.action_see_in_map', 'See in Map')}
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="outline" size="sm">{t('maps_elements.poll_modal_close_button', 'Close')}</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
