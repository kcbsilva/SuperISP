// src/app/admin/noc/fttx/olts/page.tsx
'use client';

import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
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
import { PlusCircle, Edit, Trash2, RefreshCw, MoreVertical, ListPlus, ListChecks, Network, Users, Filter as FilterIcon, Columns3 } from 'lucide-react'; 
import { useLocale } from '@/contexts/LocaleContext';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; 

interface Olt {
  id: string;
  description: string;
  manufacturer: string;
  model: string;
  technology: 'EPON' | 'GPON' | 'XGS-PON';
  ports: number; // Number of PON ports
  slots: number; // Number of physical card slots
  clients: number; // Total connected ONXs
  ipAddress: string;
  managementPort: number;
}

const placeholderOlts: Olt[] = [
  { id: 'olt-001', description: 'Central Office OLT', manufacturer: 'Huawei', model: 'MA5800-X17', technology: 'GPON', ports: 16, slots: 17, clients: 512, ipAddress: '10.0.1.5', managementPort: 80 },
  { id: 'olt-002', description: 'North Hub OLT', manufacturer: 'Fiberhome', model: 'AN6000-17', technology: 'XGS-PON', ports: 32, slots: 17, clients: 1024, ipAddress: '10.0.2.5', managementPort: 443 },
  { id: 'olt-003', description: 'South Branch OLT', manufacturer: 'ZTE', model: 'C600', technology: 'EPON', ports: 8, slots: 8, clients: 256, ipAddress: '10.0.3.5', managementPort: 8080 },
];

interface Onx {
  id: string;
  serialNumber: string;
  manufacturer: string;
  model: string;
  assignedTo?: string; // Client Name
  lightLevelTx?: string; // e.g., "+2.5 dBm"
  lightLevelRx?: string; // e.g., "-18.5 dBm" or "LOS"
  fdhId?: string; // e.g., "FDH-01-A"
  status: 'Online' | 'Offline' | 'Provisioning';
}

const placeholderOnxs: Onx[] = [
    { id: 'onx-001', serialNumber: 'FHTT1234ABCD', manufacturer: 'Fiberhome', model: 'AN5506-01-A1', assignedTo: 'Alice Wonderland', lightLevelTx: "+2.1 dBm", lightLevelRx: '-17.2 dBm', fdhId: 'FDH-01-A', status: 'Online' },
    { id: 'onx-002', serialNumber: 'HWTC8765EFGH', manufacturer: 'Huawei', model: 'HG8245H', assignedTo: 'Bob The Builder Inc.', lightLevelTx: "+1.8 dBm", lightLevelRx: '-22.5 dBm', fdhId: 'FDH-02-B', status: 'Offline' },
    { id: 'onx-003', serialNumber: 'ZTEXFEDC4321', manufacturer: 'ZTE', model: 'F601', lightLevelTx: "+2.5 dBm", lightLevelRx: '-19.0 dBm', fdhId: 'FDH-01-A', status: 'Offline'},
    { id: 'onx-004', serialNumber: 'FHTT5678IJKL', manufacturer: 'Fiberhome', model: 'AN5506-04-FA', assignedTo: 'Charlie Brown', lightLevelTx: "+2.0 dBm", lightLevelRx: '-25.8 dBm', fdhId: 'FDH-03-C', status: 'Online' },
    { id: 'onx-005', serialNumber: 'NKIA9012UVWX', manufacturer: 'Nokia', model: 'G-140W-C', assignedTo: 'David Copperfield', lightLevelTx: "+3.0 dBm", lightLevelRx: '-16.0 dBm', fdhId: 'FDH-01-B', status: 'Online' },
    { id: 'onx-006', serialNumber: 'UBIQ3456QRST', manufacturer: 'Ubiquiti', model: 'UF-Nano', lightLevelTx: "+1.5 dBm", lightLevelRx: '-29.5 dBm', fdhId: 'FDH-04-A', status: 'Offline' },
    { id: 'onx-007', serialNumber: 'FHTT7890MNOP', manufacturer: 'Fiberhome', model: 'AN5506-02-B', assignedTo: 'Eve Adams', lightLevelTx: "N/A", lightLevelRx: 'LOS', fdhId: 'FDH-03-C', status: 'Offline' }, 
    { id: 'onx-008', serialNumber: 'HWTC1122YZAB', manufacturer: 'Huawei', model: 'EG8145V5', lightLevelTx: "+2.2 dBm", lightLevelRx: '-20.1 dBm', fdhId: 'FDH-02-A', status: 'Online' },
    { id: 'onx-009', serialNumber: 'ZTEX3344CDEF', manufacturer: 'ZTE', model: 'F670L', lightLevelTx: "+1.9 dBm", lightLevelRx: '-27.0 dBm', fdhId: 'FDH-01-C', status: 'Online' },
    { id: 'onx-010', serialNumber: 'NKIA5566GHIJ', manufacturer: 'Nokia', model: 'G-240W-A', lightLevelTx: "+2.8 dBm", lightLevelRx: '-18.8 dBm', fdhId: 'FDH-04-B', status: 'Provisioning' },
];

const lightLevelRanges = [
  '-15dBm - -19dBm',
  '-19dBm - -24dBm',
  '-24dBm - -28dBm',
  '-28dBm - LOS',
];

const MAX_ONX_PER_PON_GPON_XGSPON = 128;
const MAX_ONX_PER_PON_EPON = 64; 

const getMaxCapacityForOlt = (olt: Olt): number => {
  switch (olt.technology) {
    case 'GPON':
    case 'XGS-PON':
      return olt.ports * MAX_ONX_PER_PON_GPON_XGSPON;
    case 'EPON':
      return olt.ports * MAX_ONX_PER_PON_EPON;
    default:
      return olt.ports * MAX_ONX_PER_PON_GPON_XGSPON; 
  }
};


const isLightLevelInRange = (lightLevelRxStr: string | undefined, rangeStr: string): boolean => {
  if (!lightLevelRxStr) return false;

  const numericLevel = parseFloat(lightLevelRxStr.replace(' dBm', ''));
  
  if (rangeStr.includes('LOS')) {
    return lightLevelRxStr === 'LOS' || (!isNaN(numericLevel) && numericLevel <= -28);
  }
  
  if (isNaN(numericLevel)) return false;

  const parts = rangeStr.replace(/dBm/g, '').split(' - ');
  if (parts.length !== 2) return false;

  const min = parseFloat(parts[0]);
  const max = parseFloat(parts[1]);

  if (isNaN(min) || isNaN(max)) return false;
  
  return numericLevel >= min && numericLevel < max; 
};


export default function OltsAndOnxsPage() {
  const { t } = useLocale();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const iconSize = "h-2.5 w-2.5";
  const menuIconSize = "h-2.5 w-2.5";
  const tabIconSize = "h-2.5 w-2.5";
  
  const initialTab = searchParams.get('tab') === 'onxs' ? 'onxs' : 'olts';
  const [activeTab, setActiveTab] = React.useState(initialTab);
  const [lightLevelFilter, setLightLevelFilter] = React.useState<string[]>(
    searchParams.get('lightLevelFilter') ? [decodeURIComponent(searchParams.get('lightLevelFilter')!)] : []
  );

  React.useEffect(() => {
    const filterFromQuery = searchParams.get('lightLevelFilter');
    if (filterFromQuery) {
      setLightLevelFilter([decodeURIComponent(filterFromQuery)]);
    }
  }, [searchParams]);

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

  const handleListOnxsForOlt = (oltId: string, type: 'provisioned' | 'non-provisioned') => {
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
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getOnxStatusBadgeVariant = (status: Onx['status']) => {
    switch (status) {
        case 'Online': return 'bg-green-100 text-green-800';
        case 'Offline': return 'bg-red-100 text-red-800';
        case 'Provisioning': return 'bg-blue-100 text-blue-800';
        default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleOnxAction = (onxId: string, action: string) => {
     toast({
        title: `ONx Action: ${action} (Not Implemented)`,
        description: `Action '${action}' for ONx ${onxId} is not yet available.`,
    });
  }

  const handleLightLevelFilterChange = (range: string, checked: boolean) => {
    setLightLevelFilter(prev => {
      const newFilters = checked ? [...prev, range] : prev.filter(r => r !== range);
      const currentParams = new URLSearchParams(searchParams.toString());
      if (newFilters.length > 0) {
        currentParams.set('lightLevelFilter', encodeURIComponent(newFilters.join(','))); 
      } else {
        currentParams.delete('lightLevelFilter');
      }
      router.replace(`/admin/noc/fttx/olts?tab=onxs&${currentParams.toString()}`, { scroll: false }); 
      return newFilters;
    });
  };
  
  const filteredOnxs = React.useMemo(() => {
    if (lightLevelFilter.length === 0) return placeholderOnxs;
    return placeholderOnxs.filter(onx => 
      lightLevelFilter.some(range => isLightLevelInRange(onx.lightLevelRx, range))
    );
  }, [lightLevelFilter]);


  return (
    <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
            <h1 className="text-base font-semibold">
                {activeTab === 'olts' ? t('fttx_olts.title', 'Optical Line Terminals (OLTs)') : t('fttx_olts.onxs_page_title', 'Optical Network Units/Terminals (ONx)')}
            </h1>
            <div className="flex items-center gap-2">
                <Button variant="default" className="bg-primary hover:bg-primary/90">
                    <RefreshCw className={`mr-2 ${iconSize}`} /> {t('fttx_olts.refresh_button', 'Refresh')}
                </Button>
                {activeTab === "olts" && (
                    <Button onClick={handleAddOlt} className="bg-green-600 hover:bg-green-700 text-white">
                        <PlusCircle className={`mr-2 ${iconSize}`} /> {t('fttx_olts.add_olt_button', 'Add OLT')}
                    </Button>
                )}
                {activeTab === "onxs" && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        <FilterIcon className={`mr-2 ${iconSize}`} />
                        {t('fttx_olts.filter_onx_button', 'Filter ONXs')}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>{t('fttx_olts.filter_by_light_level_label', 'Filter by Light Level')}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {lightLevelRanges.map(range => (
                        <DropdownMenuCheckboxItem
                          key={range}
                          checked={lightLevelFilter.includes(range)}
                          onCheckedChange={(checked) => handleLightLevelFilterChange(range, !!checked)}
                        >
                          {range}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
            </div>
        </div>

        <Tabs defaultValue={initialTab} value={activeTab} onValueChange={(newTab) => {
            setActiveTab(newTab);
            const currentParams = new URLSearchParams(searchParams.toString());
            currentParams.set('tab', newTab);
            if (newTab === 'olts') { 
                currentParams.delete('lightLevelFilter');
                setLightLevelFilter([]);
            }
            router.replace(`/admin/noc/fttx/olts?${currentParams.toString()}`, { scroll: false });
        }}>
            <TabsList className="grid grid-cols-2 w-auto h-auto mb-4">
                <TabsTrigger value="olts" className="flex items-center gap-2">
                    <Network className={tabIconSize} />
                    {t('fttx_olts.tabs_olts_title', 'Optical Line Terminals (OLTs)')}
                </TabsTrigger>
                <TabsTrigger value="onxs" className="flex items-center gap-2">
                    <Users className={tabIconSize} />
                    {t('fttx_olts.tabs_onxs_title', 'Optical Network X (ONU/ONT)')}
                </TabsTrigger>
            </TabsList>

            <TabsContent value="olts">
                <Card>
                    <CardContent className="pt-6">
                        <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead className="text-xs font-semibold w-24">{t('fttx_olts.table_header_id', 'ID')}</TableHead>
                                <TableHead className="text-xs font-semibold">{t('fttx_olts.table_header_description', 'Description')}</TableHead>
                                <TableHead className="text-xs font-semibold">{t('fttx_olts.table_header_manufacturer', 'Manufacturer')}</TableHead>
                                <TableHead className="text-xs font-semibold">{t('fttx_olts.table_header_model', 'Model')}</TableHead>
                                <TableHead className="text-xs font-semibold">{t('fttx_olts.table_header_technology', 'Technology')}</TableHead>
                                <TableHead className="text-xs font-semibold">{t('fttx_olts.table_header_slots', 'Slots')}</TableHead>
                                <TableHead className="text-xs font-semibold">{t('fttx_olts.table_header_ports', 'PON Ports')}</TableHead>
                                <TableHead className="text-xs font-semibold">{t('fttx_olts.table_header_onxs', 'ONXs (Connected / Max)')}</TableHead>
                                <TableHead className="text-xs font-semibold">{t('fttx_olts.table_header_ip_address', 'IP Address')}</TableHead>
                                <TableHead className="w-32 text-xs font-semibold text-right">{t('fttx_olts.table_header_actions', 'Actions')}</TableHead>
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
                                    <TableCell className="text-center text-xs">{olt.slots}</TableCell>
                                    <TableCell className="text-center text-xs">{olt.ports}</TableCell>
                                    <TableCell className="text-center text-xs">{olt.clients} / {getMaxCapacityForOlt(olt)}</TableCell>
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
                                                        <DropdownMenuItem onClick={() => handleListOnxsForOlt(olt.id, 'non-provisioned')}>
                                                            <ListPlus className={`mr-2 ${menuIconSize}`} />
                                                            {t('fttx_olts.list_non_provisioned_onxs', 'List Non-Provisioned ONXs')}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleListOnxsForOlt(olt.id, 'provisioned')}>
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
                                    <TableCell colSpan={10} className="text-center text-muted-foreground py-8 text-xs">
                                    {t('fttx_olts.no_olts_found', 'No OLTs registered yet. Click "Add OLT" to create one.')}
                                    </TableCell>
                                </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="onxs">
                <Card>
                    <CardContent className="pt-6">
                         <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-xs font-semibold">{t('fttx_olts.onx_table_serial', 'Serial Number')}</TableHead>
                                        <TableHead className="text-xs font-semibold">{t('fttx_olts.onx_table_manufacturer', 'Manufacturer')}</TableHead>
                                        <TableHead className="text-xs font-semibold">{t('fttx_olts.onx_table_model', 'Model')}</TableHead>
                                        <TableHead className="text-xs font-semibold">{t('fttx_olts.onx_table_assigned_to', 'Assigned To')}</TableHead>
                                        <TableHead className="text-xs font-semibold">{t('fttx_olts.onx_table_fdh_id', 'FDH ID')}</TableHead>
                                        <TableHead className="text-xs font-semibold">{t('fttx_olts.onx_table_light_level_tx_rx', 'Light Level (TX/RX)')}</TableHead>
                                        <TableHead className="text-xs font-semibold">{t('fttx_olts.onx_table_status', 'Status')}</TableHead>
                                        <TableHead className="w-20 text-xs font-semibold text-right">{t('fttx_olts.onx_table_actions', 'Actions')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredOnxs.length > 0 ? (
                                        filteredOnxs.map((onx) => (
                                            <TableRow key={onx.id}>
                                                <TableCell className="font-mono text-muted-foreground text-xs">{onx.serialNumber}</TableCell>
                                                <TableCell className="text-muted-foreground text-xs">{onx.manufacturer}</TableCell>
                                                <TableCell className="text-muted-foreground text-xs">{onx.model}</TableCell>
                                                <TableCell className="font-medium text-xs">{onx.assignedTo || '-'}</TableCell>
                                                <TableCell className="text-xs text-muted-foreground">{onx.fdhId || '-'}</TableCell>
                                                <TableCell className="text-xs">
                                                    {onx.lightLevelTx || '-'} / {onx.lightLevelRx || '-'}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={`text-xs ${getOnxStatusBadgeVariant(onx.status)} border-transparent`}>
                                                        {t(`fttx_olts.onx_status_${onx.status.toLowerCase()}` as any, onx.status)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-7 w-7">
                                                                <MoreVertical className={iconSize} />
                                                                <span className="sr-only">{t('fttx_olts.onx_actions_menu', 'ONx Actions')}</span>
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => handleOnxAction(onx.id, 'view_details')}>
                                                                {t('fttx_olts.onx_action_view_details', 'View Details')}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleOnxAction(onx.id, 'unprovision')} className="text-destructive">
                                                                {t('fttx_olts.onx_action_unprovision', 'Unprovision')}
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center text-muted-foreground py-8 text-xs">
                                                {t('fttx_olts.no_onxs_found', 'No ONx devices found.')}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                         </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    </div>
  );
}

