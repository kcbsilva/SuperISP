// src/app/service-calls/layout.tsx
import type { ReactNode } from 'react';

export default function ServiceCallsLayout({ children }: { children: ReactNode }) {
  return <div className="h-full">{children}</div>;
}
