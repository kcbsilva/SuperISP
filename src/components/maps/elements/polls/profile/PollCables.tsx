// src/components/maps/elements/polls/profile/PollCables.tsx
'use client';

import * as React from 'react';
import { HydroPoll } from '../types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin } from 'lucide-react';

interface Props {
  cables?: HydroPoll['cablesPassed'];
}

export function PollCables({ cables }: Props) {
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!cables) setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [cables]);

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader className="sticky top-0 bg-background z-10">
          <TableRow>
            <TableHead className="w-1/4">ID</TableHead>
            <TableHead className="w-1/2">Tags</TableHead>
            <TableHead className="w-1/4 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading || !cables ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <TableRow key={idx}>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-8 w-16" /></TableCell>
              </TableRow>
            ))
          ) : (
            cables.map((cable) => (
              <TableRow key={cable.id}>
                <TableCell>{cable.id}</TableCell>
                <TableCell>{cable.name} ({cable.fiberCount || '-'})</TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="secondary">
                    <MapPin className="w-4 h-4 mr-1" /> See in Map
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
