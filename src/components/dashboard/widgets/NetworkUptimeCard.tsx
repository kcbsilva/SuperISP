// src/components/dashboard/widgets/NetworkUptimeCard.tsx
import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Network, ArrowUpRight } from 'lucide-react';

export default function NetworkUptimeCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4">
        <CardTitle className="text-xs font-medium">Network Uptime</CardTitle>
        <Network className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">99.98%</div>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <ArrowUpRight className="h-3 w-3 text-green-500" />
          +0.02% from last month
        </p>
      </CardContent>
    </Card>
  );
}
