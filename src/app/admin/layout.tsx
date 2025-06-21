
// src/app/admin/layout.tsx
'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppLayoutContent } from './admin-layout-content';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Define paths where the full admin shell (Header, Sidebar) should NOT be rendered.
  const noShellPaths = [
    '/admin/login',
    '/admin', // Admin root might be a redirector or a very simple page
    '/admin/forgot-password',
    '/admin/update-password',
    '/admin/setup-wizard',
  ];

  if (noShellPaths.includes(pathname)) {
    return <>{children}</>; // Render only the page content for these paths
  }

  // For all other admin paths, render the full shell
  return (
    <SidebarProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </SidebarProvider>
  );
}
