// src/app/page.tsx
'use client';

import * as React from 'react';
import { BarChart, DollarSign, Network, Users, MessageSquareWarning, Activity, ArrowUpRight, ChevronDown, Plus, PieChart } from 'lucide-react';
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
import { SubscriberChart } from '@/components/dashboard/subscriber-chart';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { useLocale } from '@/contexts/LocaleContext';
import { useToast } from '@/hooks/use-toast';

const dashboardData = {
  totalSubscribers: 1256,
  subscriberChange: 180.1,
  mrr: 45231.89,
  mrrChange: 20.4,
  networkUptime: 99.98,
  uptimeChange: 0.02,
  openTickets: 23,
  ticketChange: -3,
  recentActivity: [
    { id: 'act-1', type: 'New Subscriber', description: 'John Doe signed up for the Pro plan.', time: '5 minutes ago' },
    { id: 'act-2', type: 'Ticket Resolved', description: 'Ticket #1234 marked as resolved.', time: '1 hour ago' },
    { id: 'act-3', type: 'Network Alert', description: 'High latency detected on Node-B7.', time: '2 hours ago', level: 'warning' },
    { id: 'act-4', type: 'Payment Received', description: 'Invoice #5678 paid by Jane Smith.', time: '3 hours ago' },
  ],
};

type DashboardView = "General" | "Financial" | "Network" | "Technician";

export default function DashboardPage() {
  const { t, locale } = useLocale();
  const { toast } = useToast();
  const [currentView, setCurrentView] = React.useState<DashboardView>("General");
  const [formattedSubscribers, setFormattedSubscribers] = React.useState<string | null>(null);
  const [formattedMrr, setFormattedMrr] = React.useState<string | null>(null);

  React.useEffect(() => {
    setFormattedSubscribers(dashboardData.totalSubscribers.toLocaleString(locale));
    const currencyLocale = locale === 'pt' ? 'pt-BR' : locale === 'fr' ? 'fr-FR' : 'en-US';
    setFormattedMrr(dashboardData.mrr.toLocaleString(currencyLocale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
  }, [locale]);

  const handleViewChange = (view: DashboardView) => {
    setCurrentView(view);
  };

  const handleQuickActionClick = (actionIndex: number) => {
    toast({
      title: `Quick Action ${actionIndex + 1}`,
      description: 'This quick action is not yet implemented.',
    });
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <main className="flex-1 flex flex-col gap-4 md:gap-6 pl-2 pr-4 md:pl-4 lg:pl-6 xl:pl-8 2xl:pl-10 mt-4 transition-all duration-300">
        <div className="flex items-start gap-4 mb-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {t(`dashboard.${currentView.toLowerCase()}_view`)} Dashboard
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>{t('dashboard.select_view')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {["General", "Financial", "Network", "Technician"].map((view) => (
                <DropdownMenuItem
                  key={view}
                  onClick={() => handleViewChange(view as DashboardView)}
                  disabled={currentView === view}
                >
                  {t(`dashboard.${view.toLowerCase()}_view`)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex flex-col items-start gap-1">
            <div className="text-xs font-medium text-muted-foreground px-1">{t('dashboard.quick_actions_label', 'Quick Actions')}</div>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                {Array.from({ length: 5 }).map((_, index) => (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => handleQuickActionClick(index)}
                      >
                        <Plus className="h-4 w-4" />
                        <span className="sr-only">{t('dashboard.quick_action_sr', 'Add {action}').replace('{action}', `${index + 1}`)}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t('dashboard.quick_action_tooltip', 'Quick Action {action}').replace('{action}', `${index + 1}`)}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
          </div>
        </div>

        {currentView === "General" && (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard title={t('dashboard.total_subscribers_title')} icon={<Users className="h-4 w-4 text-muted-foreground" />} value={formattedSubscribers ?? t('dashboard.loading_ellipsis')} change={t('dashboard.total_subscribers_change', '+{change}% from last month').replace('{change}', dashboardData.subscriberChange.toString())} />
              <StatCard title={t('dashboard.mrr_title')} icon={<DollarSign className="h-4 w-4 text-muted-foreground" />} value={`$${formattedMrr ?? t('dashboard.loading_ellipsis')}`} change={t('dashboard.mrr_change', '+{change}% from last month').replace('{change}', dashboardData.mrrChange.toString())} />
              <StatCard title={t('dashboard.network_uptime_title')} icon={<Network className="h-4 w-4 text-muted-foreground" />} value={`${dashboardData.networkUptime}%`} change={t('dashboard.network_uptime_change', '{prefix}{change}% from last month').replace('{prefix}', dashboardData.uptimeChange >= 0 ? '+' : '').replace('{change}', dashboardData.uptimeChange.toString())} />
              <StatCard title={t('dashboard.open_tickets_title')} icon={<MessageSquareWarning className="h-4 w-4 text-muted-foreground" />} value={`${dashboardData.openTickets}`} change={t('dashboard.open_tickets_change', '{prefix}{change} from last hour').replace('{prefix}', dashboardData.ticketChange > 0 ? '+' : '').replace('{change}', dashboardData.ticketChange.toString())} />
            </div>

            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
              <Card className="xl:col-span-2">
                <CardHeader className="flex flex-row items-center">
                  <div className="grid gap-2">
                    <CardTitle>{t('dashboard.subscriber_growth_title')}</CardTitle>
                    <CardDescription>{t('dashboard.subscriber_growth_desc')}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="pl-2">
                  <SubscriberChart />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('dashboard.recent_activity_title')}</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  {dashboardData.recentActivity.length > 0 ? (
                    dashboardData.recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-4">
                        <Activity className="h-5 w-5 text-muted-foreground" />
                        <div className="grid gap-1">
                          <div className="text-sm font-medium leading-none">
                            {t(`dashboard.activity_type_${activity.type.toLowerCase().replace(/\s+/g, '_')}` as any, activity.type)}
                            {activity.level && (
                              <Badge variant={activity.level === 'warning' ? 'destructive' : 'secondary'} className="ml-2">
                                {t(`dashboard.badge_${activity.level}` as any, activity.level)}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{activity.description}</p>
                        </div>
                        <div className="ml-auto text-sm text-muted-foreground">{activity.time}</div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center">{t('dashboard.recent_activity_none')}</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* You can add views for Financial, Network, and Technician here similarly */}
      </main>
    </div>
  );
}

function StatCard({ title, icon, value, change }: { title: string; icon: React.ReactNode; value: string; change: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{change}</p>
      </CardContent>
    </Card>
  );
}
