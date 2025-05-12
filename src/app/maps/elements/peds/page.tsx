// src/app/maps/elements/peds/page.tsx
'use client';

import * as React from 'react';
import { Card, CardContent } from "@/components/ui/card"; // CardHeader, CardTitle removed
import { Button, buttonVariants } from '@/components/ui/button';
import { Box, FileText as FileTextIcon, Edit, Trash2, Loader2, FilePlus2, List } from 'lucide-react';
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Ped {
  id: string;
  description: string;
  pedType: 'Column' | 'Cabinet';
  isEnergized: boolean;
  manufacturer: string;
  gpsCoordinates: string;
  address?: string;
}

const placeholderPeds: Ped[] = [
  { id: 'ped-001', description: 'Street Corner PED', pedType: 'Cabinet', isEnergized: true, manufacturer: 'Alpha Technologies', gpsCoordinates: '34.0522° N, 118.2437° W', address: '101 Main St, Anytown' },
  { id: 'ped-002', description: 'Parkside Distribution', pedType: 'Column', isEnergized: false, manufacturer: 'Emerson Network Power', gpsCoordinates: '34.0550° N, 118.2450° W' },
  { id: 'ped-003', description: 'Residential Block Unit', pedType: 'Cabinet', isEnergized: true, manufacturer: 'Charles Industries', gpsCoordinates: '34.0500° N, 118.2400° W', address: '202 Suburbia Dr, Anytown' },
];

const pedTemplateSchema = z.object({
  manufacturer: z.string().min(1, "Manufacturer is required."),
  model: z.string().min(1, "Model is required."),
  maxCapacity: z.coerce.number().int().positive("Max capacity must be a positive number (e.g., equipment slots)."),
  pedType: z.enum(['Column', 'Cabinet'], { required_error: "PED type is required."}),
});
type PedTemplateFormData = z.infer<typeof pedTemplateSchema>;

interface PedTemplate extends PedTemplateFormData {
  id: string;
}

const placeholderPedManufacturers = ["Alpha Technologies", "Emerson Network Power", "Charles Industries", "Steren", "Hubbell"];

const placeholderExistingPedTemplates: PedTemplate[] = [
  { id: 'tpl-ped-1', manufacturer: 'Alpha Technologies', model: 'Alpha PED 2000', maxCapacity: 12, pedType: 'Cabinet' },
  { id: 'tpl-ped-2', manufacturer: 'Emerson Network Power', model: 'NetSure Column PED', maxCapacity: 4, pedType: 'Column' },
];


export default function PedsPage() {
  const { t } = useLocale();
  const { toast } = useToast();
  const iconSize = "h-3 w-3";
  const [isAddTemplateModalOpen, setIsAddTemplateModalOpen] = React.useState(false);

  const templateForm = useForm<PedTemplateFormData>({
    resolver: zodResolver(pedTemplateSchema),
    defaultValues: {
      manufacturer: '',
      model: '',
      maxCapacity: undefined,
      pedType: undefined,
    },
  });

  const getEnergizedBadgeVariant = (isEnergized: boolean) => {
    return isEnergized ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800';
  };

  const handleAddTemplateSubmit = (data: PedTemplateFormData) => {
    console.log("New PED Template Data:", data);
    const newTemplate: PedTemplate = { ...data, id: `tpl-ped-${Date.now()}`};
    placeholderExistingPedTemplates.push(newTemplate); // Add to your placeholder array
    toast({
      title: t('maps_elements.ped_template_add_success_title', 'PED Template Added'),
      description: t('maps_elements.ped_template_add_success_desc', 'Template for {model} by {manufacturer} added.').replace('{model}', data.model).replace('{manufacturer}', data.manufacturer),
    });
    templateForm.reset();
    setIsAddTemplateModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold flex items-center gap-2">
            <Box className={`${iconSize} text-primary`} />
            {t('sidebar.maps_elements_peds', 'PEDs')}
        </h1>
         <Dialog open={isAddTemplateModalOpen} onOpenChange={setIsAddTemplateModalOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                    <FileTextIcon className={`mr-2 ${iconSize}`} /> {t('maps_elements.ped_template_button', 'PED Templates')}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="text-sm">{t('maps_elements.ped_manage_templates_title', 'Manage PED Templates')}</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
                    <fieldset className="md:col-span-2 border border-border rounded-md p-4 pt-2 space-y-4">
                       <legend className="text-sm font-semibold px-2 flex items-center gap-2">
                            <FilePlus2 className={`${iconSize} text-primary`} />
                            {t('maps_elements.ped_new_template_heading', 'New PED Template')}
                        </legend>
                        <Form {...templateForm}>
                            <form onSubmit={templateForm.handleSubmit(handleAddTemplateSubmit)} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={templateForm.control}
                                        name="manufacturer"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('maps_elements.ped_template_form_manufacturer_label', 'Manufacturer')}</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder={t('maps_elements.ped_template_form_manufacturer_placeholder', 'Select Manufacturer')} />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {placeholderPedManufacturers.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
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
                                                <FormLabel>{t('maps_elements.ped_template_form_model_label', 'Model')}</FormLabel>
                                                <FormControl>
                                                    <Input placeholder={t('maps_elements.ped_template_form_model_placeholder', 'e.g., Alpha PED 2000')} {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={templateForm.control}
                                        name="maxCapacity"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('maps_elements.ped_template_form_max_capacity_label', 'Max Capacity (Slots/Connections)')}</FormLabel>
                                                <FormControl>
                                                    <Input type="number" placeholder="e.g., 12" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={templateForm.control}
                                        name="pedType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('maps_elements.ped_template_form_type_label', 'PED Type')}</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder={t('maps_elements.ped_template_form_type_placeholder', 'Select Type')} />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="Column">{t('maps_elements.ped_type_column', 'Column')}</SelectItem>
                                                        <SelectItem value="Cabinet">{t('maps_elements.ped_type_cabinet', 'Cabinet')}</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <DialogFooter className="pt-4">
                                    <DialogClose asChild>
                                        <Button type="button" variant="outline" disabled={templateForm.formState.isSubmitting}>{t('maps_elements.ped_template_form_cancel_button', 'Cancel')}</Button>
                                    </DialogClose>
                                    <Button type="submit" disabled={templateForm.formState.isSubmitting}>
                                        {templateForm.formState.isSubmitting && <Loader2 className={`mr-2 ${iconSize} animate-spin`} />}
                                        {t('maps_elements.ped_template_form_save_button', 'Save Template')}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </fieldset>
                    <fieldset className="md:col-span-1 border border-border rounded-md p-4 pt-2 space-y-2">
                        <legend className="text-sm font-semibold px-2 flex items-center gap-2">
                            <List className={`${iconSize} text-primary`} />
                            {t('maps_elements.existing_ped_templates_list_title', 'Existing PED Templates')}
                        </legend>
                        <ScrollArea className="h-[200px] bg-muted/50 rounded-md p-2">
                            {placeholderExistingPedTemplates.length > 0 ? (
                                placeholderExistingPedTemplates.map(template => (
                                <div key={template.id} className="text-xs p-1.5 border-b last:border-b-0 hover:bg-background rounded-sm cursor-default">
                                    <div className="font-medium">{template.manufacturer} - {template.model}</div>
                                    <div className="text-muted-foreground">
                                    {t('maps_elements.ped_template_info_max_capacity')}: {template.maxCapacity}, {t('maps_elements.ped_template_info_type')}: {t(`maps_elements.ped_type_${template.pedType.toLowerCase()}` as any, template.pedType)}
                                    </div>
                                </div>
                                ))
                            ) : (
                                <p className="text-xs text-muted-foreground text-center py-4">{t('maps_elements.no_existing_ped_templates', 'No existing PED templates.')}</p>
                            )}
                        </ScrollArea>
                    </fieldset>
                </div>
            </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="pt-6">
          {placeholderPeds.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">ID</TableHead>
                    <TableHead className="text-xs">{t('maps_elements.ped_table_header_description', 'Description')}</TableHead>
                    <TableHead className="text-xs">{t('maps_elements.ped_table_header_ped_type', 'PED Type')}</TableHead>
                    <TableHead className="text-xs">{t('maps_elements.ped_table_header_energized', 'Energized?')}</TableHead>
                    <TableHead className="text-xs">{t('maps_elements.ped_table_header_manufacturer', 'Manufacturer')}</TableHead>
                    <TableHead className="text-xs">{t('maps_elements.ped_table_header_gps', 'GPS')}</TableHead>
                    <TableHead className="text-xs">{t('maps_elements.ped_table_header_address', 'Address (Optional)')}</TableHead>
                    <TableHead className="text-xs text-right">{t('maps_elements.project_table_header_actions', 'Actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {placeholderPeds.map((ped) => (
                    <TableRow key={ped.id}>
                      <TableCell className="font-mono text-muted-foreground text-xs">{ped.id}</TableCell>
                      <TableCell className="text-xs">{ped.description}</TableCell>
                      <TableCell className="text-xs">{t(`maps_elements.ped_type_${ped.pedType.toLowerCase()}` as any, ped.pedType)}</TableCell>
                      <TableCell className="text-xs">
                        <Badge variant="outline" className={`text-xs ${getEnergizedBadgeVariant(ped.isEnergized)} border-transparent`}>
                          {ped.isEnergized ? t('maps_elements.yes_indicator', 'Yes') : t('maps_elements.no_indicator', 'No')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">{ped.manufacturer}</TableCell>
                      <TableCell className="text-xs">{ped.gpsCoordinates}</TableCell>
                      <TableCell className="text-xs">{ped.address || '-'}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Edit className={iconSize} />
                          <span className="sr-only">{t('maps_elements.action_edit_ped', 'Edit PED')}</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive">
                          <Trash2 className={iconSize} />
                          <span className="sr-only">{t('maps_elements.action_delete_ped', 'Delete PED')}</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8 text-xs">
              {t('maps_elements.no_peds_found', 'No PEDs found. They are typically added via the map interface.')}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
