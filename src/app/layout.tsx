import type { Metadata } from 'next';
import Link from 'next/link';
import { Geist, Geist_Mono } from 'next/font/google';
import { LayoutDashboard, ShieldCheck, Settings, Wifi, Users, List, UserPlus } from 'lucide-react'; // Import icons

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
import { AppHeader } from '@/components/app-header'; // Import the new AppHeader

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'NetHub Manager',
  description: 'ISP Management Software',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SidebarProvider defaultOpen={false}> {/* Collapsed by default */}
          {/* Sidebar Component */}
          <Sidebar side="left" collapsible="icon"> {/* Ensure collapsible is set */}
            <SidebarHeader>
              {/* App Logo/Title in Sidebar Header */}
              <Link
                href="/"
                className="flex items-center gap-2 text-lg font-semibold text-sidebar-primary"
              >
                <Wifi className="h-6 w-6" />
                <span>NetHub Manager</span>
              </Link>
            </SidebarHeader>
            <SidebarContent>
              {/* Navigation Menu */}
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive>
                    <Link href="/" className="flex items-center gap-2 w-full">
                      <LayoutDashboard />
                      <span>Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                   <SidebarMenuButton>
                     <Users />
                     <span>Subscribers</span>
                   </SidebarMenuButton>
                   <SidebarMenuSub>
                     <SidebarMenuSubItem>
                       <SidebarMenuSubButton href="/subscribers/list">
                          <List/>
                          <span>List</span>
                       </SidebarMenuSubButton>
                     </SidebarMenuSubItem>
                     <SidebarMenuSubItem>
                       <SidebarMenuSubButton href="/subscribers/add">
                          <UserPlus/>
                          <span>Add New</span>
                       </SidebarMenuSubButton>
                     </SidebarMenuSubItem>
                   </SidebarMenuSub>
                 </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Link href="#" className="flex items-center gap-2 w-full">
                      <ShieldCheck />
                      <span>Security</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                   <SidebarMenuButton >
                    <Link href="#" className="flex items-center gap-2 w-full">
                      <Settings />
                      <span>Settings</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
            {/* Optional Sidebar Footer */}
            <SidebarFooter>
              {/* Footer content like user info or logout */}
            </SidebarFooter>
          </Sidebar>

          {/* Main Content Area */}
          <SidebarInset>
            {/* Header within the main content area */}
            <AppHeader />
            {/* Page Content */}
            <div className="p-4 md:p-6">{children}</div>
            <Toaster />
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}
