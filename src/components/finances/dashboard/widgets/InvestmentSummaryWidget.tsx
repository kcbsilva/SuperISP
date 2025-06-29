// components/finances/widgets/InvestmentSummaryWidget.tsx
import React from 'react'

interface Props {
  period: string
}

export function InvestmentSummaryWidget({ period }: Props) {
  return (
    <div className="text-sm space-y-2">
      <p className="font-semibold">Investment Summary</p>
      <ul className="space-y-1">
        <li>Securities: $191,389.32</li>
        <li>Cash Balance: $25,030.00</li>
        <li className="font-bold">Total: $216,389.32</li>
        <li className="text-red-500">Today’s Change: -$509.18 (-0.31%)</li>
      </ul>
    </div>
  )
}
