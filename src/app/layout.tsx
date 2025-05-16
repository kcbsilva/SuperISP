
// src/app/layout.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';
import type { ReactNode } from 'react';
import {
  LayoutDashboard, ShieldCheck, Settings, Users, ChevronDown, MapPin, TowerControl, Cable, Power, Box, Puzzle, Warehouse, Globe, GitFork,
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
  Phone,
  Combine,
  ListFilter,
  Archive,
  Factory,
  Package as PackageIcon,
  Truck,
  FileText as FileTextIcon,
  GitBranch,
  Network as NetworkIcon,
  Sun,
  Moon,
  Info,
  LogOut,
  UserCircle,
  Database,
  Users2,
  UserPlus,
  Bus,
  BriefcaseBusiness,
  FileCode,
  Wrench,
  LayoutDashboard as ServiceDashboardIcon,
  List as ServiceTypesIcon,
  ListTree,
  Menu as MenuIcon,
  Dot,
  BookOpen,
  SlidersHorizontal,
  Briefcase,
  Building,
  Cog,
} from 'lucide-react';
import { SiNextdns } from "react-icons/si";
import { TbDeviceImacStar } from "react-icons/tb";
import { SiReactrouter } from "react-icons/si";
// Removed direct SVG import: import ProlterLogoSvg from '@/app/assets/prolter-logo.svg';

import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import {
  SidebarProvider,
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
  useSidebar,
  SidebarInset,
} from '@/components/ui/sidebar';
import { AppHeader } from '@/components/app-header';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Progress } from '@/components/ui/progress';
import { LocaleProvider, useLocale, type Locale as AppLocale } from '@/contexts/LocaleContext';
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';
import { useIsMobile } from '@/hooks/use-mobile';

// Inlined ProlterLogo component
const ProlterLogo = () => {
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Determine fill color based on theme
  const fillColor = !isMounted ? 'hsl(var(--card-foreground))' : (theme === 'dark' ? 'hsl(var(--accent))' : '#14213D');

  if (!isMounted) {
    // Return a placeholder or null during server-side rendering or before hydration
    return <div style={{ width: '131px', height: '32px' }} />;
  }

  // **IMPORTANT:** Replace the content of this <svg> with your actual prolter-logo.svg code.
  // Ensure paths/shapes you want themed use fill="currentColor" or stroke="currentColor".
  return (
    <div style={{ width: '131px', height: '32px', color: fillColor }} className="flex items-center justify-center">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 131 32" // Keep your original viewBox
        xmlns="http://www.w3.org/2000/svg"
        // Remove fill from here if you want child elements to use currentColor based on the parent div's color
      >
        {/* Placeholder Text - REPLACE THIS with your SVG's <path>, <rect>, etc. elements */}
        {/* Make sure to use fill="currentColor" or stroke="currentColor" on elements to be themed */}
        <text
          x="50%"
          y="50%"
          fontFamily="Arial, sans-serif"
          fontSize="20" // Adjust as needed
          fontWeight="bold"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="currentColor" // This will inherit from the parent div's 'color' style
        >
          PROLTER
        </text>
        {/* Example of a path that would use currentColor:
        <path d="M10 10 H 90 V 90 H 10 Z" fill="currentColor" />
        */}
      </svg>
    </div>
  );
};


const queryClient = new QueryClient();

function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const { t } = useLocale();
  const { isMobile, isOpenMobile, setIsOpenMobile } = useSidebar();

  const toggleMobileSidebar = () => setIsOpenMobile(!isOpenMobile);

  React.useEffect(() => {
    if (!isMobile && isOpenMobile) {
      setIsOpenMobile(false);
    }
  }, [isMobile, isOpenMobile, setIsOpenMobile]);

  React.useEffect(() => {
    if (pathname) {
      setIsLoading(true);
      setProgress(20);

      const timer = setTimeout(() => {
        setProgress(90);
      }, 50);
      const finishTimer = setTimeout(() => {
        setProgress(100);
        const hideTimer = setTimeout(() => {
          setIsLoading(false);
          setProgress(0);
        }, 200);
        return () => clearTimeout(hideTimer);
      }, 200);

      return () => {
        clearTimeout(timer);
        clearTimeout(finishTimer);
      };
    }
  }, [pathname]);


  const isActive = (href: string) => {
    const cleanHref = href.split('?')[0];
    const cleanPathname = pathname.split('?')[0];
    if (cleanHref === '/') return cleanPathname === '/';
    return cleanPathname.startsWith(cleanHref);
  };

  const iconSize = "h-3 w-3";
  const isMapPage = pathname === '/maps/map';


  return (
    <div className="flex h-screen">
      <Sidebar>
        <SidebarHeader>
          <Link href="/" className="flex items-center justify-center w-full h-full" style={{ textDecoration: 'none' }}>
            <ProlterLogo />
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton href="/" isActive={isActive('/')} tooltip={t('sidebar.dashboard')}>
                <LayoutDashboard className={iconSize} />
                <span className="truncate">{t('sidebar.dashboard')}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton href="/subscribers/list" isActive={isActive('/subscribers/list')} tooltip={t('sidebar.subscribers')}>
                <Users className={iconSize} />
                <span className="truncate">{t('sidebar.subscribers')}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuSub defaultOpen={isActive('/maps')}>
                <SidebarMenuSubTrigger tooltip={t('sidebar.maps')} isActive={isActive('/maps')}>
                  <MapPin className={iconSize} />
                  <span className="truncate">{t('sidebar.maps')}</span>
                  <ChevronDown />
                </SidebarMenuSubTrigger>
                <SidebarMenuSubContent>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="/maps/projects" isActive={isActive('/maps/projects')} size="sm">
                      <FileCode className={`${iconSize} text-muted-foreground`} />
                      <span className="truncate">{t('sidebar.maps_projects')}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                   <SidebarMenuItem>
                    <SidebarMenuButton href="/maps/map" isActive={isActive('/maps/map')} size="sm">
                      <Globe className={`${iconSize} text-muted-foreground`} />
                      <span className="truncate">{t('sidebar.maps_map')}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuSub defaultOpen={isActive('/maps/elements')}>
                      <SidebarMenuSubTrigger tooltip={t('sidebar.maps_elements')} isActive={isActive('/maps/elements')} size="sm">
                        <ListTree className={`${iconSize} text-muted-foreground`} />
                        <span className="truncate">{t('sidebar.maps_elements')}</span>
                        <ChevronDown />
                      </SidebarMenuSubTrigger>
                      <SidebarMenuSubContent>
                        <SidebarMenuItem>
                          <SidebarMenuButton href="/maps/elements/polls" isActive={isActive('/maps/elements/polls')} size="sm">
                            <Power className={`${iconSize} text-muted-foreground`} />
                            <span className="truncate">{t('sidebar.maps_elements_polls')}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton href="/maps/elements/fdhs" isActive={isActive('/maps/elements/fdhs')} size="sm">
                            <Box className={`${iconSize} text-muted-foreground`} />
                            <span className="truncate">{t('sidebar.maps_elements_fdhs')}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton href="/maps/elements/foscs" isActive={isActive('/maps/elements/foscs')} size="sm">
                            <Warehouse className={`${iconSize} text-muted-foreground`} />
                            <span className="truncate">{t('sidebar.maps_elements_foscs')}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton href="/maps/elements/peds" isActive={isActive('/maps/elements/peds')} size="sm">
                            <Box className={`${iconSize} text-muted-foreground`} />
                            <span className="truncate">{t('sidebar.maps_elements_peds')}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton href="/maps/elements/accessories" isActive={isActive('/maps/elements/accessories')} size="sm">
                            <Puzzle className={`${iconSize} text-muted-foreground`} />
                            <span className="truncate">{t('sidebar.maps_elements_accessories')}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                         <SidebarMenuItem>
                          <SidebarMenuButton href="/maps/elements/splitters" isActive={isActive('/maps/elements/splitters')} size="sm">
                            <Split className={`${iconSize} text-muted-foreground`} />
                            <span className="truncate">{t('sidebar.maps_elements_splitters')}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton href="/maps/elements/towers" isActive={isActive('/maps/elements/towers')} size="sm">
                            <TowerControl className={`${iconSize} text-muted-foreground`} />
                            <span className="truncate">{t('sidebar.maps_elements_towers')}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton href="/maps/elements/cables" isActive={isActive('/maps/elements/cables')} size="sm">
                            <Cable className={`${iconSize} text-muted-foreground`} />
                            <span className="truncate">{t('sidebar.maps_elements_cables')}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      </SidebarMenuSubContent>
                    </SidebarMenuSub>
                  </SidebarMenuItem>
                </SidebarMenuSubContent>
              </SidebarMenuSub>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuSub defaultOpen={isActive('/fttx')}>
                <SidebarMenuSubTrigger tooltip={t('sidebar.fttx')} isActive={isActive('/fttx')}>
                  <GitBranch className={iconSize} />
                  <span className="truncate">{t('sidebar.fttx')}</span>
                  <ChevronDown />
                </SidebarMenuSubTrigger>
                <SidebarMenuSubContent>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="/fttx/dashboard" isActive={isActive('/fttx/dashboard')} size="sm">
                      <LayoutDashboard className={`${iconSize} text-muted-foreground`} />
                      <span className="truncate">{t('sidebar.fttx_dashboard')}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="/fttx/olts" isActive={isActive('/fttx/olts')} size="sm">
                      <NetworkIcon className={`${iconSize} text-muted-foreground`} />
                      <span className="truncate">{t('sidebar.fttx_olts')}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="/fttx/onx-templates" isActive={isActive('/fttx/onx-templates')} size="sm">
                      <FileTextIcon className={`${iconSize} text-muted-foreground`} />
                      <span className="truncate">{t('sidebar.fttx_onx_templates')}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenuSubContent>
              </SidebarMenuSub>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuSub defaultOpen={isActive('/finances')}>
                <SidebarMenuSubTrigger tooltip={t('sidebar.finances')} isActive={isActive('/finances')}>
                  <DollarSign className={iconSize} />
                  <span className="truncate">{t('sidebar.finances')}</span>
                  <ChevronDown />
                </SidebarMenuSubTrigger>
                <SidebarMenuSubContent>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="/finances/cash-book" isActive={isActive('/finances/cash-book')} size="sm">
                      <BookOpen className={`${iconSize} text-muted-foreground`} />
                      <span className="truncate">{t('sidebar.finances_cash_book')}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="/finances/entry-categories" isActive={isActive('/finances/entry-categories')} size="sm">
                      <ListFilter className={`${iconSize} text-muted-foreground`} />
                      <span className="truncate">{t('sidebar.finances_entry_categories')}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenuSubContent>
              </SidebarMenuSub>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuSub defaultOpen={isActive('/inventory')}>
                <SidebarMenuSubTrigger tooltip={t('sidebar.inventory')} isActive={isActive('/inventory')}>
                  <Archive className={iconSize} />
                  <span className="truncate">{t('sidebar.inventory')}</span>
                  <ChevronDown />
                </SidebarMenuSubTrigger>
                <SidebarMenuSubContent>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="/inventory/categories" isActive={isActive('/inventory/categories')} size="sm">
                      <ListFilter className={`${iconSize} text-muted-foreground`} />
                      <span className="truncate">{t('sidebar.inventory_categories')}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="/inventory/manufacturers" isActive={isActive('/inventory/manufacturers')} size="sm">
                      <Factory className={`${iconSize} text-muted-foreground`} />
                      <span className="truncate">{t('sidebar.inventory_manufacturers')}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="/inventory/suppliers" isActive={isActive('/inventory/suppliers')} size="sm">
                      <Truck className={`${iconSize} text-muted-foreground`} />
                      <span className="truncate">{t('sidebar.inventory_suppliers')}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="/inventory/products" isActive={isActive('/inventory/products')} size="sm">
                      <PackageIcon className={`${iconSize} text-muted-foreground`} />
                      <span className="truncate">{t('sidebar.inventory_products')}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="/inventory/warehouses" isActive={isActive('/inventory/warehouses')} size="sm">
                      <Warehouse className={`${iconSize} text-muted-foreground`} />
                      <span className="truncate">{t('sidebar.inventory_warehouses')}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="/inventory/vehicles" isActive={isActive('/inventory/vehicles')} size="sm">
                      <Bus className={`${iconSize} text-muted-foreground`} />
                      <span className="truncate">{t('sidebar.inventory_vehicles')}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenuSubContent>
              </SidebarMenuSub>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuSub defaultOpen={isActive('/service-calls')}>
                <SidebarMenuSubTrigger tooltip={t('sidebar.service_calls')} isActive={isActive('/service-calls')}>
                  <Wrench className={iconSize} />
                  <span className="truncate">{t('sidebar.service_calls')}</span>
                  <ChevronDown />
                </SidebarMenuSubTrigger>
                <SidebarMenuSubContent>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="/service-calls/dashboard" isActive={isActive('/service-calls/dashboard')} size="sm">
                      <ServiceDashboardIcon className={`${iconSize} text-muted-foreground`} />
                      <span className="truncate">{t('sidebar.service_calls_dashboard')}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="/service-calls/service-types" isActive={isActive('/service-calls/service-types')} size="sm">
                      <ServiceTypesIcon className={`${iconSize} text-muted-foreground`} />
                      <span className="truncate">{t('sidebar.service_calls_service_types')}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenuSubContent>
              </SidebarMenuSub>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton href="/reports" isActive={isActive('/reports')} tooltip={t('sidebar.reports')}>
                <BarChart3 className={iconSize} />
                <span className="truncate">{t('sidebar.reports')}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuSub defaultOpen={isActive('/hr')}>
                <SidebarMenuSubTrigger tooltip={t('sidebar.hr')} isActive={isActive('/hr')}>
                  <BriefcaseBusiness className={iconSize} />
                  <span className="truncate">{t('sidebar.hr')}</span>
                  <ChevronDown />
                </SidebarMenuSubTrigger>
                <SidebarMenuSubContent>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="/hr/employees" isActive={isActive('/hr/employees')} size="sm">
                      <Users className={`${iconSize} text-muted-foreground`} />
                      <span className="truncate">{t('sidebar.hr_employees')}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenuSubContent>
              </SidebarMenuSub>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuSub defaultOpen={isActive('/settings')}>
                <SidebarMenuSubTrigger tooltip={t('sidebar.settings')} isActive={isActive('/settings')}>
                  <Settings className={iconSize} />
                  <span className="truncate">{t('sidebar.settings')}</span>
                  <ChevronDown />
                </SidebarMenuSubTrigger>
                <SidebarMenuSubContent>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="/settings/global" isActive={isActive('/settings/global')} size="sm">
                      <Cog className={`${iconSize} text-muted-foreground`} />
                      <span className="truncate">{t('sidebar.settings_global')}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuSub defaultOpen={isActive('/settings/business')}>
                      <SidebarMenuSubTrigger tooltip={t('sidebar.settings_business')} isActive={isActive('/settings/business')} size="sm">
                        <Briefcase className={`${iconSize} text-muted-foreground`} />
                        <span className="truncate">{t('sidebar.settings_business')}</span>
                        <ChevronDown />
                      </SidebarMenuSubTrigger>
                      <SidebarMenuSubContent>
                        <SidebarMenuItem>
                          <SidebarMenuButton href="/settings/business/pops" isActive={isActive('/settings/business/pops')} size="sm">
                            <Building className={`${iconSize} text-muted-foreground`} />
                            <span className="truncate">{t('sidebar.settings_business_pops')}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      </SidebarMenuSubContent>
                    </SidebarMenuSub>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuSub defaultOpen={isActive('/settings/plans')}>
                      <SidebarMenuSubTrigger tooltip={t('sidebar.settings_plans')} isActive={isActive('/settings/plans')} size="sm">
                        <ListChecks className={`${iconSize} text-muted-foreground`} />
                        <span className="truncate">{t('sidebar.settings_plans')}</span>
                        <ChevronDown />
                      </SidebarMenuSubTrigger>
                      <SidebarMenuSubContent>
                        <SidebarMenuItem>
                          <SidebarMenuButton href="/settings/plans/internet" isActive={isActive('/settings/plans/internet')} size="sm">
                            <Wifi className={`${iconSize} text-muted-foreground`} />
                            <span className="truncate">{t('sidebar.settings_plans_internet')}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton href="/settings/plans/tv" isActive={isActive('/settings/plans/tv')} size="sm">
                            <Tv className={`${iconSize} text-muted-foreground`} />
                            <span className="truncate">{t('sidebar.settings_plans_tv')}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton href="/settings/plans/mobile" isActive={isActive('/settings/plans/mobile')} size="sm">
                            <Smartphone className={`${iconSize} text-muted-foreground`} />
                            <span className="truncate">{t('sidebar.settings_plans_mobile')}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton href="/settings/plans/landline" isActive={isActive('/settings/plans/landline')} size="sm">
                            <Phone className={`${iconSize} text-muted-foreground`} />
                            <span className="truncate">{t('sidebar.settings_plans_landline')}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton href="/settings/plans/combos" isActive={isActive('/settings/plans/combos')} size="sm">
                            <Combine className={`${iconSize} text-muted-foreground`} />
                            <span className="truncate">{t('sidebar.settings_plans_combos')}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      </SidebarMenuSubContent>
                    </SidebarMenuSub>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuSub defaultOpen={isActive('/settings/network')}>
                      <SidebarMenuSubTrigger tooltip={t('sidebar.network')} isActive={isActive('/settings/network')} size="sm">
                        <NetworkIcon className={`${iconSize} text-muted-foreground`} />
                        <span className="truncate">{t('sidebar.network')}</span>
                        <ChevronDown />
                      </SidebarMenuSubTrigger>
                      <SidebarMenuSubContent>
                        <SidebarMenuItem>
                          <SidebarMenuButton href="/settings/network/ip" isActive={isActive('/settings/network/ip')} size="sm">
                            <Code className={`${iconSize} text-muted-foreground`} />
                            <span className="truncate">{t('sidebar.network_ip')}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton href="/settings/network/devices" isActive={isActive('/settings/network/devices')} size="sm">
                            <RouterIcon className={`${iconSize} text-muted-foreground`} />
                            <span className="truncate">{t('sidebar.network_devices')}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton href="/settings/network/cgnat" isActive={isActive('/settings/network/cgnat')} size="sm">
                            <Share2 className={`${iconSize} text-muted-foreground`} />
                            <span className="truncate">{t('sidebar.network_cgnat')}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton href="/settings/network/radius" isActive={isActive('/settings/network/radius')} size="sm">
                            <ServerIcon className={`${iconSize} text-muted-foreground`} />
                            <span className="truncate">{t('sidebar.network_radius')}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton href="/settings/network/vlan" isActive={isActive('/settings/network/vlan')} size="sm">
                            <Split className={`${iconSize} text-muted-foreground`} />
                            <span className="truncate">{t('sidebar.network_vlan')}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      </SidebarMenuSubContent>
                    </SidebarMenuSub>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="/settings/finances/configurations" isActive={isActive('/settings/finances/configurations')} size="sm">
                      <SlidersHorizontal className={`${iconSize} text-muted-foreground`} />
                      <span className="truncate">{t('sidebar.finances_config')}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="/settings/security" isActive={isActive('/settings/security')} size="sm">
                      <ShieldCheck className={`${iconSize} text-muted-foreground`} />
                      <span className="truncate">{t('sidebar.security')}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="/settings/system-monitor" isActive={isActive('/settings/system-monitor')} size="sm">
                      <RouterIcon className={`${iconSize} text-muted-foreground`} />
                      <span className="truncate">{t('sidebar.settings_system_monitor')}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuSub defaultOpen={isActive('/settings/integrations')}>
                      <SidebarMenuSubTrigger tooltip={t('sidebar.settings_integrations')} isActive={isActive('/settings/integrations')} size="sm">
                        <Plug className={`${iconSize} text-muted-foreground`} />
                        <span className="truncate">{t('sidebar.settings_integrations')}</span>
                        <ChevronDown />
                      </SidebarMenuSubTrigger>
                      <SidebarMenuSubContent>
                        <SidebarMenuItem>
                          <SidebarMenuButton href="/settings/integrations/whatsapp" isActive={isActive('/settings/integrations/whatsapp')} size="sm">
                            <MessageSquare className={`${iconSize} text-muted-foreground`} />
                            <span className="truncate">{t('sidebar.settings_integrations_whatsapp')}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton href="/settings/integrations/telegram" isActive={isActive('/settings/integrations/telegram')} size="sm">
                            <MessageSquare className={`${iconSize} text-muted-foreground`} />
                            <span className="truncate">{t('sidebar.settings_integrations_telegram')}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton href="/settings/integrations/meta" isActive={isActive('/settings/integrations/meta')} size="sm">
                            <MessageSquare className={`${iconSize} text-muted-foreground`} />
                            <span className="truncate">{t('sidebar.settings_integrations_meta')}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton href="/settings/integrations/sms" isActive={isActive('/settings/integrations/sms')} size="sm">
                            <Text className={`${iconSize} text-muted-foreground`} />
                            <span className="truncate">{t('sidebar.settings_integrations_sms')}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      </SidebarMenuSubContent>
                    </SidebarMenuSub>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="/settings/users" isActive={isActive('/settings/users')} size="sm">
                      <Users className={`${iconSize} text-muted-foreground`} />
                      <span className="truncate">{t('sidebar.settings_users')}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuSub defaultOpen={isActive('/settings/mysql')}>
                      <SidebarMenuSubTrigger tooltip={t('sidebar.mysql')} isActive={isActive('/settings/mysql')} size="sm">
                        <Database className={`${iconSize} text-muted-foreground`} />
                        <span className="truncate">{t('sidebar.mysql')}</span>
                        <ChevronDown />
                      </SidebarMenuSubTrigger>
                      <SidebarMenuSubContent>
                        <SidebarMenuItem>
                          <SidebarMenuButton href="/mysql/databases" isActive={isActive('/mysql/databases')} size="sm">
                            <Database className={`${iconSize} text-muted-foreground`} />
                            <span className="truncate">{t('sidebar.mysql_databases')}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton href="/mysql/cli" isActive={isActive('/mysql/cli')} size="sm">
                            <Code className={`${iconSize} text-muted-foreground`} />
                            <span className="truncate">{t('sidebar.mysql_cli')}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      </SidebarMenuSubContent>
                    </SidebarMenuSub>
                  </SidebarMenuItem>
                </SidebarMenuSubContent>
              </SidebarMenuSub>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton href="/pilotview" isActive={isActive('/pilotview')} tooltip={t('sidebar.pilotview')}>
                <TbDeviceImacStar className={iconSize} />
                <span className="truncate">{t('sidebar.pilotview')}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton href="/transitos" isActive={isActive('/transitos')} tooltip={t('sidebar.transitos')}>
                <SiReactrouter className={iconSize} />
                <span className="truncate">{t('sidebar.transitos')}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton href="/zones" isActive={isActive('/zones')} tooltip={t('sidebar.zones')}>
                <SiNextdns className={iconSize} />
                <span className="truncate">{t('sidebar.zones')}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
        </SidebarFooter>
      </Sidebar>
      <div className="flex flex-col flex-1 overflow-hidden">
        {!isMapPage && <AppHeader onToggleSidebar={toggleMobileSidebar} />}
        <SidebarInset noMargin={isMapPage}>
          <div className="fixed top-0 left-[var(--sidebar-width)] w-[calc(100%-var(--sidebar-width))] h-1 z-50">
            {isLoading && <Progress value={progress} className="w-full h-full rounded-none bg-transparent [&>div]:bg-accent" />}
          </div>
          <div className={isMapPage ? "p-0 h-full" : "p-2 h-[calc(100%-theme(space.12))] overflow-y-auto"}>
            {children}
          </div>
          <Toaster />
        </SidebarInset>
      </div>
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`antialiased`}
        suppressHydrationWarning
      >
        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryClientProvider client={queryClient}>
            <LocaleProvider>
              <TooltipProvider delayDuration={0}>
                <SidebarProvider side="left" collapsible="none">
                  <AppLayout>{children}</AppLayout>
                </SidebarProvider>
              </TooltipProvider>
            </LocaleProvider>
          </QueryClientProvider>
        </NextThemesProvider>
      </body>
    </html>
  );
}
    