// src/app/maps/elements/towers/layout.tsx
import type { ReactNode } from 'react';

export default function TowersLayout({ children }: { children: ReactNode }) {
  return <div className="h-full">{children}</div>;
}
