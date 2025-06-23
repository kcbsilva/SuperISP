// src/app/admin/inventory/categories/layout.tsx
import type { ReactNode } from 'react';

export default function CategoriesLayout({ children }: { children: ReactNode }) {
  return <div className="h-full">{children}</div>;
}
