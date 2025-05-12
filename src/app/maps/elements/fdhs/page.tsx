// src/app/maps/elements/fdhs/page.tsx
'use client';

import * as React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from '@/components/ui/button';
import { Box, Edit, Trash2, FileText as FileTextIcon, Loader2, FilePlus2, List } from 'lucide-react';
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

interface Fdh {
  id: string;
  gpsCoordinates: string;
  type: 'Aerial' | 'Underground';
  ports: number;
  project?: string;
  pon: string;
  status: 'Active' | 'Inactive';
  brand: string;
}

const placeholderFdhs: Fdh[] = [
  { id: 'fdh-001', gpsCoordinates: '40.7128° N, 74.0060° W', type: 'Aerial', ports: 16, project: 'Downtown Expansion', pon: '1/1/1', status: 'Active', brand: 'Corning' },
  { id: 'fdh-002', gpsCoordinates: '34.0522° N, 118.2437° W', type: 'Underground', ports: 32, project: 'Suburb Rollout', pon: '1/1/2', status: 'Active', brand: 'CommScope' },
  { id: 'fdh-003', gpsCoordinates: '41.8781° N, 87.6298° W', type: 'Aerial', ports: 8, project: 'Industrial Park', pon: '1/2/1', status: 'Inactive', brand: 'Prysmian' },
];

const fdhTemplateSchema = z.object({
  manufacturer: z.string().min(1, "Manufacturer is required."),
  model: z.string().min(1, "Model is required."),
  portCapacity: z.coerce.number().int().positive("Port capacity must be a positive number."),
  fdhType: z.enum(['Aerial', 'Underground'], { required_error: "FDH type is required."}),
});
type FdhTemplateFormData = z.infer<typeof fdhTemplateSchema>;

interface FdhTemplate extends FdhTemplateFormData {
  id: string;
}

const placeholderManufacturers = ["Corning", "CommScope", "Prysmian", "Furukawa", "TE Connectivity"];

const placeholderExistingFdhTemplates: FdhTemplate[] = [
  { id: 'tpl-fdh-1', manufacturer: 'Corning', model: 'OptiSheath® MultiPort Terminal', portCapacity: 16, fdhType: 'Aerial' },
  { id: 'tpl-fdh-2', manufacturer: 'CommScope', model: 'FACT Pedestal', portCapacity: 32, fdhType: 'Underground' },
];


export default function FdhsPage() {
  const { t } = useLocale();
  const { toast } = useToast();
  const iconSize = "h-3 w-3";
  const [isAddTemplateModalOpen, setIsAddTemplateModalOpen] = React.useState(false);

  const templateForm = useForm<FdhTemplateFormData>({
    resolver: zodResolver(fdhTemplateSchema),
    defaultValues: {
      manufacturer: '',
      model: '',
      portCapacity: undefined,
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
                                        name="portCapacity"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('maps_elements.fdh_template_form_port_capacity_label', 'Port Capacity')}</FormLabel>
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
                                    {t('maps_elements.fdh_template_info_ports')}: {template.portCapacity}, {t('maps_elements.fdh_template_info_type')}: {t(`maps_elements.fdh_type_${template.fdhType.toLowerCase()}` as any, template.fdhType)}
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
                    <TableHead className="text-xs">ID</TableHead>
                    <TableHead className="text-xs">{t('maps_elements.fdh_table_header_gps', 'GPS Coordinates')}</TableHead>
                    <TableHead className="text-xs">{t('maps_elements.fdh_table_header_type', 'Type')}</TableHead>
                    <TableHead className="text-xs text-center">{t('maps_elements.fdh_table_header_ports', 'Ports')}</TableHead>
                    <TableHead className="text-xs">{t('maps_elements.table_header_project', 'Project')}</TableHead>
                    <TableHead className="text-xs">{t('maps_elements.fdh_table_header_pon', 'PON')}</TableHead>
                    <TableHead className="text-xs">{t('maps_elements.fdh_table_header_status', 'Status')}</TableHead>
                    <TableHead className="text-xs">{t('maps_elements.fdh_table_header_brand', 'Brand')}</TableHead>
                    <TableHead className="text-xs text-right">{t('maps_elements.project_table_header_actions', 'Actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {placeholderFdhs.map((fdh) => (
                    <TableRow key={fdh.id}>
                      <TableCell className="font-mono text-muted-foreground text-xs">{fdh.id}</TableCell>
                      <TableCell className="text-xs">{fdh.gpsCoordinates}</TableCell>
                      <TableCell className="text-xs">{t(`maps_elements.fdh_type_${fdh.type.toLowerCase()}` as any, fdh.type)}</TableCell>
                      <TableCell className="text-xs text-center">{fdh.ports}</TableCell>
                      <TableCell className="text-xs">{fdh.project || '-'}</TableCell>
                      <TableCell className="text-xs">{fdh.pon}</TableCell>
                      <TableCell className="text-xs">
                        <Badge variant="outline" className={`text-xs ${getStatusBadgeVariant(fdh.status)} border-transparent`}>
                          {t(`maps_elements.fdh_status_${fdh.status.toLowerCase()}` as any, fdh.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">{fdh.brand}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Edit className={iconSize} />
                          <span className="sr-only">{t('maps_elements.action_edit_fdh', 'Edit FDH')}</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive">
                          <Trash2 className={iconSize} />
                          <span className="sr-only">{t('maps_elements.action_delete_fdh', 'Delete FDH')}</span>
                        </Button>
                      </TableCell>
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
    </div>
  );
}
