// src/app/layout.tsx
'use client'; // Required for usePathname hook

import type { Metadata } from 'next';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Import usePathname
import { Geist, Geist_Mono } from 'next/font/google';
import { LayoutDashboard, ShieldCheck, Settings, Users, List, UserPlus } from 'lucide-react';

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
    <html lang="en" suppressHydrationWarning> {/* Add suppressHydrationWarning */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning /* Add suppressHydrationWarning */
      >
        {/* Configure SidebarProvider for icon-only behavior */}
        <SidebarProvider side="left" collapsible="icon"> {/* Always icon mode */}
          {/* Sidebar Component - always collapsed */}
          <Sidebar>
            <SidebarHeader>
              {/* App Logo/Title in Sidebar Header */}
              <Link
                href="/"
                className="flex items-center justify-center h-10 text-lg font-semibold text-sidebar-primary" // Always centered
              >
                 {/* Placeholder Icon */}
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                   <path d="M12 .75a8.25 8.25 0 0 0-5.162 14.564.75.75 0 0 1-.318.47l-3.75 2.25a.75.75 0 0 0 0 1.332l3.75 2.25a.75.75 0 0 1 .318.47A8.25 8.25 0 0 0 12 23.25a8.25 8.25 0 0 0 8.25-8.25v-6a8.25 8.25 0 0 0-8.25-8.25Zm-3 9a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75Zm0 3.75a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75Z" />
                 </svg>

                 <span className="ml-2 hidden">NetHub</span> {/* Text is always hidden */}
              </Link>
            </SidebarHeader>
            <SidebarContent>
              {/* Navigation Menu */}
              <SidebarMenu>
                <SidebarMenuItem>
                  {/* Set isActive based on current path */}
                  <SidebarMenuButton isActive={isActive('/')} tooltip="Dashboard">
                    <Link href="/" className="flex items-center gap-2 w-full justify-center"> {/* Center content */}
                      <LayoutDashboard />
                      <span className="hidden">Dashboard</span> {/* Text always hidden */}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                   {/* Set isActive for the parent button if any sub-item is active */}
                   <SidebarMenuButton isActive={isSubscribersActive} tooltip="Subscribers">
                     {/* Center content */}
                     <div className="flex items-center justify-center gap-2 w-full">
                       <Users />
                       <span className="hidden">Subscribers</span> {/* Text always hidden */}
                     </div>
                   </SidebarMenuButton>
                   {/* Submenu still appears on hover of parent item */}
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
                    <Link href="#" className="flex items-center gap-2 w-full justify-center"> {/* Center content */}
                      <ShieldCheck />
                      <span className="hidden">Security</span> {/* Text always hidden */}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                   {/* Example: Adjust if Settings page exists */}
                   <SidebarMenuButton isActive={isActive('/settings')} tooltip="Settings">
                    <Link href="#" className="flex items-center gap-2 w-full justify-center"> {/* Center content */}
                      <Settings />
                      <span className="hidden">Settings</span> {/* Text always hidden */}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
              {/* Footer content remains centered */}
            </SidebarFooter>
             {/* No collapse button needed */}
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
