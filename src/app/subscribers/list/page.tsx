// src/app/subscribers/list/page.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Added CardHeader, CardTitle
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { User, Building, Search, Filter, RefreshCw, PlusCircle, Users, UserCheck, UserX, TrendingUp } from "lucide-react"; // Added more icons
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

import { getSubscribers } from '@/services/postgresql/subscribers';
import type { Subscriber, SubscriberStatus } from '@/types/subscribers';

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

// Placeholder data for counters
const subscriberStats = {
  newSubscribers: 25,
  activeSubscribers: 1180,
  suspendedSubscribers: 52,
  totalSubscribers: 1257,
};


export default function ListSubscribersPage() {
    const { t } = useLocale();
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = React.useState('');
    const [filters, setFilters] = React.useState<FilterState>({
        type: [],
        status: [],
    });
    const [isLoading, setIsLoading] = React.useState(false);
    const iconSize = "h-3 w-3";
    const statIconSize = "h-4 w-4 text-muted-foreground"; // For stat cards

    const [subscribers, setSubscribers] = React.useState<Subscriber[]>([]);

    React.useEffect(() => {
      const fetchSubscribers = async () => {
        setIsLoading(true);
        try {
          const response = await getSubscribers();
          console.log('Subscribers response', response);
          setSubscribers(response);
        } catch (error) {
          console.error("Failed to fetch subscribers:", error);
          toast({
            title: "Error",
            description: "Failed to fetch subscribers.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
      fetchSubscribers();
    }, [toast]);

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

    const handleFilterChange = (category: keyof FilterState, value: string, checked: boolean) => {
        setFilters(prev => {
            const currentCategory = prev[category] as string[];
            const updatedCategory = checked
                ? [...currentCategory, value]
                : currentCategory.filter(item => item !== value);
            return { ...prev, [category]: updatedCategory };
        });
    };

    const handleRefresh = async () => {
        setIsLoading(true);
        toast({ title: t('list_subscribers.refresh_start_toast') });
        try {
          const response = await getSubscribers();
          setSubscribers(response);
          toast({ title: t('list_subscribers.refresh_end_toast') });
        } catch (error) {
          console.error("Failed to refresh subscribers:", error);
          toast({
            title: "Error",
            description: "Failed to refresh subscribers.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
    };

  return (
    <div className="flex flex-col gap-6">
      {/* Subscriber Statistics Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3 px-4"> {/* Reduced padding */}
            <CardTitle className="text-xs font-medium">{t('list_subscribers.stats_new_subscribers', 'New Subscribers (Month)')}</CardTitle>
            <TrendingUp className={statIconSize} />
          </CardHeader>
          <CardContent className="pb-3 px-4"> {/* Reduced padding */}
            <div className="text-lg font-bold">{subscriberStats.newSubscribers.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3 px-4"> {/* Reduced padding */}
            <CardTitle className="text-xs font-medium">{t('list_subscribers.stats_active_subscribers', 'Active Subscribers')}</CardTitle>
            <UserCheck className={statIconSize} />
          </CardHeader>
          <CardContent className="pb-3 px-4"> {/* Reduced padding */}
            <div className="text-lg font-bold">{subscriberStats.activeSubscribers.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3 px-4"> {/* Reduced padding */}
            <CardTitle className="text-xs font-medium">{t('list_subscribers.stats_suspended_subscribers', 'Suspended Subscribers')}</CardTitle>
            <UserX className={statIconSize} />
          </CardHeader>
          <CardContent className="pb-3 px-4"> {/* Reduced padding */}
            <div className="text-lg font-bold">{subscriberStats.suspendedSubscribers.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3 px-4"> {/* Reduced padding */}
            <CardTitle className="text-xs font-medium">{t('list_subscribers.stats_total_subscribers', 'Total Subscribers')}</CardTitle>
            <Users className={statIconSize} />
          </CardHeader>
          <CardContent className="pb-3 px-4"> {/* Reduced padding */}
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
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                        {t(`list_subscribers.filter_status_${status.toLowerCase()}` as any, status)}
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
              <Link href="/subscribers/add">
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
                  <TableHead className="w-24 text-xs">{t('list_subscribers.table_header_id')}</TableHead> 
                  <TableHead className="w-12 text-xs">{t('list_subscribers.table_header_type')}</TableHead> 
                  <TableHead className="text-xs">{t('list_subscribers.table_header_name')}</TableHead> 
                  <TableHead className="text-xs">{t('list_subscribers.table_header_tax_id', 'Tax ID')}</TableHead> 
                  <TableHead className="text-xs">{t('list_subscribers.table_header_address', 'Address')}</TableHead> 
                  <TableHead className="text-xs">{t('list_subscribers.table_header_phone')}</TableHead> 
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={`skeleton-${index}`}>
                            <TableCell><div className="h-4 bg-muted rounded w-20"></div></TableCell>
                            <TableCell><div className="h-4 bg-muted rounded w-8"></div></TableCell>
                            <TableCell><div className="h-4 bg-muted rounded w-40"></div></TableCell>
                            <TableCell><div className="h-4 bg-muted rounded w-24"></div></TableCell>
                            <TableCell><div className="h-4 bg-muted rounded w-48"></div></TableCell>
                            <TableCell><div className="h-4 bg-muted rounded w-28"></div></TableCell>
                        </TableRow>
                    ))
                ) : filteredSubscribers.length > 0 ? (
                  filteredSubscribers.map((subscriber) => (
                    <TableRow key={subscriber.id}>
                      <TableCell className="font-mono text-muted-foreground text-xs">{subscriber.id}</TableCell> 
                      <TableCell>
                        {subscriber.subscriberType === 'Residential' ? (
                          <User className={`${iconSize} text-muted-foreground`} title={t('add_subscriber.type_residential')} />
                        ) : (
                          <Building className={`${iconSize} text-muted-foreground`} title={t('add_subscriber.type_commercial')} />
                        )}
                      </TableCell>
                      <TableCell className="font-medium text-xs"> 
                        <Link href={`/subscribers/profile/${subscriber.id}`} className="hover:underline text-primary">
                          {subscriber.subscriberType === 'Residential' ? subscriber.fullName : subscriber.companyName}
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">{formatTaxId(subscriber.subscriberType === 'Residential' ? subscriber.taxId : subscriber.businessNumber)}</TableCell> 
                      <TableCell className="text-muted-foreground text-xs">{subscriber.address}</TableCell> 
                      <TableCell className="text-muted-foreground text-xs">{subscriber.phoneNumber}</TableCell> 
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8 text-xs"> 
                      {t('list_subscribers.no_results')}
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
