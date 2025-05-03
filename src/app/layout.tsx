// src/app/layout.tsx
'use client'; // Required for usePathname hook and state

import type { Metadata } from 'next';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Import usePathname
import { Geist, Geist_Mono } from 'next/font/google';
import { LayoutDashboard, ShieldCheck, Settings, Users, Network, ChevronDown, Dot, MapPin, TowerControl, Cable, Power, Box, Puzzle, Warehouse, Globe } from 'lucide-react'; // Added Globe icon

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
} from '@/components/ui/sidebar';
import { AppHeader } from '@/components/app-header';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

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

  // Determine if a link is active
  const isActive = (href: string) => pathname === href;
  const isSubscribersActive = pathname.startsWith('/subscribers');
  const isNetworkActive = pathname.startsWith('/network'); // Added for Network active state
  const isMapsActive = pathname.startsWith('/maps'); // Added for Maps active state
  const isMapElementsActive = pathname.startsWith('/maps/elements'); // Added for Elements active state

  return (
    <html lang="en" suppressHydrationWarning> {/* Add suppressHydrationWarning */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning /* Add suppressHydrationWarning */
      >
        {/* Configure SidebarProvider - Removed collapsible props */}
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
                  <SidebarMenuButton asChild isActive={isActive('/')} tooltip="Dashboard">
                    <Link href="/" className="flex items-center gap-2">
                      <LayoutDashboard />
                      <span>Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                   <SidebarMenuSub>
                      <SidebarMenuSubTrigger
                         isActive={isSubscribersActive}
                         // Removed tooltip and asChild
                      >
                         <div className="flex items-center gap-2 cursor-pointer">
                           <Users />
                           <span className="truncate">Subscribers</span>
                           <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                         </div>
                      </SidebarMenuSubTrigger>
                      <SidebarMenuSubContent>
                         <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isActive('/subscribers/list')} size="sm">
                               <Link href="/subscribers/list" className="flex items-center gap-2"> {/* Updated href */}
                                  <Dot className="text-muted-foreground"/>
                                  <span>List</span>
                               </Link>
                            </SidebarMenuButton>
                         </SidebarMenuItem>
                         <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isActive('/subscribers/add')} size="sm">
                               <Link href="/subscribers/add" className="flex items-center gap-2"> {/* Updated href */}
                                  <Dot className="text-muted-foreground"/>
                                  <span>Add New</span>
                               </Link>
                            </SidebarMenuButton>
                         </SidebarMenuItem>
                      </SidebarMenuSubContent>
                   </SidebarMenuSub>
                 </SidebarMenuItem>

                 {/* Network Menu Item with Submenu */}
                 <SidebarMenuItem>
                    {/* Removed open prop - let trigger control state */}
                    <SidebarMenuSub>
                      <SidebarMenuSubTrigger
                        // Removed asChild and tooltip
                        isActive={isNetworkActive} // Use isActive for styling only
                      >
                        {/* This doesn't navigate, just opens/closes submenu */}
                        <div className="flex items-center gap-2 cursor-pointer">
                           <Network />
                           <span className="truncate">Network</span>
                           <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" /> {/* Changed icon and rotation */}
                        </div>
                      </SidebarMenuSubTrigger>
                      <SidebarMenuSubContent>
                         {/* Submenu Items */}
                         <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isActive('/network/ip')} size="sm">
                              <Link href="#" className="flex items-center gap-2">
                                <Dot className="text-muted-foreground"/>
                                <span>IPv4/6</span>
                              </Link>
                            </SidebarMenuButton>
                         </SidebarMenuItem>
                         <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isActive('/network/devices')} size="sm">
                              <Link href="#" className="flex items-center gap-2">
                                <Dot className="text-muted-foreground"/>
                                <span>Devices</span>
                              </Link>
                            </SidebarMenuButton>
                         </SidebarMenuItem>
                         <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isActive('/network/cgnat')} size="sm">
                              <Link href="#" className="flex items-center gap-2">
                                <Dot className="text-muted-foreground"/>
                                <span>CGNAT</span>
                              </Link>
                            </SidebarMenuButton>
                         </SidebarMenuItem>
                         <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isActive('/network/radius')} size="sm">
                              <Link href="#" className="flex items-center gap-2">
                                <Dot className="text-muted-foreground"/>
                                <span>RADIUS(NAS)</span>
                              </Link>
                            </SidebarMenuButton>
                         </SidebarMenuItem>
                         <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isActive('/network/vlan')} size="sm">
                              <Link href="#" className="flex items-center gap-2">
                                <Dot className="text-muted-foreground"/>
                                <span>VLAN</span>
                              </Link>
                            </SidebarMenuButton>
                         </SidebarMenuItem>
                         {/* Towers removed from Network */}
                         {/* Hydro Polls removed from Network */}
                      </SidebarMenuSubContent>
                    </SidebarMenuSub>
                 </SidebarMenuItem>

                 {/* Maps Menu Item with Submenu - Now Top Level */}
                 <SidebarMenuItem>
                   <SidebarMenuSub>
                     <SidebarMenuSubTrigger
                       isActive={isMapsActive}
                     >
                       <div className="flex items-center gap-2 cursor-pointer">
                         <MapPin /> {/* Changed icon */}
                         <span className="truncate">Maps</span>
                         <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                       </div>
                     </SidebarMenuSubTrigger>
                     <SidebarMenuSubContent>
                       {/* Elements Item - Now a Submenu Trigger */}
                       <SidebarMenuItem>
                         <SidebarMenuSub>
                           <SidebarMenuSubTrigger
                             isActive={isMapElementsActive}
                             size="sm"
                             className="pl-3 pr-2 py-1.5" // Adjust padding for nested trigger
                           >
                             <div className="flex items-center gap-2 cursor-pointer w-full">
                               <Dot className="text-muted-foreground"/> {/* Icon for Elements trigger */}
                               <span className="truncate">Elements</span>
                               <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                             </div>
                           </SidebarMenuSubTrigger>
                           <SidebarMenuSubContent>
                              {/* Nested Submenu Items for Elements */}
                              <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={isActive('/maps/elements/polls')} size="sm">
                                  <Link href="#" className="flex items-center gap-2">
                                    <Power className="h-4 w-4 text-muted-foreground"/> {/* Icon Added */}
                                    <span>Hydro Polls</span>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                              <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={isActive('/maps/elements/fdhs')} size="sm">
                                  <Link href="#" className="flex items-center gap-2">
                                    <Box className="h-4 w-4 text-muted-foreground"/> {/* Icon Added */}
                                    <span>FDHs</span>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                              <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={isActive('/maps/elements/foscs')} size="sm">
                                  <Link href="#" className="flex items-center gap-2">
                                     <Warehouse className="h-4 w-4 text-muted-foreground"/> {/* Icon Added */}
                                    <span>FOSCs</span>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                              <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={isActive('/maps/elements/peds')} size="sm">
                                  <Link href="#" className="flex items-center gap-2">
                                    <Box className="h-4 w-4 text-muted-foreground"/> {/* Icon Added */}
                                    <span>PEDs</span>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                               <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={isActive('/maps/elements/accessories')} size="sm">
                                  <Link href="#" className="flex items-center gap-2">
                                    <Puzzle className="h-4 w-4 text-muted-foreground"/> {/* Icon Added */}
                                    <span>Accessories</span>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                              {/* Towers moved here */}
                              <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={isActive('/maps/elements/towers')} size="sm">
                                  <Link href="#" className="flex items-center gap-2">
                                    <TowerControl className="h-4 w-4 text-muted-foreground"/>
                                    <span>Towers</span>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                              {/* Cables added here */}
                               <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={isActive('/maps/elements/cables')} size="sm">
                                  <Link href="#" className="flex items-center gap-2">
                                    <Cable className="h-4 w-4 text-muted-foreground"/>
                                    <span>Cables</span>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                           </SidebarMenuSubContent>
                         </SidebarMenuSub>
                       </SidebarMenuItem>
                       {/* Map Item */}
                       <SidebarMenuItem>
                         <SidebarMenuButton asChild isActive={isActive('/maps/map')} size="sm">
                           <Link href="#" className="flex items-center gap-2"> {/* Adjusted padding */}
                             <Globe className="h-4 w-4 text-muted-foreground"/> {/* Globe Icon Added */}
                             <span>Map</span>
                           </Link>
                         </SidebarMenuButton>
                       </SidebarMenuItem>
                     </SidebarMenuSubContent>
                   </SidebarMenuSub>
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
                   {/* Example: Adjust if Settings page exists */}
                   <SidebarMenuButton asChild isActive={isActive('/settings')} tooltip="Settings">
                    <Link href="#" className="flex items-center gap-2">
                      <Settings />
                      <span>Settings</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
               {/* Removed SidebarCollapseButton */}
            </SidebarFooter>
          </Sidebar>

          <SidebarInset>
            <AppHeader />
            <div className="p-4 md:p-6">{children}</div>
            <Toaster />
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}
