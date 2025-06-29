// components/finances/widgets/ExpenseWidget.tsx
import React from 'react'

export function ExpenseWidget({ period }: { period: string }) {
  return (
    <div className="text-sm">
      <p>Total Expenses:</p>
      <p className="text-red-500 text-xl font-semibold">R$ 85,000</p>
    </div>
  )
}
