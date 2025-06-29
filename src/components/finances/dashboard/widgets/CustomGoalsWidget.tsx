// components/finances/widgets/CustomGoalsWidget.tsx
import React from 'react'

interface Props {
  period: string
}

export function CustomGoalsWidget({ period }: Props) {
  const goals = [
    { label: 'Save for Vacation', progress: 70 },
    { label: 'Emergency Fund', progress: 45 },
    { label: 'Pay Off Credit Card', progress: 90 },
  ]

  return (
    <div className="text-sm space-y-2">
      <p className="font-semibold">Custom Goals</p>
      {goals.map((goal, i) => (
        <div key={i}>
          <p>{goal.label}</p>
          <div className="w-full bg-gray-200 rounded h-2 overflow-hidden">
            <div
              className="bg-blue-500 h-2"
              style={{ width: `${goal.progress}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
