// src/components/dashboard/widgets/SubscriberGrowthChart.tsx
import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { SubscriberChart } from '@/components/dashboard/subscriber-chart';

export default function SubscriberGrowthChart() {
  return (
    <Card className="col-span-full">
      <CardHeader className="pt-4 pb-2">
        <CardTitle className="text-sm">Subscriber Growth</CardTitle>
        <CardDescription className="text-xs">
          Monthly new subscribers for the last 6 months.
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <SubscriberChart />
      </CardContent>
    </Card>
  );
}
