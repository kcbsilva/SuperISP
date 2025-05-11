// src/app/maps/elements/polls/page.tsx
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card"; // Removed CardTitle
import { Button } from '@/components/ui/button';
import { Power, PlusCircle, Edit, Trash2 } from 'lucide-react';
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

// Placeholder data - replace with actual data fetching
const placeholderPolls: HydroPoll[] = [
  { id: 'poll-001', description: 'Main Street - Corner Oak', height: '12m', type: 'Circular', address: '123 Main St, Anytown', gpsCoordinates: '40.7128° N, 74.0060° W', transformer: 'Yes', project: 'Downtown Expansion' },
  { id: 'poll-002', description: 'Park Entrance', height: '10m', type: 'Square', address: '456 Park Ave, Anytown', gpsCoordinates: '40.7135° N, 74.0055° W', transformer: 'No', project: 'City Beautification' },
];


export default function HydroPollsPage() {
  const { t } = useLocale();
  const iconSize = "h-3 w-3";

  const handleAddPoll = () => {
    console.log('Add new hydro poll clicked');
    // Implement dialog or navigation to add form
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold flex items-center gap-2">
            <Power className={`${iconSize} text-primary`} />
            {t('sidebar.maps_elements_polls', 'Hydro Polls')}
        </h1>
        <Button onClick={handleAddPoll} className="bg-green-600 hover:bg-green-700 text-white" size="sm">
            <PlusCircle className={`mr-2 ${iconSize}`} /> {t('maps_elements.add_element_button', 'Add Poll')}
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6"> {/* Adjusted padding since CardHeader/Title removed */}
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
              {t('maps_elements.no_polls_found', 'No hydro polls found. Click "Add Poll" to create one.')}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

