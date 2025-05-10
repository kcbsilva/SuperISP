// src/app/postgresql/layout.tsx
import type { ReactNode } from 'react';

export default function DatabaseManagementLayout({ children }: { children: ReactNode }) {
  return <div className="h-full">{children}</div>;
}
