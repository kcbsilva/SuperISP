// src/app/maps/projects/layout.tsx
import type { ReactNode } from 'react';

export default function MapProjectsLayout({ children }: { children: ReactNode }) {
  return <div className="h-full">{children}</div>;
}
