// src/components/settings/system/pop/PoPList.tsx
'use client';

import * as React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import type { Pop } from '@/types/pops';

interface PoPListProps {
  pops: Pop[];
  onEdit: (pop: Pop) => void;
  onDelete: (pop: Pop) => void;
}

export default function PoPList({ pops, onEdit, onDelete }: PoPListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Points of Presence</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Ownership</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pops.map((pop) => (
              <TableRow key={pop.id}>
                <TableCell>{pop.name}</TableCell>
                <TableCell>{pop.type}</TableCell>
                <TableCell>{pop.ownership}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button size="icon" variant="ghost" onClick={() => onEdit(pop)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => onDelete(pop)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
