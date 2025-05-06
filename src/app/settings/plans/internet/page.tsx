// src/app/settings/plans/internet/page.tsx
'use client';

import * as React from 'react';
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
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { Badge } from '@/components/ui/badge'; // For connection type if needed

// Placeholder type for an internet plan
interface InternetPlan {
  id: string;
  name: string;
  uploadSpeed: string;
  downloadSpeed: string;
  price: string;
  connectionType: 'Fiber' | 'Radio' | 'Satellite' | 'UTP';
  clientCount: number;
}

// Placeholder data - replace with actual data fetching
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

  const handleAddPlan = () => {
    // TODO: Implement modal or navigation to add plan form
    console.log('Add new internet plan clicked');
  };

  const handleEditPlan = (planId: string) => {
    // TODO: Implement editing logic
    console.log('Edit plan:', planId);
  };

  const handleRemovePlan = (planId: string) => {
    // TODO: Implement removal logic with confirmation
    console.log('Remove plan:', planId);
  };

  const getConnectionTypeBadgeVariant = (type: InternetPlan['connectionType']) => {
    switch (type) {
      case 'Fiber':
        return 'default'; // Or a specific color for fiber
      case 'Radio':
        return 'secondary';
      case 'Satellite':
        return 'outline'; // Or a more distinct color
      case 'UTP':
        return 'secondary'; // Could be 'destructive' if it implies older tech, or just secondary
      default:
        return 'outline';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">
          {t('settings_plans.internet_page_title', 'Internet Plans')}
        </h1>
        <Button
          onClick={handleAddPlan}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          {t('settings_plans.add_plan_button', 'Add Internet Plan')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {t(
              'settings_plans.existing_plans_title',
              'Existing Internet Plans'
            )}
          </CardTitle>
          <CardDescription>
            {t(
              'settings_plans.existing_plans_description_internet',
              'Manage your internet service plans.'
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {placeholderPlans.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      {t('settings_plans.table_header_name', 'Name')}
                    </TableHead>
                    <TableHead>
                      {t('settings_plans.table_header_upload', 'Upload')}
                    </TableHead>
                    <TableHead>
                      {t('settings_plans.table_header_download', 'Download')}
                    </TableHead>
                    <TableHead>
                      {t('settings_plans.table_header_price', 'Price')}
                    </TableHead>
                    <TableHead>
                      {t(
                        'settings_plans.table_header_connection_type',
                        'Connection Type'
                      )}
                    </TableHead>
                    <TableHead className="text-right">
                      {t(
                        'settings_plans.table_header_client_count',
                        'Client Count'
                      )}
                    </TableHead>
                    <TableHead className="text-right">
                      {t('settings_plans.table_header_actions', 'Actions')}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {placeholderPlans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell className="font-medium">{plan.name}</TableCell>
                      <TableCell>{plan.uploadSpeed}</TableCell>
                      <TableCell>{plan.downloadSpeed}</TableCell>
                      <TableCell>{plan.price}</TableCell>
                      <TableCell>
                        <Badge variant={getConnectionTypeBadgeVariant(plan.connectionType)}>
                          {t(`settings_plans.connection_type_${plan.connectionType.toLowerCase()}` as any, plan.connectionType)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {plan.clientCount}
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEditPlan(plan.id)}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">{t('settings_plans.edit_action', 'Edit')}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleRemovePlan(plan.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">{t('settings_plans.remove_action', 'Remove')}</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              {t(
                'settings_plans.no_plans_found_internet',
                'No internet plans configured yet. Click "Add Internet Plan" to create one.'
              )}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
