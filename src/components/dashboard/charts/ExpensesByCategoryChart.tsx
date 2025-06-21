// src/components/dashboard/charts/ExpensesByCategoryChart.tsx
'use client';

import * as React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Infrastructure', value: 500 },
  { name: 'Support', value: 200 },
  { name: 'Marketing', value: 300 },
];

const COLORS = ['#FF8042', '#00C49F', '#FFBB28'];

type Props = {
  planFilter: string;
  regionFilter: string;
};

export default function ExpensesByCategoryChart({ planFilter, regionFilter }: Props) {
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
