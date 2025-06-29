// components/finances/widgets/CashFlowWidget.tsx
import React from 'react'

export function CashFlowWidget() {
  return (
    <div className="w-full h-full flex flex-col justify-start text-sm">
      {/* Widget Title */}
      <div className="text-sm font-semibold text-center border-b mb-2 pb-1 px-2">
        Cash Flow
      </div>

      {/* Content */}
      <div className="flex flex-col items-center justify-center h-full px-2 text-xs text-center">
        <p className="mb-1">Total Cash Flow:</p>
        <p className="text-green-700 text-xl font-bold">R$ 85,000</p>
      </div>
    </div>
  )
}
