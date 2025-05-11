// src/app/maps/elements/fdhs/page.tsx
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card"; // Removed CardTitle
import { Button } from '@/components/ui/button';
import { Box, PlusCircle, Edit, Trash2 } from 'lucide-react';
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

// Placeholder data - replace with actual data fetching
const placeholderFdhs: Fdh[] = [
  { id: 'fdh-001', gpsCoordinates: '40.7128° N, 74.0060° W', type: 'Aerial', ports: 16, project: 'Downtown Expansion', pon: '1/1/1', status: 'Active', brand: 'Corning' },
  { id: 'fdh-002', gpsCoordinates: '34.0522° N, 118.2437° W', type: 'Underground', ports: 32, project: 'Suburb Rollout', pon: '1/1/2', status: 'Active', brand: 'CommScope' },
  { id: 'fdh-003', gpsCoordinates: '41.8781° N, 87.6298° W', type: 'Aerial', ports: 8, project: 'Industrial Park', pon: '1/2/1', status: 'Inactive', brand: 'Prysmian' },
];


export default function FdhsPage() {
  const { t } = useLocale();
  const iconSize = "h-3 w-3";

  // Removed handleAddFdh as the button is removed

  const getStatusBadgeVariant = (status: Fdh['status']) => {
    return status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold flex items-center gap-2">
            <Box className={`${iconSize} text-primary`} />
            {t('sidebar.maps_elements_fdhs', 'FDHs')}
        </h1>
        {/* "Add FDH" button removed */}
      </div>

      <Card>
        {/* CardHeader and CardTitle removed to eliminate "FDH List" */}
        <CardContent className="pt-6"> {/* Added pt-6 to CardContent since CardHeader is removed */}
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
              {t('maps_elements.no_fdhs_found', 'No FDHs found. Click "Add FDH" to create one.')}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
