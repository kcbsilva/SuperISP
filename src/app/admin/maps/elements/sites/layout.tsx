// src/app/maps/elements/sites/layout.tsx
import type { ReactNode } from 'react';

export default function SitesLayout({ children }: { children: ReactNode }) {
  return <div className="h-full">{children}</div>;
}
