// src/app/admin/settings/plans/internet/page.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  // CardHeader removed
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PlusCircle, Wifi, ArrowUp, ArrowDown, DollarSign, Hash, Users, ListChecks } from 'lucide-react'; // Added Wifi icon & column icons
import { useLocale } from '@/contexts/LocaleContext';
import { Badge } from '@/components/ui/badge';

interface InternetPlan {
  id: string;
  name: string;
  uploadSpeed: string;
  downloadSpeed: string;
  price: string;
  connectionType: 'Fiber' | 'Radio' | 'Satellite' | 'UTP';
  clientCount: number;
}

const placeholderPlans: InternetPlan[] = [
  {
    id: 'plan-1',
    name: 'Basic Fiber 50',
    uploadSpeed: '50 Mbps',
    downloadSpeed: '50 Mbps',
    price: '$39.99/mo',
    connectionType: 'Fiber',
    clientCount: 120,
  },
  {
    id: 'plan-2',
    name: 'Pro Radio 100',
    uploadSpeed: '25 Mbps',
    downloadSpeed: '100 Mbps',
    price: '$59.99/mo',
    connectionType: 'Radio',
    clientCount: 75,
  },
  {
    id: 'plan-3',
    name: 'Ultimate Fiber 1G',
    uploadSpeed: '1 Gbps',
    downloadSpeed: '1 Gbps',
    price: '$99.99/mo',
    connectionType: 'Fiber',
    clientCount: 250,
  },
];

export default function InternetPlansPage() {
  const { t } = useLocale();
  const iconSize = "h-3 w-3"; 
  const titleIconSize = "h-4 w-4";
  const columnHeaderIconSize = "h-2.5 w-2.5"; // For column headers

  const handleAddPlan = () => {
    console.log('Add new internet plan clicked');
    // Future: Open a modal or navigate to an add plan page
  };

  const getConnectionTypeBadgeVariant = (type: InternetPlan['connectionType']) => {
    switch (type) {
      case 'Fiber':
        return 'default';
      case 'Radio':
        return 'secondary';
      case 'Satellite':
        return 'outline';
      case 'UTP':
        return 'secondary'; 
      default:
        return 'outline';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold flex items-center gap-2"> 
          <Wifi className={`${titleIconSize} text-primary`} /> 
          {t('settings_plans.internet_page_title', 'Internet Plans')}
        </h1>
        <Button
          onClick={handleAddPlan}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <PlusCircle className={`mr-2 ${iconSize}`} />
          {t('settings_plans.add_plan_button', 'Add Internet Plan')}
        </Button>
      </div>

      <Card>
        {/* CardHeader removed to bring table closer to top */}
        <CardContent className="pt-6"> {/* Use pt-6 if CardHeader is fully removed, or pt-0 if CardHeader was empty */}
          {placeholderPlans.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24 text-xs text-center font-semibold">
                      <div className="flex items-center justify-center gap-1">
                        <Hash className={columnHeaderIconSize} />
                        {t('settings_plans.table_header_id', 'ID')}
                      </div>
                    </TableHead>
                    <TableHead className="text-xs font-semibold">
                      {/* No icon requested for Name, but could add ListChecks or similar */}
                      {t('settings_plans.table_header_name', 'Name')}
                    </TableHead>
                    <TableHead className="text-xs text-center font-semibold">
                      <div className="flex items-center justify-center gap-1">
                        <ArrowUp className={columnHeaderIconSize} />
                        {t('settings_plans.table_header_upload', 'Upload')}
                      </div>
                    </TableHead>
                    <TableHead className="text-xs text-center font-semibold">
                       <div className="flex items-center justify-center gap-1">
                        <ArrowDown className={columnHeaderIconSize} />
                        {t('settings_plans.table_header_download', 'Download')}
                       </div>
                    </TableHead>
                    <TableHead className="text-xs text-center font-semibold">
                      <div className="flex items-center justify-center gap-1">
                        <DollarSign className={columnHeaderIconSize} />
                        {t('settings_plans.table_header_price', 'Price')}
                      </div>
                    </TableHead>
                    <TableHead className="text-xs text-center font-semibold">
                      {/* No specific icon requested, could use Wifi or Network */}
                      {t(
                        'settings_plans.table_header_connection_type',
                        'Connection Type'
                      )}
                    </TableHead>
                    <TableHead className="text-xs text-center font-semibold">
                       <div className="flex items-center justify-center gap-1">
                        <Users className={columnHeaderIconSize} />
                        {t(
                          'settings_plans.table_header_client_count',
                          'Client Count'
                        )}
                       </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {placeholderPlans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell className="font-mono text-muted-foreground text-xs text-center">{plan.id}</TableCell>
                      <TableCell className="font-medium text-xs">
                        <Link href={`/admin/settings/plans/internet/${plan.id}`} className="hover:underline text-primary">
                          {plan.name}
                        </Link>
                      </TableCell>
                      <TableCell className="text-xs text-center">{plan.uploadSpeed}</TableCell>
                      <TableCell className="text-xs text-center">{plan.downloadSpeed}</TableCell>
                      <TableCell className="text-xs text-center">{plan.price}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={getConnectionTypeBadgeVariant(plan.connectionType)} className="text-xs">
                          {t(`settings_plans.connection_type_${plan.connectionType.toLowerCase()}` as any, plan.connectionType)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center text-xs">
                        {plan.clientCount}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4 text-xs">
              {t(
                'settings_plans.no_plans_found_internet',
                'No internet plans configured yet. Click "Add Internet Plan" to create one."'
              )}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
