// src/app/layout.tsx
'use client'; // Required for hooks and state

import type { Metadata } from 'next';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Import usePathname
import { useState, useEffect } from 'react'; // Import useState and useEffect
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
  Briefcase, // Added for Business
  Building, // Added for PoPs
  Cog, // Icon for Global Settings
  Plane, // Icon for PilotView
  Bus, // Icon for TransitOS
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
import { AppHeader } from '@/components/app-header';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip'; // Import Tooltip components
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Import react-query client provider
import { Progress } from '@/components/ui/progress'; // Import Progress component
import { LocaleProvider, useLocale } from '@/contexts/LocaleContext'; // Import LocaleProvider and useLocale

// Create a client
const queryClient = new QueryClient();

// Metadata can remain static or be dynamically generated if needed elsewhere
// export const metadata: Metadata = {
//   title: 'NetHub Manager',
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
  const isActive = (href: string) => pathname.startsWith(href);

  // Check if the current route is the map page
  const isMapPage = pathname === '/maps/map';

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
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M12 .75a8.25 8.25 0 0 0-5.162 14.564.75.75 0 0 1-.318.47l-3.75 2.25a.75.75 0 0 0 0 1.332l3.75 2.25a.75.75 0 0 1 .318.47A8.25 8.25 0 0 0 12 23.25a8.25 8.25 0 0 0 8.25-8.25v-6a8.25 8.25 0 0 0-8.25-8.25Zm-3 9a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75Zm0 3.75a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75Z" />
              </svg>
              {/* Removed text-based title */}
              {/* <span className="font-bold">NetHub</span> */}
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/') && pathname === '/'} tooltip={t('sidebar.dashboard')}>
                  <Link href="/" className="flex items-center gap-2">
                    <LayoutDashboard />
                    <span>{t('sidebar.dashboard')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Subscribers Menu - Direct Links */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/subscribers/list')} tooltip={t('sidebar.subscribers')}>
                  <Link href="/subscribers/list" className="flex items-center gap-2">
                    <Users />
                    <span className="truncate">{t('sidebar.subscribers')}</span>
                    {/* Removed ChevronDown */}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Network Menu */}
              <SidebarMenuItem>
                <SidebarMenuSub>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuSubTrigger tooltip={t('sidebar.network')}>
                        <div className="flex items-center gap-2 cursor-pointer">
                          <Network />
                          <span className="truncate">{t('sidebar.network')}</span>
                          <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                        </div>
                      </SidebarMenuSubTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="right" align="center">{t('sidebar.network')}</TooltipContent>
                  </Tooltip>
                  <SidebarMenuSubContent>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive('/network/ip')} size="sm">
                        <Link href="#" className="flex items-center gap-2">
                          <Code className="h-4 w-4 text-muted-foreground" />
                          <span>{t('sidebar.network_ip')}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive('/network/devices')} size="sm">
                        <Link href="#" className="flex items-center gap-2">
                          <Router className="h-4 w-4 text-muted-foreground" />
                          <span>{t('sidebar.network_devices')}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive('/network/cgnat')} size="sm">
                        <Link href="#" className="flex items-center gap-2">
                          <Share2 className="h-4 w-4 text-muted-foreground" />
                          <span>{t('sidebar.network_cgnat')}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive('/network/radius')} size="sm">
                        <Link href="#" className="flex items-center gap-2">
                          <Server className="h-4 w-4 text-muted-foreground" />
                          <span>{t('sidebar.network_radius')}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive('/network/vlan')} size="sm">
                        <Link href="#" className="flex items-center gap-2">
                          <Split className="h-4 w-4 text-muted-foreground" />
                          <span>{t('sidebar.network_vlan')}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenuSubContent>
                </SidebarMenuSub>
              </SidebarMenuItem>

              {/* Maps Menu */}
              <SidebarMenuItem>
                <SidebarMenuSub>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuSubTrigger tooltip={t('sidebar.maps')}>
                        <div className="flex items-center gap-2 cursor-pointer">
                          <MapPin />
                          <span className="truncate">{t('sidebar.maps')}</span>
                          <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                        </div>
                      </SidebarMenuSubTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="right" align="center">{t('sidebar.maps')}</TooltipContent>
                  </Tooltip>
                  <SidebarMenuSubContent>
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
                                <GitFork className="h-4 w-4 text-muted-foreground" />
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
                                <Power className="h-4 w-4 text-muted-foreground" />
                                <span>{t('sidebar.maps_elements_polls')}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isActive('/maps/elements/fdhs')} size="sm">
                              <Link href="#" className="flex items-center gap-2">
                                <Box className="h-4 w-4 text-muted-foreground" />
                                <span>{t('sidebar.maps_elements_fdhs')}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isActive('/maps/elements/foscs')} size="sm">
                              <Link href="#" className="flex items-center gap-2">
                                <Warehouse className="h-4 w-4 text-muted-foreground" />
                                <span>{t('sidebar.maps_elements_foscs')}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isActive('/maps/elements/peds')} size="sm">
                              <Link href="#" className="flex items-center gap-2">
                                <Box className="h-4 w-4 text-muted-foreground" />
                                <span>{t('sidebar.maps_elements_peds')}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isActive('/maps/elements/accessories')} size="sm">
                              <Link href="#" className="flex items-center gap-2">
                                <Puzzle className="h-4 w-4 text-muted-foreground" />
                                <span>{t('sidebar.maps_elements_accessories')}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isActive('/maps/elements/towers')} size="sm">
                              <Link href="#" className="flex items-center gap-2">
                                <TowerControl className="h-4 w-4 text-muted-foreground" />
                                <span>{t('sidebar.maps_elements_towers')}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isActive('/maps/elements/cables')} size="sm">
                              <Link href="#" className="flex items-center gap-2">
                                <Cable className="h-4 w-4 text-muted-foreground" />
                                <span>{t('sidebar.maps_elements_cables')}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        </SidebarMenuSubContent>
                      </SidebarMenuSub>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive('/maps/map')} size="sm" tooltip={t('sidebar.maps_map')}>
                        <Link href="/maps/map" className="flex items-center gap-2"> {/* Updated href */}
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <span>{t('sidebar.maps_map')}</span>
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
                      <SidebarMenuButton asChild isActive={isActive('/finances/cash-book')} size="sm" tooltip={t('sidebar.finances_cash_book')}>
                        <Link href="#" className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          <span>{t('sidebar.finances_cash_book')}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive('/finances/configurations')} size="sm" tooltip={t('sidebar.finances_config')}>
                        <Link href="#" className="flex items-center gap-2">
                          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                          <span>{t('sidebar.finances_config')}</span>
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
                    <BarChart3 />
                    <span>{t('sidebar.reports')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Security Menu */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/security')} tooltip={t('sidebar.security')}>
                  <Link href="#" className="flex items-center gap-2">
                    <ShieldCheck />
                    <span>{t('sidebar.security')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Settings Menu */}
              <SidebarMenuItem>
                <SidebarMenuSub>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuSubTrigger tooltip={t('sidebar.settings')}>
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
                      <SidebarMenuButton asChild isActive={isActive('/settings/global')} size="sm" tooltip={t('sidebar.settings_global')}>
                        <Link href="/settings/global" className="flex items-center gap-2">
                          <Cog className="h-4 w-4 text-muted-foreground" />
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
                            <SidebarMenuButton asChild isActive={isActive('/settings/business/pops')} size="sm" tooltip={t('sidebar.settings_business_pops')}>
                              <Link href="/settings/business/pops" className="flex items-center gap-2">
                                <Building className="h-4 w-4 text-muted-foreground" />
                                <span>{t('sidebar.settings_business_pops')}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        </SidebarMenuSubContent>
                      </SidebarMenuSub>
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
                            <SidebarMenuButton asChild isActive={isActive('/settings/integrations/whatsapp')} size="sm" tooltip={t('sidebar.settings_integrations_whatsapp')}>
                              <Link href="#" className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                <span>{t('sidebar.settings_integrations_whatsapp')}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isActive('/settings/integrations/telegram')} size="sm" tooltip={t('sidebar.settings_integrations_telegram')}>
                              <Link href="#" className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                <span>{t('sidebar.settings_integrations_telegram')}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isActive('/settings/integrations/meta')} size="sm" tooltip={t('sidebar.settings_integrations_meta')}>
                              <Link href="#" className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                <span>{t('sidebar.settings_integrations_meta')}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isActive('/settings/integrations/sms')} size="sm" tooltip={t('sidebar.settings_integrations_sms')}>
                              <Link href="#" className="flex items-center gap-2">
                                <Text className="h-4 w-4 text-muted-foreground" />
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
                    <Plane />
                    <span>{t('sidebar.pilotview', 'PilotView')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* TransitOS Menu Item */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/transitos')} tooltip={t('sidebar.transitos', 'TransitOS')}>
                  <Link href="#" className="flex items-center gap-2">
                    <Bus />
                    <span>{t('sidebar.transitos', 'TransitOS')}</span>
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
    <html lang="en" suppressHydrationWarning> {/* Add suppressHydrationWarning */}
      <body
        className={`antialiased`}
        suppressHydrationWarning /* Add suppressHydrationWarning */
      >
        <QueryClientProvider client={queryClient}>
          <LocaleProvider> {/* Wrap with LocaleProvider */}
              <AppLayout>{children}</AppLayout> {/* Use inner layout component */}
          </LocaleProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
