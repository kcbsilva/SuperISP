// src/app/maps/elements/peds/page.tsx
'use client';

import * as React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
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

const placeholderPeds: Ped[] = [];

const pedTemplateSchema = z.object({
  manufacturer: z.string().min(1, "Manufacturer is required."),
  model: z.string().min(1, "Model is required."),
  maxCapacity: z.coerce.number().int().positive("Max capacity must be a positive number (e.g., equipment slots)."),
  pedType: z.enum(['Column', 'Cabinet'], { required_error: "PED type is required." }),
});
type PedTemplateFormData = z.infer<typeof pedTemplateSchema>;

interface PedTemplate extends PedTemplateFormData {
  id: string;
}

const placeholderPedManufacturers: string[] = [];

const placeholderExistingPedTemplates: PedTemplate[] = [];

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
    const newTemplate: PedTemplate = { ...data, id: `tpl-ped-${Date.now()}` };
    placeholderExistingPedTemplates.push(newTemplate);
    toast({
      title: t('maps_elements.ped_template_add_success_title', 'PED Template Added'),
      description: t('maps_elements.ped_template_add_success_desc', 'Template for {model} by {manufacturer} added.')
        .replace('{model}', data.model)
        .replace('{manufacturer}', data.manufacturer),
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
            {/* Form and template list rendering goes here (same as in original) */}
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
                    <TableHead className="text-xs text-center">ID</TableHead>
                    <TableHead className="text-xs text-center">{t('maps_elements.ped_table_header_description', 'Description')}</TableHead>
                    <TableHead className="text-xs text-center">{t('maps_elements.ped_table_header_ped_type', 'PED Type')}</TableHead>
                    <TableHead className="text-xs text-center">{t('maps_elements.ped_table_header_energized', 'Energized?')}</TableHead>
                    <TableHead className="text-xs text-center">{t('maps_elements.ped_table_header_manufacturer', 'Manufacturer')}</TableHead>
                    <TableHead className="text-xs text-center">{t('maps_elements.ped_table_header_gps', 'GPS')}</TableHead>
                    <TableHead className="text-xs text-center">{t('maps_elements.ped_table_header_address', 'Address (Optional)')}</TableHead>
                    <TableHead className="text-xs text-center">{t('maps_elements.project_table_header_actions', 'Actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {placeholderPeds.map((ped) => (
                    <TableRow key={ped.id}>
                      <TableCell className="font-mono text-muted-foreground text-xs text-center">{ped.id}</TableCell>
                      <TableCell className="text-xs text-center">{ped.description}</TableCell>
                      <TableCell className="text-xs text-center">{t(`maps_elements.ped_type_${ped.pedType.toLowerCase()}` as any, ped.pedType)}</TableCell>
                      <TableCell className="text-xs text-center">
                        <Badge variant="outline" className={`text-xs ${getEnergizedBadgeVariant(ped.isEnergized)} border-transparent`}>
                          {ped.isEnergized ? t('maps_elements.yes_indicator', 'Yes') : t('maps_elements.no_indicator', 'No')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-center">{ped.manufacturer}</TableCell>
                      <TableCell className="text-xs text-center">{ped.gpsCoordinates}</TableCell>
                      <TableCell className="text-xs text-center">{ped.address || '-'}</TableCell>
                      <TableCell className="text-center"> {/* Ensure buttons are centered if the cell is centered */}
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
              {t('maps_elements.no_peds_found', 'No PEDs found.')}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}