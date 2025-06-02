
// src/app/admin/layout.tsx
'use client';

import * as React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppLayoutContent } from './admin-layout-content';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </SidebarProvider>
  );
}
