// components/finances/widgets/AlertsWidget.tsx
import React from 'react'

interface Props {
  period: string
}

export function AlertsWidget({ period }: Props) {
  const alerts = [
    { message: 'Credit card payment due tomorrow', level: 'warning' },
    { message: 'You’re over budget for Entertainment', level: 'danger' },
    { message: 'Invoice #1423 is overdue', level: 'danger' },
  ]

  return (
    <div className="w-full h-full flex flex-col justify-start text-sm">
      {/* Widget Title */}
      <div className="text-sm font-semibold text-center border-b mb-2 pb-1 px-2">
        Alerts
      </div>

      {/* Alerts Content */}
      <div className="flex flex-col gap-1 px-2 text-xs text-center">
        {alerts.map((alert, i) => (
          <div
            key={i}
            className={`p-2 rounded ${
              alert.level === 'danger'
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {alert.message}
          </div>
        ))}
      </div>
    </div>
  )
}
