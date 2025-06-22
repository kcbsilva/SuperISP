// src/components/dashboard/widgets/RecentActivityList.tsx
import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const activities = [
  { id: '1', type: 'New Subscriber', description: 'John Doe signed up for the Pro plan.', time: '5 minutes ago', level: undefined },
  { id: '2', type: 'Ticket Resolved', description: 'Ticket #1234 marked as resolved.', time: '1 hour ago', level: undefined },
  { id: '3', type: 'Network Alert', description: 'High latency detected on Node-B7.', time: '2 hours ago', level: 'warning' },
  { id: '4', type: 'Payment Received', description: 'Invoice #5678 paid by Jane Smith.', time: '3 hours ago', level: undefined },
];

export default function RecentActivityList() {
  return (
    <Card className="col-span-full lg:col-span-3">
      <CardHeader className="pt-4 pb-2">
        <CardTitle className="text-sm">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-3">
              <Activity className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              <div className="grid gap-0.5 flex-grow">
                <p className="text-xs font-medium leading-none">
                  {activity.type}
                  {activity.level === 'warning' && (
                    <Badge variant="destructive" className="ml-2 text-xs">
                      Warning
                    </Badge>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">{activity.description}</p>
              </div>
              <div className="ml-auto text-xs text-muted-foreground flex-shrink-0">{activity.time}</div>
            </div>
          ))
        ) : (
          <p className="text-xs text-muted-foreground text-center">No recent activity</p>
        )}
      </CardContent>
    </Card>
  );
}
