// src/app/admin/sales/leads/page.tsx
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
import { Input } from '@/components/ui/input';
import { Users, PlusCircle, Edit, Trash2, Search } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { useToast } from '@/hooks/use-toast';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
}

const placeholderLeads: Lead[] = [
  { id: 'lead-001', name: 'John Doe', email: 'john@example.com', phone: '555-1234', status: 'New' },
  { id: 'lead-002', name: 'Jane Smith', email: 'jane@example.com', phone: '555-5678', status: 'Contacted' },
];

export default function SalesLeadsPage() {
  const { t } = useLocale();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = React.useState('');
  const iconSize = 'h-3 w-3';

  const handleAddLead = () => {
    toast({
      title: t('sales_leads.add_lead_toast_title', 'Add Lead (Not Implemented)'),
      description: t('sales_leads.add_lead_toast_desc', 'Adding leads is not yet implemented.'),
    });
  };

  const handleEditLead = (leadId: string) => {
    toast({
      title: t('sales_leads.edit_lead_toast_title', 'Edit Lead (Not Implemented)'),
      description: t('sales_leads.edit_lead_toast_desc', 'Editing lead {id} is not yet implemented.').replace('{id}', leadId),
    });
  };

  const handleDeleteLead = (leadId: string) => {
    toast({
      title: t('sales_leads.delete_lead_toast_title', 'Delete Lead (Not Implemented)'),
      description: t('sales_leads.delete_lead_toast_desc', 'Deleting lead {id} is not yet implemented.').replace('{id}', leadId),
    });
  };

  const filteredLeads = React.useMemo(() => {
    return placeholderLeads.filter(l =>
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-base font-semibold flex items-center gap-2">
          <Users className={`${iconSize} text-primary`} />
          {t('sidebar.sales_leads', 'Leads')}
        </h1>
        <div className="flex flex-1 flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 w-full sm:w-auto">
            <Search className={`absolute left-2.5 top-2.5 ${iconSize} text-muted-foreground`} />
            <Input
              type="search"
              placeholder={t('sales_leads.search_placeholder', 'Search leads...')}
              className="pl-8 w-full sm:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="default" className="bg-primary hover:bg-primary/90 w-full sm:w-auto" onClick={handleAddLead}>
            <PlusCircle className={`mr-2 ${iconSize}`} /> {t('sales_leads.add_lead_button', 'Add Lead')}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{t('sales_leads.title', 'Leads')}</CardTitle>
          <CardDescription className="text-xs">{t('sales_leads.description', 'Manage potential customers and track their status.')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs text-center">{t('sales_leads.table_header_id', 'ID')}</TableHead>
                  <TableHead className="text-xs">{t('sales_leads.table_header_name', 'Name')}</TableHead>
                  <TableHead className="text-xs">{t('sales_leads.table_header_email', 'Email')}</TableHead>
                  <TableHead className="text-xs">{t('sales_leads.table_header_phone', 'Phone')}</TableHead>
                  <TableHead className="text-xs">{t('sales_leads.table_header_status', 'Status')}</TableHead>
                  <TableHead className="text-xs text-center w-32">{t('sales_leads.table_header_actions', 'Actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.length > 0 ? (
                  filteredLeads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="font-mono text-muted-foreground text-xs text-center">{lead.id}</TableCell>
                      <TableCell className="font-medium text-xs">{lead.name}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">{lead.email}</TableCell>
                      <TableCell className="text-xs">{lead.phone}</TableCell>
                      <TableCell className="text-xs">{lead.status}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditLead(lead.id)} title={t('sales_leads.action_edit')}>
                            <Edit className={iconSize} />
                            <span className="sr-only">{t('sales_leads.action_edit')}</span>
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDeleteLead(lead.id)} title={t('sales_leads.action_delete')}>
                            <Trash2 className={iconSize} />
                            <span className="sr-only">{t('sales_leads.action_delete')}</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-4 text-xs">
                      {t('sales_leads.no_leads_found', 'No leads found. Click "Add Lead" to create one.')}
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