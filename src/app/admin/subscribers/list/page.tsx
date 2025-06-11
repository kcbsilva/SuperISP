// src/app/subscribers/list/page.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card"; 
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { User, Building, Search, Filter, RefreshCw, PlusCircle, Users, UserCheck, UserX, TrendingUp, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocale } from '@/contexts/LocaleContext';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import type { Subscriber, SubscriberStatus, SubscriberType } from '@/types/subscribers';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { listSubscribers as fetchSubscribers } from '@/services/mysql/subscribers';
import { useQuery } from '@tanstack/react-query'; // Added useQuery

type FilterState = {
    type: ('Residential' | 'Commercial')[];
    status: SubscriberStatus[];
};

const formatTaxId = (taxId: string | undefined | null): string => {
  if (!taxId) return '-';
  if (taxId.length <= 5) {
    if (taxId.length === 1) return '*';
    if (taxId.length === 2) return taxId[0] + '*';
    return taxId.substring(0, 1) + '***' + taxId.substring(taxId.length - 1);
  }
  const prefix = taxId.substring(0, 3);
  const suffix = taxId.substring(taxId.length - 2);
  const middle = taxId.substring(3, taxId.length - 2);
  const maskedMiddle = middle.replace(/\d/g, '*');
  return `${prefix}${maskedMiddle}${suffix}`;
};

const subscriberStats = {
  newSubscribers: 25,
  activeSubscribers: 1180,
  suspendedSubscribers: 52,
  totalSubscribers: 1257,
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

type SortableSubscriberKeys = keyof Subscriber | 'name';


export default function ListSubscribersPage() {
    const { t } = useLocale();
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = React.useState('');
    const [filters, setFilters] = React.useState<FilterState>({
        type: [],
        status: [],
    });
    const iconSize = "h-3 w-3";
    const statIconSize = "h-4 w-4 text-muted-foreground";

    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 10;
    const [sortColumn, setSortColumn] = React.useState<SortableSubscriberKeys | null>(null);
    const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');

    const {
        data: subscribers = [], // Default to empty array
        isLoading, // Renamed from isLoadingSubscribers
        error,     // Renamed from subscribersError
        refetch    // Renamed from refetchSubscribers
    } = useQuery<Subscriber[], Error>({
        queryKey: ['subscribersList'],
        queryFn: fetchSubscribers,
    });


    const filteredSubscribers = React.useMemo(() => {
        return subscribers.filter(sub => {
        const nameMatch = sub.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || sub.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
        const taxIdMatch = sub.taxId?.toLowerCase().includes(searchTerm.toLowerCase()) || sub.businessNumber?.toLowerCase().includes(searchTerm.toLowerCase());
        const phoneMatch = sub.phoneNumber.includes(searchTerm);
        const idMatch = sub.id.toString().toLowerCase().includes(searchTerm.toLowerCase());
        const addressMatch = sub.address.toLowerCase().includes(searchTerm.toLowerCase());

        const typeMatch = filters.type.length === 0 || filters.type.includes(sub.subscriberType as 'Residential' | 'Commercial');
        const statusMatch = filters.status.length === 0 || filters.status.includes(sub.status as SubscriberStatus);

        return (idMatch || nameMatch || taxIdMatch || phoneMatch || addressMatch) && typeMatch && statusMatch;
        });
    }, [searchTerm, filters, subscribers]);

    const sortedSubscribers = React.useMemo(() => {
        if (!sortColumn) return filteredSubscribers;
        return [...filteredSubscribers].sort((a, b) => {
            let valA: any;
            let valB: any;

            if (sortColumn === 'name') {
                valA = a.subscriberType === 'Residential' ? a.fullName : a.companyName;
                valB = b.subscriberType === 'Residential' ? b.fullName : b.companyName;
            } else {
                valA = a[sortColumn as keyof Subscriber];
                valB = b[sortColumn as keyof Subscriber];
            }

            if (valA === undefined || valA === null) valA = '';
            if (valB === undefined || valB === null) valB = '';


            if (typeof valA === 'string' && typeof valB === 'string') {
                valA = valA.toLowerCase();
                valB = valB.toLowerCase();
            }


            if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
            if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }, [filteredSubscribers, sortColumn, sortDirection]);


    const totalPages = Math.ceil(sortedSubscribers.length / itemsPerPage);
    const currentSubscribers = sortedSubscribers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleSort = (column: SortableSubscriberKeys) => {
        if (sortColumn === column) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const handleFilterChange = (category: keyof FilterState, value: string, checked: boolean) => {
        setFilters(prev => {
            const currentCategory = prev[category] as string[];
            const updatedCategory = checked
                ? [...currentCategory, value]
                : currentCategory.filter(item => item !== value);
            return { ...prev, [category]: updatedCategory };
        });
        setCurrentPage(1); 
    };

    const handleRefresh = async () => {
        toast({ title: t('list_subscribers.refresh_start_toast') });
        try {
          await refetch();
          toast({ title: t('list_subscribers.refresh_end_toast') });
        } catch (err) {
           console.error("Failed to refresh subscribers:", err);
           toast({
             title: "Error Refreshing",
             description: (err as Error).message || "Failed to refresh subscriber data.",
             variant: "destructive",
           });
        }
        setCurrentPage(1);
    };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3 px-4">
            <CardTitle className="text-xs font-medium">{t('list_subscribers.stats_new_subscribers', 'New Subscribers (Month)')}</CardTitle>
            <TrendingUp className={statIconSize} />
          </CardHeader>
          <CardContent className="pb-3 px-4">
            <div className="text-lg font-bold">{subscriberStats.newSubscribers.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3 px-4">
            <CardTitle className="text-xs font-medium">{t('list_subscribers.stats_active_subscribers', 'Active Subscribers')}</CardTitle>
            <UserCheck className={statIconSize} />
          </CardHeader>
          <CardContent className="pb-3 px-4">
            <div className="text-lg font-bold">{subscriberStats.activeSubscribers.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3 px-4">
            <CardTitle className="text-xs font-medium">{t('list_subscribers.stats_suspended_subscribers', 'Suspended Subscribers')}</CardTitle>
            <UserX className={statIconSize} />
          </CardHeader>
          <CardContent className="pb-3 px-4">
            <div className="text-lg font-bold">{subscriberStats.suspendedSubscribers.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3 px-4">
            <CardTitle className="text-xs font-medium">{t('list_subscribers.stats_total_subscribers', 'Total Subscribers')}</CardTitle>
            <Users className={statIconSize} />
          </CardHeader>
          <CardContent className="pb-3 px-4">
            <div className="text-lg font-bold">{subscriberStats.totalSubscribers.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-base font-semibold">{t('sidebar.subscribers')}</h1>

        <div className="flex flex-1 flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative flex-1">
              <Search className={`absolute left-2.5 top-2.5 ${iconSize} text-muted-foreground`} />
              <Input
                type="search"
                placeholder={t('list_subscribers.search_placeholder')}
                className="pl-8 w-full border-border"
                value={searchTerm}
                onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="shrink-0 w-full sm:w-auto">
                  <Filter className={`mr-2 ${iconSize}`} /> {t('list_subscribers.filter_button')}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                 <DropdownMenuLabel>{t('list_subscribers.filter_type_label')}</DropdownMenuLabel>
                 <DropdownMenuSeparator />
                 <DropdownMenuCheckboxItem
                    checked={filters.type.includes('Residential')}
                    onCheckedChange={(checked) => handleFilterChange('type', 'Residential', !!checked)}
                 >
                    {t('list_subscribers.filter_type_residential')}
                 </DropdownMenuCheckboxItem>
                 <DropdownMenuCheckboxItem
                     checked={filters.type.includes('Commercial')}
                     onCheckedChange={(checked) => handleFilterChange('type', 'Commercial', !!checked)}
                 >
                     {t('list_subscribers.filter_type_commercial')}
                 </DropdownMenuCheckboxItem>

                 <DropdownMenuLabel className="mt-2">{t('list_subscribers.filter_status_label')}</DropdownMenuLabel>
                 <DropdownMenuSeparator />
                 {(['Active', 'Inactive', 'Suspended', 'Planned'] as SubscriberStatus[]).map(status => (
                     <DropdownMenuCheckboxItem
                        key={status}
                        checked={filters.status.includes(status)}
                        onCheckedChange={(checked) => handleFilterChange('status', status, !!checked)}
                     >
                        {t(`list_subscribers.status_${status.toLowerCase()}` as any, status)}
                     </DropdownMenuCheckboxItem>
                 ))}
              </DropdownMenuContent>
            </DropdownMenu>
        </div>

        <div className="flex items-center gap-2 shrink-0">
            <Button
                variant="default"
                onClick={handleRefresh}
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90"
            >
                <RefreshCw className={`mr-2 ${iconSize} ${isLoading ? 'animate-spin' : ''}`} />
                {t('list_subscribers.refresh_button')}
            </Button>
            <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
              <Link href="/admin/subscribers/add">
                <PlusCircle className={`mr-2 ${iconSize}`} /> {t('list_subscribers.add_button')}
              </Link>
            </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24 text-xs text-center cursor-pointer hover:bg-muted/50" onClick={() => handleSort('id')}>
                    <div className="flex items-center justify-center gap-1">
                        {t('list_subscribers.table_header_id')}
                        {sortColumn === 'id' && <ArrowUpDown className="h-2.5 w-2.5" />}
                    </div>
                  </TableHead>
                  <TableHead className="w-12 text-xs text-center cursor-pointer hover:bg-muted/50" onClick={() => handleSort('subscriberType')}>
                     <div className="flex items-center justify-center gap-1">
                        {t('list_subscribers.table_header_type')}
                        {sortColumn === 'subscriberType' && <ArrowUpDown className="h-2.5 w-2.5" />}
                    </div>
                  </TableHead>
                  <TableHead className="text-xs text-center cursor-pointer hover:bg-muted/50" onClick={() => handleSort('name')}>
                    <div className="flex items-center justify-center gap-1">
                        {t('list_subscribers.table_header_name')}
                        {sortColumn === 'name' && <ArrowUpDown className="h-2.5 w-2.5" />}
                    </div>
                  </TableHead>
                  <TableHead className="text-xs text-center cursor-pointer hover:bg-muted/50" onClick={() => handleSort('taxId')}>
                    <div className="flex items-center justify-center gap-1">
                        {t('list_subscribers.table_header_tax_id')}
                        {sortColumn === 'taxId' && <ArrowUpDown className="h-2.5 w-2.5" />}
                    </div>
                  </TableHead>
                  <TableHead className="text-xs text-center cursor-pointer hover:bg-muted/50" onClick={() => handleSort('address')}>
                    <div className="flex items-center justify-center gap-1">
                        {t('list_subscribers.table_header_address')}
                        {sortColumn === 'address' && <ArrowUpDown className="h-2.5 w-2.5" />}
                    </div>
                  </TableHead>
                  <TableHead className="text-xs text-center cursor-pointer hover:bg-muted/50" onClick={() => handleSort('phoneNumber')}>
                    <div className="flex items-center justify-center gap-1">
                        {t('list_subscribers.table_header_phone')}
                        {sortColumn === 'phoneNumber' && <ArrowUpDown className="h-2.5 w-2.5" />}
                    </div>
                  </TableHead>
                  <TableHead className="text-xs text-center cursor-pointer hover:bg-muted/50" onClick={() => handleSort('status')}>
                    <div className="flex items-center justify-center gap-1">
                        {t('list_subscribers.table_header_status')}
                        {sortColumn === 'status' && <ArrowUpDown className="h-2.5 w-2.5" />}
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                    Array.from({ length: itemsPerPage }).map((_, index) => (
                        <TableRow key={`skeleton-${index}`}>
                            <TableCell className="text-center"><Skeleton className="h-4 bg-muted rounded w-20 mx-auto" /></TableCell>
                            <TableCell className="text-center"><Skeleton className="h-4 bg-muted rounded w-8 mx-auto" /></TableCell>
                            <TableCell className="text-center"><Skeleton className="h-4 bg-muted rounded w-40 mx-auto" /></TableCell>
                            <TableCell className="text-center"><Skeleton className="h-4 bg-muted rounded w-24 mx-auto" /></TableCell>
                            <TableCell className="text-center"><Skeleton className="h-4 bg-muted rounded w-48 mx-auto" /></TableCell>
                            <TableCell className="text-center"><Skeleton className="h-4 bg-muted rounded w-28 mx-auto" /></TableCell>
                            <TableCell className="text-center"><Skeleton className="h-4 bg-muted rounded w-20 mx-auto" /></TableCell>
                        </TableRow>
                    ))
                ) : error ? (
                     <TableRow>
                        <TableCell colSpan={7} className="text-center text-destructive py-8 text-xs">
                             Error fetching subscribers: {error.message}
                        </TableCell>
                    </TableRow>
                ) : currentSubscribers.length > 0 ? (
                  currentSubscribers.map((subscriber) => (
                    <TableRow key={subscriber.id}>
                      <TableCell className="font-mono text-muted-foreground text-xs text-center">{subscriber.id}</TableCell>
                      <TableCell className="text-center">
                        {subscriber.subscriberType === 'Residential' ? (
                          <User className={`${iconSize} text-muted-foreground mx-auto`} title={t('add_subscriber.type_residential')} />
                        ) : (
                          <Building className={`${iconSize} text-muted-foreground mx-auto`} title={t('add_subscriber.type_commercial')} />
                        )}
                      </TableCell>
                      <TableCell className="font-medium text-xs text-center">
                        <Link href={`/admin/subscribers/profile/${subscriber.id}`} className="hover:underline text-primary">
                          {subscriber.subscriberType === 'Residential' ? subscriber.fullName : subscriber.companyName}
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs text-center">{formatTaxId(subscriber.subscriberType === 'Residential' ? subscriber.taxId : subscriber.businessNumber)}</TableCell>
                      <TableCell className="text-muted-foreground text-xs text-center">{subscriber.address}</TableCell>
                      <TableCell className="text-muted-foreground text-xs text-center">{subscriber.phoneNumber}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={subscriber.status === 'Active' ? 'default' : 'secondary'} className={cn("text-xs", getStatusBadgeVariant(subscriber.status))}>
                             {t(`list_subscribers.status_${subscriber.status.toLowerCase()}` as any, subscriber.status)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8 text-xs">
                      {t('list_subscribers.no_results')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {totalPages > 1 && !isLoading && !error && (
            <div className="flex items-center justify-end space-x-2 py-4">
              <span className="text-xs text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className={iconSize} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
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
