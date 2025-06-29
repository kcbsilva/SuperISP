// components/finances/widgets/UpcomingBillsWidget.tsx
import React from 'react'

interface Props {
  period: string
}

export function UpcomingBillsWidget({ period }: Props) {
  const bills = [
    { name: 'Internet', due: '2025-07-01', amount: 300 },
    { name: 'Electricity', due: '2025-07-05', amount: 450 },
    { name: 'Rent', due: '2025-07-10', amount: 2200 },
  ]

  return (
    <div className="text-sm space-y-1">
      <p className="font-semibold mb-1">Upcoming Bills</p>
      {bills.map((bill, i) => (
        <div key={i} className="flex justify-between">
          <span>{bill.name} ({bill.due})</span>
          <span>${bill.amount}</span>
        </div>
      ))}
    </div>
  )
}
