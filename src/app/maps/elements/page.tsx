// src/app/maps/elements/page.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Power,
  Box,
  Warehouse,
  Puzzle,
  TowerControl,
  Cable,
  ListFilter,
  PlusCircle
} from 'lucide-react';
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

interface MapElementItem {
  id: string;
  name: string;
  type: 'Poll' | 'FDH' | 'FOSC' | 'PED' | 'Accessory' | 'Tower' | 'Cable';
  location?: string; // e.g., coordinates or address
  status: 'Operational' | 'Planned' | 'Maintenance' | 'Faulty';
  lastInspected?: Date;
}

const placeholderElements: MapElementItem[] = [
  { id: 'poll-001', name: 'HP-MainSt-01', type: 'Poll', location: 'Main St / 1st Ave', status: 'Operational', lastInspected: new Date('2024-07-15') },
  { id: 'fdh-001', name: 'FDH-SectorA-01', type: 'FDH', location: 'Sector A, Block 2', status: 'Operational', lastInspected: new Date('2024-06-20') },
  { id: 'fosc-001', name: 'FOSC-Junction-X', type: 'FOSC', location: 'Fiber Junction X', status: 'Maintenance' },
  { id: 'tower-001', name: 'North Repeater', type: 'Tower', location: 'Hilltop North', status: 'Operational', lastInspected: new Date('2024-05-01') },
  { id: 'cable-001', name: 'Backbone-Fiber-01', type: 'Cable', location: 'Route 5 to Central Office', status: 'Operational' },
  { id: 'ped-001', name: 'PED-Residential-005', type: 'PED', location: 'Oak Street Entrance', status: 'Planned' },
  { id: 'acc-001', name: 'Amplifier-03', type: 'Accessory', location: 'FDH-SectorA-01', status: 'Faulty' },
];


const elementTypeIcons = {
  Poll: Power,
  FDH: Box,
  FOSC: Warehouse,
  PED: Box, // Using Box icon for PEDs as well for now
  Accessory: Puzzle,
  Tower: TowerControl,
  Cable: Cable,
};

export default function MapElementsPage() {
  const { t } = useLocale();
  const iconSize = "h-3 w-3";

  const [filterType, setFilterType] = React.useState<'All' | MapElementItem['type']>('All');

  const filteredElements = React.useMemo(() => {
    if (filterType === 'All') {
      return placeholderElements;
    }
    return placeholderElements.filter(el => el.type === filterType);
  }, [filterType]);

  const getStatusBadgeVariant = (status: MapElementItem['status']) => {
    switch (status) {
      case 'Operational':
        return 'bg-green-100 text-green-800';
      case 'Planned':
        return 'bg-blue-100 text-blue-800';
      case 'Maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'Faulty':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };


  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold">{t('sidebar.maps_elements', 'Map Elements')}</h1>
        <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
                <ListFilter className={`mr-2 ${iconSize}`} /> {t('maps_elements.filter_button', 'Filter by Type')}
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white" size="sm">
                <PlusCircle className={`mr-2 ${iconSize}`} /> {t('maps_elements.add_element_button', 'Add Element')}
            </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-sm">{t('maps_elements.list_title', 'All Network Elements')}</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredElements.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10 text-xs">{t('maps_elements.table_header_type', 'Type')}</TableHead>
                    <TableHead className="text-xs">{t('maps_elements.table_header_name', 'Name / ID')}</TableHead>
                    <TableHead className="text-xs">{t('maps_elements.table_header_location', 'Location / Route')}</TableHead>
                    <TableHead className="text-xs">{t('maps_elements.table_header_status', 'Status')}</TableHead>
                    <TableHead className="text-xs">{t('maps_elements.table_header_last_inspected', 'Last Inspected')}</TableHead>
                    <TableHead className="text-right w-20 text-xs">{t('maps_elements.table_header_actions', 'Actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredElements.map((element) => {
                    const ElementIcon = elementTypeIcons[element.type] || ListFilter;
                    return (
                    <TableRow key={element.id}>
                      <TableCell className="text-xs">
                        <ElementIcon className={`inline-block mr-2 ${iconSize} text-muted-foreground`} title={element.type} />
                        {/* {t(`maps_elements.type_${element.type.toLowerCase()}` as any, element.type)} */}
                      </TableCell>
                      <TableCell className="font-medium text-xs">{element.name}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">{element.location || '-'}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-xs ${getStatusBadgeVariant(element.status)}`}>
                          {t(`maps_elements.status_${element.status.toLowerCase()}` as any, element.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {element.lastInspected ? new Date(element.lastInspected).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <ListFilter className={iconSize} />
                          <span className="sr-only">{t('maps_elements.action_details', 'View Details')}</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  )})}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8 text-xs">
              {t('maps_elements.no_elements_found', 'No map elements found for the selected filter.')}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
