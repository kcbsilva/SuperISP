// src/app/layout.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, type ReactNode } from 'react';
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
  SidebarInset,
  SidebarMenuSub, 
  SidebarMenuSubTrigger,
  SidebarMenuSubContent,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { AppHeader } from '@/components/app-header';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Progress } from '@/components/ui/progress';
import { LocaleProvider, useLocale } from '@/contexts/LocaleContext';
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';
import { useIsMobile } from '@/hooks/use-mobile';

const ProlterLogo = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 131 32"
    xmlns="http://www.w3.org/2000/svg"
    className="text-foreground dark:text-accent" // Use Tailwind classes for fill
    fill="currentColor" // Set fill to currentColor to inherit text color
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


const queryClient = new QueryClient();

function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { t, locale } = useLocale();
  const { theme } = useTheme();

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleMobileSidebar = () => setIsMobileSidebarOpen(!isMobileSidebarOpen);


  useEffect(() => {
    if (!isMobile && isMobileSidebarOpen) {
      setIsMobileSidebarOpen(false);
    }
  }, [isMobile, isMobileSidebarOpen]);


  useEffect(() => {
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
    return cleanPathname === href || (cleanHref !== '/' && cleanPathname.startsWith(cleanHref));
  };


  const isMapPage = pathname === '/maps/map';

  return (
    <TooltipProvider>
        <SidebarProvider side="left" collapsible="none"> {/* Removed collapsible prop */}
            <Sidebar>
            <SidebarHeader>
                <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-sidebar-primary" style={{ width: '131px', height: '32px' }}>
                  <ProlterLogo />
                </Link>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
              {/* Dashboard */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/')} tooltip={t('sidebar.dashboard')}>
                  <Link href="/" className="flex items-center gap-2">
                    <LayoutDashboard />
                    <span className="truncate">{t('sidebar.dashboard')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Subscribers Menu - Direct Links */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/subscribers/list')} tooltip={t('sidebar.subscribers')}>
                  <Link href="/subscribers/list" className="flex items-center gap-2">
                    <Users />
                    <span className="truncate">{t('sidebar.subscribers')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Maps Menu */}
              <SidebarMenuItem>
                 <SidebarMenuSub>
                   <Tooltip>
                     <TooltipTrigger asChild>
                       <SidebarMenuSubTrigger tooltip={t('sidebar.maps')} isActive={isActive('/maps')}>
                         <div className="flex items-center gap-2 cursor-pointer">
                           <MapPin /> {/* Top level Chat icon */}
                           <span className="truncate">{t('sidebar.maps')}</span>
                           <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                         </div>
                       </SidebarMenuSubTrigger>
                     </TooltipTrigger>
                     <TooltipContent side="right" align="center">{t('sidebar.maps')}</TooltipContent>
                   </Tooltip>
                   <SidebarMenuSubContent>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isActive('/maps/map')} size="sm" tooltip={t('sidebar.maps_map')}>
                          <Link href="/maps/map" className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-muted-foreground"/> {/* Icon Added */}
                            <span>{t('sidebar.maps_map')}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isActive('/maps/projects')} size="sm" tooltip={t('sidebar.maps_projects')}>
                          <Link href="/maps/projects" className="flex items-center gap-2">
                            <FileCode className="h-4 w-4 text-muted-foreground"/>
                            <span>{t('sidebar.maps_projects')}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    {/* Elements Item - Now a Submenu Trigger */}
                    <SidebarMenuItem>
                      <SidebarMenuSub>
                         <Tooltip>
                           <TooltipTrigger asChild>
                             <SidebarMenuSubTrigger tooltip={t('sidebar.maps_elements')} isActive={isActive('/maps/elements')} size="sm">
                                <div className="flex items-center gap-2 cursor-pointer">
                                    <GitFork className="h-4 w-4 text-muted-foreground"/> {/* Icon for Elements trigger */}
                                    <span className="truncate">{t('sidebar.maps_elements')}</span>
                                    <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                                </div>
                             </SidebarMenuSubTrigger>
                           </TooltipTrigger>
                           <TooltipContent side="right" align="center">{t('sidebar.maps_elements')}</TooltipContent>
                         </Tooltip>
                        <SidebarMenuSubContent>
                           <SidebarMenuItem>
                             <SidebarMenuButton asChild isActive={isActive('/maps/elements/polls')} size="sm"><Link href="/maps/elements/polls" className="flex items-center gap-2">
                                 <Power className="h-4 w-4 text-muted-foreground"/>
                                 <span>{t('sidebar.maps_elements_polls')}</span>
                              </Link></SidebarMenuButton>
                           </SidebarMenuItem>
                           <SidebarMenuItem>
                             <SidebarMenuButton asChild isActive={isActive('/maps/elements/fdhs')} size="sm"><Link href="/maps/elements/fdhs" className="flex items-center gap-2">
                                 <Box className="h-4 w-4 text-muted-foreground"/>
                                 <span>{t('sidebar.maps_elements_fdhs')}</span>
                              </Link></SidebarMenuButton>
                           </SidebarMenuItem>
                           <SidebarMenuItem>
                             <SidebarMenuButton asChild isActive={isActive('/maps/elements/foscs')} size="sm"><Link href="/maps/elements/foscs" className="flex items-center gap-2">
                                 <Warehouse className="h-4 w-4 text-muted-foreground"/>
                                 <span>{t('sidebar.maps_elements_foscs')}</span>
                              </Link></SidebarMenuButton>
                           </SidebarMenuItem>
                           <SidebarMenuItem>
                             <SidebarMenuButton asChild isActive={isActive('/maps/elements/peds')} size="sm"><Link href="/maps/elements/peds" className="flex items-center gap-2">
                                 <Box className="h-4 w-4 text-muted-foreground"/>
                                 <span>{t('sidebar.maps_elements_peds')}</span>
                              </Link></SidebarMenuButton>
                           </SidebarMenuItem>
                           <SidebarMenuItem>
                             <SidebarMenuButton asChild isActive={isActive('/maps/elements/accessories')} size="sm"><Link href="/maps/elements/accessories" className="flex items-center gap-2">
                                 <Puzzle className="h-4 w-4 text-muted-foreground"/>
                                 <span>{t('sidebar.maps_elements_accessories')}</span>
                              </Link></SidebarMenuButton>
                           </SidebarMenuItem>
                           <SidebarMenuItem>
                             <SidebarMenuButton asChild isActive={isActive('/maps/elements/splitters')} size="sm"><Link href="/maps/elements/splitters" className="flex items-center gap-2">
                                 <Split className="h-4 w-4 text-muted-foreground"/>
                                 <span>{t('sidebar.maps_elements_splitters')}</span>
                              </Link></SidebarMenuButton>
                           </SidebarMenuItem>
                           <SidebarMenuItem>
                             <SidebarMenuButton asChild isActive={isActive('/maps/elements/towers')} size="sm"><Link href="/maps/elements/towers" className="flex items-center gap-2">
                                 <TowerControl className="h-4 w-4 text-muted-foreground"/>
                                 <span>{t('sidebar.maps_elements_towers')}</span>
                              </Link></SidebarMenuButton>
                           </SidebarMenuItem>
                           <SidebarMenuItem>
                             <SidebarMenuButton asChild isActive={isActive('/maps/elements/cables')} size="sm"><Link href="/maps/elements/cables" className="flex items-center gap-2">
                                 <Cable className="h-4 w-4 text-muted-foreground"/>
                                 <span>{t('sidebar.maps_elements_cables')}</span>
                              </Link></SidebarMenuButton>
                           </SidebarMenuItem>
                        </SidebarMenuSubContent>
                      </SidebarMenuSub>
                    </SidebarMenuItem>
                   </SidebarMenuSubContent>
                 </SidebarMenuSub>
              </SidebarMenuItem>

              {/* FTTx Menu */}
              <SidebarMenuItem>
                 <SidebarMenuSub>
                   <Tooltip>
                     <TooltipTrigger asChild>
                       <SidebarMenuSubTrigger tooltip={t('sidebar.fttx')} isActive={isActive('/fttx')}>
                         <div className="flex items-center gap-2 cursor-pointer">
                           <GitBranch />
                           <span className="truncate">{t('sidebar.fttx')}</span>
                           <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                         </div>
                       </SidebarMenuSubTrigger>
                     </TooltipTrigger>
                     <TooltipContent side="right" align="center">{t('sidebar.fttx')}</TooltipContent>
                   </Tooltip>
                   <SidebarMenuSubContent>
                     <SidebarMenuItem>
                       <SidebarMenuButton asChild isActive={isActive('/fttx/dashboard')} size="sm">
                         <Link href="/fttx/dashboard" className="flex items-center gap-2">
                           <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                           <span>{t('sidebar.fttx_dashboard')}</span>
                         </Link>
                       </SidebarMenuButton>
                     </SidebarMenuItem>
                     <SidebarMenuItem>
                       <SidebarMenuButton asChild isActive={isActive('/fttx/olts')} size="sm">
                         <Link href="/fttx/olts" className="flex items-center gap-2">
                           <Network className="h-4 w-4 text-muted-foreground" />
                           <span>{t('sidebar.fttx_olts')}</span>
                         </Link>
                       </SidebarMenuButton>
                     </SidebarMenuItem>
                     <SidebarMenuItem>
                       <SidebarMenuButton asChild isActive={isActive('/fttx/onx-templates')} size="sm">
                         <Link href="/fttx/onx-templates" className="flex items-center gap-2">
                           <FileTextIcon className="h-4 w-4 text-muted-foreground" />
                           <span>{t('sidebar.fttx_onx_templates')}</span>
                         </Link>
                       </SidebarMenuButton>
                     </SidebarMenuItem>
                   </SidebarMenuSubContent>
                 </SidebarMenuSub>
              </SidebarMenuItem>

              {/* Finances Menu */}
              <SidebarMenuItem>
                 <SidebarMenuSub>
                   <Tooltip>
                     <TooltipTrigger asChild>
                       <SidebarMenuSubTrigger tooltip={t('sidebar.finances')} isActive={isActive('/finances')}>
                         <div className="flex items-center gap-2 cursor-pointer">
                           <DollarSign />
                           <span className="truncate">{t('sidebar.finances')}</span>
                           <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                         </div>
                       </SidebarMenuSubTrigger>
                     </TooltipTrigger>
                     <TooltipContent side="right" align="center">{t('sidebar.finances')}</TooltipContent>
                   </Tooltip>
                   <SidebarMenuSubContent>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isActive('/finances/cash-book')} size="sm">
                          <Link href="/finances/cash-book" className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                            <span>{t('sidebar.finances_cash_book')}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isActive('/finances/entry-categories')} size="sm">
                          <Link href="/finances/entry-categories" className="flex items-center gap-2">
                            <ListFilter className="h-4 w-4 text-muted-foreground" />
                            <span>{t('sidebar.finances_entry_categories')}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isActive('/settings/finances/configurations')} size="sm">
                          <Link href="/settings/finances/configurations" className="flex items-center gap-2">
                            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                            <span>{t('sidebar.finances_config')}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                   </SidebarMenuSubContent>
                 </SidebarMenuSub>
              </SidebarMenuItem>

               {/* Inventory Menu */}
              <SidebarMenuItem>
                 <SidebarMenuSub>
                   <Tooltip>
                     <TooltipTrigger asChild>
                       <SidebarMenuSubTrigger tooltip={t('sidebar.inventory')} isActive={isActive('/inventory')}>
                         <div className="flex items-center gap-2 cursor-pointer">
                           <Archive />
                           <span className="truncate">{t('sidebar.inventory')}</span>
                           <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                         </div>
                       </SidebarMenuSubTrigger>
                     </TooltipTrigger>
                     <TooltipContent side="right" align="center">{t('sidebar.inventory')}</TooltipContent>
                   </Tooltip>
                   <SidebarMenuSubContent>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isActive('/inventory/categories')} size="sm">
                          <Link href="/inventory/categories" className="flex items-center gap-2">
                            <ListFilter className="h-4 w-4 text-muted-foreground" />
                            <span>{t('sidebar.inventory_categories')}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isActive('/inventory/manufacturers')} size="sm">
                          <Link href="/inventory/manufacturers" className="flex items-center gap-2">
                            <Factory className="h-4 w-4 text-muted-foreground" />
                            <span>{t('sidebar.inventory_manufacturers')}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isActive('/inventory/suppliers')} size="sm">
                          <Link href="/inventory/suppliers" className="flex items-center gap-2">
                            <Truck className="h-4 w-4 text-muted-foreground" />
                            <span>{t('sidebar.inventory_suppliers')}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isActive('/inventory/products')} size="sm">
                          <Link href="/inventory/products" className="flex items-center gap-2">
                            <PackageIcon className="h-4 w-4 text-muted-foreground" />
                            <span>{t('sidebar.inventory_products')}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isActive('/inventory/warehouses')} size="sm">
                          <Link href="/inventory/warehouses" className="flex items-center gap-2">
                            <Warehouse className="h-4 w-4 text-muted-foreground" />
                            <span>{t('sidebar.inventory_warehouses')}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                       <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isActive('/inventory/vehicles')} size="sm">
                          <Link href="/inventory/vehicles" className="flex items-center gap-2">
                            <Bus className="h-4 w-4 text-muted-foreground" />
                            <span>{t('sidebar.inventory_vehicles')}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                   </SidebarMenuSubContent>
                 </SidebarMenuSub>
              </SidebarMenuItem>

              {/* Service Calls Menu */}
              <SidebarMenuItem>
                <SidebarMenuSub>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuSubTrigger tooltip={t('sidebar.service_calls')} isActive={isActive('/service-calls')}>
                        <div className="flex items-center gap-2 cursor-pointer">
                          <Wrench />
                          <span className="truncate">{t('sidebar.service_calls')}</span>
                          <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                        </div>
                      </SidebarMenuSubTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="right" align="center">{t('sidebar.service_calls')}</TooltipContent>
                  </Tooltip>
                  <SidebarMenuSubContent>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive('/service-calls/dashboard')} size="sm">
                        <Link href="/service-calls/dashboard" className="flex items-center gap-2">
                          <ServiceDashboardIcon className="h-4 w-4 text-muted-foreground" />
                          <span>{t('sidebar.service_calls_dashboard')}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive('/service-calls/service-types')} size="sm">
                        <Link href="/service-calls/service-types" className="flex items-center gap-2">
                          <ServiceTypesIcon className="h-4 w-4 text-muted-foreground" />
                          <span>{t('sidebar.service_calls_service_types')}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenuSubContent>
                </SidebarMenuSub>
              </SidebarMenuItem>


              {/* Reports */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/reports')} tooltip={t('sidebar.reports')}>
                  <Link href="/reports" className="flex items-center gap-2">
                    <BarChart3 />
                    <span className="truncate">{t('sidebar.reports')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* HR Menu */}
              <SidebarMenuItem>
                 <SidebarMenuSub>
                   <Tooltip>
                     <TooltipTrigger asChild>
                       <SidebarMenuSubTrigger tooltip={t('sidebar.hr')} isActive={isActive('/hr')}>
                         <div className="flex items-center gap-2 cursor-pointer">
                           <BriefcaseBusiness />
                           <span className="truncate">{t('sidebar.hr')}</span>
                           <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                         </div>
                       </SidebarMenuSubTrigger>
                     </TooltipTrigger>
                     <TooltipContent side="right" align="center">{t('sidebar.hr')}</TooltipContent>
                   </Tooltip>
                   <SidebarMenuSubContent>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isActive('/hr/employees')} size="sm">
                          <Link href="/hr/employees" className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{t('sidebar.hr_employees')}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                   </SidebarMenuSubContent>
                 </SidebarMenuSub>
              </SidebarMenuItem>


              {/* Settings Menu */}
              <SidebarMenuItem>
                 <SidebarMenuSub>
                   <Tooltip>
                     <TooltipTrigger asChild>
                       <SidebarMenuSubTrigger tooltip={t('sidebar.settings')} isActive={isActive('/settings')}>
                         <div className="flex items-center gap-2 cursor-pointer">
                           <Settings />
                           <span className="truncate">{t('sidebar.settings')}</span>
                           <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                         </div>
                       </SidebarMenuSubTrigger>
                     </TooltipTrigger>
                     <TooltipContent side="right" align="center">{t('sidebar.settings')}</TooltipContent>
                   </Tooltip>
                   <SidebarMenuSubContent>
                     <SidebarMenuItem>
                       <SidebarMenuButton asChild isActive={isActive('/settings/global')} size="sm">
                         <Link href="/settings/global" className="flex items-center gap-2">
                           <Cog className="h-4 w-4 text-muted-foreground" />
                           <span>{t('sidebar.settings_global')}</span>
                         </Link>
                       </SidebarMenuButton>
                     </SidebarMenuItem>
                      {/* Business Sub-Accordion */}
                      <SidebarMenuItem>
                         <SidebarMenuSub>
                           <Tooltip>
                             <TooltipTrigger asChild>
                               <SidebarMenuSubTrigger tooltip={t('sidebar.settings_business')} isActive={isActive('/settings/business')} size="sm">
                                  <div className="flex items-center gap-2 cursor-pointer">
                                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                                      <span className="truncate">{t('sidebar.settings_business')}</span>
                                      <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                                  </div>
                               </SidebarMenuSubTrigger>
                             </TooltipTrigger>
                             <TooltipContent side="right" align="center">{t('sidebar.settings_business')}</TooltipContent>
                           </Tooltip>
                           <SidebarMenuSubContent>
                              <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={isActive('/settings/business/pops')} size="sm"><Link href="/settings/business/pops" className="flex items-center gap-2">
                                    <Building className="h-4 w-4 text-muted-foreground" />
                                    <span>{t('sidebar.settings_business_pops')}</span>
                                 </Link></SidebarMenuButton>
                              </SidebarMenuItem>
                           </SidebarMenuSubContent>
                         </SidebarMenuSub>
                      </SidebarMenuItem>
                      {/* Plans Sub-Accordion */}
                      <SidebarMenuItem>
                         <SidebarMenuSub>
                           <Tooltip>
                             <TooltipTrigger asChild>
                               <SidebarMenuSubTrigger tooltip={t('sidebar.settings_plans')} isActive={isActive('/settings/plans')} size="sm">
                                  <div className="flex items-center gap-2 cursor-pointer">
                                      <ListChecks className="h-4 w-4 text-muted-foreground" />
                                      <span className="truncate">{t('sidebar.settings_plans')}</span>
                                      <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                                  </div>
                               </SidebarMenuSubTrigger>
                             </TooltipTrigger>
                             <TooltipContent side="right" align="center">{t('sidebar.settings_plans')}</TooltipContent>
                           </Tooltip>
                           <SidebarMenuSubContent>
                              <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={isActive('/settings/plans/internet')} size="sm">
                                  <Link href="/settings/plans/internet" className="flex items-center gap-2">
                                    <Wifi className="h-4 w-4 text-muted-foreground" />
                                    <span>{t('sidebar.settings_plans_internet')}</span>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                              <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={isActive('/settings/plans/tv')} size="sm">
                                  <Link href="/settings/plans/tv" className="flex items-center gap-2">
                                    <Tv className="h-4 w-4 text-muted-foreground" />
                                    <span>{t('sidebar.settings_plans_tv')}</span>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                              <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={isActive('/settings/plans/mobile')} size="sm">
                                  <Link href="/settings/plans/mobile" className="flex items-center gap-2">
                                    <Smartphone className="h-4 w-4 text-muted-foreground" />
                                    <span>{t('sidebar.settings_plans_mobile')}</span>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                              <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={isActive('/settings/plans/landline')} size="sm">
                                  <Link href="/settings/plans/landline" className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span>{t('sidebar.settings_plans_landline')}</span>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                              <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={isActive('/settings/plans/combos')} size="sm">
                                  <Link href="/settings/plans/combos" className="flex items-center gap-2">
                                    <Combine className="h-4 w-4 text-muted-foreground" />
                                    <span>{t('sidebar.settings_plans_combos')}</span>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                           </SidebarMenuSubContent>
                         </SidebarMenuSub>
                      </SidebarMenuItem>
                      {/* Network Sub-Accordion */}
                      <SidebarMenuItem>
                         <SidebarMenuSub>
                           <Tooltip>
                             <TooltipTrigger asChild>
                               <SidebarMenuSubTrigger tooltip={t('sidebar.network')} isActive={isActive('/settings/network')} size="sm">
                                  <div className="flex items-center gap-2 cursor-pointer">
                                      <Network className="h-4 w-4 text-muted-foreground" />
                                      <span className="truncate">{t('sidebar.network')}</span>
                                      <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                                  </div>
                               </SidebarMenuSubTrigger>
                             </TooltipTrigger>
                             <TooltipContent side="right" align="center">{t('sidebar.network')}</TooltipContent>
                           </Tooltip>
                           <SidebarMenuSubContent>
                              <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={isActive('/settings/network/ip')} size="sm"><Link href="/settings/network/ip" className="flex items-center gap-2">
                                    <Code className="h-4 w-4 text-muted-foreground"/>
                                    <span>{t('sidebar.network_ip')}</span>
                                 </Link></SidebarMenuButton>
                              </SidebarMenuItem>
                              <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={isActive('/settings/network/devices')} size="sm"><Link href="/settings/network/devices" className="flex items-center gap-2">
                                    <RouterIcon className="h-4 w-4 text-muted-foreground"/>
                                    <span>{t('sidebar.network_devices')}</span>
                                 </Link></SidebarMenuButton>
                              </SidebarMenuItem>
                              <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={isActive('/settings/network/cgnat')} size="sm"><Link href="/settings/network/cgnat" className="flex items-center gap-2">
                                    <Share2 className="h-4 w-4 text-muted-foreground"/>
                                    <span>{t('sidebar.network_cgnat')}</span>
                                 </Link></SidebarMenuButton>
                              </SidebarMenuItem>
                              <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={isActive('/settings/network/radius')} size="sm"><Link href="/settings/network/radius" className="flex items-center gap-2">
                                    <ServerIcon className="h-4 w-4 text-muted-foreground"/>
                                    <span>{t('sidebar.network_radius')}</span>
                                 </Link></SidebarMenuButton>
                              </SidebarMenuItem>
                              <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={isActive('/settings/network/vlan')} size="sm"><Link href="/settings/network/vlan" className="flex items-center gap-2">
                                    <Split className="h-4 w-4 text-muted-foreground"/>
                                    <span>{t('sidebar.network_vlan')}</span>
                                 </Link></SidebarMenuButton>
                              </SidebarMenuItem>
                           </SidebarMenuSubContent>
                         </SidebarMenuSub>
                      </SidebarMenuItem>
                     <SidebarMenuItem>
                       <SidebarMenuButton asChild isActive={isActive('/settings/finances/configurations')} size="sm">
                         <Link href="/settings/finances/configurations" className="flex items-center gap-2">
                           <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                           <span>{t('sidebar.finances_config')}</span>
                         </Link>
                       </SidebarMenuButton>
                     </SidebarMenuItem>
                     <SidebarMenuItem>
                       <SidebarMenuButton asChild isActive={isActive('/settings/security')} size="sm">
                         <Link href="/settings/security" className="flex items-center gap-2">
                           <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                           <span>{t('sidebar.security')}</span>
                         </Link>
                       </SidebarMenuButton>
                     </SidebarMenuItem>
                     <SidebarMenuItem>
                       <SidebarMenuButton asChild isActive={isActive('/settings/system-monitor')} size="sm">
                         <Link href="/settings/system-monitor" className="flex items-center gap-2">
                           <RouterIcon className="h-4 w-4 text-muted-foreground" /> {/* Placeholder, consider Activity or Terminal */}
                           <span>{t('sidebar.settings_system_monitor')}</span>
                         </Link>
                       </SidebarMenuButton>
                     </SidebarMenuItem>
                     {/* Integrations Sub-Accordion */}
                     <SidebarMenuItem>
                         <SidebarMenuSub>
                           <Tooltip>
                             <TooltipTrigger asChild>
                               <SidebarMenuSubTrigger tooltip={t('sidebar.settings_integrations')} isActive={isActive('/settings/integrations')} size="sm">
                                  <div className="flex items-center gap-2 cursor-pointer">
                                      <Plug className="h-4 w-4 text-muted-foreground" />
                                      <span className="truncate">{t('sidebar.settings_integrations')}</span>
                                      <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                                  </div>
                               </SidebarMenuSubTrigger>
                             </TooltipTrigger>
                             <TooltipContent side="right" align="center">{t('sidebar.settings_integrations')}</TooltipContent>
                           </Tooltip>
                           <SidebarMenuSubContent>
                              <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={isActive('/settings/integrations/whatsapp')} size="sm"><Link href="/settings/integrations/whatsapp" className="flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4 text-muted-foreground"/>
                                    <span>{t('sidebar.settings_integrations_whatsapp')}</span>
                                 </Link></SidebarMenuButton>
                              </SidebarMenuItem>
                              <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={isActive('/settings/integrations/telegram')} size="sm"><Link href="/settings/integrations/telegram" className="flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4 text-muted-foreground"/>
                                    <span>{t('sidebar.settings_integrations_telegram')}</span>
                                 </Link></SidebarMenuButton>
                              </SidebarMenuItem>
                              <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={isActive('/settings/integrations/meta')} size="sm"><Link href="/settings/integrations/meta" className="flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4 text-muted-foreground"/>
                                    <span>{t('sidebar.settings_integrations_meta')}</span>
                                 </Link></SidebarMenuButton>
                              </SidebarMenuItem>
                              <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={isActive('/settings/integrations/sms')} size="sm"><Link href="/settings/integrations/sms" className="flex items-center gap-2">
                                    <Text className="h-4 w-4 text-muted-foreground"/>
                                    <span>{t('sidebar.settings_integrations_sms')}</span>
                                 </Link></SidebarMenuButton>
                              </SidebarMenuItem>
                           </SidebarMenuSubContent>
                         </SidebarMenuSub>
                     </SidebarMenuItem>
                     <SidebarMenuItem>
                       <SidebarMenuButton asChild isActive={isActive('/settings/users')} size="sm">
                         <Link href="/settings/users" className="flex items-center gap-2">
                           <Users className="h-4 w-4 text-muted-foreground" />
                           <span>{t('sidebar.settings_users')}</span>
                         </Link>
                       </SidebarMenuButton>
                     </SidebarMenuItem>
                     {/* MySQL Sub-Accordion */}
                     <SidebarMenuItem>
                         <SidebarMenuSub>
                           <Tooltip>
                             <TooltipTrigger asChild>
                               <SidebarMenuSubTrigger tooltip={t('sidebar.mysql')} isActive={isActive('/settings/mysql')} size="sm">
                                  <div className="flex items-center gap-2 cursor-pointer">
                                      <Database className="h-4 w-4 text-muted-foreground" />
                                      <span className="truncate">{t('sidebar.mysql')}</span>
                                      <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                                  </div>
                               </SidebarMenuSubTrigger>
                             </TooltipTrigger>
                             <TooltipContent side="right" align="center">{t('sidebar.mysql')}</TooltipContent>
                           </Tooltip>
                           <SidebarMenuSubContent>
                              <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={isActive('/mysql/databases')} size="sm"><Link href="/mysql/databases" className="flex items-center gap-2">
                                    <Database className="h-4 w-4 text-muted-foreground"/>
                                    <span>{t('sidebar.mysql_databases')}</span>
                                 </Link></SidebarMenuButton>
                              </SidebarMenuItem>
                              <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={isActive('/mysql/cli')} size="sm"><Link href="/mysql/cli" className="flex items-center gap-2">
                                    <Code className="h-4 w-4 text-muted-foreground"/>
                                    <span>{t('sidebar.mysql_cli')}</span>
                                 Link></SidebarMenuButton>
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
                <SidebarMenuButton asChild isActive={isActive('/pilotview')} tooltip="PilotView ACS">
                  <Link href="/pilotview" className="flex items-center gap-2">
                    <TbDeviceImacStar />
                    <span className="truncate">{t('sidebar.pilotview')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* TransitOS */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/transitos')} tooltip="TransitOS BGP Manager">
                  <Link href="/transitos" className="flex items-center gap-2">
                    <SiReactrouter />
                    <span className="truncate">{t('sidebar.transitos')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Zones (DNS) */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/zones')} tooltip="DNS Zones">
                  <Link href="/zones" className="flex items-center gap-2">
                    <SiNextdns />
                    <span className="truncate">{t('sidebar.zones')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
              {/* Footer content can go here if needed */}
            </SidebarFooter>
            </Sidebar>
            <SidebarInset noMargin={isMapPage}>
              <div className="fixed top-0 left-0 w-full h-1 z-50">
                {isLoading && <Progress value={progress} className="w-full h-full rounded-none bg-transparent [&>div]:bg-accent" />}
              </div>
              {!isMapPage && <AppHeader onToggleSidebar={toggleMobileSidebar} />}
              <div className={isMapPage ? "p-0" : "p-4 md:p-6"}> {/* Apply padding only if not map page */}
                {children}
              </div>
              <Toaster />
            </SidebarInset>
        </SidebarProvider>
    </TooltipProvider>
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
                <AppLayout>{children}</AppLayout>
            </LocaleProvider>
          </QueryClientProvider>
        </NextThemesProvider>
      </body>
    </html>
  );
}