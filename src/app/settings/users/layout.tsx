// src/app/settings/users/layout.tsx
import type { ReactNode } from 'react';

export default function UsersLayout({ children }: { children: ReactNode }) {
  return <div className="h-full">{children}</div>;
}
