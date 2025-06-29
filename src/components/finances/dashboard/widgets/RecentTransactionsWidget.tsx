// components/finances/widgets/RecentTransactionsWidget.tsx
import React from 'react'

interface Props {
  period: string
}

const sampleData = [
  { name: 'Balance', date: '2025-06-27', category: 'Adjustment', amount: -200.34 },
  { name: 'Safeway', date: '2025-06-26', category: 'Groceries', amount: -80.23 },
  { name: 'Starbucks', date: '2025-06-25', category: 'Coffee Shops', amount: -16.0 },
  { name: 'Test', date: '2025-06-24', category: 'Transfer', amount: 32481.0 },
]

export function RecentTransactionsWidget({ period }: Props) {
  return (
    <div className="text-sm space-y-2">
      {sampleData.map((tx, idx) => (
        <div key={idx} className="flex justify-between text-xs border-b pb-1">
          <div>
            <div className="font-semibold">{tx.name}</div>
            <div className="text-muted-foreground">{tx.date} • {tx.category}</div>
          </div>
          <div className={tx.amount < 0 ? 'text-red-500' : 'text-green-500'}>
            {tx.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
          </div>
        </div>
      ))}
    </div>
  )
}
