// src/components/dashboard/charts/RevenueByPlanChart.tsx
'use client';

import * as React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Basic', value: 400 },
  { name: 'Pro', value: 300 },
  { name: 'Enterprise', value: 300 },
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

type Props = {
  planFilter: string;
  regionFilter: string;
};

export default function RevenueByPlanChart({ planFilter, regionFilter }: Props) {
  const filteredData =
    planFilter === 'All' ? data : data.filter((item) => item.name === planFilter);

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={filteredData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={60}
          label
        >
          {filteredData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
