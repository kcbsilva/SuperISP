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

export function CardsContainer({ metrics }: Props) {
  const { t } = useLocale();
  const iconSize = 'h-4 w-4';

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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => {
        const MetricIcon = iconMap[metric.icon];
        return (
          <Card key={metric.nameKey}>
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