// src/app/admin/dashboard/page.tsx
'use client';

import * as React from 'react';
import { ArrowUpRight, ChevronDown, Plus, PieChart, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { SubscriberChart } from '@/components/dashboard/subscriber-chart';
import { useLocale } from '@/contexts/LocaleContext';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, Network, Users, MessageSquareWarning } from 'lucide-react';

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
    { id: 'act-3', type: 'Network Alert', description: 'High latency detected on Node-B7.', time: '2 hours ago', level: 'warning' as 'warning' | undefined },
    { id: 'act-4', type: 'Payment Received', description: 'Invoice #5678 paid by Jane Smith.', time: '3 hours ago' },
  ],
};

type DashboardView = "General" | "Financial" | "Network" | "Technician";

export default function AdminDashboardPage() {
  const { t, locale } = useLocale();
  const { toast } = useToast();
  const [currentView, setCurrentView] = React.useState<DashboardView>("General");
  const [formattedSubscribers, setFormattedSubscribers] = React.useState<string | null>(null);
  const [formattedMrr, setFormattedMrr] = React.useState<string | null>(null);
  const iconSize = "h-3 w-3";
  const smallIconSize = "h-2.5 w-2.5";

  React.useEffect(() => {
    setFormattedSubscribers(dashboardData.totalSubscribers.toLocaleString(locale));
    const currencyLocale = locale === 'pt' ? 'pt-BR' : locale === 'fr' ? 'fr-FR' : 'en-US';
    setFormattedMrr(dashboardData.mrr.toLocaleString(currencyLocale, { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }));
  }, [locale]);

  const handleViewChange = (view: DashboardView) => {
    setCurrentView(view);
  };

  const handleQuickActionClick = (actionIndex: number) => {
     console.log(`Quick action ${actionIndex + 1} clicked`);
     toast({
       title: t('dashboard.quick_action_tooltip', 'Quick Action {action} (e.g., Add Client)').replace('{action}', (actionIndex + 1).toString()),
       description: 'This quick action is not yet implemented.',
     });
  };

  const getActivityBadgeVariant = (level?: string) => {
    if (level === 'warning') return 'destructive';
    return 'secondary';
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-1 flex-col gap-4 md:gap-6"> {/* Changed main to div */}

         <div className="flex items-start gap-4 mb-2">
            <div className="flex flex-col items-start gap-1">
                <div className="text-xs text-muted-foreground px-1">{t('dashboard.dashboard_view_label', 'Dashboard View')}</div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="flex items-center h-7">
                            {t(`dashboard.${currentView.toLowerCase()}_view`)} Dashboard
                            <ChevronDown className={`ml-2 ${smallIconSize}`} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        <DropdownMenuLabel className="text-xs">{t('dashboard.select_view')}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-xs" onSelect={() => handleViewChange("General")}>{t('dashboard.general_view')}</DropdownMenuItem>
                        <DropdownMenuItem className="text-xs" onSelect={() => handleViewChange("Financial")}>{t('dashboard.financial_view')}</DropdownMenuItem>
                        <DropdownMenuItem className="text-xs" onSelect={() => handleViewChange("Network")}>{t('dashboard.network_view')}</DropdownMenuItem>
                        <DropdownMenuItem className="text-xs" onSelect={() => handleViewChange("Technician")}>{t('dashboard.technician_view')}</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

           <div className="flex flex-col items-start gap-1">
             <div className="text-xs text-muted-foreground px-1">{t('dashboard.quick_actions_label', 'Quick Actions')}</div>
             <div className="flex items-center gap-2">
               {Array.from({ length: 5 }).map((_, index) => (
                 <Button
                    key={index}
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleQuickActionClick(index)}
                    title={t('dashboard.quick_action_tooltip', 'Quick Action {action} (e.g., Add Client)').replace('{action}', `${index + 1}`)}
                 >
                   <Plus className={iconSize} />
                   <span className="sr-only">{t('dashboard.quick_action_sr', 'Add {action}').replace('{action}', `${index + 1}`)}</span>
                 </Button>
               ))}
              </div>
            </div>
         </div>

        {currentView === "General" && (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4">
                  <CardTitle className="text-xs font-medium">{t('dashboard.total_subscribers_title')}</CardTitle>
                  <Users className={`${iconSize} text-muted-foreground`}/>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="text-2xl font-bold">{formattedSubscribers ?? t('dashboard.loading_ellipsis')}</div>
                  <p className="text-xs text-muted-foreground">
                     {t('dashboard.total_subscribers_change', '+{change}% from last month').replace('{change}', dashboardData.subscriberChange.toString())}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4">
                  <CardTitle className="text-xs font-medium">{t('dashboard.mrr_title')}</CardTitle>
                  <DollarSign className={`${iconSize} text-muted-foreground`}/>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="text-2xl font-bold">{formattedMrr ?? t('dashboard.loading_ellipsis')}</div>
                  <p className="text-xs text-muted-foreground">
                     {t('dashboard.mrr_change', '+{change}% from last month').replace('{change}', dashboardData.mrrChange.toString())}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4">
                  <CardTitle className="text-xs font-medium">{t('dashboard.network_uptime_title')}</CardTitle>
                  <Network className={`${iconSize} text-muted-foreground`}/>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="text-2xl font-bold">{dashboardData.networkUptime}%</div>
                  <p className="text-xs text-muted-foreground">
                     {t('dashboard.network_uptime_change', '{prefix}{change}% from last month')
                       .replace('{prefix}', dashboardData.uptimeChange >= 0 ? '+' : '')
                       .replace('{change}', dashboardData.uptimeChange.toString())}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4">
                  <CardTitle className="text-xs font-medium">{t('dashboard.open_tickets_title')}</CardTitle>
                  <MessageSquareWarning className={`${iconSize} text-muted-foreground`}/>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="text-2xl font-bold">{dashboardData.openTickets}</div>
                  <p className="text-xs text-muted-foreground">
                     {t('dashboard.open_tickets_change', '{prefix}{change} from last hour')
                       .replace('{prefix}', dashboardData.ticketChange > 0 ? '+' : '')
                       .replace('{change}', dashboardData.ticketChange.toString())}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-full lg:col-span-4">
                <CardHeader className="pt-4 pb-2">
                  <CardTitle className="text-sm">{t('dashboard.subscriber_growth_title')}</CardTitle>
                  <CardDescription className="text-xs">{t('dashboard.subscriber_growth_desc')}</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <SubscriberChart />
                </CardContent>
              </Card>
              <Card className="col-span-full lg:col-span-3">
                <CardHeader className="pt-4 pb-2">
                  <CardTitle className="text-sm">{t('dashboard.recent_activity_title')}</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  {dashboardData.recentActivity.length > 0 ? (
                    dashboardData.recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-3">
                        <Activity className={`${smallIconSize} text-muted-foreground flex-shrink-0`}/>
                        <div className="grid gap-0.5 flex-grow">
                          <p className="text-xs font-medium leading-none">
                             {t(`dashboard.activity_type_${activity.type.toLowerCase().replace(/\s+/g, '_')}` as any, activity.type)}
                            {activity.level && (
                              <Badge variant={getActivityBadgeVariant(activity.level)} className="ml-2 text-xs">
                                {t(`dashboard.badge_${activity.level}` as any, activity.level)}
                              </Badge>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">{activity.description}</p>
                        </div>
                        <div className="ml-auto text-xs text-muted-foreground flex-shrink-0">{activity.time}</div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground text-center">{t('dashboard.recent_activity_none')}</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}

         {currentView === "Financial" && (
           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pt-4 pb-2">
                   <CardTitle className="text-sm">{t('dashboard.financial.revenue_by_plan_title')}</CardTitle>
                   <CardDescription className="text-xs">{t('dashboard.financial.revenue_by_plan_desc')}</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center p-4 h-48 bg-muted rounded-md">
                   <PieChart className="h-5 w-5 text-primary mr-2"/>
                   <span className="text-xs text-muted-foreground">{t('dashboard.financial.pie_chart_placeholder')}</span>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pt-4 pb-2">
                    <CardTitle className="text-sm">{t('dashboard.financial.expense_category_title')}</CardTitle>
                    <CardDescription className="text-xs">{t('dashboard.financial.expense_category_desc')}</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center p-4 h-48 bg-muted rounded-md">
                   <PieChart className="h-5 w-5 text-primary mr-2"/>
                   <span className="text-xs text-muted-foreground">{t('dashboard.financial.pie_chart_placeholder')}</span>
                </CardContent>
              </Card>
               <Card>
                 <CardHeader className="pt-4 pb-2">
                     <CardTitle className="text-sm">{t('dashboard.financial.payment_status_title')}</CardTitle>
                     <CardDescription className="text-xs">{t('dashboard.financial.payment_status_desc')}</CardDescription>
                 </CardHeader>
                 <CardContent className="flex items-center justify-center p-4 h-48 bg-muted rounded-md">
                   <PieChart className="h-5 w-5 text-primary mr-2"/>
                   <span className="text-xs text-muted-foreground">{t('dashboard.financial.pie_chart_placeholder')}</span>
                 </CardContent>
               </Card>
            </div>
         )}

         {(currentView === "Network" || currentView === "Technician") && (
           <div className="flex items-center justify-center border rounded-md p-6 h-64 bg-card">
             <p className="text-sm text-muted-foreground">
               {t('dashboard.other_view_placeholder', 'Displaying {view} Dashboard Content (Not Implemented)').replace('{view}', currentView)}
             </p>
           </div>
         )}
      </div> {/* Changed main to div */}
    </div>
  );
}
