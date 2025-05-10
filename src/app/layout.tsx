// src/app/layout.tsx
'use client'; // Required for hooks and state

import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Import usePathname
import { useState, useEffect, type ReactNode } from 'react';
// Import specific icons
import {
  LayoutDashboard, ShieldCheck, Settings, Users, ChevronDown, ChevronRight, Dot, MapPin, TowerControl, Cable, Power, Box, Puzzle, Warehouse, Globe, GitFork,
  Code, // Added for IPv4/6
  Router, // Added for Devices
  Share2, // Added for CGNAT
  Server as ServerIcon, // Added for RADIUS & Services, aliased to avoid conflict
  Split, // Added for VLAN
  DollarSign, // Added for Finances
  BarChart3, // Added for Reports
  Plug, // Added for Integrations
  MessageSquare, // For messaging integrations
  Text, // For SMS integration
  Settings2, // Added for Config/Settings icons
  BookOpen, // Added for Cash Book
  SlidersHorizontal, // Added for Financial Config
  Briefcase, // Added for Business and HR
  Building, // Added for PoPs
  Cog, // Icon for Global Settings
  Plane, // Icon for PilotView
  Bus, // Icon for TransitOS
  Dna, // Icon for Zones (DNS)
  ListChecks, // Icon for Plans
  Wifi, // Icon for Internet Plan
  Tv, // Icon for TV Plan
  Smartphone, // Icon for Mobile Plan
  Phone, // Icon for Landline Plan
  Combine, // Icon for Combos Plan
  ListFilter, // Icon for Entry Categories
  UserPlus, // For "New" subscriber
  UsersRound, // For "List" subscribers,
  Archive, // Added for Inventory
  Factory, // Icon for Manufacturers
  Package as PackageIcon, // Icon for Products
  Truck, // Icon for Suppliers (using Truck as an example, can be changed)
  FileText as FileTextIcon, // for ONx Templates
  GitBranch, // for FTTx
  Network as NetworkIcon, // For OLTs (using a generic Network icon for now)
  Sun, // For theme toggle
  Moon, // For theme toggle
  Info, // For changelog
  LogOut, // For logout
  UserCircle, // For profile menu
  MonitorSmartphone, // For System Monitor
  Database as DatabaseIcon, // For PostgreSQL
  Table as TableIcon, // For PostgreSQL Tables
  TerminalSquare, // Added for PostgreSQL CLI
} from 'lucide-react';

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
  SidebarMenuSub, // Import submenu components
  SidebarMenuSubTrigger,
  SidebarMenuSubContent,
  SidebarSeparator, // Import Separator
} from '@/components/ui/sidebar';
import { SiNextdns } from "react-icons/si";
import { TbDeviceImacStar } from "react-icons/tb";
import { SiReactrouter } from "react-icons/si";
import { AppHeader } from '@/components/app-header';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip'; // Import Tooltip components
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Import react-query client provider
import { Progress } from '@/components/ui/progress'; // Import Progress component
import { LocaleProvider, useLocale } from '@/contexts/LocaleContext'; // Import LocaleProvider and useLocale
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';


// Create a client
const queryClient = new QueryClient();

// Inner component that uses the locale context
function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); // Get current path
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { t } = useLocale(); // Get translation function
  const { theme } = useTheme();
  const [logoFillColor, setLogoFillColor] = useState<string>('hsl(var(--secondary))');


  // Simulate loading progress on route change
  useEffect(() => {
    // Don't show progress on initial load
    if (pathname) {
      setIsLoading(true);
      setProgress(10); // Start progress

      const timer = setTimeout(() => {
        setProgress(90); // Simulate loading quickly
      }, 100); // Short delay before jumping progress

      const finishTimer = setTimeout(() => {
        setProgress(100); // Complete progress
        const hideTimer = setTimeout(() => {
          setIsLoading(false);
          setProgress(0); // Reset progress
        }, 300); // Short delay before hiding
        return () => clearTimeout(hideTimer);
      }, 500); // Total simulated loading time

      return () => {
        clearTimeout(timer);
        clearTimeout(finishTimer);
      };
    }
  }, [pathname]); // Trigger effect when pathname changes

  // Determine if a link is active
  const isActive = (href: string) => {
    const cleanHref = href.split('?')[0]; // Ignore query params for active check
    const cleanPathname = pathname.split('?')[0];
    return cleanPathname === cleanHref || (cleanHref !== '/' && cleanPathname.startsWith(cleanHref));
  };


  // Check if the current route is the map page
  const isMapPage = pathname === '/maps/map';

  const iconSize = "h-3 w-3";
  const subIconSize = "h-2.5 w-2.5";

  useEffect(() => {
    if (typeof window !== 'undefined' && theme) {
      const newFillColor = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
        ? 'hsl(var(--accent))'
        : 'hsl(var(--secondary))';
      setLogoFillColor(newFillColor);
    }
  }, [theme]);


  return (
    <TooltipProvider>
      <SidebarProvider side="left" collapsible='none'>
        <Sidebar>
          <SidebarHeader>
            <Link
              href="/"
              className="flex items-center justify-center px-2 py-2"
              style={{ width: '131px', height: '32px' }}
            >
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 131 32"
                xmlns="http://www.w3.org/2000/svg"
                style={{ fill: logoFillColor }}
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
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/')} tooltip={t('sidebar.dashboard')}>
                  <Link href="/" className="flex items-center gap-2">
                    <LayoutDashboard className={iconSize} />
                    <span>{t('sidebar.dashboard')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Subscribers Menu - Direct Links */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/subscribers/list')} tooltip={t('sidebar.subscribers')}>
                  <Link href="/subscribers/list" className="flex items-center gap-2">
                    <Users className={iconSize} />
                    <span className="truncate">{t('sidebar.subscribers')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Maps Menu */}
              <SidebarMenuItem>
                <SidebarMenuSub>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuSubTrigger tooltip={t('sidebar.maps')}>
                        <div className="flex items-center gap-2 cursor-pointer">
                          <MapPin className={iconSize} />
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
                          <Globe className={subIconSize + " text-muted-foreground"} />
                          <span>{t('sidebar.maps_map')}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuSub>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <SidebarMenuSubTrigger
                              size="sm"
                              className="pl-3 pr-2 py-1.5"
                              tooltip={t('sidebar.maps_elements')}
                            >
                              <div className="flex items-center gap-2 cursor-pointer w-full">
                                <GitFork className={subIconSize + " text-muted-foreground"} />
                                <span className="truncate">{t('sidebar.maps_elements')}</span>
                                <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                              </div>
                            </SidebarMenuSubTrigger>
                          </TooltipTrigger>
                          <TooltipContent side="right" align="center">{t('sidebar.maps_elements')}</TooltipContent>
                        </Tooltip>
                        <SidebarMenuSubContent>
                          <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isActive('/maps/elements/polls')} size="sm" tooltip={t('sidebar.maps_elements_polls')}>
                              <Link href="#" className="flex items-center gap-2">
                                <Power className={subIconSize + " text-muted-foreground"} />
                                <span>{t('sidebar.maps_elements_polls')}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isActive('/maps/elements/fdhs')} size="sm" tooltip={t('sidebar.maps_elements_fdhs')}>
                              <Link href="#" className="flex items-center gap-2">
                                <Box className={subIconSize + " text-muted-foreground"} />
                                <span>{t('sidebar.maps_elements_fdhs')}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isActive('/maps/elements/foscs')} size="sm" tooltip={t('sidebar.maps_elements_foscs')}>
                              <Link href="#" className="flex items-center gap-2">
                                <Warehouse className={subIconSize + " text-muted-foreground"} />
                                <span>{t('sidebar.maps_elements_foscs')}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isActive('/maps/elements/peds')} size="sm" tooltip={t('sidebar.maps_elements_peds')}>
                              <Link href="#" className="flex items-center gap-2">
                                <Box className={subIconSize + " text-muted-foreground"} />
                                <span>{t('sidebar.maps_elements_peds')}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isActive('/maps/elements/accessories')} size="sm" tooltip={t('sidebar.maps_elements_accessories')}>
                              <Link href="#" className="flex items-center gap-2">
                                <Puzzle className={subIconSize + " text-muted-foreground"} />
                                <span>{t('sidebar.maps_elements_accessories')}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isActive('/maps/elements/towers')} size="sm" tooltip={t('sidebar.maps_elements_towers')}>
                              <Link href="#" className="flex items-center gap-2">
                                <TowerControl className={subIconSize + " text-muted-foreground"} />
                                <span>{t('sidebar.maps_elements_towers')}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isActive('/maps/elements/cables')} size="sm" tooltip={t('sidebar.maps_elements_cables')}>
                              <Link href="#" className="flex items-center gap-2">
                                <Cable className={subIconSize + " text-muted-foreground"} />
                                <span>{t('sidebar.maps_elements_cables')}</span>
                              </Link>
                            </SidebarMenuButton>
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
                      <SidebarMenuSubTrigger tooltip={t('sidebar.fttx', 'FTTx')}>
                        <div className="flex items-center gap-2 cursor-pointer">
                          <GitBranch className={iconSize}/>
                          <span className="truncate">{t('sidebar.fttx', 'FTTx')}</span>
                          <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                        </div>
                      </SidebarMenuSubTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="right" align="center">{t('sidebar.fttx', 'FTTx')}</TooltipContent>
                  </Tooltip>
                  <SidebarMenuSubContent>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive('/fttx/dashboard')} size="sm" tooltip={t('sidebar.fttx_dashboard', 'Dashboard')}>
                        <Link href="/fttx/dashboard" className="flex items-center gap-2">
                          <LayoutDashboard className={subIconSize + " text-muted-foreground"} />
                          <span>{t('sidebar.fttx_dashboard', 'Dashboard')}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive('/fttx/olts')} size="sm" tooltip={t('sidebar.fttx_olts', 'OLTs & ONXs')}>
                        <Link href="/fttx/olts" className="flex items-center gap-2">
                          <NetworkIcon className={subIconSize + " text-muted-foreground"} />
                          <span>{t('sidebar.fttx_olts', 'OLTs & ONXs')}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive('/fttx/onx-templates')} size="sm" tooltip={t('sidebar.fttx_onx_templates', 'ONx Templates')}>
                        <Link href="/fttx/onx-templates" className="flex items-center gap-2">
                          <FileTextIcon className={subIconSize + " text-muted-foreground"} />
                          <span>{t('sidebar.fttx_onx_templates', 'ONx Templates')}</span>
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
                      <SidebarMenuSubTrigger tooltip={t('sidebar.finances')}>
                        <div className="flex items-center gap-2 cursor-pointer">
                          <DollarSign className={iconSize}/>
                          <span className="truncate">{t('sidebar.finances')}</span>
                          <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                        </div>
                      </SidebarMenuSubTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="right" align="center">{t('sidebar.finances')}</TooltipContent>
                  </Tooltip>
                  <SidebarMenuSubContent>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive('/finances/cash-book')} size="sm" tooltip={t('sidebar.finances_cash_book')}>
                        <Link href="/finances/cash-book" className="flex items-center gap-2">
                          <BookOpen className={subIconSize + " text-muted-foreground"} />
                          <span>{t('sidebar.finances_cash_book')}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive('/finances/entry-categories')} size="sm" tooltip={t('sidebar.finances_entry_categories')}>
                        <Link href="/finances/entry-categories" className="flex items-center gap-2">
                          <ListFilter className={subIconSize + " text-muted-foreground"} />
                          <span>{t('sidebar.finances_entry_categories')}</span>
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
                      <SidebarMenuSubTrigger tooltip={t('sidebar.inventory', 'Inventory')}>
                        <div className="flex items-center gap-2 cursor-pointer">
                          <Archive className={iconSize}/>
                          <span className="truncate">{t('sidebar.inventory', 'Inventory')}</span>
                          <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                        </div>
                      </SidebarMenuSubTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="right" align="center">{t('sidebar.inventory', 'Inventory')}</TooltipContent>
                  </Tooltip>
                  <SidebarMenuSubContent>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive('/inventory/warehouses')} size="sm" tooltip={t('sidebar.inventory_warehouses', 'Warehouses')}>
                        <Link href="#" className="flex items-center gap-2">
                          <Warehouse className={subIconSize + " text-muted-foreground"} />
                          <span>{t('sidebar.inventory_warehouses', 'Warehouses')}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive('/inventory/suppliers')} size="sm" tooltip={t('sidebar.inventory_suppliers', 'Suppliers')}>
                        <Link href="#" className="flex items-center gap-2">
                          <Truck className={subIconSize + " text-muted-foreground"} />
                          <span>{t('sidebar.inventory_suppliers', 'Suppliers')}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive('/inventory/products')} size="sm" tooltip={t('sidebar.inventory_products', 'Products')}>
                        <Link href="#" className="flex items-center gap-2">
                          <PackageIcon className={subIconSize + " text-muted-foreground"} />
                          <span>{t('sidebar.inventory_products', 'Products')}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive('/inventory/manufacturers')} size="sm" tooltip={t('sidebar.inventory_manufacturers', 'Manufacturers')}>
                        <Link href="#" className="flex items-center gap-2">
                          <Factory className={subIconSize + " text-muted-foreground"} />
                          <span>{t('sidebar.inventory_manufacturers', 'Manufacturers')}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive('/inventory/categories')} size="sm" tooltip={t('sidebar.inventory_categories', 'Categories')}>
                        <Link href="#" className="flex items-center gap-2">
                          <ListFilter className={subIconSize + " text-muted-foreground"} />
                          <span>{t('sidebar.inventory_categories', 'Categories')}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenuSubContent>
                </SidebarMenuSub>
              </SidebarMenuItem>


              {/* Reports Menu */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/reports')} tooltip={t('sidebar.reports')}>
                  <Link href="#" className="flex items-center gap-2">
                    <BarChart3 className={iconSize}/>
                    <span>{t('sidebar.reports')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

                {/* HR Menu */}
                <SidebarMenuItem>
                <SidebarMenuSub>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuSubTrigger tooltip={t('sidebar.hr', 'HR')}>
                        <div className="flex items-center gap-2 cursor-pointer">
                          <Briefcase className={iconSize}/>
                          <span className="truncate">{t('sidebar.hr', 'HR')}</span>
                          <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                        </div>
                      </SidebarMenuSubTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="right" align="center">{t('sidebar.hr', 'HR')}</TooltipContent>
                  </Tooltip>
                  <SidebarMenuSubContent>
                     <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isActive('/hr/employees')} size="sm" tooltip={t('sidebar.hr_employees', 'Employees')}>
                           <Link href="#" className="flex items-center gap-2">
                             <Users className={subIconSize + " text-muted-foreground"} />
                             <span>{t('sidebar.hr_employees', 'Employees')}</span>
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
                      <SidebarMenuSubTrigger tooltip={t('sidebar.settings')}>
                        <div className="flex items-center gap-2 cursor-pointer">
                          <Settings className={iconSize} />
                          <span className="truncate">{t('sidebar.settings')}</span>
                          <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                        </div>
                      </SidebarMenuSubTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="right" align="center">{t('sidebar.settings')}</TooltipContent>
                  </Tooltip>
                  <SidebarMenuSubContent>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive('/settings/global')} size="sm" tooltip={t('sidebar.settings_global')}>
                        <Link href="/settings/global" className="flex items-center gap-2">
                          <Cog className={subIconSize + " text-muted-foreground"} />
                          <span>{t('sidebar.settings_global')}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                      <SidebarMenuSub>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <SidebarMenuSubTrigger
                              size="sm"
                              className="pl-3 pr-2 py-1.5"
                              tooltip={t('sidebar.settings_business')}
                            >
                              <div className="flex items-center gap-2 cursor-pointer w-full">
                                <Briefcase className={subIconSize + " text-muted-foreground"} />
                                <span className="truncate">{t('sidebar.settings_business')}</span>
                                <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                              </div>
                            </SidebarMenuSubTrigger>
                          </TooltipTrigger>
                          <TooltipContent side="right" align="center">{t('sidebar.settings_business')}</TooltipContent>
                        </Tooltip>
                        <SidebarMenuSubContent>
                          <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isActive('/settings/business/pops')} size="sm" tooltip={t('sidebar.settings_business_pops')}>
                              <Link href="/settings/business/pops" className="flex items-center gap-2">
                                <Building className={subIconSize + " text-muted-foreground"} />
                                <span>{t('sidebar.settings_business_pops')}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        </SidebarMenuSubContent>
                      </SidebarMenuSub>
                    </SidebarMenuItem>

                     {/* Plans Menu Item - Moved under Settings */}
                     <SidebarMenuItem>
                      <SidebarMenuSub>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <SidebarMenuSubTrigger
                              size="sm"
                              className="pl-3 pr-2 py-1.5"
                              tooltip={t('sidebar.settings_plans', 'Plans')}
                            >
                              <div className="flex items-center gap-2 cursor-pointer w-full">
                                <ListChecks className={subIconSize + " text-muted-foreground"} />
                                <span className="truncate">{t('sidebar.settings_plans', 'Plans')}</span>
                                <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                              </div>
                            </SidebarMenuSubTrigger>
                          </TooltipTrigger>
                          <TooltipContent side="right" align="center">{t('sidebar.settings_plans', 'Plans')}</TooltipContent>
                        </Tooltip>
                        <SidebarMenuSubContent>
                          <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isActive('/settings/plans/internet')} size="sm" tooltip={t('sidebar.settings_plans_internet', 'Internet Plans')}>
                              <Link href="/settings/plans/internet" className="flex items-center gap-2">
                                <Wifi className={subIconSize + " text-muted-foreground"} />
                                <span>{t('sidebar.settings_plans_internet', 'Internet')}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isActive('/settings/plans/tv')} size="sm" tooltip={t('sidebar.settings_plans_tv', 'TV')}>
                              <Link href="/settings/plans/tv" className="flex items-center gap-2">
                                <Tv className={subIconSize + " text-muted-foreground"} />
                                <span>{t('sidebar.settings_plans_tv', 'TV')}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isActive('/settings/plans/mobile')} size="sm" tooltip={t('sidebar.settings_plans_mobile', 'Mobile')}>
                              <Link href="/settings/plans/mobile" className="flex items-center gap-2">
                                <Smartphone className={subIconSize + " text-muted-foreground"} />
                                <span>{t('sidebar.settings_plans_mobile', 'Mobile')}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isActive('/settings/plans/landline')} size="sm" tooltip={t('sidebar.settings_plans_landline', 'Landline')}>
                              <Link href="/settings/plans/landline" className="flex items-center gap-2">
                                <Phone className={subIconSize + " text-muted-foreground"} />
                                <span>{t('sidebar.settings_plans_landline', 'Landline')}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isActive('/settings/plans/combos')} size="sm" tooltip={t('sidebar.settings_plans_combos', 'Combos')}>
                              <Link href="/settings/plans/combos" className="flex items-center gap-2">
                                <Combine className={subIconSize + " text-muted-foreground"} />
                                <span>{t('sidebar.settings_plans_combos', 'Combos')}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        </SidebarMenuSubContent>
                      </SidebarMenuSub>
                    </SidebarMenuItem>


                    {/* Network Menu moved here */}
                    <SidebarMenuItem>
                      <SidebarMenuSub>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <SidebarMenuSubTrigger
                              size="sm"
                              className="pl-3 pr-2 py-1.5"
                              tooltip={t('sidebar.network')}
                            >
                              <div className="flex items-center gap-2 cursor-pointer w-full">
                                <NetworkIcon className={subIconSize + " text-muted-foreground"} />
                                <span className="truncate">{t('sidebar.network')}</span>
                                <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                              </div>
                            </SidebarMenuSubTrigger>
                          </TooltipTrigger>
                          <TooltipContent side="right" align="center">{t('sidebar.network')}</TooltipContent>
                        </Tooltip>
                        <SidebarMenuSubContent>
                          <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isActive('/settings/network/ip')} size="sm" tooltip={t('sidebar.network_ip')}>
                              <Link href="#" className="flex items-center gap-2">
                                <Code className={subIconSize + " text-muted-foreground"} />
                                <span>{t('sidebar.network_ip')}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isActive('/settings/network/devices')} size="sm" tooltip={t('sidebar.network_devices')}>
                              <Link href="#" className="flex items-center gap-2">
                                <Router className={subIconSize + " text-muted-foreground"} />
                                <span>{t('sidebar.network_devices')}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isActive('/settings/network/cgnat')} size="sm" tooltip={t('sidebar.network_cgnat')}>
                              <Link href="/settings/network/cgnat" className="flex items-center gap-2">
                                <Share2 className={subIconSize + " text-muted-foreground"} />
                                <span>{t('sidebar.network_cgnat')}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isActive('/settings/network/radius')} size="sm" tooltip={t('sidebar.network_radius')}>
                              <Link href="#" className="flex items-center gap-2">
                                <ServerIcon className={subIconSize + " text-muted-foreground"} />
                                <span>{t('sidebar.network_radius')}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isActive('/settings/network/vlan')} size="sm" tooltip={t('sidebar.network_vlan')}>
                              <Link href="/settings/network/vlan" className="flex items-center gap-2">
                                <Split className={subIconSize + " text-muted-foreground"} />
                                <span>{t('sidebar.network_vlan')}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        </SidebarMenuSubContent>
                      </SidebarMenuSub>
                    </SidebarMenuItem>

                    {/* Financial Configurations moved here */}
                    <SidebarMenuItem>
                       <SidebarMenuButton asChild isActive={isActive('/settings/finances/configurations')} size="sm" tooltip={t('sidebar.finances_config')}>
                         <Link href="/settings/finances/configurations" className="flex items-center gap-2">
                           <SlidersHorizontal className={subIconSize + " text-muted-foreground"} />
                           <span>{t('sidebar.finances_config')}</span>
                         </Link>
                       </SidebarMenuButton>
                    </SidebarMenuItem>

                    {/* Security Menu Item moved here */}
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive('/settings/security')} size="sm" tooltip={t('sidebar.security')}>
                        <Link href="#" className="flex items-center gap-2">
                          <ShieldCheck className={subIconSize + " text-muted-foreground"} />
                          <span>{t('sidebar.security')}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive('/settings/system-monitor')} size="sm" tooltip={t('sidebar.settings_system_monitor', 'System Monitor')}>
                        <Link href="/settings/system-monitor" className="flex items-center gap-2">
                          <MonitorSmartphone className={subIconSize + " text-muted-foreground"} />
                          <span>{t('sidebar.settings_system_monitor', 'System Monitor')}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                      <SidebarMenuSub>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <SidebarMenuSubTrigger
                              size="sm"
                              className="pl-3 pr-2 py-1.5"
                              tooltip={t('sidebar.settings_integrations')}
                            >
                              <div className="flex items-center gap-2 cursor-pointer w-full">
                                <Plug className={subIconSize + " text-muted-foreground"} />
                                <span className="truncate">{t('sidebar.settings_integrations')}</span>
                                <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                              </div>
                            </SidebarMenuSubTrigger>
                          </TooltipTrigger>
                          <TooltipContent side="right" align="center">{t('sidebar.settings_integrations')}</TooltipContent>
                        </Tooltip>
                        <SidebarMenuSubContent>
                          <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isActive('/settings/integrations/whatsapp')} size="sm" tooltip={t('sidebar.settings_integrations_whatsapp')}>
                              <Link href="#" className="flex items-center gap-2">
                                <MessageSquare className={subIconSize + " text-muted-foreground"} />
                                <span>{t('sidebar.settings_integrations_whatsapp')}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isActive('/settings/integrations/telegram')} size="sm" tooltip={t('sidebar.settings_integrations_telegram')}>
                              <Link href="#" className="flex items-center gap-2">
                                <MessageSquare className={subIconSize + " text-muted-foreground"} />
                                <span>{t('sidebar.settings_integrations_telegram')}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isActive('/settings/integrations/meta')} size="sm" tooltip={t('sidebar.settings_integrations_meta')}>
                              <Link href="#" className="flex items-center gap-2">
                                <MessageSquare className={subIconSize + " text-muted-foreground"} />
                                <span>{t('sidebar.settings_integrations_meta')}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isActive('/settings/integrations/sms')} size="sm" tooltip={t('sidebar.settings_integrations_sms')}>
                              <Link href="#" className="flex items-center gap-2">
                                <Text className={subIconSize + " text-muted-foreground"} />
                                <span>{t('sidebar.settings_integrations_sms')}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        </SidebarMenuSubContent>
                      </SidebarMenuSub>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isActive('/settings/users')} size="sm" tooltip={t('sidebar.settings_users', 'Users')}>
                           <Link href="/settings/users" className="flex items-center gap-2">
                             <Users className={subIconSize + " text-muted-foreground"} />
                             <span>{t('sidebar.settings_users', 'Users')}</span>
                           </Link>
                        </SidebarMenuButton>
                     </SidebarMenuItem>
                  </SidebarMenuSubContent>
                </SidebarMenuSub>
              </SidebarMenuItem>

              {/* PostgreSQL Menu */}
              <SidebarMenuItem>
                <SidebarMenuSub>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuSubTrigger tooltip={t('sidebar.postgresql', 'PostgreSQL')}>
                        <div className="flex items-center gap-2 cursor-pointer">
                          <DatabaseIcon className={iconSize}/>
                          <span className="truncate">{t('sidebar.postgresql', 'PostgreSQL')}</span>
                          <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                        </div>
                      </SidebarMenuSubTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="right" align="center">{t('sidebar.postgresql', 'PostgreSQL')}</TooltipContent>
                  </Tooltip>
                  <SidebarMenuSubContent>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive('/postgresql/databases')} size="sm" tooltip={t('sidebar.postgresql_databases', 'Databases')}>
                        <Link href="/postgresql/databases" className="flex items-center gap-2">
                          <DatabaseIcon className={subIconSize + " text-muted-foreground"} />
                          <span>{t('sidebar.postgresql_databases', 'Databases')}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive('/postgresql/tables')} size="sm" tooltip={t('sidebar.postgresql_tables', 'Tables')}>
                        <Link href="/postgresql/tables" className="flex items-center gap-2">
                          <TableIcon className={subIconSize + " text-muted-foreground"} />
                          <span>{t('sidebar.postgresql_tables', 'Tables')}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive('/postgresql/cli')} size="sm" tooltip={t('sidebar.postgresql_cli', 'CLI')}>
                        <Link href="/postgresql/cli" className="flex items-center gap-2">
                          <TerminalSquare className={subIconSize + " text-muted-foreground"} />
                          <span>{t('sidebar.postgresql_cli', 'CLI')}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenuSubContent>
                </SidebarMenuSub>
              </SidebarMenuItem>

              {/* Separator */}
              <SidebarSeparator className="my-2" />

              {/* PilotView Menu Item */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/pilotview')} tooltip={t('sidebar.pilotview', 'PilotView')}>
                  <Link href="#" className="flex items-center gap-2">
                    <TbDeviceImacStar className={iconSize} />
                    <span>{t('sidebar.pilotview', 'PilotView')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* TransitOS Menu Item */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/transitos')} tooltip={t('sidebar.transitos', 'TransitOS')}>
                  <Link href="#" className="flex items-center gap-2">
                    <SiReactrouter className={iconSize} />
                    <span>{t('sidebar.transitos', 'TransitOS')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Zones (DNS) Menu */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/zones')} tooltip={t('sidebar.zones', 'Zones')}>
                  <Link href="#" className="flex items-center gap-2">
                    <SiNextdns className={iconSize} />
                    <span>{t('sidebar.zones', 'Zones')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
             {/* Collapse button removed */}
          </SidebarFooter>
        </Sidebar>

        <SidebarInset noMargin={isMapPage}>
          <div className="fixed top-0 left-0 w-full z-50 h-1">
            {isLoading && <Progress value={progress} className="w-full h-1 rounded-none bg-transparent [&>*]:bg-accent" indicatorClassName="bg-accent" />}
          </div>
          {!isMapPage && <AppHeader />}
          <div className={isMapPage ? 'p-0' : 'p-4 md:p-6 md:pl-5'}>
              {children}
           </div>
           <Toaster />
       </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}


// Root layout that sets up providers
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

