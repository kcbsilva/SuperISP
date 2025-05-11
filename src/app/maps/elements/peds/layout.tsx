// src/app/maps/elements/peds/layout.tsx
import type { ReactNode } from 'react';

export default function PedsLayout({ children }: { children: ReactNode }) {
  return <div className="h-full">{children}</div>;
}
