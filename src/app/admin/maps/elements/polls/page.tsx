// src/app/maps/elements/polls/page.tsx
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Power } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import dynamic from 'next/dynamic';

import { PollProfile } from '@/components/maps/elements/polls/PollProfile';
import { ListPolls, HydroPoll } from '@/components/maps/elements/polls/ListPolls';
import { PollTemplate } from '@/components/maps/elements/polls/types';

const PollTemplateDialog = dynamic(() => import('@/components/maps/elements/polls/PollTemplateDialog'), {
  ssr: false,
});

const simulatedPolls: HydroPoll[] = [
  {
    id: 'poll-001',
    description: 'Main street pole near transformer station',
    height: '12m',
    type: 'Circular',
    address: '123 Main St, Springfield',
    gpsCoordinates: '-3.745, -38.523',
    transformer: 'Yes',
  },
];

export default function HydroPollsPage() {
  const { t } = useLocale();
  const router = useRouter();

  const [polls] = React.useState<HydroPoll[]>(simulatedPolls);
  const [pollTemplates, setPollTemplates] = React.useState<PollTemplate[]>([]); // ✅ Fixed here
  const [selectedPoll, setSelectedPoll] = React.useState<HydroPoll | null>(null);
  const [isPollModalOpen, setIsPollModalOpen] = React.useState(false);

  const [searchQuery, setSearchQuery] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState<'all' | 'Circular' | 'Square'>('all');
  const [sortField, setSortField] = React.useState<'id' | 'height' | 'type'>('id');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  const handlePollClick = (poll: HydroPoll) => {
    setSelectedPoll(poll);
    setIsPollModalOpen(true);
  };

  const handleSeeInMap = (id: string) => {
    router.push(`/admin/maps/view?highlight=${id}`);
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
          manufacturers={['PoleMaster Inc.', 'Structura']}
          materials={['Concrete', 'Wood', 'Steel']}
          onAdd={(tpl) => setPollTemplates((prev) => [...prev, tpl])}
          onEdit={(tpl) =>
            setPollTemplates((prev) => prev.map((t) => (t.id === tpl.id ? tpl : t)))
          }
          onDelete={(id) => setPollTemplates((prev) => prev.filter((t) => t.id !== id))}
        />
      </div>

      <Card>
        <CardContent className="pt-6">
          <ListPolls
            polls={polls}
            searchQuery={searchQuery}
            typeFilter={typeFilter}
            sortField={sortField}
            sortDirection={sortDirection}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPollClick={handlePollClick}
            onSeeInMap={handleSeeInMap}
            onSort={setSortField}
            onSearchChange={setSearchQuery}
            onTypeFilterChange={setTypeFilter}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>

      <PollProfile
        poll={selectedPoll}
        isOpen={isPollModalOpen}
        onClose={() => setIsPollModalOpen(false)}
        onEdit={(id) => console.log('edit', id)}
        onDelete={(id) => console.log('delete', id)}
        onSeeInMap={handleSeeInMap}
      />
    </div>
  );
}
