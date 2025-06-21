// src/app/maps/elements/splitters/page.tsx
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
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Split, Edit, Trash2, FileText as FileTextIcon, Loader2, FilePlus2, List } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cn } from "@/lib/utils";

type ConnectorType = 'UPC' | 'APC';
type DistributionType = 'Network' | 'PON';
type SplitterCategoryEnum = '1x2' | '1x4' | '1x8' | '1x16' | '1x32';
type SplitterRatioEnum = '50/50' | '60/40' | '75/25' | '70/30' | '80/20' | '85/15' | '90/10' | '95/5';

interface Splitter {
  id: string;
  description: string;
  enclosureId: string; // ID of FOSC or FDH
  connectorized: boolean;
  connectorType?: ConnectorType;
  distributionType: DistributionType;
  category: SplitterCategoryEnum;
  ratio?: SplitterRatioEnum;
}

const placeholderSplitters: Splitter[] = [];

// Schema for Splitter Template
const splitterTemplateSchema = z.object({
  manufacturer: z.string().min(1, "Manufacturer is required."),
  model: z.string().min(1, "Model is required."),
  category: z.enum(['1x2', '1x4', '1x8', '1x16', '1x32'], { required_error: "Category is required."}),
  inputConnectorType: z.enum(['UPC', 'APC'], { required_error: "Input connector type is required."}),
  outputConnectorType: z.enum(['UPC', 'APC'], { required_error: "Output connector type is required."}),
  distributionType: z.enum(['Network', 'PON'], { required_error: "Distribution type is required."}),
});
type SplitterTemplateFormData = z.infer<typeof splitterTemplateSchema>;

interface SplitterTemplate extends SplitterTemplateFormData {
  id: string;
}

const placeholderSplitterManufacturers: string[] = [];

const placeholderExistingSplitterTemplates: SplitterTemplate[] = [];

export default function SplittersPage() {
  const { t } = useLocale();
  const { toast } = useToast();
  const iconSize = "h-3 w-3";
  const [isAddTemplateModalOpen, setIsAddTemplateModalOpen] = React.useState(false);

  const templateForm = useForm<SplitterTemplateFormData>({
    resolver: zodResolver(splitterTemplateSchema),
    defaultValues: {
      manufacturer: '',
      model: '',
      category: undefined,
      inputConnectorType: undefined,
      outputConnectorType: undefined,
      distributionType: undefined,
    },
  });

  const handleAddTemplateSubmit = (data: SplitterTemplateFormData) => {
    console.log("New Splitter Template Data:", data);
    const newTemplate: SplitterTemplate = { ...data, id: `tpl-splt-${Date.now()}`};
    placeholderExistingSplitterTemplates.push(newTemplate);
    toast({
      title: t('maps_elements.splitter_template_add_success_title', 'Splitter Template Added'),
      description: t('maps_elements.splitter_template_add_success_desc', 'Template for {model} by {manufacturer} added.').replace('{model}', data.model).replace('{manufacturer}', data.manufacturer),
    });
    templateForm.reset();
    setIsAddTemplateModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold flex items-center gap-2">
            <Split className={`${iconSize} text-primary`} />
            {t('sidebar.maps_elements_splitters', 'Splitters')}
        </h1>
        <Dialog open={isAddTemplateModalOpen} onOpenChange={setIsAddTemplateModalOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                    <FileTextIcon className={`mr-2 ${iconSize}`} /> {t('maps_elements.splitter_template_button', 'Splitter Templates')}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="text-sm">{t('maps_elements.splitter_manage_templates_title', 'Manage Splitter Templates')}</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
                    <fieldset className="md:col-span-2 border border-border rounded-md p-4 pt-2 space-y-4">
                       <legend className="text-sm font-semibold px-2 flex items-center gap-2">
                            <FilePlus2 className={`${iconSize} text-primary`} />
                            {t('maps_elements.splitter_new_template_heading', 'New Splitter Template')}
                        </legend>
                        <Form {...templateForm}>
                            <form onSubmit={templateForm.handleSubmit(handleAddTemplateSubmit)} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={templateForm.control}
                                        name="manufacturer"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('maps_elements.splitter_template_form_manufacturer_label', 'Manufacturer')}</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder={t('maps_elements.splitter_template_form_manufacturer_placeholder', 'Select Manufacturer')} />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {placeholderSplitterManufacturers.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
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
                                                <FormLabel>{t('maps_elements.splitter_template_form_model_label', 'Model')}</FormLabel>
                                                <FormControl>
                                                    <Input placeholder={t('maps_elements.splitter_template_form_model_placeholder', 'e.g., OptiTap Splitter')} {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={templateForm.control}
                                        name="category"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('maps_elements.splitter_template_form_category_label', 'Category')}</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl><SelectTrigger><SelectValue placeholder={t('maps_elements.splitter_template_form_category_placeholder', 'Select Category')} /></SelectTrigger></FormControl>
                                                    <SelectContent>
                                                        {(['1x2', '1x4', '1x8', '1x16', '1x32'] as SplitterCategoryEnum[]).map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                     <FormField
                                        control={templateForm.control}
                                        name="distributionType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('maps_elements.splitter_template_form_dist_type_label', 'Distribution Type')}</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl><SelectTrigger><SelectValue placeholder={t('maps_elements.splitter_template_form_dist_type_placeholder', 'Select Type')} /></SelectTrigger></FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="Network">{t('maps_elements.splitter_dist_type_network', 'Network')}</SelectItem>
                                                        <SelectItem value="PON">{t('maps_elements.splitter_dist_type_pon', 'PON')}</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                   <FormField
                                        control={templateForm.control}
                                        name="inputConnectorType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('maps_elements.splitter_template_form_input_conn_label', 'Input Connector')}</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl><SelectTrigger><SelectValue placeholder={t('maps_elements.splitter_template_form_conn_placeholder', 'Select Type')} /></SelectTrigger></FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="UPC">UPC</SelectItem>
                                                        <SelectItem value="APC">APC</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={templateForm.control}
                                        name="outputConnectorType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('maps_elements.splitter_template_form_output_conn_label', 'Output Connector(s)')}</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl><SelectTrigger><SelectValue placeholder={t('maps_elements.splitter_template_form_conn_placeholder', 'Select Type')} /></SelectTrigger></FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="UPC">UPC</SelectItem>
                                                        <SelectItem value="APC">APC</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <DialogFooter className="pt-4">
                                    <DialogClose asChild><Button type="button" variant="outline" disabled={templateForm.formState.isSubmitting}>{t('maps_elements.splitter_template_form_cancel_button', 'Cancel')}</Button></DialogClose>
                                    <Button type="submit" disabled={templateForm.formState.isSubmitting}>
                                        {templateForm.formState.isSubmitting && <Loader2 className={`mr-2 ${iconSize} animate-spin`} />}
                                        {t('maps_elements.splitter_template_form_save_button', 'Save Template')}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </fieldset>
                    <fieldset className="md:col-span-1 border border-border rounded-md p-4 pt-2 space-y-2">
                        <legend className="text-sm font-semibold px-2 flex items-center gap-2">
                            <List className={`${iconSize} text-primary`} />
                            {t('maps_elements.existing_splitter_templates_list_title', 'Existing Templates')}
                        </legend>
                        <ScrollArea className="h-[260px] bg-muted/50 rounded-md p-2">
                            {placeholderExistingSplitterTemplates.length > 0 ? (
                                placeholderExistingSplitterTemplates.map(template => (
                                <div key={template.id} className="text-xs p-1.5 border-b last:border-b-0 hover:bg-background rounded-sm cursor-default">
                                    <div className="font-medium">{template.manufacturer} - {template.model}</div>
                                    <div className="text-muted-foreground">
                                    {t('maps_elements.splitter_template_info_category')}: {template.category}, {t('maps_elements.splitter_template_info_conn_types')}: {template.inputConnectorType}/{template.outputConnectorType}
                                    </div>
                                </div>
                                ))
                            ) : (
                                <p className="text-xs text-muted-foreground text-center py-4">{t('maps_elements.no_existing_splitter_templates', 'No existing templates.')}</p>
                            )}
                        </ScrollArea>
                    </fieldset>
                </div>
            </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="pt-6">
          {placeholderSplitters.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs font-semibold">{t('maps_elements.splitter_table_header_id', 'ID')}</TableHead>
                    <TableHead className="text-xs font-semibold">{t('maps_elements.splitter_table_header_description', 'Description')}</TableHead>
                    <TableHead className="text-xs font-semibold">{t('maps_elements.splitter_table_header_enclosure', 'Enclosure (FOSC/FDH ID)')}</TableHead>
                    <TableHead className="text-xs font-semibold">{t('maps_elements.splitter_table_header_connectorized', 'Connectorized')}</TableHead>
                    <TableHead className="text-xs font-semibold">{t('maps_elements.splitter_table_header_connector_type', 'Connector Type')}</TableHead>
                    <TableHead className="text-xs font-semibold">{t('maps_elements.splitter_table_header_distribution_type', 'Distribution Type')}</TableHead>
                    <TableHead className="text-xs font-semibold">{t('maps_elements.splitter_table_header_category', 'Category')}</TableHead>
                    <TableHead className="text-xs font-semibold">{t('maps_elements.splitter_table_header_ratio', 'Ratio (if 1x2)')}</TableHead>
                    <TableHead className="text-xs font-semibold text-right">{t('maps_elements.project_table_header_actions', 'Actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {placeholderSplitters.map((splitter) => (
                    <TableRow key={splitter.id}>
                      <TableCell className="font-mono text-muted-foreground text-xs text-center">{splitter.id}</TableCell>
                      <TableCell className="text-xs">{splitter.description}</TableCell>
                      <TableCell className="font-mono text-muted-foreground text-xs text-center">{splitter.enclosureId}</TableCell>
                      <TableCell className="text-xs text-center">
                        <Badge variant={splitter.connectorized ? 'default' : 'secondary'} className={`text-xs ${splitter.connectorized ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {splitter.connectorized ? t('maps_elements.yes_indicator', 'Yes') : t('maps_elements.no_indicator', 'No')}
                        </Badge>
                      </TableCell>
                      <TableCell className={cn("text-xs text-center", 
                        splitter.connectorType === 'APC' && 'text-green-800',
                        splitter.connectorType === 'UPC' && 'text-blue-800'
                      )}>
                        {splitter.connectorized ? splitter.connectorType : '-'}
                      </TableCell>
                      <TableCell className="text-xs text-center">{splitter.distributionType}</TableCell>
                      <TableCell className="text-xs text-center">{splitter.category}</TableCell>
                      <TableCell className="text-xs text-center">{splitter.category === '1x2' ? splitter.ratio : '-'}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Edit className={iconSize} />
                          <span className="sr-only">{t('maps_elements.action_edit_splitter', 'Edit Splitter')}</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive">
                          <Trash2 className={iconSize} />
                          <span className="sr-only">{t('maps_elements.action_delete_splitter', 'Delete Splitter')}</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8 text-xs">
              {t('maps_elements.no_splitters_found', 'No splitters found. They are typically added via the map interface.')}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
