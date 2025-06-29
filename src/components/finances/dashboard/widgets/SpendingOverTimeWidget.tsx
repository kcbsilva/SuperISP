// components/finances/widgets/SpendingOverTimeWidget.tsx
'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

interface Props {
  period: string
}

const data = [
  { month: 'APR', spending: 3200 },
  { month: 'MAY', spending: 4300 },
  { month: 'JUN', spending: 5100 },
  { month: 'JUL', spending: 4800 },
  { month: 'AUG', spending: 4600 },
  { month: 'SEP', spending: 5400 },
]

export function SpendingOverTimeWidget({ period }: Props) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="spending" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  )
}
