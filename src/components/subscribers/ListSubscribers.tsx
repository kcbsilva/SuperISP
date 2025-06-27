// src/components/subscribers/ListSubscribers.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardTitle, CardHeader } from '@/components/ui/card';
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
import {
  listSubscribers,
  getSubscriberStats,
} from '@/services/postgres/subscribers';
import { useQuery } from '@tanstack/react-query';
import type { Subscriber, SubscriberStatus } from '@/types/subscribers';

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

type FilterState = {
  type: ('Residential' | 'Commercial')[];
  status: SubscriberStatus[];
};

const formatTaxId = (taxId: string | undefined | null): string => {
  if (!taxId) return '-';
  const prefix = taxId.substring(0, 3);
  const suffix = taxId.substring(taxId.length - 2);
  const middle = taxId.substring(3, taxId.length - 2);
  return `${prefix}${middle.replace(/\d/g, '*')}${suffix}`;
};

const getStatusBadgeVariant = (status: SubscriberStatus | undefined) => {
  switch (status) {
    case 'Active':
      return 'bg-green-100 text-green-800';
    case 'Suspended':
      return 'bg-yellow-100 text-yellow-800';
    case 'Inactive':
    case 'Canceled':
    case 'Planned':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-secondary text-secondary-foreground';
  }
};

type SortableKeys =
  | keyof Pick<
      Subscriber,
      'id' | 'subscriberType' | 'address' | 'phoneNumber' | 'status' | 'taxId'
    >
  | 'name';

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function ListSubscribers() {
  const { t } = useLocale();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = React.useState('');
  const [filters, setFilters] = React.useState<FilterState>({
    type: [],
    status: [],
  });
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;
  const [sortColumn, setSortColumn] = React.useState<SortableKeys | null>(null);
  const [sortDirection, setSortDirection] =
    React.useState<'asc' | 'desc'>('asc');

  const iconSize = 'h-3 w-3';
  const statIconSize = 'h-4 w-4 text-muted-foreground';

  /* ---------- React-Query v5 syntax (object form) ---------- */
  const {
    data: subscribers = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['subscribersList'],
    queryFn: listSubscribers,
  });

  const { data: subscriberStats } = useQuery({
    queryKey: ['subscriberStats'],
    queryFn: getSubscriberStats,
  });

  const stats = subscriberStats ?? {
    newSubscribers: 0,
    activeSubscribers: 0,
    suspendedSubscribers: 0,
    totalSubscribers: 0,
  };

  /* ---------- Derived lists ---------- */
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
      const addressMatch = sub.address
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const typeMatch =
        filters.type.length === 0 ||
        filters.type.includes(sub.subscriberType as 'Residential' | 'Commercial');
      const statusMatch =
        filters.status.length === 0 ||
        filters.status.includes(sub.status as SubscriberStatus);

      return (
        (idMatch || nameMatch || taxIdMatch || phoneMatch || addressMatch) &&
        typeMatch &&
        statusMatch
      );
    });
  }, [subscribers, searchTerm, filters]);

  const sorted = React.useMemo(() => {
    if (!sortColumn) return filtered;
    return [...filtered].sort((a, b) => {
      let valA: any =
        sortColumn === 'name'
          ? a.subscriberType === 'Residential'
            ? a.fullName
            : a.companyName
          : a[sortColumn];
      let valB: any =
        sortColumn === 'name'
          ? b.subscriberType === 'Residential'
            ? b.fullName
            : b.companyName
          : b[sortColumn];
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      return (valA < valB ? -1 : 1) * (sortDirection === 'asc' ? 1 : -1);
    });
  }, [filtered, sortColumn, sortDirection]);

  const current = sorted.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(sorted.length / itemsPerPage);

  /* ------------------------------------------------------------------ */
  /* Handlers                                                            */
  /* ------------------------------------------------------------------ */

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

  /* ------------------------------------------------------------------ */
  /* Render                                                              */
  /* ------------------------------------------------------------------ */

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-base font-semibold">{t('sidebar.subscribers')}</h1>

      {/* ---------- Stats ---------- */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {([
          ['newSubscribers', <TrendingUp className={statIconSize} />],
          ['activeSubscribers', <UserCheck className={statIconSize} />],
          ['suspendedSubscribers', <UserX className={statIconSize} />],
          ['totalSubscribers', <Users className={statIconSize} />],
        ] as const).map(([key, icon]) => (
          <Card key={key}>
            <CardHeader className="flex items-center justify-between pb-1 pt-3 px-4">
              <CardTitle className="text-xs">
                {t(`list_subscribers.stats_${key}`)}
              </CardTitle>
              {icon}
            </CardHeader>
            <CardContent className="pb-3 px-4">
              <div className="text-lg font-bold">
                {stats[key as keyof typeof stats].toLocaleString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ---------- Filters + Search ---------- */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-auto">
          <Search
            className={`absolute left-2.5 top-2.5 ${iconSize} text-muted-foreground`}
          />
          <Input
            type="search"
            placeholder={t('list_subscribers.search_placeholder')}
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="shrink-0 w-full sm:w-auto">
              <Filter className={`mr-2 ${iconSize}`} />{' '}
              {t('list_subscribers.filter_button')}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuLabel>
              {t('list_subscribers.filter_type_label')}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {['Residential', 'Commercial'].map((type) => (
              <DropdownMenuCheckboxItem
                key={type}
                checked={filters.type.includes(
                  type as 'Residential' | 'Commercial'
                )}
                onCheckedChange={(checked) =>
                  handleFilterChange('type', type, !!checked)
                }
              >
                {t(`list_subscribers.filter_type_${type.toLowerCase()}`)}
              </DropdownMenuCheckboxItem>
            ))}

            <DropdownMenuLabel className="mt-2">
              {t('list_subscribers.filter_status_label')}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {['Active', 'Inactive', 'Suspended', 'Planned', 'Canceled'].map(
              (status) => (
                <DropdownMenuCheckboxItem
                  key={status}
                  checked={filters.status.includes(status as SubscriberStatus)}
                  onCheckedChange={(checked) =>
                    handleFilterChange('status', status, !!checked)
                  }
                >
                  {t(`list_subscribers.status_${status.toLowerCase()}`)}
                </DropdownMenuCheckboxItem>
              )
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex gap-2">
          <Button onClick={handleRefresh}>
            <RefreshCw className={`mr-2 ${iconSize}`} />
            {t('list_subscribers.refresh_button')}
          </Button>
          <Button asChild className="bg-green-600 text-white">
            <Link href="/admin/subscribers/add">
              <PlusCircle className={`mr-2 ${iconSize}`} />
              {t('list_subscribers.add_button')}
            </Link>
          </Button>
        </div>
      </div>

      {/* ---------- Table ---------- */}
      <Card>
        <CardContent className="pt-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {[
                    'id',
                    'subscriberType',
                    'name',
                    'taxId',
                    'address',
                    'phoneNumber',
                    'status',
                  ].map((col) => (
                    <TableHead
                      key={col}
                      onClick={() => handleSort(col as SortableKeys)}
                      className="text-xs text-center cursor-pointer hover:bg-muted/50"
                    >
                      <div className="flex items-center justify-center gap-1">
                        {t(`list_subscribers.table_header_${col}`)}
                        {sortColumn === col && (
                          <ArrowUpDown className="h-2.5 w-2.5" />
                        )}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  Array.from({ length: itemsPerPage }).map((_, i) => (
                    <TableRow key={`sk-${i}`}>
                      {Array(7)
                        .fill(null)
                        .map((_, j) => (
                          <TableCell key={j}>
                            <Skeleton className="h-4 bg-muted rounded w-20 mx-auto" />
                          </TableCell>
                        ))}
                    </TableRow>
                  ))
                ) : error ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-destructive"
                    >
                      {error.message}
                    </TableCell>
                  </TableRow>
                ) : current.length > 0 ? (
                  current.map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell className="text-center font-mono text-xs text-muted-foreground">
                        {sub.id.slice(0, 8)}…
                      </TableCell>
                      <TableCell className="text-center">
                        {sub.subscriberType === 'Residential' ? (
                          <User className={iconSize} />
                        ) : (
                          <Building className={iconSize} />
                        )}
                      </TableCell>
                      <TableCell className="text-center text-xs font-medium">
                        <Link
                          href={`/admin/subscribers/profile/${sub.id}`}
                          className="text-primary hover:underline"
                        >
                          {sub.subscriberType === 'Residential'
                            ? sub.fullName
                            : sub.companyName}
                        </Link>
                      </TableCell>
                      <TableCell className="text-center text-xs text-muted-foreground">
                        {formatTaxId(sub.taxId)}
                      </TableCell>
                      <TableCell className="text-center text-xs text-muted-foreground">
                        {sub.address}
                      </TableCell>
                      <TableCell className="text-center text-xs text-muted-foreground">
                        {sub.phoneNumber}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          className={cn(
                            'text-xs',
                            getStatusBadgeVariant(sub.status)
                          )}
                        >
                          {t(
                            `list_subscribers.status_${sub.status.toLowerCase()}`
                          )}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-muted-foreground"
                    >
                      {t('add_subscriber.no_subscribers_yet')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* ---------- Pagination ---------- */}
          {totalPages > 1 && (
            <div className="flex justify-end gap-2 py-4">
              <span className="text-xs text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                size="sm"
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className={iconSize} />
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                <ChevronRight className={iconSize} />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
