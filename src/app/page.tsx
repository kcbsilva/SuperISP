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
} from '@/components/ui/card'; // Will attempt to style with Bootstrap classes
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'; // Will attempt to style with Bootstrap classes
import { Badge } from '@/components/ui/badge'; // Will attempt to style with Bootstrap classes
import { SubscriberChart } from '@/components/dashboard/subscriber-chart';
import { Button } from '@/components/ui/button'; // Will attempt to style with Bootstrap classes
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Will attempt to style with Bootstrap classes
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
  const iconSize = { width: '0.75rem', height: '0.75rem' }; 
  const smallIconSize = { width: '0.625rem', height: '0.625rem' };

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
        setFormattedSubscribers(dashboardData.totalSubscribers.toLocaleString(locale));
        const currencyLocale = locale === 'pt' ? 'pt-BR' : locale === 'fr' ? 'fr-FR' : 'en-US';
        setFormattedMrr(dashboardData.mrr.toLocaleString(currencyLocale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    }
  }, [locale]);

  const handleViewChange = (view: DashboardView) => {
    setCurrentView(view);
  };

  const handleQuickActionClick = (actionIndex: number) => {
     console.log(`Quick action ${actionIndex + 1} clicked`);
     toast({
       title: `Quick Action ${actionIndex + 1}`,
       description: 'This quick action is not yet implemented.',
     });
  };

  return (
    // Bootstrap flex container
    <div className="d-flex flex-column min-vh-100 w-100">
      {/* Bootstrap flex container with gaps */}
      <main className="d-flex flex-column flex-grow-1 gap-3 gap-md-4">

         <div className="d-flex align-items-start gap-3 mb-2">
          <div className="d-flex flex-column align-items-start gap-1">
             <div className="small text-muted px-1">{t('dashboard.dashboard_view_label', 'Dashboard View')}</div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  {/* Bootstrap button styling */}
                  <Button variant="outline" size="sm" className="btn btn-outline-secondary btn-sm">
                    {t(`dashboard.${currentView.toLowerCase()}_view`)} Dashboard
                    <ChevronDown style={smallIconSize} className="ms-2" />
                  </Button>
                </DropdownMenuTrigger>
                {/* Bootstrap dropdown menu styling */}
                <DropdownMenuContent align="start" className="dropdown-menu">
                  <DropdownMenuLabel className="dropdown-header">{t('dashboard.select_view')}</DropdownMenuLabel>
                  <DropdownMenuSeparator className="dropdown-divider"/>
                  <DropdownMenuItem onClick={() => handleViewChange("General")} disabled={currentView === "General"} className="dropdown-item">
                    {t('dashboard.general_view')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleViewChange("Financial")} disabled={currentView === "Financial"} className="dropdown-item">
                    {t('dashboard.financial_view')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleViewChange("Network")} disabled={currentView === "Network"} className="dropdown-item">
                    {t('dashboard.network_view')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleViewChange("Technician")} disabled={currentView === "Technician"} className="dropdown-item">
                    {t('dashboard.technician_view')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>


           <div className="d-flex flex-column align-items-start gap-1">
             <div className="small text-muted px-1">{t('dashboard.quick_actions_label', 'Quick Actions')}</div>
             <div className="d-flex align-items-center gap-2">
               <TooltipProvider>
                 {Array.from({ length: 5 }).map((_, index) => (
                   <Tooltip key={index}>
                     <TooltipTrigger asChild>
                       <Button
                          variant="outline"
                          size="icon"
                          className="btn btn-outline-secondary p-1" 
                          style={{height: '2rem', width: '2rem'}}
                          onClick={() => handleQuickActionClick(index)}
                       >
                         <Plus style={iconSize} />
                         <span className="visually-hidden">{t('dashboard.quick_action_sr', 'Add {action}').replace('{action}', `${index + 1}`)}</span>
                       </Button>
                     </TooltipTrigger>
                     <TooltipContent className="tooltip-inner small">
                       <p>{t('dashboard.quick_action_tooltip', 'Quick Action {action} (e.g., Add Client)').replace('{action}', `${index + 1}`)}</p>
                     </TooltipContent>
                   </Tooltip>
                 ))}
               </TooltipProvider>
              </div>
            </div>

         </div>


        {currentView === "General" && (
          <>
            {/* Bootstrap grid */}
            <div className="row g-3 g-md-4">
              {/* Bootstrap column */}
              <div className="col-lg-3 col-md-6">
                <Card className="card h-100">
                  <CardHeader className="card-header d-flex flex-row align-items-center justify-content-between pb-2">
                    <CardTitle className="card-title h6 mb-0 small">{t('dashboard.total_subscribers_title')}</CardTitle>
                    <Users style={iconSize} className="text-muted"/>
                  </CardHeader>
                  <CardContent className="card-body">
                    <div className="h4 fw-bold">{formattedSubscribers ?? t('dashboard.loading_ellipsis')}</div>
                    <p className="small text-muted">
                       {t('dashboard.total_subscribers_change', '+{change}% from last month').replace('{change}', dashboardData.subscriberChange.toString())}
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="col-lg-3 col-md-6">
                <Card className="card h-100">
                  <CardHeader className="card-header d-flex flex-row align-items-center justify-content-between pb-2">
                    <CardTitle className="card-title h6 mb-0 small">{t('dashboard.mrr_title')}</CardTitle>
                    <DollarSign style={iconSize} className="text-muted"/>
                  </CardHeader>
                  <CardContent className="card-body">
                    <div className="h4 fw-bold">${formattedMrr ?? t('dashboard.loading_ellipsis')}</div>
                    <p className="small text-muted">
                       {t('dashboard.mrr_change', '+{change}% from last month').replace('{change}', dashboardData.mrrChange.toString())}
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="col-lg-3 col-md-6">
                <Card className="card h-100">
                  <CardHeader className="card-header d-flex flex-row align-items-center justify-content-between pb-2">
                    <CardTitle className="card-title h6 mb-0 small">{t('dashboard.network_uptime_title')}</CardTitle>
                    <Network style={iconSize} className="text-muted"/>
                  </CardHeader>
                  <CardContent className="card-body">
                    <div className="h4 fw-bold">{dashboardData.networkUptime}%</div>
                    <p className="small text-muted">
                       {t('dashboard.network_uptime_change', '{prefix}{change}% from last month')
                         .replace('{prefix}', dashboardData.uptimeChange >= 0 ? '+' : '')
                         .replace('{change}', dashboardData.uptimeChange.toString())}
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="col-lg-3 col-md-6">
                <Card className="card h-100">
                  <CardHeader className="card-header d-flex flex-row align-items-center justify-content-between pb-2">
                    <CardTitle className="card-title h6 mb-0 small">{t('dashboard.open_tickets_title')}</CardTitle>
                    <MessageSquareWarning style={iconSize} className="text-muted"/>
                  </CardHeader>
                  <CardContent className="card-body">
                    <div className="h4 fw-bold">{dashboardData.openTickets}</div>
                    <p className="small text-muted">
                       {t('dashboard.open_tickets_change', '{prefix}{change} from last hour')
                         .replace('{prefix}', dashboardData.ticketChange > 0 ? '+' : '')
                         .replace('{change}', dashboardData.ticketChange.toString())}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="row g-3 g-md-4">
              <div className="col-xl-8">
                <Card className="card h-100">
                  <CardHeader className="card-header">
                    <CardTitle className="card-title h6 mb-0 small">{t('dashboard.subscriber_growth_title')}</CardTitle>
                    <CardDescription className="card-text small text-muted">{t('dashboard.subscriber_growth_desc')}</CardDescription>
                  </CardHeader>
                  <CardContent className="card-body p-2">
                    <SubscriberChart />
                  </CardContent>
                </Card>
              </div>
              <div className="col-xl-4">
                <Card className="card h-100">
                  <CardHeader className="card-header">
                    <CardTitle className="card-title h6 mb-0 small">{t('dashboard.recent_activity_title')}</CardTitle>
                  </CardHeader>
                  <CardContent className="card-body d-grid gap-3">
                    {dashboardData.recentActivity.length > 0 ? (
                      dashboardData.recentActivity.map((activity) => (
                        <div key={activity.id} className="d-flex align-items-center gap-3">
                          <Activity style={iconSize} className="text-muted"/>
                          <div className="d-grid gap-1">
                            <div className="small fw-medium">
                               {t(`dashboard.activity_type_${activity.type.toLowerCase().replace(/\s+/g, '_')}` as any, activity.type)}
                              {activity.level && (
                                <Badge bg={activity.level === 'warning' ? 'danger' : 'secondary'} className="ms-2 small badge"> {/* Bootstrap badge */}
                                  {t(`dashboard.badge_${activity.level}` as any, activity.level)}
                                </Badge>
                              )}
                            </div>
                            <p className="small text-muted">{activity.description}</p>
                          </div>
                          <div className="ms-auto small text-muted">{activity.time}</div>
                        </div>
                      ))
                    ) : (
                      <p className="small text-muted text-center">{t('dashboard.recent_activity_none')}</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}

         {currentView === "Financial" && (
           <div className="row g-3 g-md-4">
              <div className="col-xl-4">
                <Card className="card h-100">
                  <CardHeader className="card-header">
                     <CardTitle className="card-title h6 mb-0 small">{t('dashboard.financial.revenue_by_plan_title')}</CardTitle>
                     <CardDescription className="card-text small text-muted">{t('dashboard.financial.revenue_by_plan_desc')}</CardDescription>
                  </CardHeader>
                  <CardContent className="card-body">
                     <div className="d-flex align-items-center justify-content-center border rounded p-3" style={{height: '12rem', backgroundColor: 'var(--bs-light)'}}>
                       <PieChart style={{width: '1rem', height: '1rem'}} className="me-2 text-primary"/>
                       <span className="small text-muted">{t('dashboard.financial.pie_chart_placeholder')}</span>
                     </div>
                  </CardContent>
                </Card>
              </div>
              <div className="col-xl-4">
                <Card className="card h-100">
                  <CardHeader className="card-header">
                      <CardTitle className="card-title h6 mb-0 small">{t('dashboard.financial.expense_category_title')}</CardTitle>
                      <CardDescription className="card-text small text-muted">{t('dashboard.financial.expense_category_desc')}</CardHeader>
                  </CardContent>
                  <CardContent className="card-body">
                     <div className="d-flex align-items-center justify-content-center border rounded p-3" style={{height: '12rem', backgroundColor: 'var(--bs-light)'}}>
                       <PieChart style={{width: '1rem', height: '1rem'}} className="me-2 text-primary"/>
                       <span className="small text-muted">{t('dashboard.financial.pie_chart_placeholder')}</span>
                     </div>
                  </CardContent>
                </Card>
              </div>
               <div className="col-xl-4">
                 <Card className="card h-100">
                   <CardHeader className="card-header">
                       <CardTitle className="card-title h6 mb-0 small">{t('dashboard.financial.payment_status_title')}</CardTitle>
                       <CardDescription className="card-text small text-muted">{t('dashboard.financial.payment_status_desc')}</CardDescription>
                   </CardHeader>
                   <CardContent className="card-body">
                     <div className="d-flex align-items-center justify-content-center border rounded p-3" style={{height: '12rem', backgroundColor: 'var(--bs-light)'}}>
                       <PieChart style={{width: '1rem', height: '1rem'}} className="me-2 text-primary"/>
                       <span className="small text-muted">{t('dashboard.financial.pie_chart_placeholder')}</span>
                     </div>
                   </CardContent>
                 </Card>
               </div>
            </div>
         )}

         {(currentView === "Network" || currentView === "Technician") && (
           <div className="d-flex align-items-center justify-content-center border rounded p-5" style={{height: '16rem', backgroundColor: 'var(--bs-card-bg)'}}>
             <p className="small text-muted">
               {t('dashboard.other_view_placeholder', 'Displaying {view} Dashboard Content (Not Implemented)').replace('{view}', currentView)}
             </p>
           </div>
         )}
      </main>
    </div>
  );
}
