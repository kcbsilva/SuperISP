// src/app/subscribers/list/page.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Building, Search, Filter, RefreshCw, PlusCircle } from "lucide-react";
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

const placeholderSubscribers = [
  { id: 'sub-1', name: 'Alice Wonderland', type: 'Residential', status: 'Active', taxId: '123.456.789-00', phone: '555-1111' },
  { id: 'sub-2', name: 'Bob The Builder Inc.', type: 'Commercial', status: 'Active', taxId: '12.345.678/0001-99', phone: '555-2222' },
  { id: 'sub-3', name: 'Charlie Chaplin', type: 'Residential', status: 'Inactive', taxId: '987.654.321-00', phone: '555-3333' },
  { id: 'sub-4', name: 'Diana Prince', type: 'Residential', status: 'Active', taxId: '001.002.003-44', phone: '555-4444' },
  { id: 'sub-5', name: 'Evil Corp', type: 'Commercial', status: 'Suspended', taxId: '99.888.777/0002-11', phone: '555-6666' },
];

type SubscriberStatus = "Active" | "Inactive" | "Suspended" | "Planned";

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


export default function ListSubscribersPage() {
    const { t } = useLocale();
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = React.useState('');
    const [filters, setFilters] = React.useState<FilterState>({
        type: [],
        status: [],
    });
    const [isLoading, setIsLoading] = React.useState(false);
    const iconSize = "h-3 w-3"; // Reduced icon size


    const filteredSubscribers = React.useMemo(() => {
        return placeholderSubscribers.filter(sub => {
        const nameMatch = sub.name.toLowerCase().includes(searchTerm.toLowerCase());
        const taxIdMatch = sub.taxId?.toLowerCase().includes(searchTerm.toLowerCase());
        const phoneMatch = sub.phone.includes(searchTerm);
        const idMatch = sub.id.toLowerCase().includes(searchTerm.toLowerCase());

        const typeMatch = filters.type.length === 0 || filters.type.includes(sub.type as 'Residential' | 'Commercial');
        const statusMatch = filters.status.length === 0 || filters.status.includes(sub.status as SubscriberStatus);

        return (idMatch || nameMatch || taxIdMatch || phoneMatch) && typeMatch && statusMatch;
        });
    }, [searchTerm, filters]);

    const handleFilterChange = (category: keyof FilterState, value: string, checked: boolean) => {
        setFilters(prev => {
            const currentCategory = prev[category] as string[];
            const updatedCategory = checked
                ? [...currentCategory, value]
                : currentCategory.filter(item => item !== value);
            return { ...prev, [category]: updatedCategory };
        });
    };

    const handleRefresh = () => {
        setIsLoading(true);
        toast({ title: t('list_subscribers.refresh_start_toast') });
        console.log('Refreshing subscriber list...');
        setTimeout(() => {
          setIsLoading(false);
          console.log('Subscriber list refreshed.');
          toast({ title: t('list_subscribers.refresh_end_toast') });
        }, 1000);
    };


  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold">{t('sidebar.subscribers')}</h1> {/* Reduced heading size */}
        <div className="flex items-center gap-2">
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

      <div className="flex flex-col sm:flex-row gap-4">
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
            <Button variant="outline" className="shrink-0">
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


      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24 text-xs">{t('list_subscribers.table_header_id')}</TableHead> 
                  <TableHead className="w-12 text-xs">{t('list_subscribers.table_header_type')}</TableHead> 
                  <TableHead className="text-xs">{t('list_subscribers.table_header_name')}</TableHead> 
                  <TableHead className="text-xs">{t('list_subscribers.table_header_tax_id', 'Tax ID')}</TableHead> 
                  <TableHead className="text-xs">{t('list_subscribers.table_header_status')}</TableHead> 
                  <TableHead className="text-xs">{t('list_subscribers.table_header_phone')}</TableHead> 
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscribers.length > 0 ? (
                  filteredSubscribers.map((subscriber) => (
                    <TableRow key={subscriber.id}>
                      <TableCell className="font-mono text-muted-foreground text-xs">{subscriber.id}</TableCell> 
                      <TableCell>
                        {subscriber.type === 'Residential' ? (
                          <User className={`${iconSize} text-muted-foreground`} title={t('add_subscriber.type_residential')} />
                        ) : (
                          <Building className={`${iconSize} text-muted-foreground`} title={t('add_subscriber.type_commercial')} />
                        )}
                      </TableCell>
                      <TableCell className="font-medium text-xs"> 
                        <Link href={`/subscribers/profile/${subscriber.id}`} className="hover:underline text-primary">
                          {subscriber.name}
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">{formatTaxId(subscriber.taxId)}</TableCell> 
                      <TableCell>
                        <Badge
                            variant={
                                subscriber.status === 'Active' ? 'default' :
                                subscriber.status === 'Suspended' ? 'destructive' :
                                'secondary'
                            }
                             className={
                                subscriber.status === 'Active' ? 'bg-green-100 text-green-800 border-transparent text-xs' : 
                                subscriber.status === 'Suspended' ? 'bg-red-100 text-red-800 border-transparent text-xs' : 
                                subscriber.status === 'Inactive' ? 'bg-yellow-100 text-yellow-800 border-transparent text-xs' : 
                                'text-xs' 
                             }
                        >
                          {t(`list_subscribers.status_${subscriber.status.toLowerCase()}` as any, subscriber.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">{subscriber.phone}</TableCell> 
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
