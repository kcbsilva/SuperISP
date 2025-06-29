// components/finances/widgets/RevenueWidget.tsx
import React from 'react'

export function RevenueWidget({ period }: { period: string }) {
  return (
    <div className="text-sm">
      <p className="text-muted-foreground">Total Revenue ({period}):</p>
      <p className="text-green-500 text-xl font-semibold">R$ 85,000</p>
    </div>
  )
}
