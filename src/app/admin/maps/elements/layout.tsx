// src/app/maps/elements/layout.tsx
import type { ReactNode } from 'react';

export default function MapElementsSharedLayout({ children }: { children: ReactNode }) {
  return <div className="h-full">{children}</div>;
}
