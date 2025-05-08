// src/app/layout.tsx
'use client'; // Required for hooks and state

import type { Metadata } from 'next';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Import usePathname
import { useState, useEffect, type ReactNode } from 'react'; // Import useState and useEffect
// Import specific icons
import {
  LayoutDashboard, ShieldCheck, Settings, Users, Network, ChevronDown, ChevronRight, Dot, MapPin, TowerControl, Cable, Power, Box, Puzzle, Warehouse, Globe, GitFork,
  Code, // Added for IPv4/6
  Router, // Added for Devices
  Share2, // Added for CGNAT
  Server, // Added for RADIUS
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
  FileText as FileTextIcon, // for ONU Templates
  GitBranch, // for FTTx
  NetworkIcon, // For OLTs (using a generic Network icon for now)
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
import { ThemeProvider } from '@/components/theme-provider'; // Corrected import path


// Create a client
const queryClient = new QueryClient();

// Metadata can remain static or be dynamically generated if needed elsewhere
// export const metadata: Metadata = {
//   title: 'SuperISP',
//   description: 'ISP Management Software',
// };

// Inner component that uses the locale context
function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); // Get current path
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { t } = useLocale(); // Get translation function

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
  const isActive = (href: string) => pathname === href || (href !== '/' && pathname.startsWith(href));


  // Check if the current route is the map page
  const isMapPage = pathname === '/maps/map';

  const iconSize = "h-3 w-3"; // Reduced icon size for sidebar
  const subIconSize = "h-2.5 w-2.5"; // Reduced icon size for submenu items


  return (
    // TooltipProvider needs to wrap the entire layout content where tooltips are used
    <TooltipProvider>
      <SidebarProvider side="left" collapsible='none'>
        <Sidebar>
          <SidebarHeader>
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold text-sidebar-primary px-2" // Added padding for consistency
            >
              {/* Placeholder Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"> {/* Reduced size */}
                <path d="M12 .75a8.25 8.25 0 0 0-5.162 14.564.75.75 0 0 1-.318.47l-3.75 2.25a.75.75 0 0 0 0 1.332l3.75 2.25a.75.75 0 0 1 .318.47A8.25 8.25 0 0 0 12 23.25a8.25 8.25 0 0 0 8.25-8.25v-6a8.25 8.25 0 0 0-8.25-8.25Zm-3 9a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75Zm0 3.75a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75Z" />
              </svg>
              {/* Removed text-based title */}
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

              {/* Network Menu - Moved to Settings */}


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
                            <SidebarMenuButton asChild isActive={isActive('/maps/elements/polls')} size="sm">
                              <Link href="#" className="flex items-center gap-2">
                                <Power className={subIconSize + " text-muted-foreground"} />
                                <span>{t('sidebar.maps_elements_polls')}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isActive('/maps/elements/fdhs')} size="sm">
                              <Link href="#" className="flex items-center gap-2">
                                <Box className={subIconSize + " text-muted-foreground"} />
                                <span>{t('sidebar.maps_elements_fdhs')}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isActive('/maps/elements/foscs')} size="sm">
                              <Link href="#" className="flex items-center gap-2">
                                <Warehouse className={subIconSize + " text-muted-foreground"} />
                                <span>{t('sidebar.maps_elements_foscs')}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isActive('/maps/elements/peds')} size="sm">
                              <Link href="#" className="flex items-center gap-2">
                                <Box className={subIconSize + " text-muted-foreground"} />
                                <span>{t('sidebar.maps_elements_peds')}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isActive('/maps/elements/accessories')} size="sm">
                              <Link href="#" className="flex items-center gap-2">
                                <Puzzle className={subIconSize + " text-muted-foreground"} />
                                <span>{t('sidebar.maps_elements_accessories')}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isActive('/maps/elements/towers')} size="sm">
                              <Link href="#" className="flex items-center gap-2">
                                <TowerControl className={subIconSize + " text-muted-foreground"} />
                                <span>{t('sidebar.maps_elements_towers')}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isActive('/maps/elements/cables')} size="sm">
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
                      <SidebarMenuButton asChild isActive={isActive('/fttx/olts')} size="sm" tooltip={t('sidebar.fttx_olts', 'OLTs')}>
                        <Link href="/fttx/olts" className="flex items-center gap-2">
                          <NetworkIcon className={subIconSize + " text-muted-foreground"} />
                          <span>{t('sidebar.fttx_olts', 'OLTs')}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive('/fttx/onu-templates')} size="sm" tooltip={t('sidebar.fttx_onu_templates', 'ONU Templates')}>
                        <Link href="/fttx/onu-templates" className="flex items-center gap-2">
                          <FileTextIcon className={subIconSize + " text-muted-foreground"} />
                          <span>{t('sidebar.fttx_onu_templates', 'ONU Templates')}</span>
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
                    {/* Financial Configurations moved to Settings */}
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
                          <Briefcase className={iconSize}/> {/* Using Briefcase icon for HR */}
                          <span className="truncate">{t('sidebar.hr', 'HR')}</span>
                          <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                        </div>
                      </SidebarMenuSubTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="right" align="center">{t('sidebar.hr', 'HR')}</TooltipContent>
                  </Tooltip>
                  <SidebarMenuSubContent>
                    {/* Placeholder for HR submenu items */}
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
                                <Network className={subIconSize + " text-muted-foreground"} />
                                <span className="truncate">{t('sidebar.network')}</span>
                                <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                              </div>
                            </SidebarMenuSubTrigger>
                          </TooltipTrigger>
                          <TooltipContent side="right" align="center">{t('sidebar.network')}</TooltipContent>
                        </Tooltip>
                        <SidebarMenuSubContent>
                          <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isActive('/settings/network/ip')} size="sm">
                              <Link href="#" className="flex items-center gap-2">
                                <Code className={subIconSize + " text-muted-foreground"} />
                                <span>{t('sidebar.network_ip')}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isActive('/settings/network/devices')} size="sm">
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
                            <SidebarMenuButton asChild isActive={isActive('/settings/network/radius')} size="sm">
                              <Link href="#" className="flex items-center gap-2">
                                <Server className={subIconSize + " text-muted-foreground"} />
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
                         <Link href="#" className="flex items-center gap-2">
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
                    <SiNextdns className={iconSize} /> {/* Using Dna icon for DNS */}
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

        <SidebarInset noMargin={isMapPage}> {/* Pass noMargin prop */}
          <div className="fixed top-0 left-0 w-full z-50 h-1">
            {isLoading && <Progress value={progress} className="w-full h-1 rounded-none bg-transparent [&>*]:bg-green-600" indicatorClassName="bg-green-600" />}
          </div>
          {/* Conditionally render the AppHeader */}
          {!isMapPage && <AppHeader />}
          {/* Adjust padding for main content area */}
          <div className={isMapPage ? 'p-0' : 'p-4 md:p-6 md:pl-5'}> {/* Reduced left padding for medium screens */}
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
    <html lang="en" suppressHydrationWarning>{/* Add suppressHydrationWarning */}
      <body
        className={`antialiased`}
        suppressHydrationWarning /* Add suppressHydrationWarning */
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryClientProvider client={queryClient}>
            <LocaleProvider> {/* Wrap with LocaleProvider */}
                <AppLayout>{children}</AppLayout> {/* Use inner layout component */}
            </LocaleProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

