// src/app/fttx/olts/page.tsx
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  // CardDescription, // Removed
  // CardHeader, // Removed
  // CardTitle, // Removed
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
import { PlusCircle, Edit, Trash2, RefreshCw, MoreVertical, ListPlus, ListChecks } from 'lucide-react'; // Added MoreVertical, ListPlus, ListChecks
import { useLocale } from '@/contexts/LocaleContext';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Olt {
  id: string;
  description: string;
  manufacturer: string;
  model: string;
  technology: 'EPON' | 'GPON' | 'XGS-PON';
  ports: number;
  clients: number;
  ipAddress: string;
  managementPort: number; // Added management port
}

const placeholderOlts: Olt[] = [
  { id: 'olt-001', description: 'Central Office OLT', manufacturer: 'Huawei', model: 'MA5800-X17', technology: 'GPON', ports: 16, clients: 512, ipAddress: '10.0.1.5', managementPort: 80 },
  { id: 'olt-002', description: 'North Hub OLT', manufacturer: 'Fiberhome', model: 'AN6000-17', technology: 'XGS-PON', ports: 32, clients: 1024, ipAddress: '10.0.2.5', managementPort: 443 },
  { id: 'olt-003', description: 'South Branch OLT', manufacturer: 'ZTE', model: 'C600', technology: 'EPON', ports: 8, clients: 256, ipAddress: '10.0.3.5', managementPort: 8080 },
];

export default function OltsPage() {
  const { t } = useLocale();
  const { toast } = useToast();
  const iconSize = "h-3 w-3";
  const menuIconSize = "h-2.5 w-2.5"; // For icons inside dropdown menus

  const handleAddOlt = () => {
    toast({
      title: t('fttx_olts.add_olt_not_implemented_title', 'Add OLT (Not Implemented)'),
      description: t('fttx_olts.add_olt_not_implemented_desc_port', 'The functionality to add new OLTs (including management port) is not yet available.'),
    });
  };

  const handleEditOlt = (oltId: string) => {
    toast({
      title: t('fttx_olts.edit_olt_not_implemented_title', 'Edit OLT (Not Implemented)'),
      description: t('fttx_olts.edit_olt_not_implemented_desc', 'Editing OLT {id} is not yet available.').replace('{id}', oltId),
    });
  };

  const handleDeleteOlt = (oltId: string) => {
    toast({
      title: t('fttx_olts.delete_olt_not_implemented_title', 'Delete OLT (Not Implemented)'),
      description: t('fttx_olts.delete_olt_not_implemented_desc', 'Deleting OLT {id} is not yet available.').replace('{id}', oltId),
      variant: 'destructive',
    });
  };

  const handleListOnxs = (oltId: string, type: 'provisioned' | 'non-provisioned') => {
    toast({
        title: t(`fttx_olts.list_onxs_title_${type}`, `List ${type} ONXs (Not Implemented)`),
        description: t(`fttx_olts.list_onxs_desc_${type}`, `Listing ${type} ONXs for OLT {id} is not yet available.`).replace('{id}', oltId),
    });
  }

  const getTechnologyBadgeVariant = (technology: Olt['technology']) => {
    switch (technology) {
      case 'GPON':
        return 'bg-green-100 text-green-800';
      case 'EPON':
        return 'bg-blue-100 text-blue-800';
      case 'XGS-PON':
        return 'bg-purple-100 text-purple-800'; // Using purple as an example for XGS-PON
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };


  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold">{t('fttx_olts.title', 'Optical Line Terminals (OLTs)')}</h1>
        <div className="flex items-center gap-2">
            <Button variant="default" className="bg-primary hover:bg-primary/90">
                <RefreshCw className={`mr-2 ${iconSize}`} /> {t('fttx_olts.refresh_button', 'Refresh')}
            </Button>
            <Button onClick={handleAddOlt} className="bg-green-600 hover:bg-green-700 text-white">
                <PlusCircle className={`mr-2 ${iconSize}`} /> {t('fttx_olts.add_olt_button', 'Add OLT')}
            </Button>
        </div>
      </div>

      <Card>
        {/* CardHeader and CardDescription removed */}
        <CardContent className="pt-6"> {/* Added pt-6 for spacing after removing CardHeader */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs w-24">{t('fttx_olts.table_header_id', 'ID')}</TableHead>
                  <TableHead className="text-xs">{t('fttx_olts.table_header_description', 'Description')}</TableHead>
                  <TableHead className="text-xs">{t('fttx_olts.table_header_manufacturer', 'Manufacturer')}</TableHead>
                  <TableHead className="text-xs">{t('fttx_olts.table_header_model', 'Model')}</TableHead>
                  <TableHead className="text-xs">{t('fttx_olts.table_header_technology', 'Technology')}</TableHead>
                  <TableHead className="text-xs text-center">{t('fttx_olts.table_header_ports', 'Ports')}</TableHead>
                  <TableHead className="text-xs text-center">{t('fttx_olts.table_header_clients', 'Clients')}</TableHead>
                  <TableHead className="text-xs">{t('fttx_olts.table_header_ip_address', 'IP Address')}</TableHead>
                  <TableHead className="text-right w-32 text-xs">{t('fttx_olts.table_header_actions', 'Actions')}</TableHead> {/* Adjusted width for actions */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {placeholderOlts.length > 0 ? (
                  placeholderOlts.map((olt) => (
                    <TableRow key={olt.id}>
                      <TableCell className="font-mono text-muted-foreground text-xs">{olt.id}</TableCell>
                      <TableCell className="font-medium text-xs">{olt.description}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">{olt.manufacturer}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">{olt.model}</TableCell>
                      <TableCell className="text-xs">
                         <Badge variant="outline" className={`text-xs ${getTechnologyBadgeVariant(olt.technology)} border-transparent`}>
                            {olt.technology}
                         </Badge>
                      </TableCell>
                      <TableCell className="text-center text-xs">{olt.ports}</TableCell>
                      <TableCell className="text-center text-xs">{olt.clients}</TableCell>
                      <TableCell className="font-mono text-muted-foreground text-xs">
                        <a
                            href={`http://${olt.ipAddress}:${olt.managementPort}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline text-primary"
                         >
                            {olt.ipAddress}
                        </a>
                      </TableCell>
                      <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-1">
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditOlt(olt.id)}>
                                    <Edit className={iconSize} />
                                    <span className="sr-only">{t('fttx_olts.action_edit', 'Edit')}</span>
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDeleteOlt(olt.id)}>
                                    <Trash2 className={iconSize} />
                                    <span className="sr-only">{t('fttx_olts.action_delete', 'Delete')}</span>
                                </Button>
                                 <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-7 w-7">
                                            <MoreVertical className={iconSize} />
                                            <span className="sr-only">{t('fttx_olts.olt_actions_menu', 'OLT Actions')}</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleListOnxs(olt.id, 'non-provisioned')}>
                                            <ListPlus className={`mr-2 ${menuIconSize}`} />
                                            {t('fttx_olts.list_non_provisioned_onxs', 'List Non-Provisioned ONXs')}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleListOnxs(olt.id, 'provisioned')}>
                                            <ListChecks className={`mr-2 ${menuIconSize}`} />
                                            {t('fttx_olts.list_provisioned_onxs', 'List Provisioned ONXs')}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground py-8 text-xs">
                      {t('fttx_olts.no_olts_found', 'No OLTs registered yet. Click "Add OLT" to create one.')}
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

