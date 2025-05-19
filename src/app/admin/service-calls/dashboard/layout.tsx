// src/app/service-calls/dashboard/layout.tsx
import type { ReactNode } from 'react';

export default function ServiceCallsDashboardLayout({ children }: { children: ReactNode }) {
  return <div className="h-full">{children}</div>;
}
