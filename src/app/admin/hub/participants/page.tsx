// src/app/admin/hub/participants/page.tsx
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users2, PlusCircle, Edit, Search, RefreshCw } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { useToast } from '@/hooks/use-toast';

interface Participant {
  id: string;
  companyName: string;
  businessNumber: string;
  deviceCount: number;
  vlanCount: number;
}

const placeholderParticipants: Participant[] = [
  { id: 'participant-001', companyName: 'ISP Alpha', businessNumber: '11.111.111/0001-11', deviceCount: 5, vlanCount: 10 },
  { id: 'participant-002', companyName: 'Net Connect Pro', businessNumber: '22.222.222/0001-22', deviceCount: 3, vlanCount: 6 },
  { id: 'participant-003', companyName: 'Fiber Solutions Global', businessNumber: '33.333.333/0001-33', deviceCount: 8, vlanCount: 15 },
];

export default function HubParticipantsPage() {
  const { t } = useLocale();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = React.useState('');
  const iconSize = "h-3 w-3";

  const handleAddParticipant = () => {
    toast({
      title: t('hub_participants.add_participant_toast_title'),
      description: t('hub_participants.add_participant_toast_desc'),
    });
  };

  const handleEditParticipant = (participantId: string) => {
    toast({
      title: t('hub_participants.edit_participant_toast_title'),
      description: t('hub_participants.edit_participant_toast_desc').replace('{id}', participantId),
    });
  };

  const filteredParticipants = React.useMemo(() => {
    return placeholderParticipants.filter(p =>
      p.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.businessNumber.includes(searchTerm)
    );
  }, [searchTerm]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-base font-semibold flex items-center gap-2">
          <Users2 className={`${iconSize} text-primary`} />
          {t('sidebar.hub_participants', 'Participants')}
        </h1>
        <div className="flex flex-1 flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 w-full sm:w-auto">
              <Search className={`absolute left-2.5 top-2.5 ${iconSize} text-muted-foreground`} />
              <Input
                type="search"
                placeholder={t('hub_participants.search_placeholder')}
                className="pl-8 w-full sm:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="default" className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
                <RefreshCw className={`mr-2 ${iconSize}`} /> {t('cgnat_page.refresh_button', 'Refresh')}
            </Button>
            <Button onClick={handleAddParticipant} className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto">
                <PlusCircle className={`mr-2 ${iconSize}`} /> {t('hub_participants.add_participant_button')}
            </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{t('sidebar.hub_participants', 'Hub Participants List')}</CardTitle>
          <CardDescription className="text-xs">{t('sidebar.hub_participants_tooltip', 'Manage Hub Participants')}</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs text-center">{t('hub_participants.table_header_id')}</TableHead>
                  <TableHead className="text-xs text-center">{t('hub_participants.table_header_company_name')}</TableHead>
                  <TableHead className="text-xs text-center">{t('hub_participants.table_header_business_number')}</TableHead>
                  <TableHead className="text-xs text-center">{t('hub_participants.table_header_device_count')}</TableHead>
                  <TableHead className="text-xs text-center">{t('hub_participants.table_header_vlan_count')}</TableHead>
                  <TableHead className="text-xs text-center w-20">{t('hub_participants.table_header_actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredParticipants.length > 0 ? (
                  filteredParticipants.map((participant) => (
                    <TableRow key={participant.id}>
                      <TableCell className="font-mono text-muted-foreground text-xs text-center">{participant.id}</TableCell>
                      <TableCell className="font-medium text-xs text-center">{participant.companyName}</TableCell>
                      <TableCell className="text-muted-foreground text-xs text-center">{participant.businessNumber}</TableCell>
                      <TableCell className="text-xs text-center">{participant.deviceCount}</TableCell>
                      <TableCell className="text-xs text-center">{participant.vlanCount}</TableCell>
                      <TableCell className="text-center">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditParticipant(participant.id)}>
                          <Edit className={iconSize} />
                          <span className="sr-only">{t('hub_participants.action_edit')}</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-4 text-xs">
                      {t('hub_participants.no_participants_found')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
