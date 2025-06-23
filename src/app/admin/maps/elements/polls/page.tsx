// src/app/maps/elements/polls/page.tsx
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Power, MapPin as MapPinIcon } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@/components/ui/select';
import { PollModal } from '@/components/maps/elements/polls/PollModal';
import dynamic from 'next/dynamic';

const PollTemplateDialog = dynamic(() => import('@/components/maps/elements/polls/PollTemplateDialog'), { ssr: false });

const pollTypes = ['Circular', 'Square'] as const;
type PollType = (typeof pollTypes)[number];

interface HydroPoll {
  id: string;
  description: string;
  height: string;
  type: PollType;
  address: string;
  gpsCoordinates: string;
  transformer: 'Yes' | 'No';
  project?: string;
  cablesPassed?: { id: string; name: string; fiberCount?: number }[];
  attachedFoscs?: string[];
  attachedFdhs?: string[];
  history?: { id: string; date: string; user: string; description: string; details?: string }[];
}

interface PollTemplate {
  id: string;
  manufacturer?: string;
  material: string;
  height: string;
  type: PollType;
}

const simulatedPolls: HydroPoll[] = [
  {
    id: 'poll-001',
    description: 'Main street pole near transformer station',
    height: '12m',
    type: 'Circular',
    address: '123 Main St, Springfield',
    gpsCoordinates: '-3.745, -38.523',
    transformer: 'Yes',
    project: 'Fiber Expansion Q1',
    cablesPassed: [{ id: 'cable-1', name: 'Backbone Fiber A', fiberCount: 24 }],
    attachedFoscs: ['FOSC-001'],
    attachedFdhs: ['FDH-001'],
    history: [
      { id: 'hist-1', date: '2025-06-01', user: 'admin', description: 'Installed' },
    ]
  }
];

export default function HydroPollsPage() {
  const { t } = useLocale();
  const router = useRouter();
  const [selectedPoll, setSelectedPoll] = React.useState<HydroPoll | null>(null);
  const [isPollModalOpen, setIsPollModalOpen] = React.useState(false);
  const [pollTemplates, setPollTemplates] = React.useState<PollTemplate[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState<'all' | PollType>('all');
  const [sortField, setSortField] = React.useState<'id' | 'height' | 'type'>('id');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  const filteredPolls = simulatedPolls.filter((p) => {
    const matchesQuery = p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || p.type === typeFilter;
    return matchesQuery && matchesType;
  });

  const sortedPolls = [...filteredPolls].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    return (aValue < bValue ? -1 : 1) * (sortDirection === 'asc' ? 1 : -1);
  });

  const paginatedPolls = sortedPolls.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePollIdClick = (poll: HydroPoll) => {
    setSelectedPoll(poll);
    setIsPollModalOpen(true);
  };

  const handleSeeInMap = (pollId: string) => {
    router.push(`/admin/maps/view?highlight=${pollId}`);
  };

  const toggleSort = (field: 'id' | 'height' | 'type') => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold flex items-center gap-2">
          <Power className="h-4 w-4 text-primary" />
          {t('sidebar.maps_elements_polls', 'Hydro Polls')}
        </h1>
        <PollTemplateDialog
          templates={pollTemplates}
          onAdd={(tpl) => setPollTemplates(prev => [...prev, tpl])}
          manufacturers={['PoleMaster Inc.', 'Structura']}
          materials={['Concrete', 'Wood', 'Steel']}
        />
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 pb-4">
            <Input
              placeholder={t('maps_elements.poll_search_placeholder', 'Search polls')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 text-xs"
            />
            <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as 'all' | PollType)}>
              <SelectTrigger className="h-8 w-[100px] text-xs">
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
                <TableHead onClick={() => toggleSort('id')} className="text-xs text-center cursor-pointer">ID</TableHead>
                <TableHead className="text-xs text-center">Description</TableHead>
                <TableHead onClick={() => toggleSort('height')} className="text-xs text-center cursor-pointer">Height</TableHead>
                <TableHead onClick={() => toggleSort('type')} className="text-xs text-center cursor-pointer">Type</TableHead>
                <TableHead className="text-xs text-center">Address</TableHead>
                <TableHead className="text-xs text-center">GPS</TableHead>
                <TableHead className="text-xs text-center">Transformer</TableHead>
                <TableHead className="text-xs text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPolls.map(poll => (
                <TableRow key={poll.id} className="hover:bg-muted/40 cursor-pointer">
                  <TableCell className="text-xs text-center">
                    <Button variant="link" size="sm" className="p-0 h-auto text-xs" onClick={() => handlePollIdClick(poll)}>
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
                    <Button size="sm" variant="secondary" onClick={() => handleSeeInMap(poll.id)}>
                      <MapPinIcon className="w-3 h-3 mr-1" /> Map
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-end gap-2 pt-4">
            <Button size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Prev</Button>
            <Button size="sm" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage * itemsPerPage >= sortedPolls.length}>Next</Button>
          </div>
        </CardContent>
      </Card>

      <PollModal
        poll={selectedPoll}
        isOpen={isPollModalOpen}
        onClose={() => setIsPollModalOpen(false)}
        onEdit={(id) => console.log('edit', id)}
        onDelete={(id) => console.log('delete', id)}
        onSeeInMap={(id) => handleSeeInMap(id)}
      />
    </div>
  );
}
