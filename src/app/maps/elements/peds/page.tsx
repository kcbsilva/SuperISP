// src/app/maps/elements/peds/page.tsx
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Box, FileText as FileTextIcon, Edit, Trash2 } from 'lucide-react';
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

export default function PedsPage() {
  const { t } = useLocale();
  const { toast } = useToast();
  const iconSize = "h-3 w-3";

  const handleOpenTemplatesModal = () => {
    toast({
      title: t('maps_elements.template_modal_not_implemented_title', 'Template Management (Not Implemented)'),
      description: t('maps_elements.ped_template_modal_not_implemented_desc', 'Managing templates for PEDs is not yet available.'),
    });
  };

  const getEnergizedBadgeVariant = (isEnergized: boolean) => {
    return isEnergized ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800';
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold flex items-center gap-2">
            <Box className={`${iconSize} text-primary`} />
            {t('sidebar.maps_elements_peds', 'PEDs')}
        </h1>
        <Button size="sm" variant="outline" onClick={handleOpenTemplatesModal}>
            <FileTextIcon className={`mr-2 ${iconSize}`} /> {t('maps_elements.ped_template_button', 'PED Templates')}
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-sm">{t('maps_elements.list_title_peds', 'PED List')}</CardTitle>
        </CardHeader>
        <CardContent>
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
