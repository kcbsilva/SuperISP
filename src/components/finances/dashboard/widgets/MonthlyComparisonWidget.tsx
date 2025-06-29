// components/finances/widgets/MonthlyComparisonWidget.tsx
'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface Props {
  period: string
}

const data = [
  { month: 'APR', income: 12000, expenses: 8000 },
  { month: 'MAY', income: 15000, expenses: 10000 },
  { month: 'JUN', income: 17000, expenses: 12000 },
]

export function MonthlyComparisonWidget({ period }: Props) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="income" fill="#10b981" />
        <Bar dataKey="expenses" fill="#ef4444" />
      </BarChart>
    </ResponsiveContainer>
  )
}
