// src/components/maps/elements/polls/PollHistory.tsx
'use client';

import * as React from 'react';
import { HydroPoll } from '../types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
  history?: HydroPoll['history'];
}

export function PollHistory({ history }: Props) {
  const isLoading = !history; // Replace with real loading state if applicable

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader className="sticky top-0 bg-background z-10">
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-full max-w-[150px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-full max-w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-full max-w-[80px]" /></TableCell>
                </TableRow>
              ))
            : history?.map(entry => (
                <TableRow key={entry.id}>
                  <TableCell>{entry.description}</TableCell>
                  <TableCell>{entry.user}</TableCell>
                  <TableCell>{entry.date}</TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
}
