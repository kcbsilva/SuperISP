// components/finances/widgets/NetIncomeOverTimeWidget.tsx
'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

interface Props {
  period: string
}

const data = [
  { month: 'APR', income: 1200 },
  { month: 'MAY', income: 1800 },
  { month: 'JUN', income: 2900 },
  { month: 'JUL', income: 2700 },
  { month: 'AUG', income: 2500 },
  { month: 'SEP', income: 3100 },
]

export function NetIncomeOverTimeWidget({ period }: Props) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="income" fill="#10b981" />
      </BarChart>
    </ResponsiveContainer>
  )
}
