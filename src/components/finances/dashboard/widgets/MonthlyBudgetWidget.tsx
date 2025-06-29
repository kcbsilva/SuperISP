// components/finances/widgets/MonthlyBudgetWidget.tsx
import React from 'react'

interface Props {
  period: string
}

export function MonthlyBudgetWidget({ period }: Props) {
  return (
    <div className="text-sm space-y-2">
      <p className="font-semibold">Budget - June 2025</p>
      <div>
        <p className="text-red-500">Expense: $4,587 of $4,542 — <strong>$45 Over</strong></p>
        <p className="text-green-500">Income: $10,000 of $4,000 — <strong>$6,000 Over</strong></p>
      </div>
    </div>
  )
}
