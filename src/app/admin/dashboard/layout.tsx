// src/app/admin/dashboard/layout.tsx
// This layout is for the /admin/dashboard segment.
// The main AppHeader and Sidebar are provided by ../layout.tsx (AdminLayout) via AppLayoutContent.
// Therefore, this segment layout should typically just pass children through,
// or add specific layout elements *within* the main content area if needed.

import type { ReactNode } from 'react';

export default function DashboardSegmentLayout({ children }: { children: ReactNode }) {
  // By making this a simple pass-through, we avoid:
  // 1. The "Element type is invalid" error if a Sidebar import was wrong or missing.
  // 2. Rendering a duplicate Header and Sidebar.
  return <>{children}</>;
}
