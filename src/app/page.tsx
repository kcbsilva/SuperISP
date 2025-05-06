// src/app/page.tsx
'use client';

import * as React from 'react';
import { BarChart, DollarSign, Network, Users, MessageSquareWarning, Activity, ArrowUpRight, ChevronDown, Plus, PieChart } from 'lucide-react'; // Added Plus icon, PieChart icon
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
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"; // Import Tooltip
import { useLocale } from '@/contexts/LocaleContext'; // Import useLocale
import { useToast } from '@/hooks/use-toast'; // Import useToast


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
  const { t, locale } = useLocale(); // Get translation function and current locale
  const { toast } = useToast(); // Get toast function
  const [currentView, setCurrentView] = React.useState<DashboardView>("General");
  const [formattedSubscribers, setFormattedSubscribers] = React.useState<string | null>(null);
  const [formattedMrr, setFormattedMrr] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Format numbers on the client side after hydration, using current locale
    setFormattedSubscribers(dashboardData.totalSubscribers.toLocaleString(locale));
    // Determine locale for currency formatting (basic example)
    const currencyLocale = locale === 'pt' ? 'pt-BR' : locale === 'fr' ? 'fr-FR' : 'en-US';
    setFormattedMrr(dashboardData.mrr.toLocaleString(currencyLocale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
  }, [locale]); // Rerun effect when locale changes

  const handleViewChange = (view: DashboardView) => {
    setCurrentView(view);
    // Later: Add logic here to load/display different components based on the selected view
  };

  const handleQuickActionClick = (actionIndex: number) => {
     // Placeholder action
     console.log(`Quick action ${actionIndex + 1} clicked`);
     toast({
       title: `Quick Action ${actionIndex + 1}`,
       description: 'This quick action is not yet implemented.',
     });
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* Remove padding from main element, rely on layout */}
      <main className="flex flex-1 flex-col gap-4 md:gap-6"> {/* Removed p-4 and md:pl-2 md:pr-4 */}

         {/* Header Row with Dropdown and Quick Actions */}
        <div className="flex items-start gap-4 mb-2"> {/* Changed items-center to items-start for label alignment */}
          {/* Dashboard Selector Dropdown with Label */}
          <div className="flex flex-col items-start gap-1">
             <div className="text-xs font-medium text-muted-foreground px-1">{t('dashboard.dashboard_view_label', 'Dashboard View')}</div>
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
                  <DropdownMenuItem onClick={() => handleViewChange("General")} disabled={currentView === "General"}>
                    {t('dashboard.general_view')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleViewChange("Financial")} disabled={currentView === "Financial"}>
                    {t('dashboard.financial_view')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleViewChange("Network")} disabled={currentView === "Network"}>
                    {t('dashboard.network_view')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleViewChange("Technician")} disabled={currentView === "Technician"}>
                    {t('dashboard.technician_view')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div> {/* End Dashboard Selector Container */}


           {/* Quick Actions Container */}
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
                          className="h-9 w-9" // Slightly smaller square button
                          onClick={() => handleQuickActionClick(index)}
                       >
                         <Plus className="h-4 w-4" />
                         <span className="sr-only">{t('dashboard.quick_action_sr', 'Add {action}').replace('{action}', `${index + 1}`)}</span>
                       </Button>
                     </TooltipTrigger>
                     <TooltipContent>
                       <p>{t('dashboard.quick_action_tooltip', 'Quick Action {action} (e.g., Add Client)').replace('{action}', `${index + 1}`)}</p>
                     </TooltipContent>
                   </Tooltip>
                 ))}
               </TooltipProvider>
              </div>
            </div> {/* End Quick Actions Container */}

         </div>


        {/* Content based on currentView */}
        {currentView === "General" && (
          <>
            {/* Stat Cards Grid */}
            <div className="grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4"> {/* Adjusted gap */}
              <Card x-chunk="dashboard-01-chunk-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t('dashboard.total_subscribers_title')}
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                   {/* Use state variable for formatted number */}
                  <div className="text-2xl font-bold">{formattedSubscribers ?? t('dashboard.loading_ellipsis')}</div>
                  <p className="text-xs text-muted-foreground">
                     {t('dashboard.total_subscribers_change', '+{change}% from last month').replace('{change}', dashboardData.subscriberChange.toString())}
                  </p>
                </CardContent>
              </Card>
              <Card x-chunk="dashboard-01-chunk-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t('dashboard.mrr_title')}
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                   {/* Use state variable for formatted number */}
                  <div className="text-2xl font-bold">${formattedMrr ?? t('dashboard.loading_ellipsis')}</div>
                  <p className="text-xs text-muted-foreground">
                     {t('dashboard.mrr_change', '+{change}% from last month').replace('{change}', dashboardData.mrrChange.toString())}
                  </p>
                </CardContent>
              </Card>
              <Card x-chunk="dashboard-01-chunk-2">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t('dashboard.network_uptime_title')}</CardTitle>
                  <Network className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData.networkUptime}%</div>
                  <p className="text-xs text-muted-foreground">
                     {t('dashboard.network_uptime_change', '{prefix}{change}% from last month')
                       .replace('{prefix}', dashboardData.uptimeChange >= 0 ? '+' : '')
                       .replace('{change}', dashboardData.uptimeChange.toString())}
                  </p>
                </CardContent>
              </Card>
              <Card x-chunk="dashboard-01-chunk-3">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t('dashboard.open_tickets_title')}</CardTitle>
                  <MessageSquareWarning className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData.openTickets}</div>
                  <p className="text-xs text-muted-foreground">
                     {t('dashboard.open_tickets_change', '{prefix}{change} from last hour')
                       .replace('{prefix}', dashboardData.ticketChange > 0 ? '+' : '')
                       .replace('{change}', dashboardData.ticketChange.toString())}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Chart and Activity Grid */}
            <div className="grid gap-4 md:gap-6 lg:grid-cols-2 xl:grid-cols-3"> {/* Adjusted gap */}
              <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
                <CardHeader className="flex flex-row items-center">
                  <div className="grid gap-2">
                    <CardTitle>{t('dashboard.subscriber_growth_title')}</CardTitle>
                    <CardDescription>
                      {t('dashboard.subscriber_growth_desc')}
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
                  <CardTitle>{t('dashboard.recent_activity_title')}</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  {dashboardData.recentActivity.length > 0 ? (
                    dashboardData.recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-4">
                        <Activity className="h-5 w-5 text-muted-foreground" /> {/* Generic icon */}
                        <div className="grid gap-1">
                          {/* Changed p to div to fix hydration error */}
                          <div className="text-sm font-medium leading-none">
                             {/* Translate activity type */}
                             {t(`dashboard.activity_type_${activity.type.toLowerCase().replace(/\s+/g, '_')}` as any, activity.type)}
                            {activity.level && (
                              <Badge variant={activity.level === 'warning' ? 'destructive' : 'secondary'} className="ml-2">
                                {t(`dashboard.badge_${activity.level}` as any, activity.level)}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{activity.description}</p> {/* Keep description as is for now */}
                        </div>
                        <div className="ml-auto text-sm text-muted-foreground">{activity.time}</div> {/* Keep time as is */}
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

         {/* Placeholder for Financial dashboard view */}
         {currentView === "Financial" && (
           <div className="grid gap-4 md:gap-6 lg:grid-cols-2 xl:grid-cols-3">
              <Card className="xl:col-span-1">
                <CardHeader className="flex flex-row items-center">
                  <div className="grid gap-2">
                     <CardTitle>{t('dashboard.financial.revenue_by_plan_title')}</CardTitle>
                     <CardDescription>{t('dashboard.financial.revenue_by_plan_desc')}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                   {/* Placeholder for Pie Chart 1 */}
                   <div className="flex items-center justify-center h-48 border rounded-lg bg-muted text-muted-foreground">
                     <PieChart className="h-8 w-8 mr-2" />
                     <span>{t('dashboard.financial.pie_chart_placeholder')}</span>
                   </div>
                </CardContent>
              </Card>
              <Card className="xl:col-span-1">
                <CardHeader className="flex flex-row items-center">
                   <div className="grid gap-2">
                      <CardTitle>{t('dashboard.financial.expense_category_title')}</CardTitle>
                      <CardDescription>{t('dashboard.financial.expense_category_desc')}</CardDescription>
                   </div>
                </CardHeader>
                <CardContent>
                   {/* Placeholder for Pie Chart 2 */}
                   <div className="flex items-center justify-center h-48 border rounded-lg bg-muted text-muted-foreground">
                     <PieChart className="h-8 w-8 mr-2" />
                     <span>{t('dashboard.financial.pie_chart_placeholder')}</span>
                   </div>
                </CardContent>
              </Card>
               <Card className="xl:col-span-1">
                 <CardHeader className="flex flex-row items-center">
                    <div className="grid gap-2">
                       <CardTitle>{t('dashboard.financial.payment_status_title')}</CardTitle>
                       <CardDescription>{t('dashboard.financial.payment_status_desc')}</CardDescription>
                    </div>
                 </CardHeader>
                 <CardContent>
                   {/* Placeholder for Pie Chart 3 */}
                   <div className="flex items-center justify-center h-48 border rounded-lg bg-muted text-muted-foreground">
                     <PieChart className="h-8 w-8 mr-2" />
                     <span>{t('dashboard.financial.pie_chart_placeholder')}</span>
                   </div>
                 </CardContent>
               </Card>
              {/* Add more financial-specific cards or charts here */}
            </div>
         )}

         {/* Placeholder for other dashboard views */}
         {(currentView === "Network" || currentView === "Technician") && (
           <div className="flex items-center justify-center h-64 border rounded-lg bg-card text-card-foreground">
             <p className="text-muted-foreground">
               {t('dashboard.other_view_placeholder', 'Displaying {view} Dashboard Content (Not Implemented)').replace('{view}', currentView)}
             </p>
           </div>
         )}
      </main>
    </div>
  );
}
