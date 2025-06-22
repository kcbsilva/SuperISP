// src/components/dashboard/widgets/OpenTicketsCard.tsx
import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MessageSquareWarning, ArrowDownRight } from 'lucide-react';

export default function OpenTicketsCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4">
        <CardTitle className="text-xs font-medium">Open Support Tickets</CardTitle>
        <MessageSquareWarning className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">23</div>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <ArrowDownRight className="h-3 w-3 text-red-500" />
          -3 from last hour
        </p>
      </CardContent>
    </Card>
  );
}
