// src/app/settings/system-monitor/page.tsx
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
import { Cpu, HardDrive, MemoryStick, Database, RefreshCw, Loader2, CheckCircle, XCircle, Router as RouterIcon } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { testConnection as testSupabaseConnection } from '@/services/supabase/db'; // Updated import

interface SystemMetric {
  nameKey: string;
  value: string | number;
  unit?: string;
  icon: React.ElementType;
  status?: 'ok' | 'warning' | 'error' | 'fetching';
  progress?: number;
}

export default function SystemMonitorPage() {
  const { t } = useLocale();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [metrics, setMetrics] = React.useState<SystemMetric[]>([
    { nameKey: 'settingsSystemMonitor.cpu_usage', value: 'Fetching...', icon: Cpu, status: 'fetching', progress: 0 },
    { nameKey: 'settingsSystemMonitor.ram_usage', value: 'Fetching...', icon: MemoryStick, status: 'fetching', progress: 0 },
    { nameKey: 'settingsSystemMonitor.ssd_usage', value: 'Fetching...', icon: HardDrive, status: 'fetching', progress: 0 },
    { nameKey: 'settingsSystemMonitor.supabase_status', value: 'Fetching...', icon: Database, status: 'fetching' },
  ]);

  const iconSize = "h-4 w-4";
  const smallIconSize = "h-2.5 w-2.5";

  const fetchSystemMetrics = React.useCallback(async () => {
    setIsLoading(true);
    toast({
      title: t('settingsSystemMonitor.refresh_toast_title'),
      description: t('settingsSystemMonitor.refresh_toast_description'),
    });

    // Simulate API call for system metrics
    await new Promise(resolve => setTimeout(resolve, 1000));
    const cpuUsage = Math.floor(Math.random() * 100);
    const ramUsage = parseFloat((Math.random() * 16).toFixed(1));
    const ssdUsage = Math.floor(Math.random() * 500);

    // Test Supabase connection
    const supabaseConnected = await testSupabaseConnection();

    setMetrics([
      { nameKey: 'settingsSystemMonitor.cpu_usage', value: cpuUsage, unit: '%', icon: Cpu, status: cpuUsage > 80 ? 'warning' : 'ok', progress: cpuUsage },
      { nameKey: 'settingsSystemMonitor.ram_usage', value: `${ramUsage} / 16`, unit: 'GB', icon: MemoryStick, status: ramUsage > 12.8 ? 'warning' : 'ok', progress: (ramUsage / 16) * 100 },
      { nameKey: 'settingsSystemMonitor.ssd_usage', value: `${ssdUsage} / 512`, unit: 'GB', icon: HardDrive, status: ssdUsage > 400 ? 'warning' : 'ok', progress: (ssdUsage / 512) * 100 },
      { nameKey: 'settingsSystemMonitor.supabase_status', value: supabaseConnected ? 'Connected' : 'Disconnected', icon: Database, status: supabaseConnected ? 'ok' : 'error' },
    ]);
    setIsLoading(false);
  }, [t, toast]);

  React.useEffect(() => {
    fetchSystemMetrics();
  }, [fetchSystemMetrics]);

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
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold flex items-center gap-2">
            <RouterIcon className={`${smallIconSize} text-primary`} />
            {t('settingsSystemMonitor.page_title')}
        </h1>
        <Button onClick={fetchSystemMetrics} disabled={isLoading}>
          <RefreshCw className={`mr-2 ${smallIconSize} ${isLoading ? 'animate-spin' : ''}`} />
          {t('settingsSystemMonitor.refresh_button')}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          const MetricIcon = metric.icon;
          return (
            <Card key={metric.nameKey}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t(metric.nameKey)}
                </CardTitle>
                <MetricIcon className={`${iconSize} text-muted-foreground`} />
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">
                    {metric.value}
                    {metric.unit && <span className="text-sm font-normal text-muted-foreground ml-1">{metric.unit}</span>}
                    </div>
                    {getStatusIndicator(metric.status)}
                </div>
                {metric.progress !== undefined && (
                  <Progress value={metric.progress} className="mt-2 h-2" />
                )}
                 {metric.nameKey === 'settingsSystemMonitor.supabase_status' && metric.status !== 'fetching' && (
                    <p className={`text-xs mt-1 ${metric.status === 'ok' ? 'text-green-600' : 'text-red-600'}`}>
                        {metric.status === 'ok' ? t('settingsSystemMonitor.supabase_connected') : t('settingsSystemMonitor.supabase_disconnected')}
                    </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

       <Card>
        <CardHeader>
          <CardTitle className="text-sm">{t('settingsSystemMonitor.live_logs_title', 'Live Logs (Placeholder)')}</CardTitle>
          <CardDescription className="text-xs">{t('settingsSystemMonitor.live_logs_description', 'This section would display real-time system logs.')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full bg-muted rounded-md p-4 overflow-y-auto">
            <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
              {`[${new Date().toLocaleTimeString()}] System initialized.\n[${new Date().toLocaleTimeString()}] Monitoring services started...\n[${new Date().toLocaleTimeString()}] Supabase connection OK.`}
            </pre>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
