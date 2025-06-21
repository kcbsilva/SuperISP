// src/components/dashboard/charts/PaymentStatusChart.tsx
'use client';

import * as React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Paid', value: 700 },
  { name: 'Pending', value: 200 },
  { name: 'Failed', value: 100 },
];

const COLORS = ['#4ade80', '#facc15', '#f87171'];

type Props = {
  planFilter: string;
  regionFilter: string;
};

export default function PaymentStatusChart({ planFilter, regionFilter }: Props) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={60}
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
