
// src/app/admin/layout.tsx
'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppLayoutContent } from './admin-layout-content';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Define paths where the full admin shell (Header, Sidebar) should NOT be rendered.
  // This includes the login page and the admin root if it's just a redirector.
  const noShellPaths = ['/admin/login', '/admin'];

  if (noShellPaths.includes(pathname)) {
    return <>{children}</>; // Render only the page content for login or admin root
  }

  // For all other admin paths, render the full shell
  return (
    <SidebarProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </SidebarProvider>
  );
}

    