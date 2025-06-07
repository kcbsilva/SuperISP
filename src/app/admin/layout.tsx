
// src/app/admin/layout.tsx
'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation'; // Import usePathname
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppLayoutContent } from './admin-layout-content';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // If it's the login page, don't render the admin shell (sidebar, header)
  // Also, if it's the root admin page which redirects, don't show the shell yet.
  if (pathname === '/admin/login' || pathname === '/admin') {
    return <>{children}</>; // Render only the page content
  }

  // For all other admin pages, render the full admin shell
  return (
    <SidebarProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </SidebarProvider>
  );
}
