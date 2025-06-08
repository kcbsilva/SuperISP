// src/app/admin/admin-layout-content.tsx
'use client';

import * as React from 'react';
// Removed Link and usePathname as logo link is now in Header
// Removed useTheme as ProlterLogo component is removed
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarInset,
  useSidebar,
} from '@/components/ui/sidebar';
import { Header } from '@/components/app-header';
import { sidebarNav } from '@/config/sidebarNav';
import SidebarNav from '@/components/sidebar-nav';
import { usePathname } from 'next/navigation'; // Re-added usePathname for isMapPage

export function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); // For isMapPage logic
  const { isMobile, isOpenMobile, setIsOpenMobile } = useSidebar();

  const toggleMobileSidebar = () => setIsOpenMobile(!isOpenMobile);

  React.useEffect(() => {
    if (!isMobile && isOpenMobile) {
      setIsOpenMobile(false);
    }
  }, [isMobile, isOpenMobile, setIsOpenMobile]);

  const isMapPage = pathname === "/admin/maps/map";

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <Header onToggleSidebar={toggleMobileSidebar} /> {/* Header is now at the top */}
      <div className="flex flex-1 overflow-hidden"> {/* Container for Sidebar and Content */}
        <Sidebar>
          {/* SidebarHeader is now empty or can be repurposed if needed */}
          <SidebarHeader>
            {/* Intentionally left blank as logo is in the main AppHeader now */}
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarNav items={sidebarNav} />
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            {/* Footer content if any */}
          </SidebarFooter>
        </Sidebar>

        {/* Main content area */}
        <SidebarInset noMargin={isMapPage}>
          <div className={isMapPage ? "p-0 h-full overflow-y-auto" : "p-2 md:p-4 lg:p-6 h-full overflow-y-auto"}>
            {children}
          </div>
        </SidebarInset>
      </div>
    </div>
  );
}
