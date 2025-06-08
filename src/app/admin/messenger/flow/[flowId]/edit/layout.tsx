// src/app/admin/messenger/flow/[flowId]/edit/layout.tsx
import type { ReactNode } from 'react';

export default function EditFlowLayout({ children }: { children: ReactNode }) {
  return <div className="h-full w-full flex flex-col">{children}</div>;
}
