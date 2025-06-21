// src/components/dashboard/charts/PlanPerformanceChart.tsx
'use client';

import * as React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import AlertsTimeline from '@/components/dashboard/widgets/AlertsTimeline';

const planData = [
  { plan: 'Basic', subscribers: 520 },
  { plan: 'Pro', subscribers: 310 },
  { plan: 'Enterprise', subscribers: 96 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

export default function PlanPerformanceChart() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Plan Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={planData} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="plan" axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="subscribers" radius={[4, 4, 0, 0]}>
                {planData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <AlertsTimeline />
    </div>
  );
} 
