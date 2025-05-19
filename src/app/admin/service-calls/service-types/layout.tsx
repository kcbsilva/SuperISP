// src/app/service-calls/service-types/layout.tsx
import type { ReactNode } from 'react';

export default function ServiceTypesLayout({ children }: { children: ReactNode }) {
  return <div className="h-full">{children}</div>;
}
