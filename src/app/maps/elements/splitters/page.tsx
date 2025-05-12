// src/app/maps/elements/splitters/page.tsx
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Split, Edit, Trash2, FileText as FileTextIcon } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { useToast } from '@/hooks/use-toast';

type ConnectorType = 'UPC' | 'APC';
type DistributionType = 'Network' | 'PON';
type SplitterCategory = '1x2' | '1x4' | '1x8' | '1x16' | '1x32';
type SplitterRatio = '50/50' | '60/40' | '75/25' | '70/30' | '80/20' | '85/15' | '90/10' | '95/5';

interface Splitter {
  id: string;
  description: string;
  enclosureId: string; // ID of FOSC or FDH
  connectorized: boolean;
  connectorType?: ConnectorType;
  distributionType: DistributionType;
  category: SplitterCategory;
  ratio?: SplitterRatio;
}

const placeholderSplitters: Splitter[] = [
  { id: 'splt-001', description: 'Main Splitter - FDH-001', enclosureId: 'fdh-001', connectorized: true, connectorType: 'APC', distributionType: 'PON', category: '1x8' },
  { id: 'splt-002', description: 'Secondary Splitter - FOSC-002', enclosureId: 'fosc-002', connectorized: true, connectorType: 'UPC', distributionType: 'Network', category: '1x2', ratio: '50/50' },
  { id: 'splt-003', description: 'Tap Splitter - FDH-003', enclosureId: 'fdh-003', connectorized: false, distributionType: 'PON', category: '1x4' },
  { id: 'splt-004', description: 'Distribution Splitter - FOSC-001', enclosureId: 'fosc-001', connectorized: true, connectorType: 'APC', distributionType: 'PON', category: '1x16' },
];

export default function SplittersPage() {
  const { t } = useLocale();
  const { toast } = useToast();
  const iconSize = "h-3 w-3";

  const handleOpenTemplatesModal = () => {
    toast({
      title: t('maps_elements.template_modal_not_implemented_title', 'Template Management (Not Implemented)'),
      description: t('maps_elements.splitter_template_modal_not_implemented_desc', 'Managing templates for Splitters is not yet available.'),
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold flex items-center gap-2">
            <Split className={`${iconSize} text-primary`} />
            {t('sidebar.maps_elements_splitters', 'Splitters')}
        </h1>
        <Button size="sm" variant="outline" onClick={handleOpenTemplatesModal}>
            <FileTextIcon className={`mr-2 ${iconSize}`} /> {t('maps_elements.splitter_template_button', 'Splitter Templates')}
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-sm">{t('maps_elements.list_title_splitters', 'Splitter List')}</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {placeholderSplitters.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">ID</TableHead>
                    <TableHead className="text-xs">{t('maps_elements.splitter_table_header_description', 'Description')}</TableHead>
                    <TableHead className="text-xs">{t('maps_elements.splitter_table_header_enclosure', 'Enclosure (FOSC/FDH ID)')}</TableHead>
                    <TableHead className="text-xs">{t('maps_elements.splitter_table_header_connectorized', 'Connectorized')}</TableHead>
                    <TableHead className="text-xs">{t('maps_elements.splitter_table_header_connector_type', 'Connector Type')}</TableHead>
                    <TableHead className="text-xs">{t('maps_elements.splitter_table_header_distribution_type', 'Distribution Type')}</TableHead>
                    <TableHead className="text-xs">{t('maps_elements.splitter_table_header_category', 'Category')}</TableHead>
                    <TableHead className="text-xs">{t('maps_elements.splitter_table_header_ratio', 'Ratio (if 1x2)')}</TableHead>
                    <TableHead className="text-xs text-right">{t('maps_elements.project_table_header_actions', 'Actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {placeholderSplitters.map((splitter) => (
                    <TableRow key={splitter.id}>
                      <TableCell className="font-mono text-muted-foreground text-xs">{splitter.id}</TableCell>
                      <TableCell className="text-xs">{splitter.description}</TableCell>
                      <TableCell className="font-mono text-muted-foreground text-xs">{splitter.enclosureId}</TableCell>
                      <TableCell className="text-xs">
                        <Badge variant={splitter.connectorized ? 'default' : 'secondary'} className={`text-xs ${splitter.connectorized ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {splitter.connectorized ? t('maps_elements.yes_indicator', 'Yes') : t('maps_elements.no_indicator', 'No')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">{splitter.connectorized ? splitter.connectorType : '-'}</TableCell>
                      <TableCell className="text-xs">{splitter.distributionType}</TableCell>
                      <TableCell className="text-xs">{splitter.category}</TableCell>
                      <TableCell className="text-xs">{splitter.category === '1x2' ? splitter.ratio : '-'}</TableCell>
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
