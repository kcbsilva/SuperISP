// src/components/settings/system-monitor/CardsContainer.tsx
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Cpu, MemoryStick, HardDrive, Database, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';

interface SystemMetric {
  nameKey: string;
  value: string | number;
  unit?: string;
  icon: 'Cpu' | 'MemoryStick' | 'HardDrive' | 'Database';
  status?: 'ok' | 'warning' | 'error' | 'fetching';
  progress?: number;
}

interface Props {
  metrics: SystemMetric[];
}

const iconMap = {
  Cpu: Cpu,
  MemoryStick: MemoryStick,
  HardDrive: HardDrive,
  Database: Database,
};

const intervalOptions = ['1sec', '1min', '5min', '30min', '1h', '1d'];

export function CardsContainer({ metrics }: Props) {
  const { t } = useLocale();
  const iconSize = 'h-4 w-4';
  const [interval, setInterval] = React.useState('1min');
  const [chartData, setChartData] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/settings/system-monitor/history?interval=${interval}`);
        const data = await res.json();
        setChartData(data);
      } catch (error) {
        console.error('Failed to fetch chart data:', error);
      }
    };

    fetchData();
    const timer = setInterval(fetchData, 5000);
    return () => clearInterval(timer);
  }, [interval]);

  const getStatusIndicator = (status?: 'ok' | 'warning' | 'error' | 'fetching') => {
    switch (status) {
      case 'ok':
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      case 'warning':
        return <XCircle className="h-3 w-3 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-3 w-3 text-red-500" />;
      case 'fetching':
        return <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />;
      default:
        return null;
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
      {/* Combined CPU & RAM Card */}
      <Card className="xl:col-span-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
          <CardTitle className="text-sm font-medium">{t('cpu_and_ram_usage')}</CardTitle>
          <div className="flex gap-1">
            {intervalOptions.map((option) => (
              <Button
                key={option}
                variant={interval === option ? 'default' : 'ghost'}
                size="xs"
                onClick={() => setInterval(option)}
              >
                {option}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <XAxis dataKey="time" hide={false} />
              <YAxis hide={false} />
              <Tooltip />
              <Line type="monotone" dataKey="cpu" stroke="#ef4444" dot={false} strokeWidth={2} />
              <Line type="monotone" dataKey="ram" stroke="#facc15" dot={false} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Remaining cards */}
      {metrics.map((metric) => {
        if (metric.nameKey === 'cpu_usage' || metric.nameKey === 'ram_usage') return null; // skip cpu/ram
        const MetricIcon = iconMap[metric.icon];
        return (
          <Card key={metric.nameKey} className="xl:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
              <CardTitle className="text-sm font-medium">
                {t(metric.nameKey)}
              </CardTitle>
              <MetricIcon className={`${iconSize} text-muted-foreground`} />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {metric.value}
                  {metric.unit && (
                    <span className="text-sm font-normal text-muted-foreground ml-1">
                      {metric.unit}
                    </span>
                  )}
                </div>
                {getStatusIndicator(metric.status)}
              </div>
              {metric.progress !== undefined && (
                <Progress value={metric.progress} className="mt-1 h-2" />
              )}
              {metric.nameKey === 'postgres_status' && metric.status !== 'fetching' && (
                <p
                  className={`text-xs mt-1 ${
                    metric.status === 'ok' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {metric.value}
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}