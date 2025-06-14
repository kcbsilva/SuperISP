// src/app/admin/settings/plans/internet/page.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { PlusCircle, Wifi } from 'lucide-react'; // Added Wifi icon
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
  const iconSize = "h-3 w-3"; // Maintained icon size for Add button
  const titleIconSize = "h-4 w-4"; // Slightly larger for title icon

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
        return 'secondary'; // Assuming UTP is similar to Radio for now
      default:
        return 'outline';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold flex items-center gap-2"> {/* Added flex items-center gap-2 */}
          <Wifi className={`${titleIconSize} text-primary`} /> {/* Added Wifi icon */}
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
        <CardHeader>
          {/* CardTitle and CardDescription removed as requested */}
        </CardHeader>
        <CardContent className="pt-0"> {/* Adjusted padding since CardHeader is now minimal or empty */}
          {placeholderPlans.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24 text-xs">
                      {t('settings_plans.table_header_id', 'ID')}
                    </TableHead>
                    <TableHead className="text-xs">
                      {t('settings_plans.table_header_name', 'Name')}
                    </TableHead>
                    <TableHead className="text-xs">
                      {t('settings_plans.table_header_upload', 'Upload')}
                    </TableHead>
                    <TableHead className="text-xs">
                      {t('settings_plans.table_header_download', 'Download')}
                    </TableHead>
                    <TableHead className="text-xs">
                      {t('settings_plans.table_header_price', 'Price')}
                    </TableHead>
                    <TableHead className="text-xs">
                      {t(
                        'settings_plans.table_header_connection_type',
                        'Connection Type'
                      )}
                    </TableHead>
                    <TableHead className="text-xs">
                      {t(
                        'settings_plans.table_header_client_count',
                        'Client Count'
                      )}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {placeholderPlans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell className="font-mono text-muted-foreground text-xs">{plan.id}</TableCell>
                      <TableCell className="font-medium text-xs">
                        <Link href={`/admin/settings/plans/internet/${plan.id}`} className="hover:underline text-primary">
                          {plan.name}
                        </Link>
                      </TableCell>
                      <TableCell className="text-xs">{plan.uploadSpeed}</TableCell>
                      <TableCell className="text-xs">{plan.downloadSpeed}</TableCell>
                      <TableCell className="text-xs">{plan.price}</TableCell>
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
