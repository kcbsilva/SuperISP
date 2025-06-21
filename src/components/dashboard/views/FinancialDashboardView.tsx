// src/components/dashboard/views/FinancialDashboardView.tsx
import * as React from 'react';
import { useLocale } from '@/contexts/LocaleContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart } from 'lucide-react';
import TopSubscribersTable from '@/components/dashboard/widgets/TopSubscribersTable';
import ChurnRetentionChart from '@/components/dashboard/charts/ChurnRetentionChart';
import UpcomingPaymentsPanel from '@/components/dashboard/widgets/UpcomingPaymentsPanel';

export default function FinancialDashboardView() {
  const { t } = useLocale();

  const sections = [
    {
      title: t('dashboard.financial.revenue_by_plan_title', 'Revenue by Plan'),
      desc: t('dashboard.financial.revenue_by_plan_desc', 'Distribution of MRR across plans'),
    },
    {
      title: t('dashboard.financial.expense_category_title', 'Expenses by Category'),
      desc: t('dashboard.financial.expense_category_desc', 'Monthly expense breakdown'),
    },
    {
      title: t('dashboard.financial.payment_status_title', 'Payment Status'),
      desc: t('dashboard.financial.payment_status_desc', 'Paid vs Pending vs Failed'),
    }
  ];

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sections.map((section, index) => (
          <Card key={index}>
            <CardHeader className="pt-4 pb-2">
              <CardTitle className="text-sm">{section.title}</CardTitle>
              <CardDescription className="text-xs">{section.desc}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-4 h-48 bg-muted rounded-md">
              <PieChart className="h-5 w-5 text-primary mr-2" />
              <span className="text-xs text-muted-foreground">
                {t('dashboard.financial.pie_chart_placeholder', 'Coming soon...')}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <ChurnRetentionChart />
        </div>
        <div className="lg:col-span-3">
          <UpcomingPaymentsPanel />
        </div>
      </div>

      <TopSubscribersTable />
    </div>
  );
} 
