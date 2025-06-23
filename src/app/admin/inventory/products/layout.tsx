// src/app/admin/inventory/products/layout.tsx
import type { ReactNode } from 'react';

export default function ProductsLayout({ children }: { children: ReactNode }) {
  return <div className="h-full">{children}</div>;
}