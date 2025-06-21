// src/components/dashboard/views/GeneralDashboardView.tsx
import * as React from 'react';
import { useLocale } from '@/contexts/LocaleContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, DollarSign, Network, MessageSquareWarning, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SubscriberChart } from '@/components/dashboard/subscriber-chart';

type Props = {
  data: {
    totalSubscribers: number;
    subscriberChange: number;
    mrr: number;
    mrrChange: number;
    networkUptime: number;
    uptimeChange: number;
    openTickets: number;
    ticketChange: number;
    recentActivity: {
      id: string;
      type: string;
      description: string;
      time: string;
      level?: 'warning';
    }[];
  };
};

export default function GeneralDashboardView({ data }: Props) {
  const { t, locale } = useLocale();
  const iconSize = 'h-3 w-3';
  const smallIconSize = 'h-2.5 w-2.5';

  const formattedSubscribers = data.totalSubscribers.toLocaleString(locale);
  const currencyLocale = 'en-US';
  const formattedMrr = data.mrr.toLocaleString(currencyLocale, { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });

  const getTrendIcon = (change: number) => {
    const Icon = change >= 0 ? ArrowUpRight : ArrowDownRight;
    return <Icon className={`${iconSize} ${change >= 0 ? 'text-green-500' : 'text-red-500'}`} />;
  };

  const getActivityBadgeVariant = (level?: string) => {
    if (level === 'warning') return 'destructive';
    return 'secondary';
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[{
          title: 'dashboard.total_subscribers_title',
          value: formattedSubscribers,
          change: data.subscriberChange,
          icon: <Users className={`${iconSize} text-muted-foreground`} />,
        }, {
          title: 'dashboard.mrr_title',
          value: formattedMrr,
          change: data.mrrChange,
          icon: <DollarSign className={`${iconSize} text-muted-foreground`} />,
        }, {
          title: 'dashboard.network_uptime_title',
          value: `${data.networkUptime}%`,
          change: data.uptimeChange,
          icon: <Network className={`${iconSize} text-muted-foreground`} />,
        }, {
          title: 'dashboard.open_tickets_title',
          value: data.openTickets,
          change: data.ticketChange,
          icon: <MessageSquareWarning className={`${iconSize} text-muted-foreground`} />,
        }].map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4">
              <CardTitle className="text-xs font-medium">{t(stat.title)}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent className="pb-4">
              <div className="text-2xl font-bold">{stat.value ?? <Skeleton className="h-6 w-20" />}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                {getTrendIcon(stat.change)} {stat.change >= 0 ? '+' : ''}{stat.change}% from last month
              </p>
            </CardContent>
          </Card>
        ))}
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
            {data.recentActivity.length > 0 ? (
              data.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3">
                  <Activity className={`${smallIconSize} text-muted-foreground flex-shrink-0`} />
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
  );
}
