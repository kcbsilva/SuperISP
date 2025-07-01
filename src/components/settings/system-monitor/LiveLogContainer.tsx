// src/components/pages/SystemMonitor/LiveLogContainer.tsx
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useLocale } from '@/contexts/LocaleContext';

const sources = {
  syslog: 'Syslog',
  journalctl: 'Journalctl',
  postgres: 'PostgreSQL',
};

export function LiveLogContainer() {
  const { t } = useLocale();
  const [selected, setSelected] = React.useState<'syslog' | 'journalctl' | 'postgres'>('syslog');

  const [logs, setLogs] = React.useState<Record<string, string>>({
    syslog: '',
    journalctl: '',
    postgres: '',
  });

  const [loading, setLoading] = React.useState<Record<string, boolean>>({
    syslog: true,
    journalctl: false,
    postgres: false,
  });

  const fetchLogs = React.useCallback(async (source: typeof selected) => {
    setLoading((prev) => ({ ...prev, [source]: true }));
    try {
      const res = await fetch(`/api/settings/system-monitor/logs?source=${source}`);
      const data = await res.json();
      setLogs((prev) => ({ ...prev, [source]: data.logs }));
    } catch {
      setLogs((prev) => ({ ...prev, [source]: '⚠️ Failed to load logs.' }));
    } finally {
      setLoading((prev) => ({ ...prev, [source]: false }));
    }
  }, []);

  React.useEffect(() => {
    fetchLogs(selected);
    const interval = setInterval(() => fetchLogs(selected), 10000);
    return () => clearInterval(interval);
  }, [selected, fetchLogs]);

  return (
    <Card className="lg:col-span-1">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">{t('live_logs_title')}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={selected} onValueChange={(val) => setSelected(val as any)} className="w-full">
          <TabsList className="grid grid-cols-3 p-2">
            {Object.entries(sources).map(([key, label]) => (
              <TabsTrigger key={key} value={key}>{label}</TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(sources).map(([key]) => (
            <TabsContent key={key} value={key} className="p-4">
              <div className="h-64 w-full bg-muted rounded-md p-4 overflow-y-auto">
                {loading[key] ? (
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-5/6" />
                    <Skeleton className="h-3 w-2/3" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                ) : (
                  <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
                    {logs[key as keyof typeof logs]}
                  </pre>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
