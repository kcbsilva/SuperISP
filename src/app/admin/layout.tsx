// src/app/admin/layout.tsx
'use client';
import React from 'react'; // Corrected import
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppLayoutContent } from './admin-layout-content';

// This AdminLayout is NOW ONLY responsible for rendering the admin shell.
// LayoutRenderer will decide IF this AdminLayout should be used.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </SidebarProvider>
  );
}
