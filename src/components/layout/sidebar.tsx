// src/components/layout/sidebar.tsx
import * as React from 'react';
import Link from 'next/link';
import { Home, BarChart2, Settings, Users, DollarSign, Network } from 'lucide-react'; // Example icons

export function Sidebar() {
  return (
    <aside className="hidden md:flex md:flex-col md:w-60 bg-card border-r text-card-foreground p-4 space-y-4">
      <div className="text-lg font-semibold">SuperISP</div>
      <nav className="flex-1">
        <ul className="space-y-2">
          <li><Link href="/" className="flex items-center gap-2 p-2 rounded-md hover:bg-muted text-sm"><Home size={16} /> Dashboard</Link></li>
          <li><Link href="/admin/dashboard" className="flex items-center gap-2 p-2 rounded-md hover:bg-muted text-sm"><BarChart2 size={16} /> Admin Dashboard</Link></li>
          <li><Link href="/finances/cash-book" className="flex items-center gap-2 p-2 rounded-md hover:bg-muted text-sm"><DollarSign size={16} /> Cash Book</Link></li>
          <li><Link href="/subscribers" className="flex items-center gap-2 p-2 rounded-md hover:bg-muted text-sm"><Users size={16} /> Subscribers</Link></li>
          <li><Link href="/network-status" className="flex items-center gap-2 p-2 rounded-md hover:bg-muted text-sm"><Network size={16} /> Network Status</Link></li>
          <li><Link href="/settings" className="flex items-center gap-2 p-2 rounded-md hover:bg-muted text-sm"><Settings size={16} /> Settings</Link></li>
        </ul>
      </nav>
    </aside>
  );
}