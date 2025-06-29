// components/finances/widgets/SpendingCategoriesWidget.tsx
'use client'

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts'

interface Props {
  period: string
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a78bfa']
const data = [
  { name: 'Home', value: 2150 },
  { name: 'Cash & ATM', value: 550 },
  { name: 'Education', value: 500 },
  { name: 'Business Expenses', value: 100 },
  { name: 'Other', value: 887 },
]

export function SpendingCategoriesWidget({ period }: Props) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          innerRadius={40}
          outerRadius={60}
          fill="#8884d8"
          paddingAngle={2}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend layout="vertical" verticalAlign="middle" align="right" />
      </PieChart>
    </ResponsiveContainer>
  )
}
