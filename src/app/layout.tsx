// src/app/layout.tsx
'use client'; // Required for usePathname hook

import type { Metadata } from 'next';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Import usePathname
import { Geist, Geist_Mono } from 'next/font/google';
import { LayoutDashboard, ShieldCheck, Settings, Wifi, Users, List, UserPlus } from 'lucide-react';

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
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarInset,
  SidebarCollapseButton, // Import the collapse button
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

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Configure SidebarProvider with desired side and collapsible mode */}
        <SidebarProvider defaultOpen={true} side="left" collapsible="icon"> {/* Default to open */}
          {/* Sidebar Component - inherits side and collapsible from provider */}
          <Sidebar>
            <SidebarHeader>
              {/* App Logo/Title in Sidebar Header */}
              <Link
                href="/"
                className="flex items-center gap-2 text-lg font-semibold text-sidebar-primary"
              >
                <Wifi className="h-6 w-6" />
                {/* Use span and conditionally hide based on CSS in Sidebar component */}
                <span>NetHub Manager</span>
              </Link>
               {/* Add the collapse button inside the header */}
               <SidebarCollapseButton />
            </SidebarHeader>
            <SidebarContent>
              {/* Navigation Menu */}
              <SidebarMenu>
                <SidebarMenuItem>
                  {/* Set isActive based on current path */}
                  <SidebarMenuButton isActive={isActive('/')} tooltip="Dashboard">
                    <Link href="/" className="flex items-center gap-2 w-full">
                      <LayoutDashboard />
                      <span>Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                   {/* Set isActive for the parent button if any sub-item is active */}
                   <SidebarMenuButton isActive={isSubscribersActive} tooltip="Subscribers">
                     <Users />
                     <span>Subscribers</span>
                   </SidebarMenuButton>
                   <SidebarMenuSub>
                     <SidebarMenuSubItem>
                       {/* Set isActive for sub-button */}
                       <SidebarMenuSubButton href="/subscribers/list" isActive={isActive('/subscribers/list')}>
                          <List/>
                          <span>List</span>
                       </SidebarMenuSubButton>
                     </SidebarMenuSubItem>
                     <SidebarMenuSubItem>
                        {/* Set isActive for sub-button */}
                       <SidebarMenuSubButton href="/subscribers/add" isActive={isActive('/subscribers/add')}>
                          <UserPlus/>
                          <span>Add New</span>
                       </SidebarMenuSubButton>
                     </SidebarMenuSubItem>
                   </SidebarMenuSub>
                 </SidebarMenuItem>
                <SidebarMenuItem>
                  {/* Example: Adjust if Security page exists */}
                  <SidebarMenuButton isActive={isActive('/security')} tooltip="Security">
                    <Link href="#" className="flex items-center gap-2 w-full">
                      <ShieldCheck />
                      <span>Security</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                   {/* Example: Adjust if Settings page exists */}
                   <SidebarMenuButton isActive={isActive('/settings')} tooltip="Settings">
                    <Link href="#" className="flex items-center gap-2 w-full">
                      <Settings />
                      <span>Settings</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
              {/* Footer content */}
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
