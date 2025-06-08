// src/app/maps/elements/ducts/layout.tsx
import type { ReactNode } from 'react';

export default function DuctsLayout({ children }: { children: ReactNode }) {
  return <div className="h-full">{children}</div>;
}
