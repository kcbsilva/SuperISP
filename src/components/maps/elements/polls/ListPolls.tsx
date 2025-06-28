// src/components/maps/elements/polls/ListPolls.tsx
'use client';

import * as React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin as MapPinIcon } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';

type PollType = 'Circular' | 'Square';

export interface HydroPoll {
  id: string;
  description: string;
  height: string;
  type: PollType;
  address: string;
  gpsCoordinates: string;
  transformer: 'Yes' | 'No';
}

interface Props {
  polls: HydroPoll[];
  searchQuery: string;
  typeFilter: 'all' | PollType;
  sortField: 'id' | 'height' | 'type';
  sortDirection: 'asc' | 'desc';
  currentPage: number;
  itemsPerPage: number;
  onPollClick: (poll: HydroPoll) => void;
  onSeeInMap: (id: string) => void;
  onSort: (field: 'id' | 'height' | 'type') => void;
  onSearchChange: (value: string) => void;
  onTypeFilterChange: (value: 'all' | PollType) => void;
  onPageChange: (page: number) => void;
}

export function ListPolls({
  polls,
  searchQuery,
  typeFilter,
  sortField,
  sortDirection,
  currentPage,
  itemsPerPage,
  onPollClick,
  onSeeInMap,
  onSort,
  onSearchChange,
  onTypeFilterChange,
  onPageChange
}: Props) {
  const { t } = useLocale();

  const pollTypes: PollType[] = ['Circular', 'Square'];

  const filtered = polls.filter((p) => {
    const matchesQuery = p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || p.type === typeFilter;
    return matchesQuery && matchesType;
  });

  const sorted = [...filtered].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    return (aValue < bValue ? -1 : 1) * (sortDirection === 'asc' ? 1 : -1);
  });

  const paginated = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <>
      <div className="flex items-center justify-between flex-wrap gap-2 pb-4">
        <Input
          placeholder={t('maps_elements.poll_search_placeholder', 'Search polls')}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-8 text-xs w-full sm:w-[300px]"
        />
        <Select value={typeFilter} onValueChange={(v) => onTypeFilterChange(v as 'all' | PollType)}>
          <SelectTrigger className="h-8 w-[120px] text-xs">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {pollTypes.map(pt => <SelectItem key={pt} value={pt}>{pt}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader className="sticky top-0 bg-background z-10">
          <TableRow>
            <TableHead onClick={() => onSort('id')} className="text-xs text-center cursor-pointer">ID {sortField === 'id' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}</TableHead>
            <TableHead className="text-xs text-center">Description</TableHead>
            <TableHead onClick={() => onSort('height')} className="text-xs text-center cursor-pointer">Height {sortField === 'height' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}</TableHead>
            <TableHead onClick={() => onSort('type')} className="text-xs text-center cursor-pointer">Type {sortField === 'type' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}</TableHead>
            <TableHead className="text-xs text-center">Address</TableHead>
            <TableHead className="text-xs text-center">GPS</TableHead>
            <TableHead className="text-xs text-center">Transformer</TableHead>
            <TableHead className="text-xs text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.length > 0 ? (
            paginated.map(poll => (
              <TableRow key={poll.id} className="hover:bg-muted/40 cursor-pointer">
                <TableCell className="text-xs text-center">
                  <Button variant="link" size="sm" className="p-0 h-auto text-xs" onClick={() => onPollClick(poll)}>
                    {poll.id}
                  </Button>
                </TableCell>
                <TableCell className="text-xs text-center">{poll.description}</TableCell>
                <TableCell className="text-xs text-center">{poll.height}</TableCell>
                <TableCell className="text-xs text-center">{poll.type}</TableCell>
                <TableCell className="text-xs text-center">{poll.address}</TableCell>
                <TableCell className="text-xs text-center">{poll.gpsCoordinates}</TableCell>
                <TableCell className="text-xs text-center">
                  <Badge variant="outline" className="text-xs">
                    {poll.transformer === 'Yes' ? '🔌 Yes' : '❌ No'}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-center">
                  <Button size="sm" variant="secondary" onClick={() => onSeeInMap(poll.id)}>
                    <MapPinIcon className="w-3 h-3 mr-1" /> Map
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-xs italic py-4">
                {t('maps_elements.no_results_found', 'No polls found for the current filters.')}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center gap-2 pt-4">
        <span className="text-xs">Page {currentPage}</span>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => onPageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>Prev</Button>
          <Button size="sm" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage * itemsPerPage >= sorted.length}>Next</Button>
        </div>
      </div>
    </>
  );
}
