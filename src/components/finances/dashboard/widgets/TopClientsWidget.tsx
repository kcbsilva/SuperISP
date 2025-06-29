// components/finances/widgets/TopClientsWidget.tsx
import React from 'react'

interface Props {
  period: string
}

export function TopClientsWidget({ period }: Props) {
  const clients = [
    { name: 'ACME Corp', revenue: 12000 },
    { name: 'Beta LLC', revenue: 8700 },
    { name: 'Gamma Inc.', revenue: 5600 },
  ]

  return (
    <div className="text-sm">
      <p className="font-semibold mb-1">Top Clients</p>
      {clients.map((client, i) => (
        <div key={i} className="flex justify-between">
          <span>{client.name}</span>
          <span className="text-green-600">${client.revenue}</span>
        </div>
      ))}
    </div>
  )
}
