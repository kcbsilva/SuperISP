// src/app/maps/elements/foscs/page.tsx
'use client';

import * as React from 'react';
import { Card, CardContent } from "@/components/ui/card"; // Removed CardHeader, CardTitle
// import { Button } from '@/components/ui/button'; // Button removed
import { Warehouse, Edit, Trash2 } from 'lucide-react'; // PlusCircle removed
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
import { Button } from '@/components/ui/button'; // Re-added Button for actions

interface Fosc {
  id: string;
  gpsCoordinates: string;
  type: 'Aerial' | 'Underground';
  trays: string; // e.g., "4/8"
  project?: string;
  cable?: string; // Cable ID or name
  status: 'Active' | 'Inactive' | 'Planned';
  brand: string;
}

// Placeholder data - replace with actual data fetching
const placeholderFoscs: Fosc[] = [
  { id: 'fosc-001', gpsCoordinates: '39.9526° N, 75.1652° W', type: 'Aerial', trays: '6/12', project: 'Center City Fiber', cable: 'CB-001-Main', status: 'Active', brand: 'TE Connectivity' },
  { id: 'fosc-002', gpsCoordinates: '34.0522° N, 118.2437° W', type: 'Underground', trays: '10/24', project: 'LA Downtown Grid', cable: 'CB-002-West', status: 'Active', brand: 'Furukawa' },
  { id: 'fosc-003', gpsCoordinates: '40.7128° N, 74.0060° W', type: 'Aerial', trays: '2/4', project: 'NYC Soho Link', cable: 'CB-003-East', status: 'Planned', brand: 'Corning' },
];

export default function FoscsPage() {
  const { t } = useLocale();
  const iconSize = "h-3 w-3";

  const getStatusBadgeVariant = (status: Fosc['status']) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-red-100 text-red-800';
      case 'Planned': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold flex items-center gap-2">
            <Warehouse className={`${iconSize} text-primary`} />
            {t('sidebar.maps_elements_foscs', 'FOSCs')}
        </h1>
        {/* "Add FOSC" button removed */}
      </div>

      <Card>
        {/* CardHeader and CardTitle removed */}
        <CardContent className="pt-6"> {/* Added pt-6 since CardHeader is removed */}
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
                    <TableHead className="text-xs">{t('maps_elements.fosc_table_header_cable', 'Cable')}</TableHead>
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
                      <TableCell className="text-xs">{fosc.cable || '-'}</TableCell>
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
