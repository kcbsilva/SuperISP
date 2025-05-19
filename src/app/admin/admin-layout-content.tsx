
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

// Define ProlterLogo component here
const ProlterLogo = () => {
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  let fillColor = "currentColor"; // Default for SSR or if theme not ready

  if (isMounted) {
    // Dark theme: Accent color (Orange/Amber #FCA311)
    // Light theme: Primary color (Dark Blue, e.g., #14213D or #233B6E based on your globals.css)
    fillColor = theme === "dark" ? "hsl(var(--accent))" : "hsl(var(--primary))";
  }

  if (!isMounted) {
    // Return a div with fixed size for SSR to prevent layout shift
    // and ensure it has a default color that won't clash badly if the theme switch is slow.
    return <div style={{ width: "131px", height: "32px", color: "hsl(var(--foreground))" }} />;
  }

  return (
    <div style={{ width: '131px', height: '32px' }} className="flex items-center justify-center">
      {/* 
        !!! IMPORTANT: Ensure your actual SVG code from src/app/assets/prolter-logo.svg is placed here.
        For theme colors to apply, the paths/shapes in your SVG should use fill="currentColor" or stroke="currentColor".
      */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 131 32" // Adjust viewBox if your actual SVG is different
        xmlns="http://www.w3.org/2000/svg"
        fill={fillColor} // This will be dynamically set based on the theme
        // Add any other necessary attributes from your SVG like stroke, strokeWidth, etc.
      >
        {/* === PASTE YOUR ACTUAL SVG CODE FROM src/app/assets/prolter-logo.svg HERE === */}
        {/* For example, if your logo was simple text, it might look like this: */}
        <text
          x="50%"
          y="50%"
          fontFamily="Arial, sans-serif"
          fontSize="20" 
          fontWeight="bold"
          textAnchor="middle"
          dominantBaseline="middle"
          // Ensure this text element also uses currentColor or inherits the fill
        >
          PROLTER
        </text>
        {/* === END OF SVG CODE TO PASTE === */}
      </svg>
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
