// src/components/dashboard/widgets/TopSubscribersTable.tsx
'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const topSubscribers = [
  { name: 'Alice Costa', plan: 'Enterprise', usage: '890GB', mrr: '$390' },
  { name: 'João Silva', plan: 'Pro', usage: '645GB', mrr: '$250' },
  { name: 'Maria Lima', plan: 'Pro', usage: '610GB', mrr: '$250' },
  { name: 'Carlos Souza', plan: 'Basic', usage: '510GB', mrr: '$170' },
];

export default function TopSubscribersTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Top Subscribers</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-muted-foreground">
              <th className="text-left py-1">Name</th>
              <th className="text-left py-1">Plan</th>
              <th className="text-left py-1">Usage</th>
              <th className="text-left py-1">MRR</th>
            </tr>
          </thead>
          <tbody>
            {topSubscribers.map((sub, index) => (
              <tr key={index} className="border-t border-muted">
                <td className="py-1 font-medium">{sub.name}</td>
                <td className="py-1">{sub.plan}</td>
                <td className="py-1">{sub.usage}</td>
                <td className="py-1">{sub.mrr}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
