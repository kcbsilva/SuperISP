// src/app/fttx/onu-templates/page.tsx
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
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
import { Textarea } from "@/components/ui/textarea";
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
  AlertDialogTrigger, // Added AlertDialogTrigger import
} from "@/components/ui/alert-dialog";
import { PlusCircle, Edit, Trash2, Loader2, RefreshCw } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Schema for ONU Template
const onuTemplateSchema = z.object({
  templateName: z.string().min(1, "Template name is required."),
  manufacturer: z.string().min(1, "Manufacturer is required."),
  model: z.string().min(1, "Model is required."),
  script: z.string().min(1, "Provisioning script is required."),
});

type OnuTemplateFormData = z.infer<typeof onuTemplateSchema>;

interface OnuTemplate extends OnuTemplateFormData {
  id: string;
  createdAt: Date;
}

const placeholderTemplates: OnuTemplate[] = [
  { id: 'tpl-1', templateName: 'Fiberhome GPON Residential', manufacturer: 'Fiberhome', model: 'AN5506-01-A1', script: '# Sample Script\ncd onu\nset whitelist phy_addr address {{onuSerial}} action add slot {{slot}} pon {{port}} onu {{onuId}} type {{model}}', createdAt: new Date() },
  { id: 'tpl-2', templateName: 'Huawei EPON Business', manufacturer: 'Huawei', model: 'HG8245H', script: '# Another Sample Script\nconfig\ninterface gpon 0/{{slot}}\nonu add {{port}} {{onuId}} sn {{onuSerial}} type {{model}}\nquit', createdAt: new Date(Date.now() - 86400000) },
];

// Simulated list of manufacturers - in a real app, this might come from a database or config
const manufacturers = ["Fiberhome", "Huawei", "ZTE", "Nokia", "Ubiquiti"];


export default function OnuTemplatesPage() {
  const { t } = useLocale();
  const { toast } = useToast();
  const [templates, setTemplates] = React.useState<OnuTemplate[]>(placeholderTemplates);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingTemplate, setEditingTemplate] = React.useState<OnuTemplate | null>(null);
  const [templateToDelete, setTemplateToDelete] = React.useState<OnuTemplate | null>(null);

  const iconSize = "h-3 w-3";

  const form = useForm<OnuTemplateFormData>({
    resolver: zodResolver(onuTemplateSchema),
    defaultValues: {
      templateName: '',
      manufacturer: '',
      model: '',
      script: '',
    },
  });

  React.useEffect(() => {
    if (editingTemplate) {
      form.reset(editingTemplate);
      setIsModalOpen(true);
    } else {
      form.reset({ templateName: '', manufacturer: '', model: '', script: '' });
    }
  }, [editingTemplate, form]);

  const handleFormSubmit = (data: OnuTemplateFormData) => {
    if (editingTemplate) {
      // Update existing template
      setTemplates(prev => prev.map(tpl => tpl.id === editingTemplate.id ? { ...tpl, ...data } : tpl));
      toast({
        title: t('onu_templates.update_success_title', 'Template Updated'),
        description: t('onu_templates.update_success_description', 'ONU template "{name}" has been updated.').replace('{name}', data.templateName),
      });
    } else {
      // Add new template
      const newTemplate: OnuTemplate = {
        ...data,
        id: `tpl-${Date.now()}`,
        createdAt: new Date(),
      };
      setTemplates(prev => [newTemplate, ...prev]);
      toast({
        title: t('onu_templates.add_success_title', 'Template Added'),
        description: t('onu_templates.add_success_description', 'ONU template "{name}" has been added.').replace('{name}', data.templateName),
      });
    }
    form.reset();
    setEditingTemplate(null);
    setIsModalOpen(false);
  };

  const handleEdit = (template: OnuTemplate) => {
    setEditingTemplate(template);
  };

  const confirmDelete = () => {
    if (templateToDelete) {
      setTemplates(prev => prev.filter(tpl => tpl.id !== templateToDelete.id));
      toast({
        title: t('onu_templates.delete_success_title', 'Template Deleted'),
        description: t('onu_templates.delete_success_description', 'ONU template "{name}" has been deleted.').replace('{name}', templateToDelete.templateName),
        variant: 'destructive',
      });
      setTemplateToDelete(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold">{t('onu_templates.title', 'ONU Templates')}</h1>
        <div className="flex items-center gap-2">
            <Button variant="default" className="bg-primary hover:bg-primary/90">
                <RefreshCw className={`mr-2 ${iconSize}`} /> {t('onu_templates.refresh_button', 'Refresh')}
            </Button>
             <Dialog open={isModalOpen} onOpenChange={(isOpen) => {
                 setIsModalOpen(isOpen);
                 if (!isOpen) setEditingTemplate(null);
             }}>
                <DialogTrigger asChild>
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                        <PlusCircle className={`mr-2 ${iconSize}`} /> {t('onu_templates.add_template_button', 'Add Template')}
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-sm">{editingTemplate ? t('onu_templates.form_title_edit', 'Edit ONU Template') : t('onu_templates.form_title_add', 'Add New ONU Template')}</DialogTitle>
                        <DialogDescription className="text-xs">{t('onu_templates.form_description', 'Configure provisioning scripts for ONUs.')}</DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="grid gap-4 py-4">
                            <FormField
                                control={form.control}
                                name="templateName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('onu_templates.form_template_name_label', 'Template Name')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t('onu_templates.form_template_name_placeholder', 'e.g., Fiberhome Residential')} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="manufacturer"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('onu_templates.form_manufacturer_label', 'Manufacturer')}</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={t('onu_templates.form_manufacturer_placeholder', 'Select Manufacturer')} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {manufacturers.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="model"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('onu_templates.form_model_label', 'Model')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t('onu_templates.form_model_placeholder', 'e.g., 5506-01-A1')} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="script"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('onu_templates.form_script_label', 'Provisioning Script')}</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder={t('onu_templates.form_script_placeholder', 'Enter provisioning script template here...')} {...field} rows={10} className="font-mono text-xs"/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="outline" disabled={form.formState.isSubmitting}>{t('onu_templates.form_cancel_button', 'Cancel')}</Button>
                                </DialogClose>
                                <Button type="submit" disabled={form.formState.isSubmitting}>
                                    {form.formState.isSubmitting && <Loader2 className={`mr-2 ${iconSize} animate-spin`} />}
                                    {form.formState.isSubmitting ? t('onu_templates.form_saving_button', 'Saving...') : (editingTemplate ? t('onu_templates.form_update_button', 'Update Template') : t('onu_templates.form_save_button', 'Save Template'))}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">{t('onu_templates.table_header_name', 'Template Name')}</TableHead>
                  <TableHead className="text-xs">{t('onu_templates.table_header_manufacturer', 'Manufacturer')}</TableHead>
                  <TableHead className="text-xs">{t('onu_templates.table_header_model', 'Model')}</TableHead>
                  <TableHead className="text-right w-28 text-xs">{t('onu_templates.table_header_actions', 'Actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.length > 0 ? (
                  templates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium text-xs">{template.templateName}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">{template.manufacturer}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">{template.model}</TableCell>
                      <TableCell className="text-right">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(template)}>
                                <Edit className={iconSize} />
                                <span className="sr-only">{t('entry_categories.action_edit', 'Edit')}</span>
                            </Button>
                             <AlertDialog>
                               <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10">
                                    <Trash2 className={iconSize} />
                                    <span className="sr-only">{t('entry_categories.action_delete', 'Delete')}</span>
                                </Button>
                               </AlertDialogTrigger>
                               <AlertDialogContent>
                                 <AlertDialogHeader>
                                   <AlertDialogTitle>{t('onu_templates.confirm_delete_title', 'Are you sure?')}</AlertDialogTitle>
                                   <AlertDialogDescription className="text-xs">
                                     {t('onu_templates.confirm_delete_description', 'This action cannot be undone. This will permanently delete the template "{name}".').replace('{name}', template.templateName)}
                                   </AlertDialogDescription>
                                 </AlertDialogHeader>
                                 <AlertDialogFooter>
                                   <AlertDialogCancel onClick={() => setTemplateToDelete(null)}>{t('onu_templates.form_cancel_button', 'Cancel')}</AlertDialogCancel>
                                   <AlertDialogAction
                                     className={buttonVariants({ variant: "destructive" })}
                                     onClick={() => {
                                       setTemplateToDelete(template);
                                       confirmDelete();
                                     }}
                                   >
                                     {t('entry_categories.delete_confirm_delete', 'Delete')}
                                   </AlertDialogAction>
                                 </AlertDialogFooter>
                               </AlertDialogContent>
                             </AlertDialog>
                        </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8 text-xs">
                      {t('onu_templates.no_templates_found', 'No ONU templates found. Click "Add Template" to create one.')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

