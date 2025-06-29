// components/finances/widgets/OverdueInvoicesWidget.tsx
import React from 'react'

interface Props {
  period: string
}

export function OverdueInvoicesWidget({ period }: Props) {
  const invoices = [
    { client: 'ACME Corp', due: '2025-06-20', amount: 1500 },
    { client: 'Beta LLC', due: '2025-06-18', amount: 920 },
  ]

  return (
    <div className="text-sm">
      <p className="font-semibold mb-1">Overdue Invoices</p>
      {invoices.map((inv, i) => (
        <div key={i} className="flex justify-between">
          <span>{inv.client} ({inv.due})</span>
          <span className="text-red-500">${inv.amount}</span>
        </div>
      ))}
    </div>
  )
}
