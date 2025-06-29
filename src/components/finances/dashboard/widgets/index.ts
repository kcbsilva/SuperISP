// components/finances/widgets/index.ts
import { RecentTransactionsWidget } from './RecentTransactionsWidget'
import { SpendingCategoriesWidget } from './SpendingCategoriesWidget'
import { MonthlyBudgetWidget } from './MonthlyBudgetWidget'
import { SpendingOverTimeWidget } from './SpendingOverTimeWidget'
import { NetIncomeOverTimeWidget } from './NetIncomeOverTimeWidget'
import { InvestmentSummaryWidget } from './InvestmentSummaryWidget'
import { CashFlowSummaryWidget } from './CashFlowSummaryWidget'
import { UpcomingBillsWidget } from './UpcomingBillsWidget'
import { OverdueInvoicesWidget } from './OverdueInvoicesWidget'
import { TopClientsWidget } from './TopClientsWidget'
import { MonthlyComparisonWidget } from './MonthlyComparisonWidget'
import { CustomGoalsWidget } from './CustomGoalsWidget'
import { AlertsWidget } from './AlertsWidget'

export const widgets = [
  { key: 'Recent Transactions', component: RecentTransactionsWidget },
  { key: 'Top Spending Categories', component: SpendingCategoriesWidget },
  { key: 'Monthly Budget', component: MonthlyBudgetWidget },
  { key: 'Spending Over Time', component: SpendingOverTimeWidget },
  { key: 'Net Income Over Time', component: NetIncomeOverTimeWidget },
  { key: 'Investment Summary', component: InvestmentSummaryWidget },
  { key: 'Cash Flow Summary', component: CashFlowSummaryWidget },
  { key: 'Upcoming Bills', component: UpcomingBillsWidget },
  { key: 'Overdue Invoices', component: OverdueInvoicesWidget },
  { key: 'Top Clients', component: TopClientsWidget },
  { key: 'Monthly Comparison', component: MonthlyComparisonWidget },
  { key: 'Custom Goals', component: CustomGoalsWidget },
  { key: 'Alerts', component: AlertsWidget },
]
