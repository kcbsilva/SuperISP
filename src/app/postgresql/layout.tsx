// src/app/mysql/layout.tsx
import type { ReactNode } from 'react';

export default function MysqlManagementLayout({ children }: { children: ReactNode }) {
  return <div className="h-full">{children}</div>;
}
