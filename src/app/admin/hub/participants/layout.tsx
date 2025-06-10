// src/app/admin/hub/participants/layout.tsx
import type { ReactNode } from 'react';

export default function HubParticipantsLayout({ children }: { children: ReactNode }) {
  return <div className="h-full">{children}</div>;
}
