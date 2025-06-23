// src/components/dashboard/sections/CustomizableDashboard.tsx
'use client';

import * as React from 'react';
import GridLayout, { Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { Pencil, Check } from 'lucide-react';

import PlanPerformanceChart from '@/components/dashboard/charts/PlanPerformanceChart';
import AlertsTimeline from '@/components/dashboard/widgets/AlertsTimeline';
import TechnicianInsightsCard from '@/components/dashboard/widgets/TechnicianInsightsCard';
import TopSubscribersTable from '@/components/dashboard/widgets/TopSubscribersTable';
import ChurnRetentionChart from '@/components/dashboard/charts/ChurnRetentionChart';
import UpcomingPaymentsPanel from '@/components/dashboard/widgets/UpcomingPaymentsPanel';
import RealTimeNetworkMap from '@/components/dashboard/widgets/RealTimeNetworkMap';
import TotalSubscribersCard from '@/components/dashboard/widgets/TotalSubscribersCard';
import MRRCard from '@/components/dashboard/widgets/MRRCard';
import NetworkUptimeCard from '@/components/dashboard/widgets/NetworkUptimeCard';
import OpenTicketsCard from '@/components/dashboard/widgets/OpenTicketsCard';
import SubscriberGrowthChart from '@/components/dashboard/widgets/SubscriberGrowthChart';
import RecentActivityList from '@/components/dashboard/widgets/RecentActivityList';

const currentDepartment: Department = 'supervisor';

const departments = ['commercial', 'financial', 'network', 'support', 'supervisor'] as const;
type Department = typeof departments[number];
type DashboardView = 'General' | 'Financial' | 'Network' | 'Technician' | 'Supervisor';

interface WidgetConfig {
  component: React.ReactNode;
  departments: Department[];
}

const widgetConfigs: Record<DashboardView, Record<string, WidgetConfig>> = {
  General: {
    planPerformance: { component: <PlanPerformanceChart />, departments: ['commercial', 'supervisor'] },
    alerts: { component: <AlertsTimeline />, departments: ['network', 'support', 'supervisor'] },
    technician: { component: <TechnicianInsightsCard />, departments: ['support', 'supervisor'] },
    totalSubscribers: { component: <TotalSubscribersCard />, departments: ['commercial', 'supervisor'] },
    mrr: { component: <MRRCard />, departments: ['financial', 'supervisor'] },
    networkUptime: { component: <NetworkUptimeCard />, departments: ['network', 'supervisor'] },
    openTickets: { component: <OpenTicketsCard />, departments: ['support', 'supervisor'] },
    subscriberGrowth: { component: <SubscriberGrowthChart />, departments: ['commercial', 'supervisor'] },
    recentActivity: { component: <RecentActivityList />, departments: ['supervisor'] },
  },
  Financial: {
    topSubscribers: { component: <TopSubscribersTable />, departments: ['financial', 'supervisor'] },
    churnRetention: { component: <ChurnRetentionChart />, departments: ['financial', 'supervisor'] },
    upcomingPayments: { component: <UpcomingPaymentsPanel />, departments: ['financial', 'supervisor'] },
  },
  Network: {
    realtimeMap: { component: <RealTimeNetworkMap />, departments: ['network', 'supervisor'] },
  },
  Technician: {},
  Supervisor: {},
};

const defaultLayouts: Record<DashboardView, Layout[]> = {
  General: [
    { i: 'planPerformance', x: 0, y: 0, w: 2, h: 2 },
    { i: 'alerts', x: 2, y: 0, w: 2, h: 2 },
    { i: 'technician', x: 4, y: 0, w: 2, h: 2 },
    { i: 'totalSubscribers', x: 0, y: 2, w: 2, h: 2 },
    { i: 'mrr', x: 2, y: 2, w: 2, h: 2 },
    { i: 'networkUptime', x: 4, y: 2, w: 2, h: 2 },
    { i: 'openTickets', x: 6, y: 2, w: 2, h: 2 },
    { i: 'subscriberGrowth', x: 0, y: 4, w: 4, h: 2 },
    { i: 'recentActivity', x: 4, y: 4, w: 4, h: 2 },
  ],
  Financial: [
    { i: 'topSubscribers', x: 0, y: 0, w: 4, h: 2 },
    { i: 'churnRetention', x: 4, y: 0, w: 4, h: 2 },
    { i: 'upcomingPayments', x: 0, y: 2, w: 8, h: 2 },
  ],
  Network: [
    { i: 'realtimeMap', x: 0, y: 0, w: 8, h: 4 },
  ],
  Technician: [],
  Supervisor: [],
};

export default function CustomDashboardPage() {
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => setHydrated(true), []);

  const [currentView, setCurrentView] = React.useState<DashboardView>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('dashboard-view') as DashboardView) || 'General';
    }
    return 'General';
  });

  const [layouts, setLayouts] = React.useState<Record<DashboardView, Layout[]>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dashboard-layouts');
      return saved ? JSON.parse(saved) : defaultLayouts;
    }
    return defaultLayouts;
  });

  const [hidden, setHidden] = React.useState<Record<DashboardView, string[]>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dashboard-hidden');
      return saved ? JSON.parse(saved) : { General: [], Financial: [], Network: [], Technician: [], Supervisor: [] };
    }
    return { General: [], Financial: [], Network: [], Technician: [], Supervisor: [] };
  });

  const [isEditing, setIsEditing] = React.useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dashboard-editing');
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });

  if (!hydrated) return <div className="p-4 text-muted-foreground">Loading dashboard...</div>;

  const viewWidgets = widgetConfigs[currentView];
  const hiddenWidgets = hidden[currentView] || [];
  const visibleWidgets = Object.entries(viewWidgets).filter(
    ([key, config]: [string, WidgetConfig]) => config.departments.includes(currentDepartment) && !hiddenWidgets.includes(key)
  );

  const handleLayoutChange = (newLayout: Layout[]) => {
    const updated = { ...layouts, [currentView]: newLayout };
    setLayouts(updated);
    localStorage.setItem('dashboard-layouts', JSON.stringify(updated));
  };

  const handleRemove = (key: string) => {
    const updated = { ...hidden, [currentView]: [...hiddenWidgets, key] };
    setHidden(updated);
    localStorage.setItem('dashboard-hidden', JSON.stringify(updated));
  };

  const handleRestore = (key: string) => {
    const updated = { ...hidden, [currentView]: hiddenWidgets.filter((k: string) => k !== key) };
    setHidden(updated);
    localStorage.setItem('dashboard-hidden', JSON.stringify(updated));
  };

  const toggleEdit = () => {
    const updated = !isEditing;
    setIsEditing(updated);
    localStorage.setItem('dashboard-editing', JSON.stringify(updated));
  };

  return (
    <div className="p-4 w-full overflow-x-auto bg-background">
      <div className="mb-4 flex gap-4 min-w-[1200px] items-end bg-transparent">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Dashboard View</span>
          <select
            value={currentView}
            onChange={(e) => {
              setCurrentView(e.target.value as DashboardView);
              localStorage.setItem('dashboard-view', e.target.value);
            }}
            className="px-3 py-2 text-sm border rounded h-[36px]"
          >
            {Object.keys(widgetConfigs).map((view: string) => (
              <option key={view} value={view}>{view} Dashboard</option>
            ))}
          </select>
        </div>

        <button
          onClick={toggleEdit}
          className="h-[36px] px-3 py-1 rounded bg-primary text-white text-sm flex items-center gap-1"
          title={isEditing ? 'Finish Editing' : 'Edit Layout'}
        >
          {isEditing ? <Check className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
        </button>

        {hiddenWidgets.length > 0 && (
          <div className="flex gap-2 items-center text-sm">
            <span className="font-medium">Restore Widgets:</span>
            {hiddenWidgets.map((key: string) => (
              <button
                key={key}
                onClick={() => handleRestore(key)}
                className="px-2 py-1 bg-primary text-white rounded"
              >
                + {key}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="min-w-[1200px] bg-transparent">
        <GridLayout
          className="layout"
          layout={layouts[currentView].filter((item: Layout) =>
            visibleWidgets.some(([key]) => key === item.i)
          )}
          cols={8}
          rowHeight={100}
          width={1200}
          isDraggable={isEditing}
          isResizable={isEditing}
          onLayoutChange={handleLayoutChange}
          preventCollision={true}
          compactType={null}
        >
          {visibleWidgets.map(([key, config]: [string, WidgetConfig]) => (
            <div key={key} className="rounded-md shadow relative bg-background">
              {isEditing && (
                <button
                  onClick={() => handleRemove(key)}
                  className="absolute top-1 right-1 z-10 text-xs"
                  title="Remove widget"
                >
                  ✕
                </button>
              )}
              {config.component}
            </div>
          ))}
        </GridLayout>
      </div>
    </div>
  );
}
