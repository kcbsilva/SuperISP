// src/translations/en/dashboard.ts
// Note: 'search' section has been moved to 'header.ts' as it's part of the AppHeader
const dashboard = {
    dashboard: { // Assuming the key 'dashboard' is used as t('dashboard.dashboard_view_label')
    dashboard_view_label: 'Dashboard View',
    select_view: 'Select Dashboard View',
    general_view: 'General Dashboard',
    financial_view: 'Financial Dashboard',
    network_view: 'Network Dashboard',
    technician_view: 'Technician Dashboard',
    total_subscribers_title: 'Total Subscribers',
    total_subscribers_change: '+{change}% from last month',
    mrr_title: 'Monthly Recurring Revenue',
    mrr_change: '+{change}% from last month',
    network_uptime_title: 'Network Uptime',
    network_uptime_change: '{prefix}{change}% from last month',
    open_tickets_title: 'Open Support Tickets',
    open_tickets_change: '{prefix}{change} from last hour',
    subscriber_growth_title: 'Subscriber Growth',
    subscriber_growth_desc: 'Monthly new subscribers for the last 6 months.',
    recent_activity_title: 'Recent Activity',
    recent_activity_none: 'No recent activity.',
    other_view_placeholder: 'Displaying {view} Dashboard Content (Not Implemented)',
    loading_ellipsis: '...',
    badge_warning: 'Warning',
    activity_type_new_subscriber: 'New Subscriber',
    activity_type_ticket_resolved: 'Ticket Resolved',
    activity_type_network_alert: 'Network Alert',
    activity_type_payment_received: 'Payment Received',
    quick_actions_label: 'Quick Actions',
    quick_action_tooltip: 'Quick Action {action} (e.g., Add Client)',
    quick_action_sr: 'Add {action}',
    financial: { // Nested as dashboard.financial.*
      revenue_by_plan_title: 'Revenue by Plan',
      revenue_by_plan_desc: 'MRR breakdown by subscription plan.',
      expense_category_title: 'Expenses by Category',
      expense_category_desc: 'Monthly breakdown of expenses.',
      payment_status_title: 'Payment Status',
      payment_status_desc: 'Overview of recent invoice payment statuses.',
      pie_chart_placeholder: 'Pie chart data not available.',
    },
  }
};

export default dashboard;
