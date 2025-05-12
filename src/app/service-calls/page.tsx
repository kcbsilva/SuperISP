// src/app/service-calls/page.tsx
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from '@/components/ui/badge';
import { PlusCircle, RefreshCw, Edit, Trash2, Eye } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { enUS, fr, ptBR } from 'date-fns/locale';
import type { Locale as AppLocale } from '@/contexts/LocaleContext';

interface ServiceCall {
  id: string;
  subscriberName: string;
  subscriberId: string;
  reason: string;
  status: 'Pending' | 'In Progress' | 'Resolved' | 'Canceled';
  technician?: string;
  scheduledDate: Date;
  createdAt: Date;
}

const dateLocales: Record<AppLocale, typeof enUS> = {
    en: enUS,
    fr: fr,
    pt: ptBR,
};

const placeholderServiceCalls: ServiceCall[] = [
  { id: 'sc-001', subscriberName: 'Alice Wonderland', subscriberId: 'sub-1', reason: 'No internet connection', status: 'Pending', technician: 'John Doe', scheduledDate: new Date(2024, 7, 15, 10, 0), createdAt: new Date(2024, 7, 14) },
  { id: 'sc-002', subscriberName: 'Bob The Builder Inc.', subscriberId: 'sub-2', reason: 'Slow fiber speeds', status: 'In Progress', technician: 'Jane Smith', scheduledDate: new Date(2024, 7, 16, 14, 0), createdAt: new Date(2024, 7, 14) },
  { id: 'sc-003', subscriberName: 'Charlie Brown', subscriberId: 'sub-3', reason: 'TV signal issues', status: 'Resolved', technician: 'John Doe', scheduledDate: new Date(2024, 7, 10), createdAt: new Date(2024, 7, 9) },
  { id: 'sc-004', subscriberName: 'Diana Prince', subscriberId: 'sub-4', reason: 'Request new installation', status: 'Canceled', scheduledDate: new Date(2024, 7, 20), createdAt: new Date(2024, 7, 18) },
];

export default function ServiceCallsPage() {
  const { t, locale } = useLocale();
  const { toast } = useToast();
  const iconSize = "h-3 w-3";

  const handleNewServiceCall = () => {
    toast({
      title: t('service_calls.new_call_not_implemented_title', 'New Service Call (Not Implemented)'),
      description: t('service_calls.new_call_not_implemented_desc', 'Functionality to create a new service call is not yet available.'),
    });
  };

  const handleViewServiceCall = (callId: string) => {
    toast({
      title: t('service_calls.view_call_not_implemented_title', 'View Service Call (Not Implemented)'),
      description: t('service_calls.view_call_not_implemented_desc', 'Viewing details for service call {id} is not yet available.').replace('{id}', callId),
    });
  };

  const handleEditServiceCall = (callId: string) => {
     toast({
      title: t('service_calls.edit_call_not_implemented_title', 'Edit Service Call (Not Implemented)'),
      description: t('service_calls.edit_call_not_implemented_desc', 'Editing service call {id} is not yet available.').replace('{id}', callId),
    });
  };

  const handleDeleteServiceCall = (callId: string) => {
    toast({
      title: t('service_calls.delete_call_not_implemented_title', 'Delete Service Call (Not Implemented)'),
      description: t('service_calls.delete_call_not_implemented_desc', 'Deleting service call {id} is not yet available.').replace('{id}', callId),
      variant: 'destructive',
    });
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
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold">{t('sidebar.service_calls', 'Service Calls')}</h1>
        <div className="flex items-center gap-2">
          <Button variant="default" className="bg-primary hover:bg-primary/90">
            <RefreshCw className={`mr-2 ${iconSize}`} /> {t('service_calls.refresh_button', 'Refresh')}
          </Button>
          <Button onClick={handleNewServiceCall} className="bg-green-600 hover:bg-green-700 text-white">
            <PlusCircle className={`mr-2 ${iconSize}`} /> {t('service_calls.new_call_button', 'New Service Call')}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{t('service_calls.list_title', 'All Service Calls')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs text-center font-semibold">{t('service_calls.table_header_id', 'ID')}</TableHead>
                  <TableHead className="text-xs text-center font-semibold">{t('service_calls.table_header_subscriber', 'Subscriber')}</TableHead>
                  <TableHead className="text-xs text-center font-semibold">{t('service_calls.table_header_reason', 'Reason')}</TableHead>
                  <TableHead className="text-xs text-center font-semibold">{t('service_calls.table_header_status', 'Status')}</TableHead>
                  <TableHead className="text-xs text-center font-semibold">{t('service_calls.table_header_technician', 'Technician')}</TableHead>
                  <TableHead className="text-xs text-center font-semibold">{t('service_calls.table_header_scheduled_date', 'Scheduled Date')}</TableHead>
                  <TableHead className="text-xs text-center font-semibold">{t('service_calls.table_header_created_at', 'Created At')}</TableHead>
                  <TableHead className="text-xs text-center font-semibold w-28">{t('service_calls.table_header_actions', 'Actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {placeholderServiceCalls.length > 0 ? (
                  placeholderServiceCalls.map((call) => (
                    <TableRow key={call.id}>
                      <TableCell className="font-mono text-muted-foreground text-xs text-center">{call.id}</TableCell>
                      <TableCell className="text-xs text-center">
                        <Button variant="link" size="sm" className="p-0 h-auto text-xs" onClick={() => router.push(`/subscribers/profile/${call.subscriberId}`)}>
                            {call.subscriberName}
                        </Button>
                      </TableCell>
                      <TableCell className="text-xs text-center">{call.reason}</TableCell>
                      <TableCell className="text-xs text-center">
                        <Badge variant="outline" className={`text-xs ${getStatusBadgeVariant(call.status)} border-transparent`}>
                          {t(`service_calls.status_${call.status.toLowerCase().replace(/\s+/g, '_')}` as any, call.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-center">{call.technician || '-'}</TableCell>
                      <TableCell className="text-xs text-center">{format(call.scheduledDate, 'PPpp', { locale: dateLocales[locale] || enUS })}</TableCell>
                      <TableCell className="text-xs text-center">{format(call.createdAt, 'PP', { locale: dateLocales[locale] || enUS })}</TableCell>
                      <TableCell className="text-center">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleViewServiceCall(call.id)}>
                          <Eye className={iconSize} />
                          <span className="sr-only">{t('service_calls.action_view', 'View')}</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditServiceCall(call.id)}>
                          <Edit className={iconSize} />
                          <span className="sr-only">{t('service_calls.action_edit', 'Edit')}</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDeleteServiceCall(call.id)}>
                          <Trash2 className={iconSize} />
                          <span className="sr-only">{t('service_calls.action_delete', 'Delete')}</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8 text-xs">
                      {t('service_calls.no_calls_found', 'No service calls found.')}
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
