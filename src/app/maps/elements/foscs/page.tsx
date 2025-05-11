// src/app/maps/elements/foscs/page.tsx
'use client';

import * as React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from '@/components/ui/button';
import { Warehouse, Edit, Trash2, PlusCircle, FileText as FileTextIcon, Loader2 } from 'lucide-react';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle as AlertDialogTitleComponent,
} from "@/components/ui/alert-dialog";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ScrollArea } from '@/components/ui/scroll-area';


interface Fosc {
  id: string;
  gpsCoordinates: string;
  type: 'Aerial' | 'Underground';
  trays: string;
  project?: string;
  cableCount: string; // Format "current/max"
  status: 'Active' | 'Inactive' | 'Planned';
  brand: string;
}

const placeholderFoscs: Fosc[] = [
  { id: 'fosc-001', gpsCoordinates: '39.9526° N, 75.1652° W', type: 'Aerial', trays: '6/12', project: 'Center City Fiber', cableCount: '4/6', status: 'Active', brand: 'TE Connectivity' },
  { id: 'fosc-002', gpsCoordinates: '34.0522° N, 118.2437° W', type: 'Underground', trays: '10/24', project: 'LA Downtown Grid', cableCount: '8/12', status: 'Active', brand: 'Furukawa' },
  { id: 'fosc-003', gpsCoordinates: '40.7128° N, 74.0060° W', type: 'Aerial', trays: '2/4', project: 'NYC Soho Link', cableCount: '1/2', status: 'Planned', brand: 'Corning' },
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
  const [isAddTemplateModalOpen, setIsAddTemplateModalOpen] = React.useState(false);

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
            <DialogContent className="sm:max-w-3xl"> {/* Increased width for better layout */}
                <DialogHeader>
                    <DialogTitle className="text-sm">{t('maps_elements.fosc_manage_templates_title', 'Manage FOSC Templates')}</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
                    <div className="md:col-span-2 border border-border rounded-md p-4"> {/* Added border and padding */}
                        <h3 className="text-sm font-semibold mb-3 text-left">{t('maps_elements.fosc_new_template_heading', 'New Template')}</h3>
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
                    </div>
                    <div className="md:col-span-1">
                        <h3 className="text-xs font-semibold mb-2 text-muted-foreground">{t('maps_elements.existing_fosc_templates_list_title', 'Existing Templates')}</h3>
                        <ScrollArea className="h-[300px] border rounded-md p-2 bg-muted/50">
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
                    </div>
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
                    <TableHead className="text-xs">ID</TableHead>
                    <TableHead className="text-xs">{t('maps_elements.fosc_table_header_gps', 'GPS Coordinates')}</TableHead>
                    <TableHead className="text-xs">{t('maps_elements.fosc_table_header_type', 'Type')}</TableHead>
                    <TableHead className="text-xs text-center">{t('maps_elements.fosc_table_header_trays', 'Trays (Used/Max)')}</TableHead>
                    <TableHead className="text-xs">{t('maps_elements.table_header_project', 'Project')}</TableHead>
                    <TableHead className="text-xs text-center">{t('maps_elements.fosc_table_header_cable_count', 'Cable Count (In/Out)')}</TableHead>
                    <TableHead className="text-xs">{t('maps_elements.fosc_table_header_status', 'Status')}</TableHead>
                    <TableHead className="text-xs">{t('maps_elements.fosc_table_header_brand', 'Brand')}</TableHead>
                    <TableHead className="text-xs text-right">{t('maps_elements.project_table_header_actions', 'Actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {placeholderFoscs.map((fosc) => (
                    <TableRow key={fosc.id}>
                      <TableCell className="font-mono text-muted-foreground text-xs">{fosc.id}</TableCell>
                      <TableCell className="text-xs">{fosc.gpsCoordinates}</TableCell>
                      <TableCell className="text-xs">{t(`maps_elements.fosc_type_${fosc.type.toLowerCase()}` as any, fosc.type)}</TableCell>
                      <TableCell className="text-xs text-center">{fosc.trays}</TableCell>
                      <TableCell className="text-xs">{fosc.project || '-'}</TableCell>
                      <TableCell className="text-xs text-center">{fosc.cableCount}</TableCell>
                      <TableCell className="text-xs">
                        <Badge variant="outline" className={`text-xs ${getStatusBadgeVariant(fosc.status)} border-transparent`}>
                          {t(`maps_elements.fosc_status_${fosc.status.toLowerCase()}` as any, fosc.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">{fosc.brand}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Edit className={iconSize} />
                          <span className="sr-only">{t('maps_elements.action_edit_fosc', 'Edit FOSC')}</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive">
                          <Trash2 className={iconSize} />
                          <span className="sr-only">{t('maps_elements.action_delete_fosc', 'Delete FOSC')}</span>
                        </Button>
                      </TableCell>
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
    </div>
  );
}
