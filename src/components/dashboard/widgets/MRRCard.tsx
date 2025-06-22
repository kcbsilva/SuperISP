// src/components/dashboard/widgets/MRRCard.tsx
import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DollarSign, ArrowUpRight } from 'lucide-react';

export default function MRRCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4">
        <CardTitle className="text-xs font-medium">Monthly Recurring Revenue</CardTitle>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">$45,231.89</div>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <ArrowUpRight className="h-3 w-3 text-green-500" />
          +20.4% from last month
        </p>
      </CardContent>
    </Card>
  );
}
