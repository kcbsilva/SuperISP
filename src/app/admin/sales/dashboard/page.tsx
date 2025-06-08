// src/app/admin/sales/dashboard/page.tsx
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip as ShadChartTooltip,
  ChartTooltipContent as ShadChartTooltipContent,
  ChartLegend as ShadChartLegend,
  ChartLegendContent as ShadChartLegendContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { DollarSign, Users, Target, TrendingUp, Activity, CalendarDays, Download } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const salesStats = {
  newLeadsMonth: 120,
  opportunitiesWonMonth: 35,
  salesRevenueMonth: 25670.50,
  conversionRateMonth: 29.17,
};

const salesPipelineData = [
  { stage: 'Lead', count: 120, fill: "hsl(var(--chart-1))" },
  { stage: 'Contacted', count: 95, fill: "hsl(var(--chart-2))" },
  { stage: 'Proposal', count: 60, fill: "hsl(var(--chart-3))" },
  { stage: 'Negotiation', count: 45, fill: "hsl(var(--chart-4))" },
  { stage: 'Won', count: 35, fill: "hsl(var(--chart-5))" },
];

const revenueOverTimeData = [
  { month: 'Jan', revenue: 18000 },
  { month: 'Feb', revenue: 22000 },
  { month: 'Mar', revenue: 19500 },
  { month: 'Apr', revenue: 25000 },
  { month: 'May', revenue: 23000 },
  { month: 'Jun', revenue: 28000 },
];

const recentSalesActivity = [
  { id: 'act-sales-1', type: 'New Lead', description: 'Alpha Corp interested in Enterprise Plan.', time: '15 minutes ago', user: 'Jane Doe' },
  { id: 'act-sales-2', type: 'Proposal Sent', description: 'Proposal sent to Beta LLC for 50 Fiber Lines.', time: '2 hours ago', user: 'John Smith' },
  { id: 'act-sales-3', type: 'Sale Closed', description: 'Gamma Solutions signed up for Pro Radio 200.', time: '1 day ago', user: 'Jane Doe', amount: 2500.00 },
  { id: 'act-sales-4', type: 'Opportunity Created', description: 'New opportunity with Delta Retailers.', time: '2 days ago', user: 'Mike Brown' },
];

const salesPipelineChartConfig = {
  count: { label: "Opportunities" },
  Lead: { label: "Lead", color: "hsl(var(--chart-1))" },
  Contacted: { label: "Contacted", color: "hsl(var(--chart-2))" },
  Proposal: { label: "Proposal", color: "hsl(var(--chart-3))" },
  Negotiation: { label: "Negotiation", color: "hsl(var(--chart-4))" },
  Won: { label: "Won", color: "hsl(var(--chart-5))" },
} satisfies ChartConfig;

const revenueChartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;


export default function SalesDashboardPage() {
  const { t, locale } = useLocale();
  const [formattedRevenue, setFormattedRevenue] = React.useState<string | null>(null);
  const statIconSize = "h-4 w-4 text-muted-foreground";
  const iconSize = "h-3 w-3";

  React.useEffect(() => {
    const currencyLocale = locale === 'pt' ? 'pt-BR' : locale === 'fr' ? 'fr-FR' : 'en-US';
    setFormattedRevenue(salesStats.salesRevenueMonth.toLocaleString(currencyLocale, { style: 'currency', currency: 'USD' }));
  }, [locale]);

  const getActivityBadgeVariant = (type: string) => {
    if (type === 'Sale Closed') return 'default';
    if (type === 'Proposal Sent') return 'secondary';
    return 'outline';
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h1 className="text-base font-semibold">{t('sales_dashboard.title')}</h1>
        <div className="flex items-center gap-2">
          <Select defaultValue="last-30-days">
            <SelectTrigger className="w-[180px] h-8 text-xs">
              <CalendarDays className={`mr-2 ${iconSize}`} />
              <SelectValue placeholder={t('hr_dashboard.date_range_placeholder', 'Select Date Range')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-7-days" className="text-xs">{t('hr_dashboard.date_range_7_days', 'Last 7 Days')}</SelectItem>
              <SelectItem value="last-30-days" className="text-xs">{t('hr_dashboard.date_range_30_days', 'Last 30 Days')}</SelectItem>
              <SelectItem value="last-90-days" className="text-xs">{t('hr_dashboard.date_range_90_days', 'Last 90 Days')}</SelectItem>
              <SelectItem value="custom" className="text-xs">{t('hr_dashboard.date_range_custom', 'Custom Range')}</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="h-8">
            <Download className={`mr-2 ${iconSize}`} />
            {t('hr_dashboard.export_button', 'Export')}
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3 px-4">
            <CardTitle className="text-xs font-medium">{t('sales_dashboard.new_leads_month')}</CardTitle>
            <Users className={statIconSize} />
          </CardHeader>
          <CardContent className="pb-3 px-4">
            <div className="text-lg font-bold">{salesStats.newLeadsMonth}</div>
            <p className="text-xs text-muted-foreground">+15% {t('sales_dashboard.from_last_period')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3 px-4">
            <CardTitle className="text-xs font-medium">{t('sales_dashboard.opportunities_won_month')}</CardTitle>
            <Target className={statIconSize} />
          </CardHeader>
          <CardContent className="pb-3 px-4">
            <div className="text-lg font-bold">{salesStats.opportunitiesWonMonth}</div>
            <p className="text-xs text-muted-foreground">+8% {t('sales_dashboard.from_last_period')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3 px-4">
            <CardTitle className="text-xs font-medium">{t('sales_dashboard.sales_revenue_month')}</CardTitle>
            <DollarSign className={statIconSize} />
          </CardHeader>
          <CardContent className="pb-3 px-4">
            <div className="text-lg font-bold">{formattedRevenue ?? '...'}</div>
             <p className="text-xs text-muted-foreground">+12% {t('sales_dashboard.from_last_period')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3 px-4">
            <CardTitle className="text-xs font-medium">{t('sales_dashboard.conversion_rate_month')}</CardTitle>
            <TrendingUp className={statIconSize} />
          </CardHeader>
          <CardContent className="pb-3 px-4">
            <div className="text-lg font-bold">{salesStats.conversionRateMonth.toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground">+2.1% {t('sales_dashboard.from_last_period')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pt-4 pb-2">
            <CardTitle className="text-sm">{t('sales_dashboard.pipeline_by_stage_title')}</CardTitle>
            <CardDescription className="text-xs">{t('sales_dashboard.pipeline_by_stage_desc')}</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={salesPipelineChartConfig} className="min-h-[250px] w-full aspect-video">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={salesPipelineData} layout="vertical" margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tickLine={false} axisLine={false} tickMargin={8} fontSize={10} />
                  <YAxis dataKey="stage" type="category" tickLine={false} axisLine={false} tickMargin={8} fontSize={10} width={80} />
                  <ShadChartTooltip cursor={false} content={<ShadChartTooltipContent />} />
                  <Bar dataKey="count" radius={4}>
                    {salesPipelineData.map((entry) => (
                        <div key={entry.stage} style={{ backgroundColor: entry.fill }} /> // Replaced Cell with a div for simplicity
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pt-4 pb-2">
            <CardTitle className="text-sm">{t('sales_dashboard.revenue_over_time_title')}</CardTitle>
            <CardDescription className="text-xs">{t('sales_dashboard.revenue_over_time_desc')}</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
             <ChartContainer config={revenueChartConfig} className="min-h-[250px] w-full aspect-video">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={revenueOverTimeData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} fontSize={10} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={10} tickFormatter={(value) => `$${(value/1000)}k`} />
                  <ShadChartTooltip cursor={false} content={<ShadChartTooltipContent />} />
                  <ShadChartLegend content={<ShadChartLegendContent />} />
                  <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} dot={true} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sales Activity Table */}
      <Card>
        <CardHeader className="pt-4 pb-2">
            <CardTitle className="text-sm">{t('sales_dashboard.recent_sales_activity_title')}</CardTitle>
        </CardHeader>
        <CardContent>
            {recentSalesActivity.length > 0 ? (
            <div className="overflow-x-auto">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead className="text-xs">Tipo</TableHead>
                    <TableHead className="text-xs">Descrição</TableHead>
                    <TableHead className="text-xs">Usuário</TableHead>
                    <TableHead className="text-xs">Valor</TableHead>
                    <TableHead className="text-xs text-right">Tempo</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {recentSalesActivity.map((activity) => (
                    <TableRow key={activity.id}>
                        <TableCell>
                        <Badge variant={getActivityBadgeVariant(activity.type)} className="text-xs">
                            {t(`sales_dashboard.activity_type_${activity.type.toLowerCase().replace(/\s+/g, '_')}`, activity.type)}
                        </Badge>
                        </TableCell>
                        <TableCell className="text-xs">{activity.description}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{activity.user}</TableCell>
                        <TableCell className="text-xs text-right">
                        {activity.amount ? formattedRevenue : '-'}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground text-right">{activity.time}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </div>
            ) : (
            <p className="text-xs text-muted-foreground text-center py-4">{t('sales_dashboard.recent_sales_activity_none')}</p>
            )}
        </CardContent>
      </Card>
    </div>
  );
}

    