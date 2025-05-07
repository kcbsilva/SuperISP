// src/app/settings/network/vlan/layout.tsx
import type { ReactNode } from 'react';

export default function VlanLayout({ children }: { children: ReactNode }) {
  return <div className="h-full">{children}</div>;
}
