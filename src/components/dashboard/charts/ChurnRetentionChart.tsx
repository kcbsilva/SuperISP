// src/components/dashboard/charts/ChurnRetentionChart.tsx
'use client';

import * as React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const churnData = [
  { month: 'Jan', churnRate: 5.2 },
  { month: 'Feb', churnRate: 4.7 },
  { month: 'Mar', churnRate: 6.1 },
  { month: 'Apr', churnRate: 5.5 },
  { month: 'May', churnRate: 4.9 },
  { month: 'Jun', churnRate: 5.3 },
];

export default function ChurnRetentionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Churn & Retention</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={churnData} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} />
            <YAxis domain={[0, 'auto']} unit="%" tickLine={false} axisLine={false} />
            <Tooltip formatter={(value) => `${value}%`} />
            <Line type="monotone" dataKey="churnRate" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
