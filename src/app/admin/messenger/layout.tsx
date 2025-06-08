
// src/app/admin/messenger/layout.tsx
import type { ReactNode } from 'react';

export default function MessengerLayout({ children }: { children: ReactNode }) {
  return <div className="h-full">{children}</div>;
}
