// src/components/dashboard/sections/CustomizableDashboard.tsx
'use client';

import * as React from 'react';
import GridLayout, { Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import PlanPerformanceChart from '@/components/dashboard/charts/PlanPerformanceChart';
import AlertsTimeline from '@/components/dashboard/widgets/AlertsTimeline';
import TechnicianInsightsCard from '@/components/dashboard/widgets/TechnicianInsightsCard';
import TopSubscribersTable from '@/components/dashboard/widgets/TopSubscribersTable';
import ChurnRetentionChart from '@/components/dashboard/charts/ChurnRetentionChart';
import UpcomingPaymentsPanel from '@/components/dashboard/widgets/UpcomingPaymentsPanel';
import RealTimeNetworkMap from '@/components/dashboard/widgets/RealTimeNetworkMap';

const role: 'admin' | 'technician' = 'admin';

type DashboardView = 'General' | 'Financial' | 'Network' | 'Technician';

interface WidgetConfig {
  component: React.ReactNode;
  roles: ('admin' | 'technician')[];
}

const widgetConfigs: Record<DashboardView, Record<string, WidgetConfig>> = {
  General: {
    planPerformance: { component: <PlanPerformanceChart />, roles: ['admin'] },
    alerts: { component: <AlertsTimeline />, roles: ['admin', 'technician'] },
    technician: { component: <TechnicianInsightsCard />, roles: ['technician'] },
  },
  Financial: {
    topSubscribers: { component: <TopSubscribersTable />, roles: ['admin'] },
    churnRetention: { component: <ChurnRetentionChart />, roles: ['admin'] },
    upcomingPayments: { component: <UpcomingPaymentsPanel />, roles: ['admin'] },
  },
  Network: {
    realtimeMap: { component: <RealTimeNetworkMap />, roles: ['admin', 'technician'] },
  },
  Technician: {},
};

type DashboardStorage = {
  layouts: Record<DashboardView, Layout[]>;
  hidden: Record<DashboardView, string[]>;
  editing: {
    isDraggable: boolean;
    isResizable: boolean;
    isEditing: boolean;
  };
  lastView: DashboardView;
};

const defaultLayouts: DashboardStorage['layouts'] = {
  General: [
    { i: 'planPerformance', x: 0, y: 0, w: 4, h: 2 },
    { i: 'alerts', x: 4, y: 0, w: 2, h: 2 },
    { i: 'technician', x: 6, y: 0, w: 2, h: 2 },
  ],
  Financial: [
    { i: 'topSubscribers', x: 0, y: 0, w: 4, h: 3 },
    { i: 'churnRetention', x: 4, y: 0, w: 4, h: 3 },
    { i: 'upcomingPayments', x: 0, y: 3, w: 8, h: 2 },
  ],
  Network: [
    { i: 'realtimeMap', x: 0, y: 0, w: 8, h: 5 },
  ],
  Technician: [],
};

const defaultHidden: DashboardStorage['hidden'] = {
  General: [],
  Financial: [],
  Network: [],
  Technician: [],
};

const defaultEditing: DashboardStorage['editing'] = {
  isDraggable: false,
  isResizable: false,
  isEditing: false,
};

export default function CustomDashboardPage() {
  const [currentView, setCurrentView] = React.useState<DashboardView>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dashboard-view');
      if (saved) return saved as DashboardView;
    }
    return 'General';
  });

  const [layouts, setLayouts] = React.useState<DashboardStorage['layouts']>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dashboard-layouts');
      if (saved) return JSON.parse(saved);
    }
    return defaultLayouts;
  });

  const [hidden, setHidden] = React.useState<DashboardStorage['hidden']>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dashboard-hidden');
      if (saved) return JSON.parse(saved);
    }
    return defaultHidden;
  });

  const [editingState, setEditingState] = React.useState<DashboardStorage['editing']>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dashboard-editing');
      if (saved) return JSON.parse(saved);
    }
    return defaultEditing;
  });

  const { isDraggable, isResizable, isEditing } = editingState;
  const layout = layouts[currentView];
  const hiddenWidgets = hidden[currentView];
  const viewWidgets = widgetConfigs[currentView];

  const visibleWidgets = Object.entries(viewWidgets)
    .filter(([key, config]) => config.roles.includes(role) && !hiddenWidgets.includes(key))
    .map(([key]) => key);

  const handleLayoutChange = (newLayout: Layout[]) => {
    const updated = { ...layouts, [currentView]: newLayout };
    setLayouts(updated);
    localStorage.setItem('dashboard-layouts', JSON.stringify(updated));
  };

  const handleRemoveWidget = (key: string) => {
    const updated = { ...hidden, [currentView]: [...hiddenWidgets, key] };
    setHidden(updated);
    localStorage.setItem('dashboard-hidden', JSON.stringify(updated));
  };

  const handleRestoreWidget = (key: string) => {
    const updated = { ...hidden, [currentView]: hiddenWidgets.filter((w) => w !== key) };
    setHidden(updated);
    localStorage.setItem('dashboard-hidden', JSON.stringify(updated));
  };

  const toggleEditMode = () => {
    const updated = {
      isEditing: !isEditing,
      isDraggable: !isDraggable,
      isResizable: !isResizable,
    };
    setEditingState(updated);
    localStorage.setItem('dashboard-editing', JSON.stringify(updated));
  };

  const handleViewChange = (view: DashboardView) => {
    setCurrentView(view);
    localStorage.setItem('dashboard-view', view);
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Dashboard View</span>
            <select
              value={currentView}
              onChange={(e) => handleViewChange(e.target.value as DashboardView)}
              className="px-3 py-1 text-sm border rounded"
            >
              {Object.keys(widgetConfigs).map((view) => (
                <option key={view} value={view}>{view} Dashboard</option>
              ))}
            </select>
          </div>

          <button
            onClick={toggleEditMode}
            className="px-3 py-1 rounded bg-primary text-white hover:bg-primary/90 text-sm"
          >
            {isEditing ? 'Finish Editing' : 'Edit Layout'}
          </button>

          {hiddenWidgets.length > 0 && (
            <div className="p-2 bg-muted border rounded flex items-center gap-2 text-sm">
              <span className="font-medium">Restore Widgets:</span>
              {hiddenWidgets.map((key) => (
                <button
                  key={key}
                  onClick={() => handleRestoreWidget(key)}
                  className="px-2 py-1 rounded bg-primary text-white hover:bg-primary/90"
                >
                  + {key}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={isEditing ? 'relative before:absolute before:inset-0 before:z-0 before:bg-grid-pattern before:opacity-20' : ''}>
        <GridLayout
          className="layout z-10"
          layout={layout.filter((item) => visibleWidgets.includes(item.i))}
          cols={8}
          rowHeight={100}
          width={1200}
          onLayoutChange={handleLayoutChange}
          isDraggable={isDraggable}
          isResizable={isResizable}
        >
          {visibleWidgets.map((key) => {
            const config = viewWidgets[key as keyof typeof viewWidgets];
            if (!config) return null;
            return (
              <div key={key} className="rounded-md shadow relative group bg-background">
                {isEditing && (
                  <button
                    className="absolute top-1 right-1 z-10 text-xs opacity-100"
                    onClick={() => handleRemoveWidget(key)}
                    title="Remove widget"
                  >
                    ✕
                  </button>
                )}
                {config.component}
              </div>
            );
          })}
        </GridLayout>
      </div>
    </div>
  );
}

declare module 'react-grid-layout';
