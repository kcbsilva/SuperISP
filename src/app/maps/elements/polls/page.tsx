// src/app/maps/elements/polls/page.tsx
'use client';

import * as React from 'react';
import { Card, CardContent } from "@/components/ui/card"; // Removed CardHeader
import { Button, buttonVariants } from '@/components/ui/button';
import { Power, Edit, Trash2, FileText as FileTextIcon, Loader2, FilePlus2, List } from 'lucide-react';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle as AlertDialogTitleComponent, // Renamed to avoid conflict
} from "@/components/ui/alert-dialog";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ScrollArea } from '@/components/ui/scroll-area';

interface HydroPoll {
  id: string;
  description: string;
  height: string;
  type: 'Circular' | 'Square';
  address: string;
  gpsCoordinates: string;
  transformer: 'Yes' | 'No';
  project?: string;
}

const placeholderPolls: HydroPoll[] = [
  { id: 'poll-001', description: 'Main Street - Corner Oak', height: '12m', type: 'Circular', address: '123 Main St, Anytown', gpsCoordinates: '40.7128° N, 74.0060° W', transformer: 'Yes', project: 'Downtown Expansion' },
  { id: 'poll-002', description: 'Park Entrance', height: '10m', type: 'Square', address: '456 Park Ave, Anytown', gpsCoordinates: '40.7135° N, 74.0055° W', transformer: 'No', project: 'City Beautification' },
];

const pollTemplateSchema = z.object({
  manufacturer: z.string().min(1, "Manufacturer is required."),
  material: z.string().min(1, "Material is required."), // e.g., Concrete, Wood, Steel
  heightOptions: z.string().min(1, "Height options are required (e.g., 9m, 10m, 12m)."),
  strengthClass: z.string().min(1, "Strength class is required (e.g., Class 5, 300daN)."),
});
type PollTemplateFormData = z.infer<typeof pollTemplateSchema>;

interface PollTemplate extends PollTemplateFormData {
  id: string;
}

const placeholderPollManufacturers = ["Manufacturer A", "Manufacturer B", "Manufacturer C"];
const placeholderPollMaterials = ["Concrete", "Wood", "Steel", "Composite"];

const placeholderExistingPollTemplates: PollTemplate[] = [
  { id: 'tpl-poll-1', manufacturer: 'Manufacturer A', material: 'Concrete', heightOptions: '9m, 10.5m, 12m', strengthClass: '300daN' },
  { id: 'tpl-poll-2', manufacturer: 'Manufacturer B', material: 'Wood', heightOptions: '10m, 11m', strengthClass: 'Class 5' },
];


export default function HydroPollsPage() {
  const { t } = useLocale();
  const { toast } = useToast();
  const iconSize = "h-3 w-3";
  const [isAddTemplateModalOpen, setIsAddTemplateModalOpen] = React.useState(false);

  const templateForm = useForm<PollTemplateFormData>({
    resolver: zodResolver(pollTemplateSchema),
    defaultValues: {
      manufacturer: '',
      material: '',
      heightOptions: '',
      strengthClass: '',
    },
  });

  const handleAddTemplateSubmit = (data: PollTemplateFormData) => {
    console.log("New Poll Template Data:", data);
    const newTemplate: PollTemplate = { ...data, id: `tpl-poll-${Date.now()}`};
    placeholderExistingPollTemplates.push(newTemplate);
    toast({
      title: t('maps_elements.poll_template_add_success_title', 'Poll Template Added'),
      description: t('maps_elements.poll_template_add_success_desc', 'Template by {manufacturer} for {material} polls added.').replace('{manufacturer}', data.manufacturer).replace('{material}', data.material),
    });
    templateForm.reset();
    setIsAddTemplateModalOpen(false);
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
                                                <FormLabel>{t('maps_elements.poll_template_form_manufacturer_label', 'Manufacturer')}</FormLabel>
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
                                    name="heightOptions"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('maps_elements.poll_template_form_heights_label', 'Height Options (comma-separated)')}</FormLabel>
                                            <FormControl>
                                                <Input placeholder={t('maps_elements.poll_template_form_heights_placeholder', 'e.g., 9m, 10.5m, 12m')} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={templateForm.control}
                                    name="strengthClass"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('maps_elements.poll_template_form_strength_label', 'Strength Class')}</FormLabel>
                                            <FormControl>
                                                <Input placeholder={t('maps_elements.poll_template_form_strength_placeholder', 'e.g., Class 5, 300daN')} {...field} />
                                            </FormControl>
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
                                    <div className="font-medium">{template.manufacturer} - {template.material}</div>
                                    <div className="text-muted-foreground">
                                    {t('maps_elements.poll_template_info_heights')}: {template.heightOptions}, {t('maps_elements.poll_template_info_strength')}: {template.strengthClass}
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
                    <TableHead className="text-xs">ID</TableHead>
                    <TableHead className="text-xs">Description</TableHead>
                    <TableHead className="text-xs">{t('maps_elements.table_header_project', 'Project')}</TableHead>
                    <TableHead className="text-xs">Height</TableHead>
                    <TableHead className="text-xs">Type</TableHead>
                    <TableHead className="text-xs">Address</TableHead>
                    <TableHead className="text-xs">GPS Coordinates</TableHead>
                    <TableHead className="text-xs">Transformer</TableHead>
                    <TableHead className="text-xs text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {placeholderPolls.map((poll) => (
                    <TableRow key={poll.id}>
                      <TableCell className="font-mono text-muted-foreground text-xs">{poll.id}</TableCell>
                      <TableCell className="text-xs">{poll.description}</TableCell>
                      <TableCell className="text-xs">{poll.project || '-'}</TableCell>
                      <TableCell className="text-xs">{poll.height}</TableCell>
                      <TableCell className="text-xs">{poll.type}</TableCell>
                      <TableCell className="text-xs">{poll.address}</TableCell>
                      <TableCell className="text-xs">{poll.gpsCoordinates}</TableCell>
                      <TableCell className="text-xs">
                        <Badge variant={poll.transformer === 'Yes' ? 'destructive' : 'default'} className={`text-xs ${poll.transformer === 'Yes' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                          {poll.transformer}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Edit className={iconSize} />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive">
                          <Trash2 className={iconSize} />
                          <span className="sr-only">Delete</span>
                        </Button>
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
    </div>
  );
}

