'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Wifi } from 'lucide-react'; // Keep Wifi icon if needed for branding consistency

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 md:px-6">
      {/* Sidebar Trigger for mobile/collapsible */}
      <SidebarTrigger className="md:hidden" />

      {/* Optional: Page Title or Breadcrumbs can go here */}
      {/* Example: <h1 className="text-lg font-semibold">Dashboard</h1> */}

      {/* Spacer */}
      <div className="flex-1"></div>

      {/* Optional: User menu, search, etc. can go here */}
    </header>
  );
}
