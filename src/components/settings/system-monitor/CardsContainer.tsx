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
  free?: string;
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
  const [interval, setIntervalState] = React.useState('1min');
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
    const timer = window.setInterval(fetchData, 5000);
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
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {/* Combined CPU & RAM Card */}
      <Card className="xl:col-span-2">
        <CardHeader className="pb-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">{t('cpu_and_ram_usage')}</CardTitle>
          </div>
          <div className="flex gap-1 mt-2 justify-end">
            {intervalOptions.map((option) => (
              <Button
                key={option}
                variant={interval === option ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setIntervalState(option)}
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
          <div className="mt-2 text-xs text-muted-foreground flex justify-center gap-4">
            <div className="flex items-center gap-1">
              <span className="w-3 h-1.5 rounded bg-red-500" /> CPU
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-1.5 rounded bg-yellow-400" /> RAM
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SSD Card */}
      {metrics.find((m) => m.nameKey === 'disk_usage') && (
        <Card className="xl:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-sm font-medium">{t('disk_usage')}</CardTitle>
            <HardDrive className={`${iconSize} text-muted-foreground`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex justify-between items-center">
              <span>
                {metrics.find((m) => m.nameKey === 'disk_usage')?.value}
                <span className="text-sm font-normal text-muted-foreground ml-1">
                  {metrics.find((m) => m.nameKey === 'disk_usage')?.unit}
                </span>
              </span>
              {getStatusIndicator(metrics.find((m) => m.nameKey === 'disk_usage')?.status)}
            </div>
            <div className="relative group mt-2">
              <Progress
                value={metrics.find((m) => m.nameKey === 'disk_usage')?.progress}
                className={`h-2 transition-colors
                  ${metrics.find((m) => m.nameKey === 'disk_usage')?.progress! > 80
                    ? 'bg-red-200 [&>div]:bg-red-500'
                    : metrics.find((m) => m.nameKey === 'disk_usage')?.progress! > 60
                    ? 'bg-yellow-200 [&>div]:bg-yellow-500'
                    : 'bg-muted [&>div]:bg-green-500'}`}
              />
              <div className="absolute bottom-full left-0 mb-1 hidden group-hover:flex bg-black text-white text-xs px-2 py-1 rounded shadow z-10">
                {metrics.find((m) => m.nameKey === 'disk_usage')?.free} GB free
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Remaining metrics */}
      {metrics.map((metric) => {
        if (['cpu_usage', 'ram_usage', 'disk_usage', 'postgres_status'].includes(metric.nameKey)) return null;
        const MetricIcon = iconMap[metric.icon];
        return (
          <Card key={metric.nameKey} className="xl:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
              <CardTitle className="text-sm font-medium">{t(metric.nameKey)}</CardTitle>
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
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
