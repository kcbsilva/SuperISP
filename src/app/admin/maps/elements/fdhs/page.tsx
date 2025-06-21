// src/app/maps/elements/fdhs/page.tsx
'use client';

import * as React from 'react';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from '@/components/ui/button';
import { Box, Edit, Trash2, FileText as FileTextIcon, Loader2, FilePlus2, List, ChevronLeft, ChevronRight, Users2, GitMerge, ListChecks, Cable, AlertTriangle } from 'lucide-react';
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

interface ClientInfo {
  id: string;
  name: string;
  lightLevelRx: string;
  lightLevelTx: string;
  port: number;
}

interface SpliceLogEntry {
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

interface CableInfo {
  id: string;
  cableNumber: string;
  serialNumber?: string;
  count: string; // e.g., "12F", "24F"
  manufacturer: string;
  description: string;
  tubeIds: string; // e.g., "1-4" or "Blue, Orange"
  meterMark?: string;
}

interface FdhHistoryEntry {
  id: string;
  date: string;
  user: string;
  action: string;
  details?: string;
}

interface Fdh {
  id: string;
  gpsCoordinates: string;
  type: 'Aerial' | 'Underground';
  ports: number;
  project?: string;
  pon: string;
  status: 'Active' | 'Inactive';
  brand: string;
  clients?: ClientInfo[];
  spliceLogs?: SpliceLogEntry[];
  cableInfo?: CableInfo[];
  history?: FdhHistoryEntry[];
}

const placeholderFdhs: Fdh[] = [];

const fdhTemplateSchema = z.object({
  manufacturer: z.string().min(1, "Manufacturer is required."),
  model: z.string().min(1, "Model is required."),
  maxPortCapacity: z.coerce.number().int().positive("Max port capacity must be a positive number."),
  fdhType: z.enum(['Aerial', 'Underground'], { required_error: "FDH type is required."}),
});
type FdhTemplateFormData = z.infer<typeof fdhTemplateSchema>;

interface FdhTemplate extends FdhTemplateFormData {
  id: string;
}

const placeholderManufacturers: string[] = [];

const placeholderExistingFdhTemplates: FdhTemplate[] = [];

export default function FdhsPage() {
  const { t } = useLocale();
  const { toast } = useToast();
  const iconSize = "h-3 w-3";
  const modalIconSize = "h-2.5 w-2.5";
  const [isAddTemplateModalOpen, setIsAddTemplateModalOpen] = React.useState(false);

  const [selectedFdh, setSelectedFdh] = React.useState<Fdh | null>(null);
  const [isFdhModalOpen, setIsFdhModalOpen] = React.useState(false);
  const [activeModalTab, setActiveModalTab] = React.useState('port-list'); // Changed from clients to port-list
  const [currentPage, setCurrentPage] = React.useState(1);
  const portsPerPage = 24;


  const templateForm = useForm<FdhTemplateFormData>({
    resolver: zodResolver(fdhTemplateSchema),
    defaultValues: {
      manufacturer: '',
      model: '',
      maxPortCapacity: undefined,
      fdhType: undefined,
    },
  });

  const getStatusBadgeVariant = (status: Fdh['status']) => {
    return status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const handleAddTemplateSubmit = (data: FdhTemplateFormData) => {
    console.log("New FDH Template Data:", data);
    const newTemplate: FdhTemplate = { ...data, id: `tpl-fdh-${Date.now()}`};
    placeholderExistingFdhTemplates.push(newTemplate);
    toast({
      title: t('maps_elements.fdh_template_add_success_title', 'FDH Template Added'),
      description: t('maps_elements.fdh_template_add_success_desc', 'Template for {model} by {manufacturer} added.').replace('{model}', data.model).replace('{manufacturer}', data.manufacturer),
    });
    templateForm.reset();
    setIsAddTemplateModalOpen(false);
  };

  const handleFdhClick = (fdh: Fdh) => {
    setSelectedFdh(fdh);
    setActiveModalTab('port-list'); // Changed from clients to port-list
    setCurrentPage(1);
    setIsFdhModalOpen(true);
  };

  // Calculate paginatedPorts based on currentPage and portsPerPage
  const indexOfLastPort = currentPage * portsPerPage; // Ensure currentPage is accessible here
  const indexOfFirstPort = indexOfLastPort - portsPerPage;
  const totalPortsArray = selectedFdh ? Array.from({ length: selectedFdh.ports }, (_, i) => i + 1) : [];
  const paginatedPorts = totalPortsArray.slice(indexOfFirstPort, indexOfLastPort);
  const totalPages = selectedFdh ? Math.ceil(selectedFdh.ports / portsPerPage) : 0;



  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold flex items-center gap-2">
            <Box className={`${iconSize} text-primary`} />
            {t('sidebar.maps_elements_fdhs', 'FDHs')}
        </h1>
        <Dialog open={isAddTemplateModalOpen} onOpenChange={setIsAddTemplateModalOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                    <FileTextIcon className={`mr-2 ${iconSize}`} /> {t('maps_elements.fdh_template_button', 'FDH Templates')}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="text-sm">{t('maps_elements.fdh_manage_templates_title', 'Manage FDH Templates')}</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
                    <fieldset className="md:col-span-2 border border-border rounded-md p-4 pt-2 space-y-4">
                       <legend className="text-sm font-semibold px-2 flex items-center gap-2">
                            <FilePlus2 className={`${iconSize} text-primary`} />
                            {t('maps_elements.fdh_new_template_heading', 'New FDH Template')}
                        </legend>
                        <Form {...templateForm}>
                            <form onSubmit={templateForm.handleSubmit(handleAddTemplateSubmit)} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={templateForm.control}
                                        name="manufacturer"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('maps_elements.fdh_template_form_manufacturer_label', 'Manufacturer')}</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder={t('maps_elements.fdh_template_form_manufacturer_placeholder', 'Select Manufacturer')} />
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
                                                <FormLabel>{t('maps_elements.fdh_template_form_model_label', 'Model')}</FormLabel>
                                                <FormControl>
                                                    <Input placeholder={t('maps_elements.fdh_template_form_model_placeholder', 'e.g., OptiSheath')} {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={templateForm.control}
                                        name="maxPortCapacity"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('maps_elements.fdh_template_form_max_port_capacity_label', 'Max Port Capacity')}</FormLabel>
                                                <FormControl>
                                                    <Input type="number" placeholder="e.g., 16" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={templateForm.control}
                                        name="fdhType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('maps_elements.fdh_template_form_type_label', 'FDH Type')}</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder={t('maps_elements.fdh_template_form_type_placeholder', 'Select Type')} />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="Aerial">{t('maps_elements.fdh_type_aerial', 'Aerial')}</SelectItem>
                                                        <SelectItem value="Underground">{t('maps_elements.fdh_type_underground', 'Underground')}</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <DialogFooter className="pt-4">
                                    <DialogClose asChild>
                                        <Button type="button" variant="outline" disabled={templateForm.formState.isSubmitting}>{t('maps_elements.fdh_template_form_cancel_button', 'Cancel')}</Button>
                                    </DialogClose>
                                    <Button type="submit" disabled={templateForm.formState.isSubmitting}>
                                        {templateForm.formState.isSubmitting && <Loader2 className={`mr-2 ${iconSize} animate-spin`} />}
                                        {t('maps_elements.fdh_template_form_save_button', 'Save Template')}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </fieldset>
                    <fieldset className="md:col-span-1 border border-border rounded-md p-4 pt-2 space-y-2">
                        <legend className="text-sm font-semibold px-2 flex items-center gap-2">
                            <List className={`${iconSize} text-primary`} />
                            {t('maps_elements.existing_fdh_templates_list_title', 'Existing FDH Templates')}
                        </legend>
                        <ScrollArea className="h-[200px] bg-muted/50 rounded-md p-2">
                            {placeholderExistingFdhTemplates.length > 0 ? (
                                placeholderExistingFdhTemplates.map(template => (
                                <div key={template.id} className="text-xs p-1.5 border-b last:border-b-0 hover:bg-background rounded-sm cursor-default">
                                    <div className="font-medium">{template.manufacturer} - {template.model}</div>
                                    <div className="text-muted-foreground">
                                    {t('maps_elements.fdh_template_info_max_ports')}: {template.maxPortCapacity}, {t('maps_elements.fdh_template_info_type')}: {t(`maps_elements.fdh_type_${template.fdhType.toLowerCase()}` as any, template.fdhType)}
                                    </div>
                                </div>
                                ))
                            ) : (
                                <p className="text-xs text-muted-foreground text-center py-4">{t('maps_elements.no_existing_fdh_templates', 'No existing FDH templates.')}</p>
                            )}
                        </ScrollArea>
                    </fieldset>
                </div>
            </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="pt-6">
           {placeholderFdhs.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs text-center">ID</TableHead>
                    <TableHead className="text-xs text-center">{t('maps_elements.fdh_table_header_gps', 'GPS Coordinates')}</TableHead>
                    <TableHead className="text-xs text-center">{t('maps_elements.fdh_table_header_type', 'Type')}</TableHead>
                    <TableHead className="text-xs text-center">{t('maps_elements.fdh_table_header_ports', 'Ports')}</TableHead>
                    <TableHead className="text-xs text-center">{t('maps_elements.table_header_project', 'Project')}</TableHead>
                    <TableHead className="text-xs text-center">{t('maps_elements.fdh_table_header_pon', 'PON')}</TableHead>
                    <TableHead className="text-xs text-center">{t('maps_elements.fdh_table_header_status', 'Status')}</TableHead>
                    <TableHead className="text-xs text-center">{t('maps_elements.fdh_table_header_brand', 'Brand')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {placeholderFdhs.map((fdh) => (
                    <TableRow key={fdh.id}>
                      <TableCell className="font-mono text-muted-foreground text-xs text-center">
                        <Button variant="link" size="sm" className="p-0 h-auto text-xs" onClick={() => handleFdhClick(fdh)}>
                            {fdh.id}
                        </Button>
                      </TableCell>
                      <TableCell className="text-xs text-center">{fdh.gpsCoordinates}</TableCell>
                      <TableCell className="text-xs text-center">{t(`maps_elements.fdh_type_${fdh.type.toLowerCase()}` as any, fdh.type)}</TableCell>
                      <TableCell className="text-xs text-center">{fdh.ports}</TableCell>
                      <TableCell className="text-xs text-center">{fdh.project || '-'}</TableCell>
                      <TableCell className="text-xs text-center">{fdh.pon}</TableCell>
                      <TableCell className="text-xs text-center">
                        <Badge variant="outline" className={`text-xs ${getStatusBadgeVariant(fdh.status)} border-transparent`}>
                          {t(`maps_elements.fdh_status_${fdh.status.toLowerCase()}` as any, fdh.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-center">{fdh.brand}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8 text-xs">
              {t('maps_elements.no_fdhs_found', 'No FDHs found. They are typically added via the map interface.')}
            </p>
          )}
        </CardContent>
      </Card>

      <Dialog open={isFdhModalOpen} onOpenChange={setIsFdhModalOpen}>
        <DialogContent className="sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-5xl h-[80vh] flex flex-col">
          <DialogHeader className="relative p-4 border-b">
            <DialogTitle className="sr-only">
                {t('maps_elements.fdh_modal_title', 'FDH Details: {id}').replace('{id}', selectedFdh?.id || 'N/A')}
            </DialogTitle>
             <fieldset className="border border-border rounded-md p-4 pt-1">
                <legend className="text-sm font-semibold px-2 flex items-center gap-2 -ml-2">
                    <Box className={`${modalIconSize} text-primary`} />
                    {t('maps_elements.fdh_modal_title', 'FDH Details: {id}').replace('{id}', selectedFdh?.id || 'N/A')}
                </legend>
                {selectedFdh && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1 text-xs pt-2">
                      <p><strong>{t('maps_elements.fdh_table_header_gps', 'GPS')}:</strong> {selectedFdh.gpsCoordinates}</p>
                      <p><strong>{t('maps_elements.fdh_table_header_type', 'Type')}:</strong> {t(`maps_elements.fdh_type_${selectedFdh.type.toLowerCase()}` as any, selectedFdh.type)}</p>
                      <p><strong>{t('maps_elements.fdh_table_header_ports', 'Ports')}:</strong> {selectedFdh.ports}</p>
                      <p><strong>{t('maps_elements.fdh_table_header_brand', 'Brand')}:</strong> {selectedFdh.brand}</p>
                      <p><strong>{t('maps_elements.table_header_project', 'Project')}:</strong> {selectedFdh.project || '-'}</p>
                      <p><strong>{t('maps_elements.fdh_table_header_pon', 'PON')}:</strong> {selectedFdh.pon}</p>
                      <p><strong>{t('maps_elements.fdh_table_header_status', 'Status')}:</strong>
                          <Badge variant="outline" className={cn("ml-1 text-xs border-transparent", getStatusBadgeVariant(selectedFdh.status))}>
                          {t(`maps_elements.fdh_status_${selectedFdh.status.toLowerCase()}` as any, selectedFdh.status)}
                          </Badge>
                      </p>
                  </div>
                )}
            </fieldset>
          </DialogHeader>

          <Tabs value={activeModalTab} onValueChange={setActiveModalTab} className="w-full flex-grow flex flex-col overflow-hidden">
            <TabsList className="grid w-full grid-cols-5 shrink-0"> {/* Updated to 5 columns */}
              <TabsTrigger value="port-list"><Users2 className={`mr-1.5 ${modalIconSize}`} />{t('maps_elements.fdh_modal_tab_port_list', 'Port List')}</TabsTrigger>
              <TabsTrigger value="cable-info"><Cable className={`mr-1.5 ${modalIconSize}`} />{t('maps_elements.fdh_modal_tab_cable_info', 'Cable Info')}</TabsTrigger>
              <TabsTrigger value="diagram"><GitMerge className={`mr-1.5 ${modalIconSize}`} />{t('maps_elements.fdh_modal_tab_diagram', 'Splice Diagram')}</TabsTrigger>
              <TabsTrigger value="log"><ListChecks className={`mr-1.5 ${modalIconSize}`} />{t('maps_elements.fdh_modal_tab_log', 'Splice Log')}</TabsTrigger>
              <TabsTrigger value="history"><AlertTriangle className={`mr-1.5 ${modalIconSize}`} />{t('maps_elements.fdh_modal_tab_history', 'History')}</TabsTrigger>
            </TabsList>

            <TabsContent value="port-list" className="mt-2 flex-grow overflow-y-auto">
              {selectedFdh && selectedFdh.ports > 0 ? (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs text-center w-1/4">{t('maps_elements.fdh_modal_port_number', 'Port #')}</TableHead>
                        <TableHead className="text-xs text-center w-1/2">{t('maps_elements.fdh_modal_client_name', 'Client Name')}</TableHead>
                        <TableHead className="text-xs text-center w-1/4">{t('maps_elements.fdh_modal_light_levels_rx_tx', 'Light Levels (RX/TX)')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedPorts.map(portNumber => {
                        const client = selectedFdh.clients?.find(c => c.port === portNumber);
                        return (
                          <TableRow key={`port-${portNumber}`}>
                            <TableCell className="text-xs text-center">{portNumber}</TableCell>
                            <TableCell className="text-xs text-center">{client ? client.name : t('maps_elements.fdh_modal_port_free', 'Free')}</TableCell>
                            <TableCell className="text-xs text-center">{client ? `${client.lightLevelRx} / ${client.lightLevelTx}` : '-'}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                 
                </>
              ) : (
                <p className="text-xs text-muted-foreground text-center py-4">{t('maps_elements.fdh_modal_no_clients_or_ports', 'No ports or clients to display for this FDH.')}</p>
              )}
            </TabsContent>

            <TabsContent value="cable-info" className="mt-2 flex-grow overflow-y-auto">
              {selectedFdh?.cableInfo && selectedFdh.cableInfo.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs text-center">{t('maps_elements.fdh_modal_cable_info_number', '#')}</TableHead>
                      <TableHead className="text-xs text-center">{t('maps_elements.fdh_modal_cable_info_serial', 'Serial #')}</TableHead>
                      <TableHead className="text-xs text-center">{t('maps_elements.fdh_modal_cable_info_count', 'Count')}</TableHead>
                      <TableHead className="text-xs text-center">{t('maps_elements.fdh_modal_cable_info_manufacturer', 'Manufacturer')}</TableHead>
                      <TableHead className="text-xs text-center">{t('maps_elements.fdh_modal_cable_info_description', 'Description')}</TableHead>
                      <TableHead className="text-xs text-center">{t('maps_elements.fdh_modal_cable_info_tube_ids', 'Tube IDs')}</TableHead>
                      <TableHead className="text-xs text-center">{t('maps_elements.fdh_modal_cable_info_meter_mark', 'Meter Mark')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedFdh.cableInfo.map(cable => (
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
                 <p className="text-xs text-muted-foreground text-center py-4">{t('maps_elements.fdh_modal_no_cable_info', 'No cable information available for this FDH.')}</p>
              )}
            </TabsContent>

            <TabsContent value="diagram" className="mt-2 flex-grow flex justify-center items-center overflow-hidden">
              <Image src="https://placehold.co/600x400.png" alt="Splice Diagram Placeholder" width={550} height={350} data-ai-hint="fiber splice diagram" className="object-contain" />
            </TabsContent>

            <TabsContent value="log" className="mt-2 flex-grow overflow-y-auto">
             {selectedFdh?.spliceLogs && selectedFdh.spliceLogs.length > 0 ? (
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
                    {selectedFdh.spliceLogs.map(log => (
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
                <p className="text-xs text-muted-foreground text-center py-4">{t('maps_elements.fdh_modal_no_logs', 'No splice logs available for this FDH.')}</p>
             )}
            </TabsContent>

            <TabsContent value="history" className="mt-2 flex-grow overflow-y-auto">
               {selectedFdh?.history && selectedFdh.history.length > 0 ? (
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
                    {selectedFdh.history.map(entry => (
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
                <p className="text-xs text-muted-foreground text-center py-4">{t('maps_elements.fdh_modal_no_history', 'No history available for this FDH.')}</p>
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
