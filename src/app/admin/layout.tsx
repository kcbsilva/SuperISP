// src/app/admin/layout.tsx
'use client';

import * as React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppLayoutContent } from './admin-layout-content'; // Assuming admin-layout-content.tsx is in the same directory

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // This AdminLayout component is responsible for the structure of admin pages
  // It uses AppLayoutContent which includes the actual Sidebar and AppHeader
  return (
    <SidebarProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </SidebarProvider>
  );
}
