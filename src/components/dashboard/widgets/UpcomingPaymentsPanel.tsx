// src/components/dashboard/widgets/UpcomingPaymentsPanel.tsx
'use client';

import * as React from 'react';
import { CalendarDays, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const upcomingPayments = [
  { id: 'inv-1024', name: 'João Silva', amount: 'R$170,00', due: 'in 2 days' },
  { id: 'inv-1025', name: 'Alice Costa', amount: 'R$250,00', due: 'in 3 days' },
];

const overduePayments = [
  { id: 'inv-1019', name: 'Carlos Souza', amount: 'R$170,00', due: '3 days ago' },
  { id: 'inv-1020', name: 'Maria Lima', amount: 'R$390,00', due: '1 day ago' },
];

export default function UpcomingPaymentsPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Upcoming & Overdue Payments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-1">
            <CalendarDays className="h-4 w-4" /> Upcoming
          </div>
          <ul className="space-y-1 text-sm">
            {upcomingPayments.map((item) => (
              <li key={item.id} className="flex justify-between">
                <span>{item.name}</span>
                <span className="text-muted-foreground">{item.amount} – {item.due}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-red-500 mb-1">
            <AlertCircle className="h-4 w-4" /> Overdue
          </div>
          <ul className="space-y-1 text-sm">
            {overduePayments.map((item) => (
              <li key={item.id} className="flex justify-between">
                <span>{item.name}</span>
                <span className="text-destructive">{item.amount} – {item.due}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
