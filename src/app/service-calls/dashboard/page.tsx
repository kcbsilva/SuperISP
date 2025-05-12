// src/app/service-calls/dashboard/page.tsx
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocale } from '@/contexts/LocaleContext';
import { LayoutDashboard as ServiceDashboardIcon } from 'lucide-react';

export default function ServiceCallsDashboardPage() {
  const { t } = useLocale();
  const iconSize = "h-4 w-4";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold flex items-center gap-2">
            <ServiceDashboardIcon className={`${iconSize} text-primary`} />
            {t('service_calls_dashboard.title', 'Service Calls Overview')}
        </h1>
        {/* Add any dashboard-specific actions here, e.g., date range filter */}
      </div>

      <Card>
        <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-sm">{t('service_calls_dashboard.placeholder', 'Dashboard content for service calls will be displayed here.')}</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-center text-muted-foreground py-8 text-xs">
              {t('service_calls_dashboard.placeholder', 'Dashboard content for service calls will be displayed here.')}
            </p>
            {/* Placeholder for charts and stats related to service calls */}
        </CardContent>
      </Card>
    </div>
  );
}
