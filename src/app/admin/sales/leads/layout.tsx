// src/app/admin/sales/leads/layout.tsx
import type { ReactNode } from 'react';

export default function SalesLeadsLayout({ children }: { children: ReactNode }) {
  return <div className="h-full">{children}</div>;
}