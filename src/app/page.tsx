// src/app/page.tsx
'use client';

import * as React from 'react';
import { BarChart, DollarSign, Network, Users, MessageSquareWarning, Activity, ArrowUpRight, ChevronDown } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { SubscriberChart } from '@/components/dashboard/subscriber-chart'; // Create this component
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


// Placeholder data - replace with actual data fetching
const dashboardData = {
  totalSubscribers: 1256,
  subscriberChange: 180.1,
  mrr: 45231.89,
  mrrChange: 20.4,
  networkUptime: 99.98,
  uptimeChange: 0.02, // Small positive change
  openTickets: 23,
  ticketChange: -3, // Negative change means fewer open tickets
  recentActivity: [
    { id: 'act-1', type: 'New Subscriber', description: 'John Doe signed up for the Pro plan.', time: '5 minutes ago' },
    { id: 'act-2', type: 'Ticket Resolved', description: 'Ticket #1234 marked as resolved.', time: '1 hour ago' },
    { id: 'act-3', type: 'Network Alert', description: 'High latency detected on Node-B7.', time: '2 hours ago', level: 'warning' },
    { id: 'act-4', type: 'Payment Received', description: 'Invoice #5678 paid by Jane Smith.', time: '3 hours ago' },
  ],
};

type DashboardView = "General" | "Financial" | "Network" | "Technician";

export default function DashboardPage() {
  const [currentView, setCurrentView] = React.useState<DashboardView>("General");

  const handleViewChange = (view: DashboardView) => {
    setCurrentView(view);
    // Later: Add logic here to load/display different components based on the selected view
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {/* Dashboard Selector Dropdown */}
        <div className="flex justify-start mb-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {currentView} Dashboard
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Select Dashboard View</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleViewChange("General")} disabled={currentView === "General"}>
                General Overview
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleViewChange("Financial")} disabled={currentView === "Financial"}>
                Financial Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleViewChange("Network")} disabled={currentView === "Network"}>
                Network Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleViewChange("Technician")} disabled={currentView === "Technician"}>
                Technician Dashboard
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Content based on currentView - For now, showing general content */}
        {currentView === "General" && (
          <>
            {/* Stat Cards Grid */}
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
              <Card x-chunk="dashboard-01-chunk-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Subscribers
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData.totalSubscribers.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    +{dashboardData.subscriberChange}% from last month
                  </p>
                </CardContent>
              </Card>
              <Card x-chunk="dashboard-01-chunk-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Monthly Recurring Revenue
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${dashboardData.mrr.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  <p className="text-xs text-muted-foreground">
                    +{dashboardData.mrrChange}% from last month
                  </p>
                </CardContent>
              </Card>
              <Card x-chunk="dashboard-01-chunk-2">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Network Uptime</CardTitle>
                  <Network className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData.networkUptime}%</div>
                  <p className="text-xs text-muted-foreground">
                    {dashboardData.uptimeChange >= 0 ? '+' : ''}{dashboardData.uptimeChange}% from last month
                  </p>
                </CardContent>
              </Card>
              <Card x-chunk="dashboard-01-chunk-3">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Open Support Tickets</CardTitle>
                  <MessageSquareWarning className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData.openTickets}</div>
                  <p className="text-xs text-muted-foreground">
                    {dashboardData.ticketChange > 0 ? '+' : ''}{dashboardData.ticketChange} from last hour
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Chart and Activity Grid */}
            <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
              <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
                <CardHeader className="flex flex-row items-center">
                  <div className="grid gap-2">
                    <CardTitle>Subscriber Growth</CardTitle>
                    <CardDescription>
                      Monthly new subscribers over the last 6 months.
                    </CardDescription>
                  </div>
                  {/* Optional: Add controls like date range picker here */}
                </CardHeader>
                <CardContent className="pl-2">
                  {/* Chart Component */}
                  <SubscriberChart />
                </CardContent>
              </Card>
              <Card x-chunk="dashboard-01-chunk-5">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  {dashboardData.recentActivity.length > 0 ? (
                    dashboardData.recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-4">
                        <Activity className="h-5 w-5 text-muted-foreground" /> {/* Generic icon */}
                        <div className="grid gap-1">
                          {/* Changed p to div to fix hydration error */}
                          <div className="text-sm font-medium leading-none">
                            {activity.type}
                            {activity.level && (
                              <Badge variant={activity.level === 'warning' ? 'destructive' : 'secondary'} className="ml-2">
                                {activity.level}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{activity.description}</p>
                        </div>
                        <div className="ml-auto text-sm text-muted-foreground">{activity.time}</div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center">No recent activity.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}

         {/* Placeholder for other dashboard views */}
         {currentView !== "General" && (
           <div className="flex items-center justify-center h-64 border rounded-lg bg-card text-card-foreground">
             <p className="text-muted-foreground">Displaying {currentView} Dashboard Content (Not Implemented)</p>
           </div>
         )}

         {/* Optional: Add back DeviceList/ThreatDetector or other components here */}
         {/* <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6"> */}
           {/* <div className="lg:col-span-2 space-y-6"> */}
             {/* <DeviceList ... /> */}
           {/* </div> */}
           {/* <div className="space-y-6"> */}
             {/* <ManualDeviceEntry ... /> */}
             {/* <ThreatDetector ... /> */}
           {/* </div> */}
         {/* </div> */}
      </main>
    </div>
  );
}
