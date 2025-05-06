// src/app/subscribers/list/page.tsx
'use client';

import * as React from 'react';
import Link from 'next/link'; // Import Link for navigation
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

// Placeholder data - replace with actual data fetching and state management
const placeholderSubscribers = [
  { id: 'sub-1', name: 'Alice Wonderland', type: 'Residential', status: 'Active', address: '123 Fantasy Lane', email: 'alice@example.com', phone: '555-1111' },
  { id: 'sub-2', name: 'Bob The Builder Inc.', type: 'Commercial', status: 'Active', address: '456 Construction Ave', email: 'bob@example.com', phone: '555-2222' },
  { id: 'sub-3', name: 'Charlie Chaplin', type: 'Residential', status: 'Inactive', address: '789 Silent Film St', email: 'charlie@example.com', phone: '555-3333' },
  { id: 'sub-4', name: 'Diana Prince', type: 'Residential', status: 'Active', address: '1 Paradise Island', email: 'diana@example.com', phone: '555-4444' },
  { id: 'sub-5', name: 'Evil Corp', type: 'Commercial', status: 'Suspended', address: '666 Dark Tower Rd', email: 'evil@example.com', phone: '555-6666' },
];

type SubscriberStatus = "Active" | "Inactive" | "Suspended" | "Planned"; // Example statuses

type FilterState = {
    type: ('Residential' | 'Commercial')[];
    status: SubscriberStatus[];
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

     // Filter logic
    const filteredSubscribers = React.useMemo(() => {
        return placeholderSubscribers.filter(sub => {
        const nameMatch = sub.name.toLowerCase().includes(searchTerm.toLowerCase());
        const emailMatch = sub.email.toLowerCase().includes(searchTerm.toLowerCase());
        const addressMatch = sub.address.toLowerCase().includes(searchTerm.toLowerCase());
        const phoneMatch = sub.phone.includes(searchTerm);
        const idMatch = sub.id.toLowerCase().includes(searchTerm.toLowerCase());

        const typeMatch = filters.type.length === 0 || filters.type.includes(sub.type as 'Residential' | 'Commercial');
        const statusMatch = filters.status.length === 0 || filters.status.includes(sub.status as SubscriberStatus);

        return (idMatch || nameMatch || emailMatch || addressMatch || phoneMatch) && typeMatch && statusMatch;
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
        <h1 className="text-2xl font-semibold">{t('sidebar.subscribers')}</h1> {/* Changed heading */}
        <div className="flex items-center gap-2">
            <Button
                variant="default"
                onClick={handleRefresh}
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90"
            >
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                {t('list_subscribers.refresh_button')}
            </Button>
            <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
              <Link href="/subscribers/add">
                <PlusCircle className="mr-2 h-4 w-4" /> {t('list_subscribers.add_button')}
              </Link>
            </Button>
        </div>
      </div>

       {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
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
              <Filter className="mr-2 h-4 w-4" /> {t('list_subscribers.filter_button')}
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
        {/* CardHeader removed */}
        <CardContent className="pt-6"> {/* Added padding-top to CardContent as CardHeader was removed */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">{t('list_subscribers.table_header_id')}</TableHead> {/* Added ID Header */}
                  <TableHead className="w-12">{t('list_subscribers.table_header_type')}</TableHead>
                  <TableHead>{t('list_subscribers.table_header_name')}</TableHead>
                  <TableHead>{t('list_subscribers.table_header_status')}</TableHead>
                  <TableHead>{t('list_subscribers.table_header_address')}</TableHead>
                  <TableHead>{t('list_subscribers.table_header_email')}</TableHead>
                  <TableHead>{t('list_subscribers.table_header_phone')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscribers.length > 0 ? (
                  filteredSubscribers.map((subscriber) => (
                    <TableRow key={subscriber.id}>
                      <TableCell className="font-mono text-muted-foreground">{subscriber.id}</TableCell> {/* Added ID Cell */}
                      <TableCell>
                        {subscriber.type === 'Residential' ? (
                          <User className="h-5 w-5 text-muted-foreground" title="Residential" />
                        ) : (
                          <Building className="h-5 w-5 text-muted-foreground" title="Commercial" />
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        <Link href={`/subscribers/profile/${subscriber.id}`} className="hover:underline text-primary">
                          {subscriber.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge
                            variant={
                                subscriber.status === 'Active' ? 'default' :
                                subscriber.status === 'Suspended' ? 'destructive' :
                                'secondary'
                            }
                             className={
                                subscriber.status === 'Active' ? 'bg-green-100 text-green-800 border-transparent' :
                                subscriber.status === 'Suspended' ? 'bg-red-100 text-red-800 border-transparent' :
                                subscriber.status === 'Inactive' ? 'bg-yellow-100 text-yellow-800 border-transparent' :
                                ''
                             }
                        >
                          {t(`list_subscribers.status_${subscriber.status.toLowerCase()}` as any, subscriber.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{subscriber.address}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{subscriber.email}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{subscriber.phone}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8"> {/* Updated colSpan */}
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

