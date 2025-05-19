
// src/app/admin/admin-layout-content.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShieldCheck,
  Settings,
  Users,
  MapPin,
  TowerControl,
  Cable,
  Power,
  Box,
  Puzzle,
  Warehouse,
  Globe,
  GitFork,
  Split,
  Code,
  Router as RouterIcon,
  Share2,
  Server as ServerIcon,
  DollarSign,
  BarChart3,
  Plug,
  MessageSquare,
  Text,
  Settings2,
  ListChecks,
  Wifi,
  Tv,
  Smartphone,
  PhoneCall,
  Combine,
  ListFilter,
  Archive,
  Factory,
  Package as PackageIcon,
  Truck,
  FileText as FileTextIcon,
  GitBranch,
  Network as NetworkIcon,
  Database,
  Users2,
  Bus,
  BriefcaseBusiness,
  FileCode,
  Wrench,
  BookOpen,
  SlidersHorizontal,
  Briefcase,
  Building,
  Cog,
  Dot,
  ChevronDown,
  Menu as MenuIcon, // Added MenuIcon for mobile toggle
} from 'lucide-react';
import { SiNextdns } from "react-icons/si";
import { TbDeviceImacStar } from "react-icons/tb";
import { SiReactrouter } from "react-icons/si";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubTrigger,
  SidebarMenuSubContent,
  SidebarSeparator,
  SidebarInset,
  useSidebar,
} from '@/components/ui/sidebar';
import { AppHeader } from '@/components/app-header'; 
import { sidebarNav } from '@/config/sidebarNav';
import { useLocale } from '@/contexts/LocaleContext';
import SidebarNav from '@/components/sidebar-nav';
import { useTheme } from 'next-themes';

const ProlterLogo = () => {
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const fillColor = isMounted
    ? theme === "dark"
      ? "hsl(var(--accent))"
      : "hsl(var(--primary))"
    : "hsl(var(--foreground))";

  return (
    <div style={{ width: '131px', height: '32px' }} className="flex items-center justify-center">
      <img
        src="../assets/prolter-logo.svg"
        alt="Prolter Logo"
        style={{ height: "100%", width: "auto", fill: fillColor }}
      />
    </div>
  );
};



export function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isMobile, isOpenMobile, setIsOpenMobile } = useSidebar();
  const { t } = useLocale();

  const toggleMobileSidebar = () => setIsOpenMobile(!isOpenMobile);

  React.useEffect(() => {
    if (!isMobile && isOpenMobile) {
      setIsOpenMobile(false);
    }
  }, [isMobile, isOpenMobile, setIsOpenMobile]);
  
  const isMapPage = pathname === "/admin/maps/map";


  return (
    <div className="flex h-screen overflow-hidden">
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
        <AppHeader onToggleSidebar={toggleMobileSidebar} />
        <SidebarInset noMargin={isMapPage}>
          <div className={isMapPage ? "p-0 h-full overflow-hidden" : "p-2 h-[calc(100%-theme(space.14))] overflow-y-auto"}>
            {children}
          </div>
        </SidebarInset>
      </div>
    </div>
  );
}
