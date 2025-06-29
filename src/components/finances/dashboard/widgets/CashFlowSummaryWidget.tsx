// components/finances/widgets/CashFlowSummaryWidget.tsx
'use client'

import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from 'recharts'

interface Props {
  period: string
}

export function CashFlowSummaryWidget({ period }: Props) {
  const data = [
    { name: 'Income', value: 25000, color: '#16a34a' },
    { name: 'Expenses', value: 18300, color: '#dc2626' },
    { name: 'Net Cash Flow', value: 6700, color: '#0f766e' },
  ]

  return (
    <div className="w-full h-full flex flex-col justify-start text-sm">
      {/* Widget Title */}
      <div className="text-sm font-semibold text-center border-b mb-2 pb-1 px-2">
        Cash Flow Summary
      </div>

      {/* Chart */}
      <div className="flex-1 px-2 pb-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
            barSize={20}
          >
            <XAxis type="number" hide />
            <YAxis
              dataKey="name"
              type="category"
              width={80}
              tick={{ fontSize: 12 }}
            />
            <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
            {data.map((entry, index) => (
              <Bar
                key={entry.name}
                dataKey="value"
                data={[entry]}
                barSize={20}
                fill={entry.color}
                isAnimationActive={false}
              >
                <LabelList
                  dataKey="value"
                  position="right"
                  formatter={(value: number) => `$${value.toLocaleString()}`}
                />
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
