// src/app/maps/elements/layout.tsx
import type { ReactNode } from 'react';

export default function MapElementsLayout({ children }: { children: ReactNode }) {
  return <div className="h-full">{children}</div>;
}
