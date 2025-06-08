// src/app/admin/messenger/flow/page.tsx
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
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Workflow, Edit, Trash2 } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { useToast } from '@/hooks/use-toast';

interface MessengerFlowItem {
  id: string;
  description: string;
  status: 'Active' | 'Inactive' | 'Draft';
  channel: 'WhatsApp' | 'Telegram' | 'Facebook' | 'Web';
  createdAt: Date;
}

const placeholderFlows: MessengerFlowItem[] = [
  { id: 'flow-1', description: 'Welcome flow for new WhatsApp users', status: 'Active', channel: 'WhatsApp', createdAt: new Date() },
  { id: 'flow-2', description: 'Technical support triage for Telegram', status: 'Draft', channel: 'Telegram', createdAt: new Date() },
  { id: 'flow-3', description: 'Billing inquiry automation for Web Chat', status: 'Inactive', channel: 'Web', createdAt: new Date() },
];

export default function MessengerFlowListPage() {
  const { t } = useLocale();
  const { toast } = useToast();
  const iconSize = "h-3 w-3";

  const handleAddNewFlow = () => {
    toast({
      title: t('messenger_flow.add_new_flow_toast_title', 'Add New Flow (Not Implemented)'),
      description: t('messenger_flow.add_new_flow_toast_desc', 'Functionality to add a new flow is not yet implemented.'),
    });
  };

  const getStatusBadgeVariant = (status: MessengerFlowItem['status']) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-red-100 text-red-800';
      case 'Draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="flex flex-col gap-6 p-2 md:p-4 h-full">
      <div className="flex justify-between items-center shrink-0">
        <h1 className="text-base font-semibold flex items-center gap-2">
          <Workflow className="h-4 w-4 text-primary" />
          {t('sidebar.messenger_flow', 'Messenger Flows')}
        </h1>
        <Button onClick={handleAddNewFlow} className="bg-green-600 hover:bg-green-700 text-white">
          <PlusCircle className={`mr-2 ${iconSize}`} />
          {t('messenger_flow.add_new_flow_button', 'Add New Flow')}
        </Button>
      </div>

      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="text-sm">{t('messenger_flow.list_title', 'Configured Flows')}</CardTitle>
          <CardDescription className="text-xs">{t('messenger_flow.list_description', 'Manage your automated messenger flows and their statuses.')}</CardDescription>
        </CardHeader>
        <CardContent>
          {placeholderFlows.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">{t('messenger_flow.table_header_description', 'Description')}</TableHead>
                    <TableHead className="text-xs text-center">{t('messenger_flow.table_header_status', 'Status')}</TableHead>
                    <TableHead className="text-xs text-center">{t('messenger_flow.table_header_channel', 'Channel')}</TableHead>
                    <TableHead className="text-xs text-center">{t('messenger_flow.table_header_created_at', 'Created At')}</TableHead>
                    <TableHead className="text-xs text-right">{t('messenger_flow.table_header_actions', 'Actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {placeholderFlows.map((flow) => (
                    <TableRow key={flow.id}>
                      <TableCell className="font-medium text-xs">{flow.description}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={`text-xs ${getStatusBadgeVariant(flow.status)} border-transparent`}>
                          {t(`messenger_flow.status_${flow.status.toLowerCase()}` as any, flow.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-center">{flow.channel}</TableCell>
                      <TableCell className="text-xs text-center">{flow.createdAt.toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toast({title: 'Edit Flow (NI)', description: `Editing ${flow.description}`})}>
                          <Edit className={iconSize} />
                          <span className="sr-only">{t('messenger_flow.action_edit', 'Edit')}</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => toast({title: 'Delete Flow (NI)', description: `Deleting ${flow.description}`, variant: 'destructive'})}>
                          <Trash2 className={iconSize} />
                          <span className="sr-only">{t('messenger_flow.action_delete', 'Delete')}</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8 text-xs">
              {t('messenger_flow.no_flows_found', 'No flows configured yet.')}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
