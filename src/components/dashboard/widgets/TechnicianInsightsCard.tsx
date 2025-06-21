// src/components/dashboard/widgets/TechnicianInsightsCard.tsx
'use client';

import * as React from 'react';
import { UserCheck, Timer, Wrench } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const insights = [
  {
    icon: <UserCheck className="w-4 h-4 text-primary" />,
    label: 'Assigned Tickets',
    value: 17,
  },
  {
    icon: <Timer className="w-4 h-4 text-primary" />,
    label: 'Avg. Response Time',
    value: '42 min',
  },
  {
    icon: <Wrench className="w-4 h-4 text-primary" />,
    label: 'Active Jobs',
    value: 6,
  },
];

export default function TechnicianInsightsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Technician Insights</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {insights.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            {item.icon}
            <div className="text-sm">
              <div className="font-medium leading-tight">{item.value}</div>
              <div className="text-xs text-muted-foreground">{item.label}</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
