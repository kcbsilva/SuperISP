// src/components/subscribers/ListSubscribers.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardTitle,
  CardHeader,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  User,
  Building,
  Search,
  Filter,
  RefreshCw,
  PlusCircle,
  Users,
  UserCheck,
  UserX,
  TrendingUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLocale } from '@/contexts/LocaleContext';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import type { Subscriber, SubscriberStatus } from '@/types/subscribers';

import { AddSubscriberModal } from './AddSubscriberModal';
import { UpdateSubscriberModal } from './UpdateSubscriberModal';
import { RemoveSubscriberModal } from './RemoveSubscriberModal';
import { SubscriberProfile } from './SubscriberProfile';

const formatTaxId = (taxId?: string | null): string => {
  if (!taxId) return '-';
  const prefix = taxId.substring(0, 3);
  const suffix = taxId.substring(taxId.length - 2);
  const middle = taxId.substring(3, taxId.length - 2);
  return `${prefix}${middle.replace(/\d/g, '*')}${suffix}`;
};

const getStatusBadgeVariant = (status?: SubscriberStatus) => {
  switch (status) {
    case 'Active': return 'bg-green-100 text-green-800';
    case 'Suspended': return 'bg-yellow-100 text-yellow-800';
    case 'Inactive':
    case 'Canceled':
    case 'Planned': return 'bg-gray-100 text-gray-800';
    default: return 'bg-secondary text-secondary-foreground';
  }
};

type SortableKeys =
  | keyof Pick<Subscriber, 'id' | 'subscriberType' | 'address' | 'phoneNumber' | 'status' | 'taxId'>
  | 'name';

type FilterState = {
  type: ('Residential' | 'Commercial')[];
  status: SubscriberStatus[];
};

export function ListSubscribers() {
  const { t } = useLocale();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = React.useState('');
  const [filters, setFilters] = React.useState<FilterState>({ type: [], status: [] });
  const [currentPage, setCurrentPage] = React.useState(1);
  const [sortColumn, setSortColumn] = React.useState<SortableKeys | null>(null);
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');

  const itemsPerPage = 10;
  const iconSize = 'h-3 w-3';
  const statIconSize = 'h-4 w-4 text-muted-foreground';

  const {
    data: subscribers = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['subscribersList'],
    queryFn: async () => {
      const res = await fetch('/api/subscribers/list');
      if (!res.ok) throw new Error('Failed to fetch subscribers');
      return res.json();
    },
  });

  const { data: subscriberStats } = useQuery({
    queryKey: ['subscriberStats'],
    queryFn: async () => {
      const res = await fetch('/api/subscribers/stats');
      if (!res.ok) throw new Error('Failed to fetch stats');
      return res.json();
    },
  });

  const stats = subscriberStats ?? {
    newSubscribers: 0,
    activeSubscribers: 0,
    suspendedSubscribers: 0,
    totalSubscribers: 0,
  };

  const filtered = React.useMemo(() => {
    return subscribers.filter((sub) => {
      const nameMatch =
        sub.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
      const taxIdMatch =
        sub.taxId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.businessNumber?.toLowerCase().includes(searchTerm.toLowerCase());
      const phoneMatch = sub.phoneNumber.includes(searchTerm);
      const idMatch = sub.id.toLowerCase().includes(searchTerm.toLowerCase());
      const addressMatch = sub.address.toLowerCase().includes(searchTerm.toLowerCase());

      const typeMatch = filters.type.length === 0 || filters.type.includes(sub.subscriberType);
      const statusMatch = filters.status.length === 0 || filters.status.includes(sub.status);

      return (idMatch || nameMatch || taxIdMatch || phoneMatch || addressMatch) && typeMatch && statusMatch;
    });
  }, [subscribers, searchTerm, filters]);

  const sorted = React.useMemo(() => {
    if (!sortColumn) return filtered;
    return [...filtered].sort((a, b) => {
      let valA = sortColumn === 'name'
        ? (a.subscriberType === 'Residential' ? a.fullName : a.companyName) || ''
        : (a[sortColumn] as string);
      let valB = sortColumn === 'name'
        ? (b.subscriberType === 'Residential' ? b.fullName : b.companyName) || ''
        : (b[sortColumn] as string);

      valA = typeof valA === 'string' ? valA.toLowerCase() : valA;
      valB = typeof valB === 'string' ? valB.toLowerCase() : valB;
      return (valA < valB ? -1 : 1) * (sortDirection === 'asc' ? 1 : -1);
    });
  }, [filtered, sortColumn, sortDirection]);

  const current = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(sorted.length / itemsPerPage);

  const handleSort = (column: SortableKeys) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleFilterChange = (
    key: keyof FilterState,
    value: string,
    checked: boolean
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: checked ? [...prev[key], value] : prev[key].filter((v) => v !== value),
    }));
    setCurrentPage(1);
  };

  const handleRefresh = async () => {
    toast({ title: t('list_subscribers.refresh_start_toast') });
    try {
      await refetch();
      toast({ title: t('list_subscribers.refresh_end_toast') });
    } catch (err) {
      toast({
        title: 'Error Refreshing',
        description: (err as Error).message,
        variant: 'destructive',
      });
    }
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-base font-semibold">{t('sidebar.subscribers')}</h1>

      {/* Modals and additional components can be placed here */}
      <AddSubscriberModal />
      <UpdateSubscriberModal />
      <RemoveSubscriberModal />
      {/* Example of how to show profile component: */}
      {/* <SubscriberProfile subscriber={someSelectedSubscriber} /> */}

      {/* Stats, Filters, Table, Pagination would follow */}
    </div>
  );
}
