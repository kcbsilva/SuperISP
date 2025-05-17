// src/app/maps/elements/foscs/page.tsx
'use client';

import * as React from 'react';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from '@/components/ui/button';
import { Warehouse, Edit, Trash2, PlusCircle, FileText as FileTextIcon, Loader2, FilePlus2, List, Cable, GitMerge, ListChecks, AlertTriangle } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from "@/lib/utils";

interface SpliceLogEntryFosc {
  id: string;
  date: string;
  technician: string;
  tubeIdA: string;
  fiberNumberA: string;
  tubeIdB: string;
  fiberNumberB: string;
  tray: string;
  slot: string;
  description: string;
}

interface CableInfoFosc {
  id: string;
  cableNumber: string;
  serialNumber?: string;
  count: string;
  manufacturer: string;
  description: string;
  tubeIds: string;
  meterMark?: string;
}

interface FoscHistoryEntry {
  id: string;
  date: string;
  user: string;
  action: string;
  details?: string;
}
interface Fosc {
  id: string;
  gpsCoordinates: string;
  type: 'Aerial' | 'Underground';
  trays: string;
  project?: string;
  cableCount: string;
  status: 'Active' | 'Inactive' | 'Planned';
  manufacturer: string; // Changed from brand
  cableInfo?: CableInfoFosc[];
  spliceLogs?: SpliceLogEntryFosc[];
  vaultId?: string; // Assuming field name for Underground FOSC
  postId?: string; // Assuming field name for Aerial FOSC
  history?: FoscHistoryEntry[];
}

const placeholderFoscs: Fosc[] = [
  { id: 'fosc-001', gpsCoordinates: '39.9526° N, 75.1652° W', type: 'Aerial', trays: '6/12', project: 'Center City Fiber', cableCount: '4/6', status: 'Active', manufacturer: 'TE Connectivity',
    cableInfo: Array.from({length: 3}, (_, i) => ({ id: `cb-${i+1}`, cableNumber: `Cable ${i+1}`, count: "12F", manufacturer: "Corning", description: `Feeder ${i+1}`, tubeIds: `T${i+1}-T${i+4}`})),
    spliceLogs: [{id: 'log-f1', date: '2024-07-15', technician: 'Mike W.', tubeIdA: 'T1', fiberNumberA: '1-Blue', tubeIdB: 'T2', fiberNumberB: '1-Orange', tray: 'A1', slot:'1', description: 'Main splice'}],
 history: [{id: 'hist-f1', date: '2024-07-01', user: 'Admin', action: 'Created FOSC'}], postId: 'P-1234'
  },
  { id: 'fosc-002', gpsCoordinates: '34.0522° N, 118.2437° W', type: 'Underground', trays: '10/24', project: 'LA Downtown Grid', cableCount: '8/12', status: 'Active', manufacturer: 'Furukawa', vaultId: 'V-5678' },
  { id: 'fosc-003', gpsCoordinates: '40.7128° N, 74.0060° W', type: 'Aerial', trays: '2/4', project: 'NYC Soho Link', cableCount: '1/2', status: 'Planned', manufacturer: 'Corning' },
];

const foscTemplateSchema = z.object({
  manufacturer: z.string().min(1, "Manufacturer is required."),
  model: z.string().min(1, "Model is required."),
  maxTrayCapacity: z.coerce.number().int().positive("Max tray capacity must be a positive number."),
  maxCableInserts: z.coerce.number().int().positive("Max cable inserts must be a positive number."),
  maxSpliceCounts: z.coerce.number().int().positive("Max splice counts must be a positive number."),
});
type FoscTemplateFormData = z.infer<typeof foscTemplateSchema>;

interface FoscTemplate extends FoscTemplateFormData {
  id: string;
}

const placeholderManufacturers = ["TE Connectivity", "Furukawa", "Corning", "CommScope", "Prysmian"];

const placeholderExistingFoscTemplates: FoscTemplate[] = [
  { id: 'tpl-fosc-1', manufacturer: 'Corning', model: 'SCF-6C', maxTrayCapacity: 6, maxCableInserts: 4, maxSpliceCounts: 72 },
  { id: 'tpl-fosc-2', manufacturer: 'TE Connectivity', model: 'FOSC 450 D6', maxTrayCapacity: 12, maxCableInserts: 6, maxSpliceCounts: 288 },
  { id: 'tpl-fosc-3', manufacturer: 'Furukawa', model: 'FITEL S123M12', maxTrayCapacity: 4, maxCableInserts: 2, maxSpliceCounts: 48 },
];


export default function FoscsPage() {
  const { t } = useLocale();
  const { toast } = useToast();
  const iconSize = "h-3 w-3";
  const modalIconSize = "h-2.5 w-2.5";
  const [isAddTemplateModalOpen, setIsAddTemplateModalOpen] = React.useState(false);
  const [selectedFosc, setSelectedFosc] = React.useState<Fosc | null>(null);
  const [isFoscModalOpen, setIsFoscModalOpen] = React.useState(false);
  const [activeFoscModalTab, setActiveFoscModalTab] = React.useState('cable-info');


  const templateForm = useForm<FoscTemplateFormData>({
    resolver: zodResolver(foscTemplateSchema),
    defaultValues: {
      manufacturer: '',
      model: '',
      maxTrayCapacity: undefined,
      maxCableInserts: undefined,
      maxSpliceCounts: undefined,
    },
  });

  const getStatusBadgeVariant = (status: Fosc['status']) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-red-100 text-red-800';
      case 'Planned': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddTemplateSubmit = (data: FoscTemplateFormData) => {
    console.log("New FOSC Template Data:", data);
    const newTemplate: FoscTemplate = { ...data, id: `tpl-fosc-${Date.now()}`};
    placeholderExistingFoscTemplates.push(newTemplate);
    toast({
      title: t('maps_elements.fosc_template_add_success_title', 'FOSC Template Added'),
      description: t('maps_elements.fosc_template_add_success_desc', 'Template for {model} by {manufacturer} added.').replace('{model}', data.model).replace('{manufacturer}', data.manufacturer),
    });
    templateForm.reset();
    setIsAddTemplateModalOpen(false);
  };

  const handleFoscIdClick = (fosc: Fosc) => {
    setSelectedFosc(fosc);
    setActiveFoscModalTab('cable-info');
    setIsFoscModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold flex items-center gap-2">
            <Warehouse className={`${iconSize} text-primary`} />
            {t('sidebar.maps_elements_foscs', 'FOSCs (CEOs)')}
        </h1>
        <Dialog open={isAddTemplateModalOpen} onOpenChange={setIsAddTemplateModalOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                    <FileTextIcon className={`mr-2 ${iconSize}`} /> {t('maps_elements.fosc_template_button', 'FOSC Templates')}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="text-sm">{t('maps_elements.fosc_manage_templates_title', 'Manage FOSC Templates')}</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
                    <fieldset className="md:col-span-2 border border-border rounded-md p-4 pt-2 space-y-4">
                       <legend className="text-sm font-semibold px-2 flex items-center gap-2">
                            <FilePlus2 className={`${iconSize} text-primary`} />
                            {t('maps_elements.fosc_new_template_heading', 'New Template')}
                        </legend>
                        <Form {...templateForm}>
                            <form onSubmit={templateForm.handleSubmit(handleAddTemplateSubmit)} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={templateForm.control}
                                        name="manufacturer"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('maps_elements.fosc_template_form_manufacturer_label', 'Manufacturer')}</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder={t('maps_elements.fosc_template_form_manufacturer_placeholder', 'Select Manufacturer')} />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {placeholderManufacturers.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={templateForm.control}
                                        name="model"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('maps_elements.fosc_template_form_model_label', 'Model')}</FormLabel>
                                                <FormControl>
                                                    <Input placeholder={t('maps_elements.fosc_template_form_model_placeholder', 'e.g., FOSC 450 D6')} {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <FormField
                                        control={templateForm.control}
                                        name="maxTrayCapacity"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('maps_elements.fosc_template_form_max_trays_label', 'Max Tray Capacity')}</FormLabel>
                                                <FormControl>
                                                    <Input type="number" placeholder="e.g., 12" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={templateForm.control}
                                        name="maxCableInserts"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('maps_elements.fosc_template_form_max_cables_label', 'Max Cable Inserts')}</FormLabel>
                                                <FormControl>
                                                    <Input type="number" placeholder="e.g., 6" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={templateForm.control}
                                        name="maxSpliceCounts"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('maps_elements.fosc_template_form_max_splices_label', 'Max Splice Counts')}</FormLabel>
                                                <FormControl>
                                                    <Input type="number" placeholder="e.g., 288" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <DialogFooter className="pt-4">
                                    <DialogClose asChild>
                                        <Button type="button" variant="outline" disabled={templateForm.formState.isSubmitting}>{t('maps_elements.fosc_template_form_cancel_button', 'Cancel')}</Button>
                                    </DialogClose>
                                    <Button type="submit" disabled={templateForm.formState.isSubmitting}>
                                        {templateForm.formState.isSubmitting && <Loader2 className={`mr-2 ${iconSize} animate-spin`} />}
                                        {t('maps_elements.fosc_template_form_save_button', 'Save Template')}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </fieldset>
                    <fieldset className="md:col-span-1 border border-border rounded-md p-4 pt-2 space-y-2">
                        <legend className="text-sm font-semibold px-2 flex items-center gap-2">
                            <List className={`${iconSize} text-primary`} />
                            {t('maps_elements.existing_fosc_templates_list_title', 'Existing Templates')}
                        </legend>
                        <ScrollArea className="h-[260px] bg-muted/50 rounded-md p-2">
                            {placeholderExistingFoscTemplates.length > 0 ? (
                                placeholderExistingFoscTemplates.map(template => (
                                <div key={template.id} className="text-xs p-1.5 border-b last:border-b-0 hover:bg-background rounded-sm cursor-default">
                                    <div className="font-medium">{template.manufacturer} - {template.model}</div>
                                    <div className="text-muted-foreground">
                                    {t('maps_elements.fosc_template_info_trays')}: {template.maxTrayCapacity}, {t('maps_elements.fosc_template_info_cables')}: {template.maxCableInserts}, {t('maps_elements.fosc_template_info_splices')}: {template.maxSpliceCounts}
                                    </div>
                                </div>
                                ))
                            ) : (
                                <p className="text-xs text-muted-foreground text-center py-4">{t('maps_elements.no_existing_fosc_templates', 'No existing templates.')}</p>
                            )}
                        </ScrollArea>
                    </fieldset>
                </div>
            </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="pt-6">
           {placeholderFoscs.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs text-center">ID</TableHead>
                    <TableHead className="text-xs text-center">{t('maps_elements.fosc_table_header_gps', 'GPS Coordinates')}</TableHead>
                    <TableHead className="text-xs text-center">{t('maps_elements.fosc_table_header_type', 'Type')}</TableHead>
                    <TableHead className="text-xs text-center">{t('maps_elements.fosc_table_header_trays', 'Trays (Used/Max)')}</TableHead>
                    <TableHead className="text-xs text-center">{t('maps_elements.table_header_project', 'Project')}</TableHead>
                    <TableHead className="text-xs text-center">{t('maps_elements.fosc_table_header_cable_count', 'Cable Count (In/Out)')}</TableHead>
                    <TableHead className="text-xs text-center">{t('maps_elements.fosc_table_header_status', 'Status')}</TableHead>
                    <TableHead className="text-xs text-center">{t('maps_elements.fosc_table_header_manufacturer', 'Manufacturer')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {placeholderFoscs.map((fosc) => (
                    <TableRow key={fosc.id}>
                      <TableCell className="font-mono text-muted-foreground text-xs text-center">
                        <Button variant="link" size="sm" className="p-0 h-auto text-xs" onClick={() => handleFoscIdClick(fosc)}>
                            {fosc.id}
                        </Button>
                      </TableCell>
                      <TableCell className="text-xs text-center">{fosc.gpsCoordinates}</TableCell>
                      <TableCell className="text-xs text-center">{t(`maps_elements.fosc_type_${fosc.type.toLowerCase()}` as any, fosc.type)}</TableCell>
                      <TableCell className="text-xs text-center">{fosc.trays}</TableCell>
                      <TableCell className="text-xs text-center">{fosc.project || '-'}</TableCell>
                      <TableCell className="text-xs text-center">{fosc.cableCount}</TableCell>
                      <TableCell className="text-xs text-center">
                        <Badge variant="outline" className={`text-xs ${getStatusBadgeVariant(fosc.status)} border-transparent`}>
                          {t(`maps_elements.fosc_status_${fosc.status.toLowerCase()}` as any, fosc.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-center">{fosc.manufacturer}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8 text-xs">
              {t('maps_elements.no_foscs_found', 'No FOSCs found. They are typically added via the map interface.')}
            </p>
          )}
        </CardContent>
      </Card>

      {/* FOSC Profile Modal */}
      <Dialog open={isFoscModalOpen} onOpenChange={setIsFoscModalOpen}>
        <DialogContent className="sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-5xl h-[80vh] flex flex-col">
          <DialogHeader className="relative p-4 border-b">
            <DialogTitle className="sr-only">
                {t('maps_elements.fosc_modal_title', 'FOSC Details: {id}').replace('{id}', selectedFosc?.id || 'N/A')}
            </DialogTitle>
            <fieldset className="border border-border rounded-md p-4 pt-1">
                <legend className="text-sm font-semibold px-2 flex items-center gap-2 -ml-2">
                    <Warehouse className={`${modalIconSize} text-primary`} />
                    {t('maps_elements.fosc_modal_title', 'FOSC Details: {id}').replace('{id}', selectedFosc?.id || 'N/A')}
                </legend>
                {selectedFosc && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1 text-xs pt-2">
                      <p><strong>{t('maps_elements.fosc_table_header_gps', 'GPS')}:</strong> {selectedFosc.gpsCoordinates}</p>
                      <p><strong>{t('maps_elements.fosc_table_header_type', 'Type')}:</strong> {t(`maps_elements.fosc_type_${selectedFosc.type.toLowerCase()}` as any, selectedFosc.type)}</p>
                      <p><strong>{t('maps_elements.fosc_table_header_trays', 'Trays')}:</strong> {selectedFosc.trays}</p>
                      <p><strong>{t('maps_elements.fosc_table_header_manufacturer', 'Manufacturer')}:</strong> {selectedFosc.manufacturer}</p>
                      <p><strong>{t('maps_elements.table_header_project', 'Project')}:</strong> {selectedFosc.project || '-'}</p>
                       <p><strong>{t('maps_elements.fosc_table_header_cable_count', 'Cables')}:</strong> {selectedFosc.cableCount}</p>
                      <p><strong>{t('maps_elements.fosc_table_header_status', 'Status')}:</strong>
                          <Badge variant="outline" className={cn("ml-1 text-xs border-transparent", getStatusBadgeVariant(selectedFosc.status))}>
                      <p>
                        <strong>Attached to:</strong>{' '}
                        {selectedFosc.type === 'Underground' && selectedFosc.vaultId && `Vault ID: ${selectedFosc.vaultId}`}
                        {selectedFosc.type === 'Aerial' && selectedFosc.postId && `Post ID: ${selectedFosc.postId}`}
                      </p>
                          {t(`maps_elements.fosc_status_${selectedFosc.status.toLowerCase()}` as any, selectedFosc.status)}
                          </Badge>
                      </p>
                  </div>
                )}
            </fieldset>
          </DialogHeader>
          <Tabs value={activeFoscModalTab} onValueChange={setActiveFoscModalTab} className="w-full flex-grow flex flex-col overflow-hidden">
             <TabsList className="grid w-full grid-cols-4 shrink-0">
                <TabsTrigger value="cable-info"><Cable className={`mr-1.5 ${modalIconSize}`} />{t('maps_elements.fosc_modal_tab_cable_info', 'Cable Info')}</TabsTrigger>
                <TabsTrigger value="diagram"><GitMerge className={`mr-1.5 ${modalIconSize}`} />{t('maps_elements.fosc_modal_tab_splice_diagram', 'Splice Diagram')}</TabsTrigger>
                <TabsTrigger value="log"><ListChecks className={`mr-1.5 ${modalIconSize}`} />{t('maps_elements.fosc_modal_tab_splice_log', 'Splice Log')}</TabsTrigger>
                <TabsTrigger value="history"><AlertTriangle className={`mr-1.5 ${modalIconSize}`} />{t('maps_elements.fosc_modal_tab_history', 'History')}</TabsTrigger>
            </TabsList>
            <TabsContent value="cable-info" className="mt-2 flex-grow overflow-y-auto">
              {selectedFosc?.cableInfo && selectedFosc.cableInfo.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs text-center">{t('maps_elements.fosc_modal_cable_info_number', '#')}</TableHead>
                      <TableHead className="text-xs text-center">{t('maps_elements.fosc_modal_cable_info_serial', 'Serial #')}</TableHead>
                      <TableHead className="text-xs text-center">{t('maps_elements.fosc_modal_cable_info_count', 'Count')}</TableHead>
                      <TableHead className="text-xs text-center">{t('maps_elements.fosc_modal_cable_info_manufacturer', 'Manufacturer')}</TableHead>
                      <TableHead className="text-xs text-center">{t('maps_elements.fosc_modal_cable_info_description', 'Description')}</TableHead>
                      <TableHead className="text-xs text-center">{t('maps_elements.fosc_modal_cable_info_tube_ids', 'Tube IDs')}</TableHead>
                      <TableHead className="text-xs text-center">{t('maps_elements.fosc_modal_cable_info_meter_mark', 'Meter Mark')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedFosc.cableInfo.slice(0, 7).map(cable => ( // Show up to 7 cables
                      <TableRow key={cable.id}>
                        <TableCell className="text-xs text-center">{cable.cableNumber}</TableCell>
                        <TableCell className="text-xs text-center">{cable.serialNumber || '-'}</TableCell>
                        <TableCell className="text-xs text-center">{cable.count}</TableCell>
                        <TableCell className="text-xs text-center">{cable.manufacturer}</TableCell>
                        <TableCell className="text-xs text-center">{cable.description}</TableCell>
                        <TableCell className="text-xs text-center">{cable.tubeIds}</TableCell>
                        <TableCell className="text-xs text-center">{cable.meterMark || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                 <p className="text-xs text-muted-foreground text-center py-4">{t('maps_elements.fosc_modal_no_cable_info', 'No cable information available.')}</p>
              )}
            </TabsContent>
            <TabsContent value="diagram" className="mt-2 flex-grow flex justify-center items-center overflow-hidden">
              <Image src="https://placehold.co/600x400.png" alt="Splice Diagram Placeholder" width={550} height={350} data-ai-hint="fiber splice diagram" className="object-contain" />
            </TabsContent>
            <TabsContent value="log" className="mt-2 flex-grow overflow-y-auto">
             {selectedFosc?.spliceLogs && selectedFosc.spliceLogs.length > 0 ? (
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead className="text-xs text-center">{t('maps_elements.fdh_modal_log_date', 'Date')}</TableHead>
                        <TableHead className="text-xs text-center">{t('maps_elements.fdh_modal_log_technician', 'Technician')}</TableHead>
                        <TableHead className="text-xs text-center">{t('maps_elements.fdh_modal_log_tube_a', 'Tube ID (A)')}</TableHead>
                        <TableHead className="text-xs text-center">{t('maps_elements.fdh_modal_log_fiber_a', 'Fiber # (A)')}</TableHead>
                        <TableHead className="text-xs text-center">{t('maps_elements.fdh_modal_log_tube_b', 'Tube ID (B)')}</TableHead>
                        <TableHead className="text-xs text-center">{t('maps_elements.fdh_modal_log_fiber_b', 'Fiber # (B)')}</TableHead>
                        <TableHead className="text-xs text-center">{t('maps_elements.fdh_modal_log_tray', 'Tray')}</TableHead>
                        <TableHead className="text-xs text-center">{t('maps_elements.fdh_modal_log_slot', 'Slot')}</TableHead>
                        <TableHead className="text-xs text-center">{t('maps_elements.fdh_modal_log_notes', 'Description')}</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {selectedFosc.spliceLogs.map(log => (
                        <TableRow key={log.id}>
                        <TableCell className="text-xs text-center">{log.date}</TableCell>
                        <TableCell className="text-xs text-center">{log.technician}</TableCell>
                        <TableCell className="text-xs text-center">{log.tubeIdA}</TableCell>
                        <TableCell className="text-xs text-center">{log.fiberNumberA}</TableCell>
                        <TableCell className="text-xs text-center">{log.tubeIdB}</TableCell>
                        <TableCell className="text-xs text-center">{log.fiberNumberB}</TableCell>
                        <TableCell className="text-xs text-center">{log.tray}</TableCell>
                        <TableCell className="text-xs text-center">{log.slot}</TableCell>
                        <TableCell className="text-xs text-center">{log.description}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
             ) : (
                <p className="text-xs text-muted-foreground text-center py-4">{t('maps_elements.fosc_modal_no_splice_logs', 'No splice logs available.')}</p>
             )}
            </TabsContent>
             <TabsContent value="history" className="mt-2 flex-grow overflow-y-auto">
               {selectedFosc?.history && selectedFosc.history.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs text-center">{t('maps_elements.fdh_modal_history_date', 'Date')}</TableHead>
                      <TableHead className="text-xs text-center">{t('maps_elements.fdh_modal_history_user', 'User')}</TableHead>
                      <TableHead className="text-xs text-center">{t('maps_elements.fdh_modal_history_action', 'Action')}</TableHead>
                      <TableHead className="text-xs text-center">{t('maps_elements.fdh_modal_history_details', 'Details')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedFosc.history.map(entry => (
                      <TableRow key={entry.id}>
                        <TableCell className="text-xs text-center">{entry.date}</TableCell>
                        <TableCell className="text-xs text-center">{entry.user}</TableCell>
                        <TableCell className="text-xs text-center">{entry.action}</TableCell>
                        <TableCell className="text-xs text-center">{entry.details || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-xs text-muted-foreground text-center py-4">{t('maps_elements.fosc_modal_no_history', 'No history available.')}</p>
              )}
            </TabsContent>
          </Tabs>
          <DialogFooter className="mt-auto pt-4 border-t">
            <DialogClose asChild>
              <Button type="button" variant="outline">{t('maps_elements.fdh_modal_close_button', 'Close')}</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
