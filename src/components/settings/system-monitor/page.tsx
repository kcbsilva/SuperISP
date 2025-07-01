// src/components/settings/system-monitor/page.tsx
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Router as RouterIcon } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { useToast } from '@/hooks/use-toast';
import { CardsContainer } from './CardsContainer';
import { LiveLogContainer } from './LiveLogContainer';
import { SystemChecks } from './SystemChecks';

interface SystemMetric {
  nameKey: string;
  value: string | number;
  unit?: string;
  icon: 'Cpu' | 'MemoryStick' | 'HardDrive' | 'Database';
  status?: 'ok' | 'warning' | 'error' | 'fetching';
  progress?: number;
}

interface MonitoredService {
  id: string;
  nameKey: string;
  status: 'Active' | 'Inactive';
  error?: string;
}

export default function SystemMonitorPage() {
  const { t } = useLocale();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = React.useState(false);
  const [metrics, setMetrics] = React.useState<SystemMetric[]>([]);
  const [services, setServices] = React.useState<MonitoredService[]>([]);

  const fetchSystemMetrics = React.useCallback(async () => {
    setIsLoading(true);
    toast({
      title: t('refresh_toast_title'),
      description: t('refresh_toast_description'),
    });

    try {
      const [cardsRes, servicesRes] = await Promise.all([
        fetch('/api/settings/system-monitor/cards'),
        fetch('/api/settings/system-monitor/services'),
      ]);

      const cardsData = await cardsRes.json();
      const servicesData = await servicesRes.json();

      setMetrics([
        {
          nameKey: 'cpu_usage',
          value: cardsData.cpu.usage,
          unit: '%',
          icon: 'Cpu',
          status: cardsData.cpu.usage > 80 ? 'warning' : 'ok',
          progress: cardsData.cpu.usage,
        },
        {
          nameKey: 'ram_usage',
          value: `${cardsData.ram.used} / ${cardsData.ram.total}`,
          unit: 'GB',
          icon: 'MemoryStick',
          status: cardsData.ram.used > cardsData.ram.total * 0.8 ? 'warning' : 'ok',
          progress: (cardsData.ram.used / cardsData.ram.total) * 100,
        },
        {
          nameKey: 'ssd_usage',
          value: `${cardsData.disk.used} / ${cardsData.disk.total}`,
          unit: 'GB',
          icon: 'HardDrive',
          status: cardsData.disk.used > cardsData.disk.total * 0.8 ? 'warning' : 'ok',
          progress: (cardsData.disk.used / cardsData.disk.total) * 100,
        },
        {
          nameKey: 'postgres_status',
          value: cardsData.postgres.connected
            ? t('postgres_connected')
            : t('postgres_disconnected'),
          icon: 'Database',
          status: cardsData.postgres.connected ? 'ok' : 'error',
        },
      ]);

      setServices(servicesData);
    } catch (error) {
      console.error('[FETCH_METRICS_ERROR]', error);
      toast({
        title: t('error'),
        description: t('error_fetching_metrics'),
        variant: 'destructive',
      });
    }

    setIsLoading(false);
  }, [t, toast]);

  React.useEffect(() => {
    fetchSystemMetrics();
    const interval = setInterval(fetchSystemMetrics, 30000); // Auto-refresh every 30s
    return () => clearInterval(interval);
  }, [fetchSystemMetrics]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold flex items-center gap-2">
          <RouterIcon className="h-2.5 w-2.5 text-primary" />
          {t('page_title')}
        </h1>
        <Button onClick={fetchSystemMetrics} disabled={isLoading}>
          <RefreshCw className={`mr-2 h-2.5 w-2.5 ${isLoading ? 'animate-spin' : ''}`} />
          {t('refresh_button')}
        </Button>
      </div>

      <CardsContainer metrics={metrics} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LiveLogContainer />
        <SystemChecks services={services} setServices={setServices} isLoading={isLoading} />
      </div>
    </div>
  );
}
