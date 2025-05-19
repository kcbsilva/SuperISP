// src/app/inventory/warehouses/layout.tsx
import type { ReactNode } from 'react';

export default function WarehousesLayout({ children }: { children: ReactNode }) {
  return <div className="h-full">{children}</div>;
}
