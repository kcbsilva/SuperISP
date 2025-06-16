// src/app/admin/settings/system-monitor/page.tsx
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Removed CardDescription
import { Button } from '@/components/ui/button';
import { Cpu, HardDrive, MemoryStick, Database, RefreshCw, Loader2, CheckCircle, XCircle, Router as RouterIcon, Power } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

interface SystemMetric {
  nameKey: string;
  value: string | number;
  unit?: string;
  icon: React.ElementType;
  status?: 'ok' | 'warning' | 'error' | 'fetching';
  progress?: number;
}

interface MonitoredService {
  id: string;
  nameKey: string;
  status: 'Active' | 'Inactive';
}

const placeholderServices: MonitoredService[] = [
  { id: 'ubuntu', nameKey: 'service_ubuntu', status: 'Active' },
  { id: 'cron', nameKey: 'service_cron', status: 'Active' },
  { id: 'ntp', nameKey: 'service_ntp', status: 'Inactive' },
  { id: 'freeradius', nameKey: 'service_freeradius', status: 'Active' },
  { id: 'nginx', nameKey: 'service_nginx', status: 'Active' },
  { id: 'nodejs', nameKey: 'service_nodejs', status: 'Inactive' },
  { id: 'nextjs', nameKey: 'service_nextjs', status: 'Active' },
  { id: 'postgresql', nameKey: 'service_postgresql', status: 'Active' },
  { id: 'pptpd', nameKey: 'service_pptpd', status: 'Inactive' },
];


export default function SystemMonitorPage() {
  const { t } = useLocale();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [metrics, setMetrics] = React.useState<SystemMetric[]>([
    { nameKey: 'cpu_usage', value: 'Fetching...', icon: Cpu, status: 'fetching', progress: 0 },
    { nameKey: 'ram_usage', value: 'Fetching...', icon: MemoryStick, status: 'fetching', progress: 0 },
    { nameKey: 'ssd_usage', value: 'Fetching...', icon: HardDrive, status: 'fetching', progress: 0 },
    { nameKey: 'postgres_status', value: 'Fetching...', icon: Database, status: 'fetching' },
  ]);
  const [services, setServices] = React.useState<MonitoredService[]>(placeholderServices);


  const iconSize = "h-4 w-4";
  const smallIconSize = "h-2.5 w-2.5";
  const actionButtonIconSize = "h-3 w-3";

  const fetchSystemMetrics = React.useCallback(async () => {
    setIsLoading(true);
    toast({
      title: t('refresh_toast_title'),
      description: t('refresh_toast_description'),
    });

    await new Promise(resolve => setTimeout(resolve, 1000));
    const cpuUsage = Math.floor(Math.random() * 100);
    const ramUsage = parseFloat((Math.random() * 16).toFixed(1));
    const ssdUsage = Math.floor(Math.random() * 500);
    
    const postgresConnected = Math.random() > 0.2; 

    setMetrics([
      { nameKey: 'cpu_usage', value: cpuUsage, unit: '%', icon: Cpu, status: cpuUsage > 80 ? 'warning' : 'ok', progress: cpuUsage },
      { nameKey: 'ram_usage', value: `${ramUsage} / 16`, unit: 'GB', icon: MemoryStick, status: ramUsage > 12.8 ? 'warning' : 'ok', progress: (ramUsage / 16) * 100 },
      { nameKey: 'ssd_usage', value: `${ssdUsage} / 512`, unit: 'GB', icon: HardDrive, status: ssdUsage > 400 ? 'warning' : 'ok', progress: (ssdUsage / 512) * 100 },
      { nameKey: 'postgres_status', value: postgresConnected ? 'Connected' : 'Disconnected', icon: Database, status: postgresConnected ? 'ok' : 'error' },
    ]);

    setServices(prevServices => prevServices.map(s => ({
        ...s,
        status: Math.random() > 0.3 ? 'Active' : 'Inactive'
    })));

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

  const handleRestartService = (serviceNameKey: string) => {
    const serviceName = t(serviceNameKey);
    toast({
      title: t('restart_action_toast_title'),
      description: t('restart_action_toast_desc', 'Restarting {serviceName}... (This is a simulation)').replace('{serviceName}', serviceName),
    });
    setIsLoading(true);
    setTimeout(() => {
        setServices(prevServices => prevServices.map(s =>
            s.nameKey === serviceNameKey ? { ...s, status: 'Active' } : s
        ));
        setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold flex items-center gap-2">
            <RouterIcon className={`${smallIconSize} text-primary`} />
            {t('page_title')}
        </h1>
        <Button onClick={fetchSystemMetrics} disabled={isLoading}>
          <RefreshCw className={`mr-2 ${smallIconSize} ${isLoading ? 'animate-spin' : ''}`} />
          {t('refresh_button')}
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
                 {metric.nameKey === 'postgres_status' && metric.status !== 'fetching' && (
                    <p className={`text-xs mt-1 ${metric.status === 'ok' ? 'text-green-600' : 'text-red-600'}`}>
                        {metric.status === 'ok' ? t('postgres_connected') : t('postgres_disconnected')}
                    </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm">{t('live_logs_title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full bg-muted rounded-md p-4 overflow-y-auto">
              <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
                {`[${new Date().toLocaleTimeString()}] System initialized.\n[${new Date().toLocaleTimeString()}] Monitoring services started...\n[${new Date().toLocaleTimeString()}] PostgreSQL connection OK.`}
              </pre>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm">{t('services_status_title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {services.map((service) => (
                <div key={service.id} className="flex items-center justify-between p-2 border rounded-md hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full inline-block ${service.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    <span className="text-xs font-medium">{t(service.nameKey)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold ${service.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
                      {service.status === 'Active' ? t('service_status_active') : t('service_status_inactive')}
                    </span>
                    <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => handleRestartService(service.nameKey)} disabled={isLoading}>
                      <Power className={`mr-1.5 ${actionButtonIconSize}`} />
                      {t('service_action_restart')}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
