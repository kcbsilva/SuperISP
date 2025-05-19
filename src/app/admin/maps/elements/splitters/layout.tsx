// src/app/maps/elements/splitters/layout.tsx
import type { ReactNode } from 'react';

export default function SplittersLayout({ children }: { children: ReactNode }) {
  return <div className="h-full">{children}</div>;
}
