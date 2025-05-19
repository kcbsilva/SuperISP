// src/app/admin/hr/dashboard/page.tsx
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
  ChartTooltip as ShadChartTooltip, // Renamed to avoid conflict
  ChartTooltipContent as ShadChartTooltipContent, // Renamed
  ChartLegend as ShadChartLegend, // Renamed
  ChartLegendContent as ShadChartLegendContent, // Renamed
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { Users, UserPlus, UserMinus, TrendingDown, CalendarDays, Download } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const hiresTerminationsData = [
  { month: 'Jan', hires: 5, terminations: 2 },
  { month: 'Feb', hires: 7, terminations: 3 },
  { month: 'Mar', hires: 4, terminations: 1 },
  { month: 'Apr', hires: 6, terminations: 4 },
  { month: 'May', hires: 8, terminations: 2 },
  { month: 'Jun', hires: 5, terminations: 3 },
];

const turnoverData = [
  { month: 'Jan', turnoverRate: 2.5 },
  { month: 'Feb', turnoverRate: 3.1 },
  { month: 'Mar', turnoverRate: 1.8 },
  { month: 'Apr', turnoverRate: 4.0 },
  { month: 'May', turnoverRate: 2.2 },
  { month: 'Jun', turnoverRate: 3.5 },
];

const tenureData = [
  { tenure: '0-1 Yr', count: 15 },
  { tenure: '1-2 Yrs', count: 25 },
  { tenure: '2-5 Yrs', count: 30 },
  { tenure: '5-10 Yrs', count: 20 },
  { tenure: '10+ Yrs', count: 10 },
];

const hiresTerminationsChartConfig = {
  hires: {
    label: "Hires",
    color: "hsl(180, 70%, 50%)", // Cyan/Teal
  },
  terminations: {
    label: "Terminations",
    color: "hsl(var(--chart-1))", // Orange/Amber
  },
} satisfies ChartConfig;

const turnoverChartConfig = {
  turnoverRate: {
    label: "Turnover Rate (%)",
    color: "hsl(330, 70%, 60%)", // Pink/Magenta
  },
} satisfies ChartConfig;

const tenureChartConfig = {
  count: {
    label: "Employees",
    color: "hsl(var(--chart-2))", // Blue
  },
} satisfies ChartConfig;

export default function HRDashboardPage() {
  const { t } = useLocale();
  const statIconSize = "h-4 w-4 text-muted-foreground";
  const iconSize = "h-3 w-3";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h1 className="text-base font-semibold">{t('hr_dashboard.title', 'HR Dashboard')}</h1>
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
            <CardTitle className="text-xs font-medium">{t('hr_dashboard.active_employees', 'Active Employees')}</CardTitle>
            <Users className={statIconSize} />
          </CardHeader>
          <CardContent className="pb-3 px-4">
            <div className="text-lg font-bold">150</div>
            <p className="text-xs text-muted-foreground">+5 {t('hr_dashboard.from_last_month', 'from last month')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3 px-4">
            <CardTitle className="text-xs font-medium">{t('hr_dashboard.new_hires_month', 'New Hires (Month)')}</CardTitle>
            <UserPlus className={statIconSize} />
          </CardHeader>
          <CardContent className="pb-3 px-4">
            <div className="text-lg font-bold">8</div>
            <p className="text-xs text-muted-foreground">+2 {t('hr_dashboard.compared_to_last_month', 'compared to last month')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3 px-4">
            <CardTitle className="text-xs font-medium">{t('hr_dashboard.terminations_month', 'Terminations (Month)')}</CardTitle>
            <UserMinus className={statIconSize} />
          </CardHeader>
          <CardContent className="pb-3 px-4">
            <div className="text-lg font-bold">3</div>
             <p className="text-xs text-muted-foreground">-1 {t('hr_dashboard.compared_to_last_month', 'compared to last month')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3 px-4">
            <CardTitle className="text-xs font-medium">{t('hr_dashboard.turnover_rate_month', 'Turnover Rate (Month)')}</CardTitle>
            <TrendingDown className={statIconSize} />
          </CardHeader>
          <CardContent className="pb-3 px-4">
            <div className="text-lg font-bold">2.0%</div>
            <p className="text-xs text-muted-foreground">{t('hr_dashboard.target_2_5_percent', 'Target: < 2.5%')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pt-4 pb-2">
            <CardTitle className="text-sm">{t('hr_dashboard.hires_terminations_chart_title', 'Hires and Terminations')}</CardTitle>
            <CardDescription className="text-xs">{t('hr_dashboard.hires_terminations_chart_desc', 'Monthly trends over the last 6 months.')}</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={hiresTerminationsChartConfig} className="min-h-[250px] w-full aspect-video">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={hiresTerminationsData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} fontSize={10} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={10} />
                  <ShadChartTooltip cursor={false} content={<ShadChartTooltipContent indicator="dot" />} />
                  <ShadChartLegend content={<ShadChartLegendContent />} />
                  <Bar dataKey="hires" fill="var(--color-hires)" radius={4} />
                  <Bar dataKey="terminations" fill="var(--color-terminations)" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pt-4 pb-2">
            <CardTitle className="text-sm">{t('hr_dashboard.turnover_rate_chart_title', 'Turnover Rate Over Time')}</CardTitle>
            <CardDescription className="text-xs">{t('hr_dashboard.turnover_rate_chart_desc', 'Monthly turnover percentage.')}</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
             <ChartContainer config={turnoverChartConfig} className="min-h-[250px] w-full aspect-video">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={turnoverData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} fontSize={10} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={10} domain={[0, 'dataMax + 1']}/>
                  <ShadChartTooltip cursor={false} content={<ShadChartTooltipContent />} />
                  <ShadChartLegend content={<ShadChartLegendContent />} />
                  <Line type="monotone" dataKey="turnoverRate" stroke="var(--color-turnoverRate)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader className="pt-4 pb-2">
            <CardTitle className="text-sm">{t('hr_dashboard.employees_by_tenure_chart_title', 'Employees by Tenure')}</CardTitle>
            <CardDescription className="text-xs">{t('hr_dashboard.employees_by_tenure_chart_desc', 'Distribution of employees by years of service.')}</CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
            <ChartContainer config={tenureChartConfig} className="min-h-[250px] w-full aspect-video">
            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={tenureData} layout="vertical" margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <YAxis dataKey="tenure" type="category" tickLine={false} axisLine={false} tickMargin={8} fontSize={10} width={60} />
                <XAxis type="number" tickLine={false} axisLine={false} tickMargin={8} fontSize={10} />
                <ShadChartTooltip cursor={false} content={<ShadChartTooltipContent indicator="dot" />} />
                <ShadChartLegend content={<ShadChartLegendContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={4} />
                </BarChart>
            </ResponsiveContainer>
            </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
