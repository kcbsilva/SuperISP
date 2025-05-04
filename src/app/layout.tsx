// src/app/layout.tsx
'use client'; // Required for hooks and state

import type { Metadata } from 'next';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Import usePathname
import { useState, useEffect } from 'react'; // Import useState and useEffect
// Import specific icons
import {
  LayoutDashboard, ShieldCheck, Settings, Users, Network, ChevronDown, Dot, MapPin, TowerControl, Cable, Power, Box, Puzzle, Warehouse, Globe, GitFork,
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
  // SidebarCollapseButton, // Removed as sidebar is no longer collapsible
} from '@/components/ui/sidebar';
import { AppHeader } from '@/components/app-header';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip'; // Import Tooltip components
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Import react-query client provider
import { Progress } from '@/components/ui/progress'; // Import Progress component

// Create a client
const queryClient = new QueryClient();

// Metadata can remain static or be dynamically generated if needed elsewhere
// export const metadata: Metadata = {
//   title: 'NetHub Manager',
//   description: 'ISP Management Software',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname(); // Get current path
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

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
  const isActive = (href: string) => pathname.startsWith(href); // Use startsWith for active state in menus
  // Removed boolean checks for parent active state as they are no longer used for highlighting triggers

  return (
    <html lang="en" suppressHydrationWarning> {/* Add suppressHydrationWarning */}
      <body
        className={`antialiased`}
        suppressHydrationWarning /* Add suppressHydrationWarning */
      >
        {/* Wrap entire content with QueryClientProvider */}
       <QueryClientProvider client={queryClient}>
          {/* Configure SidebarProvider */}
          <TooltipProvider>
            <SidebarProvider side="left" collapsible="none">
              <Sidebar>
                <SidebarHeader>
                  {/* App Logo/Title in Sidebar Header */}
                  <Link
                    href="/"
                    className="flex items-center gap-2 text-lg font-semibold text-sidebar-primary px-2" // Added padding for consistency
                  >
                     {/* Placeholder Icon */}
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                       <path d="M12 .75a8.25 8.25 0 0 0-5.162 14.564.75.75 0 0 1-.318.47l-3.75 2.25a.75.75 0 0 0 0 1.332l3.75 2.25a.75.75 0 0 1 .318.47A8.25 8.25 0 0 0 12 23.25a8.25 8.25 0 0 0 8.25-8.25v-6a8.25 8.25 0 0 0-8.25-8.25Zm-3 9a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75Zm0 3.75a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75Z" />
                     </svg>
                     {/* Text always visible */}
                     <span className="font-bold">NetHub</span>
                  </Link>
                </SidebarHeader>
                <SidebarContent>
                  {/* Navigation Menu */}
                  <SidebarMenu>
                    <SidebarMenuItem>
                      {/* Set isActive based on current path */}
                      <SidebarMenuButton asChild isActive={isActive('/') && pathname === '/'} tooltip="Dashboard">
                        <Link href="/" className="flex items-center gap-2">
                          <LayoutDashboard />
                          <span>Dashboard</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    {/* Changed Subscribers to a direct link */}
                     <SidebarMenuItem>
                       <SidebarMenuButton asChild isActive={isActive('/subscribers')} tooltip="Subscribers">
                         <Link href="/subscribers/list" className="flex items-center gap-2">
                           <Users />
                           <span>Subscribers</span>
                         </Link>
                       </SidebarMenuButton>
                     </SidebarMenuItem>

                     {/* Network Menu Item with Submenu */}
                     <SidebarMenuItem>
                        {/* Removed open prop - let trigger control state */}
                       <SidebarMenuSub>
                        {/* Wrap SidebarMenuSubTrigger with Tooltip */}
                         <Tooltip>
                           <TooltipTrigger asChild>
                             {/* Removed isActive prop from trigger */}
                             <SidebarMenuSubTrigger>
                               {/* This doesn't navigate, just opens/closes submenu */}
                               <div className="flex items-center gap-2 cursor-pointer">
                                 <Network />
                                 <span className="truncate">Network</span>
                                 <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" /> {/* Changed icon and rotation */}
                               </div>
                             </SidebarMenuSubTrigger>
                           </TooltipTrigger>
                           <TooltipContent side="right" align="center">Network</TooltipContent>
                         </Tooltip>
                         <SidebarMenuSubContent>
                            {/* Submenu Items */}
                            <SidebarMenuItem >
                               <SidebarMenuButton asChild isActive={isActive('/network/ip')} size="sm"><Link href="#" className="flex items-center gap-2">
                                   <Code className="h-4 w-4 text-muted-foreground"/> {/* Icon Added */}
                                   <span>IPv4/6</span>
                                 </Link></SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                               <SidebarMenuButton asChild isActive={isActive('/network/devices')} size="sm"><Link href="#" className="flex items-center gap-2">
                                   <Router className="h-4 w-4 text-muted-foreground"/> {/* Icon Added */}
                                   <span>Devices</span>
                                 </Link></SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                               <SidebarMenuButton asChild isActive={isActive('/network/cgnat')} size="sm"><Link href="#" className="flex items-center gap-2">
                                   <Share2 className="h-4 w-4 text-muted-foreground"/> {/* Icon Added */}
                                   <span>CGNAT</span>
                                 </Link></SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                               <SidebarMenuButton asChild isActive={isActive('/network/radius')} size="sm"><Link href="#" className="flex items-center gap-2">
                                   <Server className="h-4 w-4 text-muted-foreground"/> {/* Icon Added */}
                                   <span>RADIUS(NAS)</span>
                                 </Link></SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                               <SidebarMenuButton asChild isActive={isActive('/network/vlan')} size="sm"><Link href="#" className="flex items-center gap-2">
                                   <Split className="h-4 w-4 text-muted-foreground"/> {/* Icon Added */}
                                   <span>VLAN</span>
                                 </Link></SidebarMenuButton>
                            </SidebarMenuItem>
                            {/* Towers removed from Network */}
                            {/* Hydro Polls removed from Network */}
                         </SidebarMenuSubContent>
                       </SidebarMenuSub>
                     </SidebarMenuItem>

                     {/* Maps Menu Item with Submenu - Now Top Level */}
                     <SidebarMenuItem>
                       <SidebarMenuSub>
                        {/* Wrap SidebarMenuSubTrigger with Tooltip */}
                         <Tooltip>
                           <TooltipTrigger asChild>
                             {/* Removed isActive prop from trigger */}
                             <SidebarMenuSubTrigger>
                               <div className="flex items-center gap-2 cursor-pointer">
                                 <MapPin /> {/* Changed icon */}
                                 <span className="truncate">Maps</span>
                                 <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                               </div>
                             </SidebarMenuSubTrigger>
                           </TooltipTrigger>
                           <TooltipContent side="right" align="center">Maps</TooltipContent>
                         </Tooltip>
                         <SidebarMenuSubContent>
                           {/* Elements Item - Now a Submenu Trigger */}
                           <SidebarMenuItem>
                             <SidebarMenuSub >
                               {/* Wrap SidebarMenuSubTrigger with Tooltip */}
                               <Tooltip>
                                 <TooltipTrigger asChild>
                                   {/* Removed isActive prop from nested trigger */}
                                   <SidebarMenuSubTrigger
                                     size="sm"
                                     className="pl-3 pr-2 py-1.5" // Adjust padding for nested trigger
                                   >
                                     <div className="flex items-center gap-2 cursor-pointer w-full">
                                       <GitFork className="h-4 w-4 text-muted-foreground"/> {/* Icon for Elements trigger */}
                                       <span className="truncate">Elements</span>
                                       <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                                     </div>
                                   </SidebarMenuSubTrigger>
                                 </TooltipTrigger>
                                 <TooltipContent side="right" align="center">Elements</TooltipContent>
                               </Tooltip>
                               <SidebarMenuSubContent>
                                 {/* Nested Submenu Items for Elements */}
                                 <SidebarMenuItem>
                                   <SidebarMenuButton asChild isActive={isActive('/maps/elements/polls')} size="sm"><Link href="#" className="flex items-center gap-2">
                                       <Power className="h-4 w-4 text-muted-foreground"/> {/* Icon Added */}
                                       <span>Hydro Polls</span>
                                     </Link></SidebarMenuButton>
                                 </SidebarMenuItem>
                                 <SidebarMenuItem>
                                   <SidebarMenuButton asChild isActive={isActive('/maps/elements/fdhs')} size="sm"><Link href="#" className="flex items-center gap-2">
                                       <Box className="h-4 w-4 text-muted-foreground"/> {/* Icon Added */}
                                       <span>FDHs</span>
                                     </Link></SidebarMenuButton>
                                 </SidebarMenuItem>
                                 <SidebarMenuItem>
                                   <SidebarMenuButton asChild isActive={isActive('/maps/elements/foscs')} size="sm"><Link href="#" className="flex items-center gap-2">
                                        <Warehouse className="h-4 w-4 text-muted-foreground"/> {/* Icon Added */}
                                       <span>FOSCs</span>
                                     </Link></SidebarMenuButton>
                                 </SidebarMenuItem>
                                 <SidebarMenuItem>
                                   <SidebarMenuButton asChild isActive={isActive('/maps/elements/peds')} size="sm"><Link href="#" className="flex items-center gap-2">
                                       <Box className="h-4 w-4 text-muted-foreground"/> {/* Icon Added */}
                                       <span>PEDs</span>
                                     </Link></SidebarMenuButton>
                                 </SidebarMenuItem>
                                  <SidebarMenuItem>
                                   <SidebarMenuButton asChild isActive={isActive('/maps/elements/accessories')} size="sm"><Link href="#" className="flex items-center gap-2">
                                       <Puzzle className="h-4 w-4 text-muted-foreground"/> {/* Icon Added */}
                                       <span>Accessories</span>
                                     </Link></SidebarMenuButton>
                                 </SidebarMenuItem>
                                 {/* Towers moved here */}
                                 <SidebarMenuItem>
                                   <SidebarMenuButton asChild isActive={isActive('/maps/elements/towers')} size="sm"><Link href="#" className="flex items-center gap-2">
                                       <TowerControl className="h-4 w-4 text-muted-foreground"/>
                                       <span>Towers</span>
                                     </Link></SidebarMenuButton>
                                 </SidebarMenuItem>
                                 {/* Cables added here */}
                                  <SidebarMenuItem>
                                   <SidebarMenuButton asChild isActive={isActive('/maps/elements/cables')} size="sm"><Link href="#" className="flex items-center gap-2">
                                       <Cable className="h-4 w-4 text-muted-foreground"/>
                                       <span>Cables</span>
                                     </Link></SidebarMenuButton>
                                 </SidebarMenuItem>
                               </SidebarMenuSubContent>
                             </SidebarMenuSub>
                           </SidebarMenuItem>
                           {/* Map Item */}
                           <SidebarMenuItem>
                             <SidebarMenuButton asChild isActive={isActive('/maps/map')} size="sm"><Link href="#" className="flex items-center gap-2"> {/* Adjusted padding */}
                                 <Globe className="h-4 w-4 text-muted-foreground"/> {/* Globe Icon Added */}
                                 <span>Map</span>
                               </Link></SidebarMenuButton>
                           </SidebarMenuItem>
                         </SidebarMenuSubContent>
                       </SidebarMenuSub>
                     </SidebarMenuItem>

                     {/* Finances Menu Item */}
                     <SidebarMenuItem>
                        <SidebarMenuSub>
                          {/* Wrap SidebarMenuSubTrigger with Tooltip */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              {/* Removed isActive prop from trigger */}
                              <SidebarMenuSubTrigger>
                                <div className="flex items-center gap-2 cursor-pointer">
                                  <DollarSign />
                                  <span className="truncate">Finances</span>
                                  <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                                </div>
                              </SidebarMenuSubTrigger>
                            </TooltipTrigger>
                            <TooltipContent side="right" align="center">Finances</TooltipContent>
                          </Tooltip>
                          <SidebarMenuSubContent>
                             <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={isActive('/finances/cash-book')} size="sm"><Link href="#" className="flex items-center gap-2">
                                    <BookOpen className="h-4 w-4 text-muted-foreground"/>
                                    <span>Cash Book</span>
                                  </Link></SidebarMenuButton>
                             </SidebarMenuItem>
                              <SidebarMenuItem>
                                 <SidebarMenuButton asChild isActive={isActive('/finances/configurations')} size="sm"><Link href="#" className="flex items-center gap-2">
                                     <SlidersHorizontal className="h-4 w-4 text-muted-foreground"/> {/* Icon for Financial Config */}
                                     <span>Financial Configurations</span>
                                   </Link></SidebarMenuButton>
                              </SidebarMenuItem>
                             {/* Add more finance sub-items here if needed */}
                          </SidebarMenuSubContent>
                        </SidebarMenuSub>
                      </SidebarMenuItem>

                      {/* Reports Menu Item */}
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isActive('/reports')} tooltip="Reports">
                          <Link href="#" className="flex items-center gap-2">
                            <BarChart3 />
                            <span>Reports</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>


                    <SidebarMenuItem>
                      {/* Example: Adjust if Security page exists */}
                      <SidebarMenuButton asChild isActive={isActive('/security')} tooltip="Security">
                        <Link href="#" className="flex items-center gap-2">
                          <ShieldCheck />
                          <span>Security</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      {/* Settings Menu Item with Submenu */}
                      <SidebarMenuSub>
                       {/* Wrap SidebarMenuSubTrigger with Tooltip */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            {/* Removed isActive prop from trigger */}
                            <SidebarMenuSubTrigger>
                              <div className="flex items-center gap-2 cursor-pointer">
                                <Settings />
                                <span className="truncate">Settings</span>
                                <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                              </div>
                            </SidebarMenuSubTrigger>
                          </TooltipTrigger>
                          <TooltipContent side="right" align="center">Settings</TooltipContent>
                        </Tooltip>
                        <SidebarMenuSubContent>
                           {/* Global Settings */}
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={isActive('/settings/global')} size="sm">
                                  <Link href="/settings/global" className="flex items-center gap-2"> {/* Updated href */}
                                    <Cog className="h-4 w-4 text-muted-foreground"/>
                                    <span>Global Settings</span>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>

                           {/* Business Submenu */}
                           <SidebarMenuItem>
                             <SidebarMenuSub>
                               <Tooltip>
                                 <TooltipTrigger asChild>
                                   {/* Removed isActive prop from nested trigger */}
                                   <SidebarMenuSubTrigger
                                     size="sm"
                                     className="pl-3 pr-2 py-1.5"
                                   >
                                     <div className="flex items-center gap-2 cursor-pointer w-full">
                                       <Briefcase className="h-4 w-4 text-muted-foreground"/>
                                       <span className="truncate">Business</span>
                                       <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                                     </div>
                                   </SidebarMenuSubTrigger>
                                 </TooltipTrigger>
                                 <TooltipContent side="right" align="center">Business</TooltipContent>
                               </Tooltip>
                               <SidebarMenuSubContent>
                                 <SidebarMenuItem>
                                   <SidebarMenuButton asChild isActive={isActive('/settings/business/pops')} size="sm">
                                     <Link href="/settings/business/pops" className="flex items-center gap-2"> {/* Updated href */}
                                       <Building className="h-4 w-4 text-muted-foreground"/>
                                       <span>PoPs (Place of Presence)</span>
                                     </Link>
                                   </SidebarMenuButton>
                                 </SidebarMenuItem>
                                 {/* Add more Business sub-items here */}
                               </SidebarMenuSubContent>
                             </SidebarMenuSub>
                           </SidebarMenuItem>

                          <SidebarMenuItem>
                             {/* Nested Submenu for Integrations */}
                            <SidebarMenuSub>
                              {/* Wrap SidebarMenuSubTrigger with Tooltip */}
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  {/* Removed isActive prop from nested trigger */}
                                  <SidebarMenuSubTrigger
                                    size="sm"
                                    className="pl-3 pr-2 py-1.5" // Adjust padding
                                  >
                                    <div className="flex items-center gap-2 cursor-pointer w-full">
                                      <Plug className="h-4 w-4 text-muted-foreground"/>
                                      <span className="truncate">Integrations</span>
                                      <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                                    </div>
                                  </SidebarMenuSubTrigger>
                                </TooltipTrigger>
                                <TooltipContent side="right" align="center">Integrations</TooltipContent>
                              </Tooltip>
                              <SidebarMenuSubContent>
                                 {/* Integration Sub-Items */}
                                 <SidebarMenuItem>
                                   <SidebarMenuButton asChild isActive={isActive('/settings/integrations/whatsapp')} size="sm"><Link href="#" className="flex items-center gap-2">
                                       {/* Placeholder Icon - Replace with actual WhatsApp icon if available or use SVG */}
                                       <MessageSquare className="h-4 w-4 text-muted-foreground"/>
                                       <span>WhatsApp</span>
                                     </Link></SidebarMenuButton>
                                 </SidebarMenuItem>
                                 <SidebarMenuItem>
                                   <SidebarMenuButton asChild isActive={isActive('/settings/integrations/telegram')} size="sm"><Link href="#" className="flex items-center gap-2">
                                        {/* Placeholder Icon */}
                                       <MessageSquare className="h-4 w-4 text-muted-foreground"/>
                                       <span>Telegram</span>
                                     </Link></SidebarMenuButton>
                                 </SidebarMenuItem>
                                  <SidebarMenuItem>
                                   <SidebarMenuButton asChild isActive={isActive('/settings/integrations/meta')} size="sm"><Link href="#" className="flex items-center gap-2">
                                        {/* Placeholder Icon */}
                                       <MessageSquare className="h-4 w-4 text-muted-foreground"/>
                                       <span>Meta</span>
                                     </Link></SidebarMenuButton>
                                 </SidebarMenuItem>
                                  <SidebarMenuItem>
                                   <SidebarMenuButton asChild isActive={isActive('/settings/integrations/sms')} size="sm"><Link href="#" className="flex items-center gap-2">
                                       <Text className="h-4 w-4 text-muted-foreground"/>
                                       <span>SMS</span>
                                     </Link></SidebarMenuButton>
                                 </SidebarMenuItem>
                              </SidebarMenuSubContent>
                            </SidebarMenuSub>
                          </SidebarMenuItem>
                          {/* Remove Separator and Chat Submenu */}
                          {/* Add more settings sub-items here if needed */}
                        </SidebarMenuSubContent>
                      </SidebarMenuSub>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarContent>
                <SidebarFooter>
                   {/* Removed SidebarCollapseButton */}
                </SidebarFooter>
              </Sidebar>

              <SidebarInset>
                {/* Progress Bar */}
                <div className="fixed top-0 left-0 w-full z-50 h-1"> {/* Added fixed positioning */}
                   {isLoading && <Progress value={progress} className="w-full h-1 rounded-none bg-transparent [&>*]:bg-green-600" indicatorClassName="bg-green-600" />} {/* Use green color */}
                </div>
                 <AppHeader />
                <div className="p-5">{children}</div> {/* Use p-5 for 20px padding */}
                <Toaster />
              </SidebarInset>
            </SidebarProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
