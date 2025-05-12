// src/app/service-calls/dashboard/page.tsx
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import { useLocale } from '@/contexts/LocaleContext';
import { useToast } from '@/hooks/use-toast';
import { LayoutDashboard as ServiceDashboardIcon, Wrench, CheckCircle, Clock, ListChecks, Search, Filter as FilterIcon, PlusCircle } from 'lucide-react';

interface ServiceCall {
  id: string;
  subscriberName: string;
  reason: string;
  status: 'Pending' | 'In Progress' | 'Resolved' | 'Canceled';
  technician?: string;
  scheduledDate: string; // Or Date
  createdAt: string; // Or Date
}

const placeholderServiceCalls: ServiceCall[] = [
  { id: 'sc-001', subscriberName: 'Alice Wonderland', reason: 'No internet connection', status: 'Pending', technician: 'John Tech', scheduledDate: '2024-08-15', createdAt: '2024-08-14' },
  { id: 'sc-002', subscriberName: 'Bob The Builder Inc.', reason: 'Intermittent TV signal', status: 'In Progress', technician: 'Jane Fixit', scheduledDate: '2024-08-16', createdAt: '2024-08-14' },
  { id: 'sc-003', subscriberName: 'Charlie Brown', reason: 'Slow internet speed', status: 'Resolved', technician: 'John Tech', scheduledDate: '2024-08-12', createdAt: '2024-08-10' },
  { id: 'sc-004', subscriberName: 'Diana Prince', reason: 'Phone line noisy', status: 'Pending', scheduledDate: '2024-08-17', createdAt: '2024-08-15' },
  { id: 'sc-005', subscriberName: 'Wayne Enterprises', reason: 'Router replacement', status: 'Resolved', technician: 'Jane Fixit', scheduledDate: '2024-08-10', createdAt: '2024-08-09' },
];

const dashboardStats = {
  openedThisMonth: 45,
  resolvedCalls: 123,
  pendingCalls: 12,
  avgResolutionTime: '4.5 hours', // Example, can be calculated
};

type ServiceCallStatusFilter = 'All' | 'Pending' | 'InProgress' | 'Resolved';

export default function ServiceCallsDashboardPage() {
  const { t } = useLocale();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [activeTab, setActiveTab] = React.useState<ServiceCallStatusFilter>('All');
  const [statusFilters, setStatusFilters] = React.useState<ServiceCall['status'][]>([]);
  const iconSize = "h-3 w-3";
  const statIconSize = "h-4 w-4 text-muted-foreground";
  const tabIconSize = "h-2.5 w-2.5";

  const handleNewServiceCall = () => {
    toast({
      title: t('service_calls.new_call_not_implemented_title'),
      description: t('service_calls.new_call_not_implemented_desc'),
    });
  };

  const filteredServiceCalls = React.useMemo(() => {
    return placeholderServiceCalls.filter(call => {
      const searchTermMatch = call.subscriberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              call.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              call.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              (call.technician && call.technician.toLowerCase().includes(searchTerm.toLowerCase()));

      const tabStatusMatch = activeTab === 'All' || call.status === activeTab || (activeTab === 'InProgress' && call.status === 'In Progress');

      const filterStatusMatch = statusFilters.length === 0 || statusFilters.includes(call.status);

      return searchTermMatch && tabStatusMatch && filterStatusMatch;
    });
  }, [searchTerm, activeTab, statusFilters]);

  const handleStatusFilterChange = (status: ServiceCall['status'], checked: boolean) => {
    setStatusFilters(prev =>
      checked ? [...prev, status] : prev.filter(s => s !== status)
    );
  };

  const getStatusBadgeVariant = (status: ServiceCall['status']) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'Canceled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-base font-semibold flex items-center gap-2">
        <ServiceDashboardIcon className={`${iconSize} text-primary`} />
        {t('service_calls_dashboard.title', 'Service Calls Overview')}
      </h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3 px-4">
            <CardTitle className="text-xs font-medium">{t('service_calls_dashboard.stats_opened_month', 'Opened This Month')}</CardTitle>
            <Wrench className={statIconSize} />
          </CardHeader>
          <CardContent className="pb-3 px-4">
            <div className="text-lg font-bold">{dashboardStats.openedThisMonth}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3 px-4">
            <CardTitle className="text-xs font-medium">{t('service_calls_dashboard.stats_resolved', 'Resolved Calls')}</CardTitle>
            <CheckCircle className={statIconSize} />
          </CardHeader>
          <CardContent className="pb-3 px-4">
            <div className="text-lg font-bold">{dashboardStats.resolvedCalls}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3 px-4">
            <CardTitle className="text-xs font-medium">{t('service_calls_dashboard.stats_pending', 'Pending Calls')}</CardTitle>
            <Clock className={statIconSize} />
          </CardHeader>
          <CardContent className="pb-3 px-4">
            <div className="text-lg font-bold">{dashboardStats.pendingCalls}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3 px-4">
            <CardTitle className="text-xs font-medium">{t('service_calls_dashboard.stats_avg_resolution', 'Avg. Resolution Time')}</CardTitle>
            <ListChecks className={statIconSize} />
          </CardHeader>
          <CardContent className="pb-3 px-4">
            <div className="text-lg font-bold">{dashboardStats.avgResolutionTime}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
                <div className="relative">
                    <Search className={`absolute left-2.5 top-2.5 ${iconSize} text-muted-foreground`} />
                    <Input
                        type="search"
                        placeholder={t('service_calls_dashboard.search_placeholder', 'Search calls by ID, subscriber, reason...')}
                        className="pl-8 w-full sm:w-[300px] lg:w-[400px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="shrink-0">
                      <FilterIcon className={`mr-2 ${iconSize}`} /> {t('service_calls_dashboard.filter_button', 'Filter Status')}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                     <DropdownMenuLabel>{t('service_calls_dashboard.filter_status_label', 'Filter by Status')}</DropdownMenuLabel>
                     <DropdownMenuSeparator />
                     {(['Pending', 'In Progress', 'Resolved', 'Canceled'] as ServiceCall['status'][]).map(status => (
                         <DropdownMenuCheckboxItem
                            key={status}
                            checked={statusFilters.includes(status)}
                            onCheckedChange={(checked) => handleStatusFilterChange(status, !!checked)}
                         >
                            {t(`service_calls.status_${status.toLowerCase().replace(' ', '_')}` as any, status)}
                         </DropdownMenuCheckboxItem>
                     ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button onClick={handleNewServiceCall} size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                    <PlusCircle className={`mr-2 ${iconSize}`} /> {t('service_calls.new_call_button', 'New Service Call')}
                </Button>
            </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ServiceCallStatusFilter)} className="w-full">
            <TabsList className="grid w-full grid-cols-4 h-auto mb-4">
              <TabsTrigger value="All"><ListChecks className={`mr-1.5 ${tabIconSize}`} />{t('service_calls.status_all_tab', 'All')}</TabsTrigger>
              <TabsTrigger value="Pending"><Clock className={`mr-1.5 ${tabIconSize}`} />{t('service_calls.status_pending', 'Pending')}</TabsTrigger>
              <TabsTrigger value="InProgress"><Wrench className={`mr-1.5 ${tabIconSize}`} />{t('service_calls.status_in_progress', 'In Progress')}</TabsTrigger>
              <TabsTrigger value="Resolved"><CheckCircle className={`mr-1.5 ${tabIconSize}`} />{t('service_calls.status_resolved', 'Resolved')}</TabsTrigger>
            </TabsList>
            {(['All', 'Pending', 'InProgress', 'Resolved'] as ServiceCallStatusFilter[]).map(tabValue => (
              <TabsContent key={tabValue} value={tabValue}>
                {filteredServiceCalls.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">{t('service_calls.table_header_id', 'ID')}</TableHead>
                          <TableHead className="text-xs">{t('service_calls.table_header_subscriber', 'Subscriber')}</TableHead>
                          <TableHead className="text-xs">{t('service_calls.table_header_reason', 'Reason')}</TableHead>
                          <TableHead className="text-xs">{t('service_calls.table_header_status', 'Status')}</TableHead>
                          <TableHead className="text-xs">{t('service_calls.table_header_technician', 'Technician')}</TableHead>
                          <TableHead className="text-xs">{t('service_calls.table_header_scheduled_date', 'Scheduled')}</TableHead>
                          <TableHead className="text-xs">{t('service_calls.table_header_created_at', 'Created')}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredServiceCalls.map((call) => (
                          <TableRow key={call.id}>
                            <TableCell className="font-mono text-muted-foreground text-xs">{call.id}</TableCell>
                            <TableCell className="font-medium text-xs">{call.subscriberName}</TableCell>
                            <TableCell className="text-xs">{call.reason}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={`text-xs ${getStatusBadgeVariant(call.status)} border-transparent`}>
                                {t(`service_calls.status_${call.status.toLowerCase().replace(' ', '_')}` as any, call.status)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs">{call.technician || '-'}</TableCell>
                            <TableCell className="text-xs">{call.scheduledDate}</TableCell>
                            <TableCell className="text-xs">{call.createdAt}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8 text-xs">
                    {t('service_calls.no_calls_found_filtered', 'No service calls found matching your current filters and tab selection.')}
                  </p>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

