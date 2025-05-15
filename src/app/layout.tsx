// src/app/layout.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';
import type { ReactNode } from 'react';
import {
  LayoutDashboard, ShieldCheck, Settings, Users, ChevronDown, Dot, MapPin, TowerControl, Cable, Power, Box, Puzzle, Warehouse, Globe, GitFork,
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
  BookOpen,
  SlidersHorizontal,
  Briefcase,
  Building,
  Cog,
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
  Network,
  Sun,
  Moon,
  Info,
  LogOut,
  UserCircle,
  Database,
  Bus,
  BriefcaseBusiness,
  FileCode,
  Wrench,
  LayoutDashboard as ServiceDashboardIcon,
  List as ServiceTypesIcon,
  ChevronRight,
  Menu as MenuIcon,
  ListTree,
  Users2,
  UserPlus
} from 'lucide-react';
import { SiNextdns } from "react-icons/si";
import { TbDeviceImacStar } from "react-icons/tb";
import { SiReactrouter } from "react-icons/si";

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

const ProlterLogo = () => {
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const fillColor = !isMounted ? '#14213D' : theme === 'dark' ? 'hsl(var(--accent))' : '#14213D';

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 131 32"
      xmlns="http://www.w3.org/2000/svg"
      fill={fillColor}
      style={{ maxWidth: '131px', height: '32px' }} // Ensures correct aspect ratio and max size
      preserveAspectRatio="xMidYMid meet" // Ensures the SVG scales correctly
    >
      <path d="M21.0938 18.375H18.2188V27H15.25V18.375H12.375V15.875H15.25V11.6562C15.25 9.5625 16.3438 8.03125 18.5312 8.03125L21.25 8.0625V10.625H19.5C18.8125 10.625 18.2188 10.9688 18.2188 11.8438V15.875H21.2188L21.0938 18.375Z" />
      <path d="M33.2812 20.0625C33.1875 20.0938 33.0938 20.0938 33 20.125C31.6562 20.7812 30.0938 21.125 28.3438 21.125C24.5312 21.125 22.1562 18.5312 22.1562 14.5312C22.1562 10.5312 24.5312 7.9375 28.3438 7.9375C30.0938 7.9375 31.6562 8.28125 33 8.9375C33.0938 8.96875 33.1875 8.96875 33.2812 9V11.4375C33.1875 11.4062 33.0938 11.4062 33 11.375C32.0312 10.9062 30.8438 10.5 29.5312 10.5C27.2812 10.5 26.0312 12.0312 26.0312 14.5312C26.0312 17.0312 27.2812 18.5625 29.5312 18.5625C30.8438 18.5625 32.0312 18.1562 33 17.6875C33.0938 17.6562 33.1875 17.6562 33.2812 17.625V20.0625Z" />
      <path d="M42.2188 18.8125L38.9375 8.09375H35.5938L32.3125 18.8125L32.2188 21H34.5938L35.2188 18.9062H39.4062L40.0312 21H42.4062L42.2188 18.8125ZM37.3125 12.5938L38.3125 16.4062H36.3125L37.3125 12.5938Z" />
      <path d="M51.2812 20.0625C51.1875 20.0938 51.0938 20.0938 51 20.125C49.6562 20.7812 48.0938 21.125 46.3438 21.125C42.5312 21.125 40.1562 18.5312 40.1562 14.5312C40.1562 10.5312 42.5312 7.9375 46.3438 7.9375C48.0938 7.9375 49.6562 8.28125 51 8.9375C51.0938 8.96875 51.1875 8.96875 51.2812 9V11.4375C51.1875 11.4062 51.0938 11.4062 51 11.375C50.0312 10.9062 48.8438 10.5 47.5312 10.5C45.2812 10.5 44.0312 12.0312 44.0312 14.5312C44.0312 17.0312 45.2812 18.5625 47.5312 18.5625C48.8438 18.5625 50.0312 18.1562 51 17.6875C51.0938 17.6562 51.1875 17.6562 51.2812 17.625V20.0625Z" />
      <path d="M58.4062 18.375H55.5312V27H52.5625V18.375H49.6875V15.875H52.5625V11.6562C52.5625 9.5625 53.6562 8.03125 55.8438 8.03125L58.5625 8.0625V10.625H56.8125C56.125 10.625 55.5312 10.9688 55.5312 11.8438V15.875H58.5312L58.4062 18.375Z" />
      <path d="M66.8125 21H63.7812V8.09375H66.8125V21Z" />
      <path d="M79.6875 21H76.6562V8.09375H79.6875V21Z" />
      <path d="M93.625 21H80.7812V18.4375H90.5938V8.09375H93.625V21Z" />
      <path d="M102.375 21H96.5625C93.9062 21 92.0312 19.125 92.0312 16.5312V10.5625C92.0312 7.96875 93.9062 6.09375 96.5625 6.09375H102.375V8.65625H96.875C95.75 8.65625 95.0625 9.34375 95.0625 10.5312V16.5625C95.0625 17.75 95.75 18.4375 96.875 18.4375H102.375V21Z" />
      <path d="M109.656 18.8125L106.375 8.09375H103.031L99.75 18.8125L99.6562 21H102.031L102.656 18.9062H106.844L107.469 21H109.844L109.656 18.8125ZM104.75 12.5938L105.75 16.4062H103.75L104.75 12.5938Z" />
      <path d="M120.594 21H111.031V18.4375H114.594V13.5312H111.031V10.9688H114.594V8.09375H120.594V10.9688H117.156V13.5312H120.594V15.875H117.156V18.4375H120.594V21Z" />
      <path d="M126.031 18.375H123.156V27H120.188V18.375H117.312V15.875H120.188V11.6562C120.188 9.5625 121.281 8.03125 123.469 8.03125L126.188 8.0625V10.625H124.438C123.75 10.625 123.156 10.9688 123.156 11.8438V15.875H126.156L126.031 18.375Z" />
      <path d="M0.5 0.5H4.5V4.5H0.5V0.5Z" />
      <path d="M0.5 8.5H4.5V12.5H0.5V8.5Z" />
      <path d="M0.5 16.5H4.5V20.5H0.5V16.5Z" />
      <path d="M0.5 24.5H4.5V28.5H0.5V24.5Z" />
      <path d="M8.5 0.5H12.5V4.5H8.5V0.5Z" />
      <path d="M8.5 8.5H12.5V12.5H8.5V8.5Z" />
  </svg>
  );
};


const queryClient = new QueryClient();

function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const { t } = useLocale();
  const { isMobile, isOpenMobile, setIsOpenMobile, collapsed, setCollapsed, collapsible } = useSidebar();


  const toggleMobileSidebar = () => setIsOpenMobile(!isOpenMobile);

  // This function is not used since collapsible is 'none'
  // const toggleDesktopSidebar = () => {
  //   if (collapsible !== 'none') {
  //     setCollapsed(!collapsed);
  //   }
  // };


  React.useEffect(() => {
    if (!isMobile && isOpenMobile) {
      setIsOpenMobile(false);
    }
  }, [isMobile, isOpenMobile, setIsOpenMobile]);


  React.useEffect(() => {
    if (pathname) {
      setIsLoading(true);
      setProgress(10);

      const timer = setTimeout(() => {
        setProgress(90);
      }, 100);

      const finishTimer = setTimeout(() => {
        setProgress(100);
        const hideTimer = setTimeout(() => {
          setIsLoading(false);
          setProgress(0);
        }, 300);
        return () => clearTimeout(hideTimer);
      }, 500);

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


  const isMapPage = pathname === '/maps/map';

  return (
    <div className="flex flex-col h-screen"> {/* Outer container: vertical flex, full height */}
      {/* Header: Spans full width at the top */}
      {!isMapPage && <AppHeader onToggleSidebar={toggleMobileSidebar} />}
      
      {/* Container for Sidebar and Main Content: horizontal flex, takes remaining height */}
      <div className="flex flex-1 overflow-hidden"> 
        <Sidebar>
          <SidebarHeader>
              <Link href="/" className="flex items-center justify-center w-full h-full" style={{ textDecoration: 'none' }}>
                <ProlterLogo />
              </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
            {/* Dashboard */}
            <SidebarMenuItem>
              <SidebarMenuButton href="/" isActive={isActive('/')} tooltip={t('sidebar.dashboard')}>
                  <LayoutDashboard />
                  <span className="truncate">{t('sidebar.dashboard')}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Subscribers Menu - Direct Link */}
            <SidebarMenuItem>
              <SidebarMenuButton href="/subscribers/list" isActive={isActive('/subscribers/list')} tooltip={t('sidebar.subscribers')}>
                  <Users />
                  <span className="truncate">{t('sidebar.subscribers')}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Maps Menu */}
            <SidebarMenuItem>
              <SidebarMenuSub>
                  <SidebarMenuSubTrigger tooltip={t('sidebar.maps')} isActive={isActive('/maps')}>
                    <div className="flex items-center gap-2 cursor-pointer">
                      <MapPin />
                      <span className="truncate">{t('sidebar.maps')}</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                    </div>
                  </SidebarMenuSubTrigger>
                <SidebarMenuSubContent>
                  <SidebarMenuItem>
                      <SidebarMenuButton href="/maps/projects" isActive={isActive('/maps/projects')} size="sm">
                          <FileCode className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate">{t('sidebar.maps_projects')}</span>
                      </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuSub>
                         <SidebarMenuSubTrigger tooltip={t('sidebar.maps_elements')} isActive={isActive('/maps/elements')} size="sm">
                            <div className="flex items-center gap-2 cursor-pointer">
                              <ListTree className="h-4 w-4 text-muted-foreground"/>
                              <span className="truncate">{t('sidebar.maps_elements')}</span>
                              <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                            </div>
                         </SidebarMenuSubTrigger>
                      <SidebarMenuSubContent>
                          <SidebarMenuItem>
                              <SidebarMenuButton href="/maps/elements/polls" isActive={isActive('/maps/elements/polls')} size="sm">
                                  <Power className="h-4 w-4 text-muted-foreground"/>
                                  <span className="truncate">{t('sidebar.maps_elements_polls')}</span>
                              </SidebarMenuButton>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                              <SidebarMenuButton href="/maps/elements/fdhs" isActive={isActive('/maps/elements/fdhs')} size="sm">
                                  <Box className="h-4 w-4 text-muted-foreground"/>
                                  <span className="truncate">{t('sidebar.maps_elements_fdhs')}</span>
                              </SidebarMenuButton>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                              <SidebarMenuButton href="/maps/elements/foscs" isActive={isActive('/maps/elements/foscs')} size="sm">
                                  <Warehouse className="h-4 w-4 text-muted-foreground"/>
                                  <span className="truncate">{t('sidebar.maps_elements_foscs')}</span>
                              </SidebarMenuButton>
                          </SidebarMenuItem>
                           <SidebarMenuItem>
                              <SidebarMenuButton href="/maps/elements/peds" isActive={isActive('/maps/elements/peds')} size="sm">
                                  <Box className="h-4 w-4 text-muted-foreground"/>
                                  <span className="truncate">{t('sidebar.maps_elements_peds')}</span>
                              </SidebarMenuButton>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                              <SidebarMenuButton href="/maps/elements/accessories" isActive={isActive('/maps/elements/accessories')} size="sm">
                                  <Puzzle className="h-4 w-4 text-muted-foreground"/>
                                  <span className="truncate">{t('sidebar.maps_elements_accessories')}</span>
                              </SidebarMenuButton>
                          </SidebarMenuItem>
                           <SidebarMenuItem>
                              <SidebarMenuButton href="/maps/elements/splitters" isActive={isActive('/maps/elements/splitters')} size="sm">
                                  <Split className="h-4 w-4 text-muted-foreground"/>
                                  <span className="truncate">{t('sidebar.maps_elements_splitters')}</span>
                              </SidebarMenuButton>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                              <SidebarMenuButton href="/maps/elements/towers" isActive={isActive('/maps/elements/towers')} size="sm">
                                  <TowerControl className="h-4 w-4 text-muted-foreground"/>
                                  <span className="truncate">{t('sidebar.maps_elements_towers')}</span>
                              </SidebarMenuButton>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                              <SidebarMenuButton href="/maps/elements/cables" isActive={isActive('/maps/elements/cables')} size="sm">
                                  <Cable className="h-4 w-4 text-muted-foreground"/>
                                  <span className="truncate">{t('sidebar.maps_elements_cables')}</span>
                              </SidebarMenuButton>
                          </SidebarMenuItem>
                      </SidebarMenuSubContent>
                    </SidebarMenuSub>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                      <SidebarMenuButton href="/maps/map" isActive={isActive('/maps/map')} size="sm">
                          <Globe className="h-4 w-4 text-muted-foreground"/>
                          <span className="truncate">{t('sidebar.maps_map')}</span>
                      </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenuSubContent>
              </SidebarMenuSub>
            </SidebarMenuItem>

            {/* FTTx Menu */}
            <SidebarMenuItem>
                <SidebarMenuSub>
                  <SidebarMenuSubTrigger tooltip={t('sidebar.fttx')} isActive={isActive('/fttx')}>
                    <div className="flex items-center gap-2 cursor-pointer">
                      <GitBranch />
                      <span className="truncate">{t('sidebar.fttx')}</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                    </div>
                  </SidebarMenuSubTrigger>
                  <SidebarMenuSubContent>
                    <SidebarMenuItem>
                      <SidebarMenuButton href="/fttx/dashboard" isActive={isActive('/fttx/dashboard')} size="sm">
                          <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate">{t('sidebar.fttx_dashboard')}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton href="/fttx/olts" isActive={isActive('/fttx/olts')} size="sm">
                          <Network className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate">{t('sidebar.fttx_olts')}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton href="/fttx/onx-templates" isActive={isActive('/fttx/onx-templates')} size="sm">
                          <FileTextIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate">{t('sidebar.fttx_onx_templates')}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenuSubContent>
                </SidebarMenuSub>
            </SidebarMenuItem>

            {/* Finances Menu */}
            <SidebarMenuItem>
                <SidebarMenuSub>
                  <SidebarMenuSubTrigger tooltip={t('sidebar.finances')} isActive={isActive('/finances')}>
                    <div className="flex items-center gap-2 cursor-pointer">
                      <DollarSign />
                      <span className="truncate">{t('sidebar.finances')}</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                    </div>
                  </SidebarMenuSubTrigger>
                  <SidebarMenuSubContent>
                    <SidebarMenuItem>
                      <SidebarMenuButton href="/finances/cash-book" isActive={isActive('/finances/cash-book')} size="sm">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate">{t('sidebar.finances_cash_book')}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton href="/finances/entry-categories" isActive={isActive('/finances/entry-categories')} size="sm">
                          <ListFilter className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate">{t('sidebar.finances_entry_categories')}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenuSubContent>
                </SidebarMenuSub>
            </SidebarMenuItem>

              {/* Inventory Menu */}
            <SidebarMenuItem>
                <SidebarMenuSub>
                  <SidebarMenuSubTrigger tooltip={t('sidebar.inventory')} isActive={isActive('/inventory')}>
                    <div className="flex items-center gap-2 cursor-pointer">
                      <Archive />
                      <span className="truncate">{t('sidebar.inventory')}</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                    </div>
                  </SidebarMenuSubTrigger>
                  <SidebarMenuSubContent>
                    <SidebarMenuItem>
                      <SidebarMenuButton href="/inventory/categories" isActive={isActive('/inventory/categories')} size="sm">
                          <ListFilter className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate">{t('sidebar.inventory_categories')}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton href="/inventory/manufacturers" isActive={isActive('/inventory/manufacturers')} size="sm">
                          <Factory className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate">{t('sidebar.inventory_manufacturers')}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton href="/inventory/suppliers" isActive={isActive('/inventory/suppliers')} size="sm">
                          <Truck className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate">{t('sidebar.inventory_suppliers')}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton href="/inventory/products" isActive={isActive('/inventory/products')} size="sm">
                          <PackageIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate">{t('sidebar.inventory_products')}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton href="/inventory/warehouses" isActive={isActive('/inventory/warehouses')} size="sm">
                          <Warehouse className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate">{t('sidebar.inventory_warehouses')}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                      <SidebarMenuItem>
                      <SidebarMenuButton href="/inventory/vehicles" isActive={isActive('/inventory/vehicles')} size="sm">
                          <Bus className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate">{t('sidebar.inventory_vehicles')}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenuSubContent>
                </SidebarMenuSub>
            </SidebarMenuItem>
            
            {/* Service Calls Menu */}
            <SidebarMenuItem>
              <SidebarMenuSub>
                <SidebarMenuSubTrigger tooltip={t('sidebar.service_calls')} isActive={isActive('/service-calls')}>
                  <div className="flex items-center gap-2 cursor-pointer">
                    <Wrench />
                    <span className="truncate">{t('sidebar.service_calls')}</span>
                    <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                  </div>
                </SidebarMenuSubTrigger>
                <SidebarMenuSubContent>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="/service-calls/dashboard" isActive={isActive('/service-calls/dashboard')} size="sm">
                        <ServiceDashboardIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="truncate">{t('sidebar.service_calls_dashboard')}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="/service-calls/service-types" isActive={isActive('/service-calls/service-types')} size="sm">
                        <ServiceTypesIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="truncate">{t('sidebar.service_calls_service_types')}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenuSubContent>
              </SidebarMenuSub>
            </SidebarMenuItem>

            {/* Reports */}
            <SidebarMenuItem>
              <SidebarMenuButton href="/reports" isActive={isActive('/reports')} tooltip={t('sidebar.reports')}>
                  <BarChart3 />
                  <span className="truncate">{t('sidebar.reports')}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* HR Menu */}
            <SidebarMenuItem>
                <SidebarMenuSub>
                  <SidebarMenuSubTrigger tooltip={t('sidebar.hr')} isActive={isActive('/hr')}>
                    <div className="flex items-center gap-2 cursor-pointer">
                      <BriefcaseBusiness />
                      <span className="truncate">{t('sidebar.hr')}</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                    </div>
                  </SidebarMenuSubTrigger>
                  <SidebarMenuSubContent>
                    <SidebarMenuItem>
                      <SidebarMenuButton href="/hr/employees" isActive={isActive('/hr/employees')} size="sm">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate">{t('sidebar.hr_employees')}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenuSubContent>
                </SidebarMenuSub>
            </SidebarMenuItem>


            {/* Settings Menu */}
            <SidebarMenuItem>
                <SidebarMenuSub>
                  <SidebarMenuSubTrigger tooltip={t('sidebar.settings')} isActive={isActive('/settings')}>
                    <div className="flex items-center gap-2 cursor-pointer">
                      <Settings />
                      <span className="truncate">{t('sidebar.settings')}</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                    </div>
                  </SidebarMenuSubTrigger>
                  <SidebarMenuSubContent>
                    <SidebarMenuItem>
                      <SidebarMenuButton href="/settings/global" isActive={isActive('/settings/global')} size="sm">
                          <Cog className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate">{t('sidebar.settings_global')}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    {/* Business Sub-Accordion */}
                    <SidebarMenuItem>
                        <SidebarMenuSub>
                          <SidebarMenuSubTrigger tooltip={t('sidebar.settings_business')} isActive={isActive('/settings/business')} size="sm">
                              <div className="flex items-center gap-2 cursor-pointer">
                                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                                  <span className="truncate">{t('sidebar.settings_business')}</span>
                                  <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                              </div>
                          </SidebarMenuSubTrigger>
                          <SidebarMenuSubContent>
                            <SidebarMenuItem>
                              <SidebarMenuButton href="/settings/business/pops" isActive={isActive('/settings/business/pops')} size="sm">
                                  <Building className="h-4 w-4 text-muted-foreground" />
                                  <span className="truncate">{t('sidebar.settings_business_pops')}</span>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          </SidebarMenuSubContent>
                        </SidebarMenuSub>
                    </SidebarMenuItem>
                    {/* Plans Sub-Accordion */}
                    <SidebarMenuItem>
                        <SidebarMenuSub>
                          <SidebarMenuSubTrigger tooltip={t('sidebar.settings_plans')} isActive={isActive('/settings/plans')} size="sm">
                              <div className="flex items-center gap-2 cursor-pointer">
                                  <ListChecks className="h-4 w-4 text-muted-foreground" />
                                  <span className="truncate">{t('sidebar.settings_plans')}</span>
                                  <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                              </div>
                          </SidebarMenuSubTrigger>
                          <SidebarMenuSubContent>
                            <SidebarMenuItem>
                              <SidebarMenuButton href="/settings/plans/internet" isActive={isActive('/settings/plans/internet')} size="sm">
                                  <Wifi className="h-4 w-4 text-muted-foreground" />
                                  <span className="truncate">{t('sidebar.settings_plans_internet')}</span>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                              <SidebarMenuButton href="/settings/plans/tv" isActive={isActive('/settings/plans/tv')} size="sm">
                                  <Tv className="h-4 w-4 text-muted-foreground" />
                                  <span className="truncate">{t('sidebar.settings_plans_tv')}</span>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                              <SidebarMenuButton href="/settings/plans/mobile" isActive={isActive('/settings/plans/mobile')} size="sm">
                                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                                  <span className="truncate">{t('sidebar.settings_plans_mobile')}</span>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                              <SidebarMenuButton href="/settings/plans/landline" isActive={isActive('/settings/plans/landline')} size="sm">
                                  <Phone className="h-4 w-4 text-muted-foreground" />
                                  <span className="truncate">{t('sidebar.settings_plans_landline')}</span>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                              <SidebarMenuButton href="/settings/plans/combos" isActive={isActive('/settings/plans/combos')} size="sm">
                                  <Combine className="h-4 w-4 text-muted-foreground" />
                                  <span className="truncate">{t('sidebar.settings_plans_combos')}</span>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          </SidebarMenuSubContent>
                        </SidebarMenuSub>
                    </SidebarMenuItem>
                    {/* Network (moved under settings) */}
                    <SidebarMenuItem>
                      <SidebarMenuSub>
                        <SidebarMenuSubTrigger tooltip={t('sidebar.network')} isActive={isActive('/settings/network')} size="sm">
                            <div className="flex items-center gap-2 cursor-pointer">
                                <Network className="h-4 w-4 text-muted-foreground" />
                                <span className="truncate">{t('sidebar.network')}</span>
                                <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                            </div>
                        </SidebarMenuSubTrigger>
                        <SidebarMenuSubContent>
                          <SidebarMenuItem>
                            <SidebarMenuButton href="/settings/network/ip" isActive={isActive('/settings/network/ip')} size="sm">
                                <Code className="h-4 w-4 text-muted-foreground"/>
                                <span className="truncate">{t('sidebar.network_ip')}</span>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <SidebarMenuButton href="/settings/network/devices" isActive={isActive('/settings/network/devices')} size="sm">
                                <RouterIcon className="h-4 w-4 text-muted-foreground"/>
                                <span className="truncate">{t('sidebar.network_devices')}</span>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <SidebarMenuButton href="/settings/network/cgnat" isActive={isActive('/settings/network/cgnat')} size="sm">
                                <Share2 className="h-4 w-4 text-muted-foreground"/>
                                <span className="truncate">{t('sidebar.network_cgnat')}</span>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <SidebarMenuButton href="/settings/network/radius" isActive={isActive('/settings/network/radius')} size="sm">
                                <ServerIcon className="h-4 w-4 text-muted-foreground"/>
                                <span className="truncate">{t('sidebar.network_radius')}</span>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <SidebarMenuButton href="/settings/network/vlan" isActive={isActive('/settings/network/vlan')} size="sm">
                                <Split className="h-4 w-4 text-muted-foreground"/>
                                <span className="truncate">{t('sidebar.network_vlan')}</span>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        </SidebarMenuSubContent>
                      </SidebarMenuSub>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton href="/settings/finances/configurations" isActive={isActive('/settings/finances/configurations')} size="sm">
                          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate">{t('sidebar.finances_config')}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton href="/settings/security" isActive={isActive('/settings/security')} size="sm">
                          <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate">{t('sidebar.security')}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton href="/settings/system-monitor" isActive={isActive('/settings/system-monitor')} size="sm">
                          <RouterIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate">{t('sidebar.settings_system_monitor')}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    {/* Integrations Sub-Accordion */}
                    <SidebarMenuItem>
                        <SidebarMenuSub>
                          <SidebarMenuSubTrigger tooltip={t('sidebar.settings_integrations')} isActive={isActive('/settings/integrations')} size="sm">
                              <div className="flex items-center gap-2 cursor-pointer">
                                  <Plug className="h-4 w-4 text-muted-foreground" />
                                  <span className="truncate">{t('sidebar.settings_integrations')}</span>
                                  <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                              </div>
                          </SidebarMenuSubTrigger>
                          <SidebarMenuSubContent>
                            <SidebarMenuItem>
                              <SidebarMenuButton href="/settings/integrations/whatsapp" isActive={isActive('/settings/integrations/whatsapp')} size="sm">
                                  <MessageSquare className="h-4 w-4 text-muted-foreground"/>
                                  <span className="truncate">{t('sidebar.settings_integrations_whatsapp')}</span>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                              <SidebarMenuButton href="/settings/integrations/telegram" isActive={isActive('/settings/integrations/telegram')} size="sm">
                                  <MessageSquare className="h-4 w-4 text-muted-foreground"/>
                                  <span className="truncate">{t('sidebar.settings_integrations_telegram')}</span>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                              <SidebarMenuButton href="/settings/integrations/meta" isActive={isActive('/settings/integrations/meta')} size="sm">
                                  <MessageSquare className="h-4 w-4 text-muted-foreground"/>
                                  <span className="truncate">{t('sidebar.settings_integrations_meta')}</span>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                              <SidebarMenuButton href="/settings/integrations/sms" isActive={isActive('/settings/integrations/sms')} size="sm">
                                  <Text className="h-4 w-4 text-muted-foreground"/>
                                  <span className="truncate">{t('sidebar.settings_integrations_sms')}</span>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          </SidebarMenuSubContent>
                        </SidebarMenuSub>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton href="/settings/users" isActive={isActive('/settings/users')} size="sm">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate">{t('sidebar.settings_users')}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    {/* MySQL Sub-Accordion */}
                    <SidebarMenuItem>
                        <SidebarMenuSub>
                          <SidebarMenuSubTrigger tooltip={t('sidebar.mysql')} isActive={isActive('/settings/mysql')} size="sm">
                              <div className="flex items-center gap-2 cursor-pointer">
                                  <Database className="h-4 w-4 text-muted-foreground" />
                                  <span className="truncate">{t('sidebar.mysql')}</span>
                                  <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                              </div>
                          </SidebarMenuSubTrigger>
                          <SidebarMenuSubContent>
                            <SidebarMenuItem>
                              <SidebarMenuButton href="/mysql/databases" isActive={isActive('/mysql/databases')} size="sm">
                                  <Database className="h-4 w-4 text-muted-foreground"/>
                                  <span className="truncate">{t('sidebar.mysql_databases')}</span>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                              <SidebarMenuButton href="/mysql/cli" isActive={isActive('/mysql/cli')} size="sm">
                                  <Code className="h-4 w-4 text-muted-foreground"/>
                                  <span className="truncate">{t('sidebar.mysql_cli')}</span>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          </SidebarMenuSubContent>
                        </SidebarMenuSub>
                    </SidebarMenuItem>
                  </SidebarMenuSubContent>
                </SidebarMenuSub>
            </SidebarMenuItem>

            {/* Separator */}
            <SidebarSeparator />

            {/* PilotView */}
            <SidebarMenuItem>
              <SidebarMenuButton href="/pilotview" isActive={isActive('/pilotview')} tooltip={t('sidebar.pilotview')}>
                  <TbDeviceImacStar />
                  <span className="truncate">{t('sidebar.pilotview')}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* TransitOS */}
            <SidebarMenuItem>
              <SidebarMenuButton href="/transitos" isActive={isActive('/transitos')} tooltip={t('sidebar.transitos')}>
                  <SiReactrouter />
                  <span className="truncate">{t('sidebar.transitos')}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Zones (DNS) */}
            <SidebarMenuItem>
              <SidebarMenuButton href="/zones" isActive={isActive('/zones')} tooltip={t('sidebar.zones')}>
                  <SiNextdns />
                  <span className="truncate">{t('sidebar.zones')}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
             {/* Footer content can be added here if needed */}
          </SidebarFooter>
        </Sidebar>
        
        <SidebarInset noMargin={isMapPage}>
          {/* Loading Progress Bar */}
          <div className="fixed top-0 left-0 w-full h-1 z-50">
            {isLoading && <Progress value={progress} className="w-full h-full rounded-none bg-transparent [&>div]:bg-accent" />}
          </div>
          
          {/* Actual content area with padding */}
          {/* The p-5 class ensures a 20px padding around the content like the dashboard */}
          <div className={isMapPage ? "p-0 h-full" : "p-5 h-[calc(100%-theme(space.12))] overflow-y-auto"}>
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
        className={`antialiased min-h-screen flex flex-col h-full`}
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
                <SidebarProvider side="left" collapsible="none"> {/* Ensure sidebar is non-collapsible */}
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
