// src/components/dashboard/widgets/AlertsTimeline.tsx
'use client';

import * as React from 'react';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const mockAlerts = [
  {
    id: 'a1',
    type: 'outage',
    message: 'NAS Server X-12 is unreachable.',
    timestamp: '5 min ago',
    level: 'critical' as const,
  },
  {
    id: 'a2',
    type: 'ticket',
    message: 'Urgent ticket #1099 escalated.',
    timestamp: '20 min ago',
    level: 'warning' as const,
  },
  {
    id: 'a3',
    type: 'info',
    message: 'Scheduled maintenance completed.',
    timestamp: '1 hour ago',
    level: 'info' as const,
  },
];

const levelStyles = {
  critical: 'text-red-500',
  warning: 'text-yellow-500',
  info: 'text-muted-foreground',
};

const icons = {
  critical: AlertTriangle,
  warning: Clock,
  info: CheckCircle,
};

export default function AlertsTimeline() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Alerts & Incidents</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockAlerts.map((alert) => {
          const Icon = icons[alert.level];
          return (
            <div key={alert.id} className="flex items-start gap-3">
              <Icon className={`h-4 w-4 mt-1 ${levelStyles[alert.level]}`} />
              <div className="flex flex-col text-sm">
                <span className="font-medium leading-tight">{alert.message}</span>
                <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
