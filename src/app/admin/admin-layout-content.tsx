
// src/app/admin/admin-layout-content.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarInset,
  useSidebar,
} from '@/components/ui/sidebar';
import { Header } from '@/components/app-header'; // Changed AppHeader to Header
import { sidebarNav } from '@/config/sidebarNav';
import SidebarNav from '@/components/sidebar-nav';
// Removed unused icons and locale context as they were specific to older versions

const ProlterLogo = () => {
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Default to a fallback color or a specific color if theme is not yet available or for SSR
  let fillColor = "hsl(var(--foreground))"; // A sensible default

  if (isMounted) {
    fillColor = theme === "dark"
      ? "hsl(var(--accent))"
      : "hsl(var(--primary))";
  }

  // Return a div placeholder if not mounted to avoid hydration mismatch issues with SVG fill
  if (!isMounted) {
    return <div style={{ width: '131px', height: '32px' }} className="bg-muted animate-pulse rounded" />;
  }
  
  return (
    <div style={{ width: '131px', height: '32px' }} className="flex items-center justify-center">
      {/* Replace with your actual SVG or img tag for the logo */}
      {/* This is a placeholder SVG */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 131 32"
        xmlns="http://www.w3.org/2000/svg"
        fill={fillColor} // Use the determined fill color
      >
        <text
          x="50%"
          y="50%"
          fontFamily="Arial, sans-serif"
          fontSize="20"
          fontWeight="bold"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          PROLTER
        </text>
      </svg>
    </div>
  );
};


export function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isMobile, isOpenMobile, setIsOpenMobile } = useSidebar();

  const toggleMobileSidebar = () => setIsOpenMobile(!isOpenMobile);

  React.useEffect(() => {
    if (!isMobile && isOpenMobile) {
      setIsOpenMobile(false);
    }
  }, [isMobile, isOpenMobile, setIsOpenMobile]);

  const isMapPage = pathname === "/admin/maps/map";

  return (
    <div className="flex h-screen overflow-hidden w-full">
      <Sidebar>
        <SidebarHeader>
          <Link href="/admin/dashboard" className="flex items-center justify-center w-full h-full" style={{ textDecoration: 'none' }}>
            <ProlterLogo />
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarNav items={sidebarNav} />
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          {/* Footer content if any, e.g., version number or quick links */}
        </SidebarFooter>
      </Sidebar>

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header onToggleSidebar={toggleMobileSidebar} /> {/* Changed AppHeader to Header */}
        <SidebarInset noMargin={isMapPage}>
          <div className={isMapPage ? "p-0 h-full overflow-hidden" : "p-2 md:p-4 lg:p-6 h-[calc(100vh-theme(space.14))] overflow-y-auto"}>
            {children}
          </div>
        </SidebarInset>
      </div>
    </div>
  );
}
