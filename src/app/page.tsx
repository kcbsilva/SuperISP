// src/app/page.tsx
'use client';

import * as React from 'react';
import { BarChart, DollarSign, Network, Users, MessageSquareWarning, Activity, ArrowUpRight, ChevronDown, Plus, PieChart } from 'lucide-react';
import { SubscriberChart } from '@/components/dashboard/subscriber-chart';
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
  const iconSize = { width: '0.875rem', height: '0.875rem' }; // text-sm equivalent
  const smallIconSize = { width: '0.75rem', height: '0.75rem' }; // text-xs equivalent

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

  const getActivityBadgeClass = (level?: string) => {
    if (level === 'warning') return 'badge bg-danger-subtle text-danger';
    return 'badge bg-secondary-subtle text-secondary'; // Bootstrap subtle badges
  };

  return (
    <div className="d-flex flex-column w-100"> {/* Use min-vh-100 if it's the root page container */}
      <main className="d-flex flex-column flex-grow-1 gap-3 gap-md-4">

         <div className="d-flex align-items-start gap-3 mb-2">
          <div className="d-flex flex-column align-items-start gap-1">
             <div className="small text-muted px-1">{t('dashboard.dashboard_view_label', 'Dashboard View')}</div>
              <div className="dropdown">
                <button className="btn btn-outline-secondary btn-sm dropdown-toggle d-flex align-items-center" type="button" id="dashboardViewDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                  {t(`dashboard.${currentView.toLowerCase()}_view`)} Dashboard
                  <ChevronDown style={smallIconSize} className="ms-2" />
                </button>
                <ul className="dropdown-menu" aria-labelledby="dashboardViewDropdown">
                  <li><h6 className="dropdown-header small">{t('dashboard.select_view')}</h6></li>
                  <li><hr className="dropdown-divider"/></li>
                  <li><button className={`dropdown-item small ${currentView === "General" ? 'active' : ''}`} type="button" onClick={() => handleViewChange("General")}>{t('dashboard.general_view')}</button></li>
                  <li><button className={`dropdown-item small ${currentView === "Financial" ? 'active' : ''}`} type="button" onClick={() => handleViewChange("Financial")}>{t('dashboard.financial_view')}</button></li>
                  <li><button className={`dropdown-item small ${currentView === "Network" ? 'active' : ''}`} type="button" onClick={() => handleViewChange("Network")}>{t('dashboard.network_view')}</button></li>
                  <li><button className={`dropdown-item small ${currentView === "Technician" ? 'active' : ''}`} type="button" onClick={() => handleViewChange("Technician")}>{t('dashboard.technician_view')}</button></li>
                </ul>
              </div>
            </div>

           <div className="d-flex flex-column align-items-start gap-1">
             <div className="small text-muted px-1">{t('dashboard.quick_actions_label', 'Quick Actions')}</div>
             <div className="d-flex align-items-center gap-2">
               {Array.from({ length: 5 }).map((_, index) => (
                 <button
                    key={index}
                    type="button"
                    className="btn btn-outline-secondary p-0 d-flex align-items-center justify-content-center"
                    style={{height: '2rem', width: '2rem'}}
                    onClick={() => handleQuickActionClick(index)}
                    data-bs-toggle="tooltip"
                    data-bs-placement="bottom"
                    title={t('dashboard.quick_action_tooltip', 'Quick Action {action} (e.g., Add Client)').replace('{action}', `${index + 1}`)}
                 >
                   <Plus style={iconSize} />
                   <span className="visually-hidden">{t('dashboard.quick_action_sr', 'Add {action}').replace('{action}', `${index + 1}`)}</span>
                 </button>
               ))}
              </div>
            </div>
         </div>

        {currentView === "General" && (
          <>
            <div className="row g-3 g-md-4">
              {/* Total Subscribers Card */}
              <div className="col-lg-3 col-md-6">
                <div className="card h-100 shadow-sm">
                  <div className="card-header d-flex flex-row align-items-center justify-content-between pb-2 pt-3">
                    <h6 className="card-title small mb-0">{t('dashboard.total_subscribers_title')}</h6>
                    <Users style={iconSize} className="text-muted"/>
                  </div>
                  <div className="card-body">
                    <div className="h4 fw-bold">{formattedSubscribers ?? t('dashboard.loading_ellipsis')}</div>
                    <p className="small text-muted">
                       {t('dashboard.total_subscribers_change', '+{change}% from last month').replace('{change}', dashboardData.subscriberChange.toString())}
                    </p>
                  </div>
                </div>
              </div>
              {/* MRR Card */}
              <div className="col-lg-3 col-md-6">
                <div className="card h-100 shadow-sm">
                  <div className="card-header d-flex flex-row align-items-center justify-content-between pb-2 pt-3">
                    <h6 className="card-title small mb-0">{t('dashboard.mrr_title')}</h6>
                    <DollarSign style={iconSize} className="text-muted"/>
                  </div>
                  <div className="card-body">
                    <div className="h4 fw-bold">${formattedMrr ?? t('dashboard.loading_ellipsis')}</div>
                    <p className="small text-muted">
                       {t('dashboard.mrr_change', '+{change}% from last month').replace('{change}', dashboardData.mrrChange.toString())}
                    </p>
                  </div>
                </div>
              </div>
              {/* Network Uptime Card */}
              <div className="col-lg-3 col-md-6">
                <div className="card h-100 shadow-sm">
                  <div className="card-header d-flex flex-row align-items-center justify-content-between pb-2 pt-3">
                    <h6 className="card-title small mb-0">{t('dashboard.network_uptime_title')}</h6>
                    <Network style={iconSize} className="text-muted"/>
                  </div>
                  <div className="card-body">
                    <div className="h4 fw-bold">{dashboardData.networkUptime}%</div>
                    <p className="small text-muted">
                       {t('dashboard.network_uptime_change', '{prefix}{change}% from last month')
                         .replace('{prefix}', dashboardData.uptimeChange >= 0 ? '+' : '')
                         .replace('{change}', dashboardData.uptimeChange.toString())}
                    </p>
                  </div>
                </div>
              </div>
              {/* Open Tickets Card */}
              <div className="col-lg-3 col-md-6">
                <div className="card h-100 shadow-sm">
                  <div className="card-header d-flex flex-row align-items-center justify-content-between pb-2 pt-3">
                    <h6 className="card-title small mb-0">{t('dashboard.open_tickets_title')}</h6>
                    <MessageSquareWarning style={iconSize} className="text-muted"/>
                  </div>
                  <div className="card-body">
                    <div className="h4 fw-bold">{dashboardData.openTickets}</div>
                    <p className="small text-muted">
                       {t('dashboard.open_tickets_change', '{prefix}{change} from last hour')
                         .replace('{prefix}', dashboardData.ticketChange > 0 ? '+' : '')
                         .replace('{change}', dashboardData.ticketChange.toString())}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="row g-3 g-md-4">
              {/* Subscriber Growth Chart */}
              <div className="col-xl-8">
                <div className="card h-100 shadow-sm">
                  <div className="card-header pt-3 pb-2">
                    <h6 className="card-title small mb-0">{t('dashboard.subscriber_growth_title')}</h6>
                    <p className="card-text small text-muted">{t('dashboard.subscriber_growth_desc')}</p>
                  </div>
                  <div className="card-body p-2">
                    <SubscriberChart />
                  </div>
                </div>
              </div>
              {/* Recent Activity */}
              <div className="col-xl-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-header pt-3 pb-2">
                    <h6 className="card-title small mb-0">{t('dashboard.recent_activity_title')}</h6>
                  </div>
                  <div className="card-body d-grid gap-3">
                    {dashboardData.recentActivity.length > 0 ? (
                      dashboardData.recentActivity.map((activity) => (
                        <div key={activity.id} className="d-flex align-items-center gap-3">
                          <Activity style={iconSize} className="text-muted flex-shrink-0"/>
                          <div className="d-grid gap-1 flex-grow-1">
                            <div className="small fw-medium">
                               {t(`dashboard.activity_type_${activity.type.toLowerCase().replace(/\s+/g, '_')}` as any, activity.type)}
                              {activity.level && (
                                <span className={`ms-2 small ${getActivityBadgeClass(activity.level)}`}>
                                  {t(`dashboard.badge_${activity.level}` as any, activity.level)}
                                </span>
                              )}
                            </div>
                            <p className="small text-muted">{activity.description}</p>
                          </div>
                          <div className="ms-auto small text-muted flex-shrink-0">{activity.time}</div>
                        </div>
                      ))
                    ) : (
                      <p className="small text-muted text-center">{t('dashboard.recent_activity_none')}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

         {currentView === "Financial" && (
           <div className="row g-3 g-md-4">
              <div className="col-xl-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-header pt-3 pb-2">
                     <h6 className="card-title small mb-0">{t('dashboard.financial.revenue_by_plan_title')}</h6>
                     <p className="card-text small text-muted">{t('dashboard.financial.revenue_by_plan_desc')}</p>
                  </div>
                  <div className="card-body">
                     <div className="d-flex align-items-center justify-content-center border rounded p-3" style={{height: '12rem', backgroundColor: 'var(--bs-tertiary-bg)'}}>
                       <PieChart style={{width: '1rem', height: '1rem'}} className="me-2 text-primary"/>
                       <span className="small text-muted">{t('dashboard.financial.pie_chart_placeholder')}</span>
                     </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-header pt-3 pb-2">
                      <h6 className="card-title small mb-0">{t('dashboard.financial.expense_category_title')}</h6>
                      <p className="card-text small text-muted">{t('dashboard.financial.expense_category_desc')}</p>
                  </div>
                  <div className="card-body">
                     <div className="d-flex align-items-center justify-content-center border rounded p-3" style={{height: '12rem', backgroundColor: 'var(--bs-tertiary-bg)'}}>
                       <PieChart style={{width: '1rem', height: '1rem'}} className="me-2 text-primary"/>
                       <span className="small text-muted">{t('dashboard.financial.pie_chart_placeholder')}</span>
                     </div>
                  </div>
                </div>
              </div>
               <div className="col-xl-4">
                 <div className="card h-100 shadow-sm">
                   <div className="card-header pt-3 pb-2">
                       <h6 className="card-title small mb-0">{t('dashboard.financial.payment_status_title')}</h6>
                       <p className="card-text small text-muted">{t('dashboard.financial.payment_status_desc')}</p>
                   </div>
                   <div className="card-body">
                     <div className="d-flex align-items-center justify-content-center border rounded p-3" style={{height: '12rem', backgroundColor: 'var(--bs-tertiary-bg)'}}>
                       <PieChart style={{width: '1rem', height: '1rem'}} className="me-2 text-primary"/>
                       <span className="small text-muted">{t('dashboard.financial.pie_chart_placeholder')}</span>
                     </div>
                   </div>
                 </div>
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
