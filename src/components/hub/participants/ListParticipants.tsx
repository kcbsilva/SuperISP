'use client';

import * as React from 'react';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLocale } from '@/contexts/LocaleContext';
import { useQuery } from '@tanstack/react-query';
import { Users2, PlusCircle, Edit, Search, RefreshCw, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';


interface Participant {
    id: string;
    companyName: string;
    businessNumber: string;
    deviceCount: number;
    vlanCount: number;
}

interface Props {
    onAdd: () => void;
    onEdit: (participant: Participant) => void;
    onRemove: (participantId: string) => void;
}

export function ListParticipants({ onAdd, onEdit, onRemove }: Props) {
    const { t } = useLocale();
    const [searchTerm, setSearchTerm] = React.useState('');
    const iconSize = "h-3 w-3";

    const { data, isLoading, refetch } = useQuery<Participant[]>({
        queryKey: ['participants'],
        queryFn: async () => {
          const res = await fetch('/api/admin/hub/participants');
          if (!res.ok) throw new Error('Failed to load participants');
          return res.json();
        },
      });

    const filtered = React.useMemo(() => {
        return (data || []).filter(p =>
            p.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.businessNumber.includes(searchTerm)
        );
    }, [searchTerm, data]);

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
                    <Button onClick={() => refetch()} className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
                        <RefreshCw className={`mr-2 ${iconSize}`} /> {t('cgnat_page.refresh_button', 'Refresh')}
                    </Button>
                    <Button onClick={onAdd} className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto">
                        <PlusCircle className={`mr-2 ${iconSize}`} /> {t('hub_participants.add_participant_button')}
                    </Button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-xs text-center">{t('hub_participants.table_header_id')}</TableHead>
                            <TableHead className="text-xs text-center">{t('hub_participants.table_header_company_name')}</TableHead>
                            <TableHead className="text-xs text-center">{t('hub_participants.table_header_business_number')}</TableHead>
                            <TableHead className="text-xs text-center">{t('hub_participants.table_header_device_count')}</TableHead>
                            <TableHead className="text-xs text-center">{t('hub_participants.table_header_vlan_count')}</TableHead>
                            <TableHead className="text-xs text-center w-32">{t('hub_participants.table_header_actions')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            // Show 5 skeleton rows with headers still visible
                            [...Array(5)].map((_, idx) => (
                                <TableRow key={`skeleton-${idx}`}>
                                    <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-8 mx-auto" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-8 mx-auto" /></TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <Skeleton className="h-7 w-7 rounded" />
                                            <Skeleton className="h-7 w-7 rounded" />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : filtered.length > 0 ? (
                            filtered.map((p) => (
                                <TableRow key={p.id}>
                                    <TableCell className="font-mono text-muted-foreground text-xs text-center">{p.id}</TableCell>
                                    <TableCell className="font-medium text-xs text-center">{p.companyName}</TableCell>
                                    <TableCell className="text-muted-foreground text-xs text-center">{p.businessNumber}</TableCell>
                                    <TableCell className="text-xs text-center">{p.deviceCount}</TableCell>
                                    <TableCell className="text-xs text-center">{p.vlanCount}</TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(p)} title={t('edit')}>
                                                <Edit className={iconSize} />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onRemove(p.id)} title={t('delete')}>
                                                <Trash2 className={iconSize} />
                                            </Button>
                                        </div>
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
        </div>
    );
}
