// src/app/fttx/dashboard/page.tsx
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Network, Server, Wifi, Users, AlertCircle, CheckCircle, XCircle, Signal, SignalHigh, SignalMedium, SignalLow } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import Link from 'next/link';

// Placeholder data - replace with actual data fetching logic
const fttxDashboardData = {
  olts: [
    { id: 'olt-001', name: 'Central Office OLT', status: 'Online', clients: 480, capacity: 512, utilization: '93.75%' },
    { id: 'olt-002', name: 'North Hub OLT', status: 'Online', clients: 950, capacity: 1024, utilization: '92.77%' },
    { id: 'olt-003', name: 'South Branch OLT', status: 'Offline', clients: 0, capacity: 256, utilization: '0.00%' },
  ],
  onxStats: {
    total: 1430,
    online: 1385,
    offline: 30,
    nonProvisioned: 15,
  },
  onxLightLevels: [
    { range: '-15dBm - -19dBm', count: 152, color: 'text-green-600', icon: SignalHigh },
    { range: '-19dBm - -24dBm', count: 10, color: 'text-yellow-600', icon: SignalMedium }, // Using yellow-600 for better visibility
    { range: '-24dBm - -28dBm', count: 1, color: 'text-purple-600', icon: SignalLow }, // Using purple-600
    { range: '-28dBm - LOS', count: 60, color: 'text-red-600', icon: SignalLow }, // Using SignalLow for LOS/very low signal
  ],
};

export default function FTTxDashboardPage() {
  const { t } = useLocale();
  const iconSize = "h-4 w-4"; // Standard icon size for cards
  const smallIconSize = "h-3 w-3"; // For buttons or smaller indicators
  const lightLevelIconSize = "h-3.5 w-3.5"; // Specific for light level icons

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold">{t('fttx_dashboard.title', 'FTTx Dashboard')}</h1>
      </div>

      {/* OLT Summary Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Network className={`${iconSize} text-primary`} />
            {t('fttx_dashboard.olt_summary_title', 'OLT Summary')}
          </CardTitle>
          <CardDescription className="text-xs">
            {t('fttx_dashboard.olt_summary_desc', 'Overview of your Optical Line Terminals.')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {fttxDashboardData.olts.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {fttxDashboardData.olts.map(olt => (
                <Card key={olt.id} className="flex flex-col">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-medium flex items-center justify-between">
                      {olt.name}
                      <span className={`flex items-center text-xs ${olt.status === 'Online' ? 'text-green-600' : 'text-red-600'}`}>
                        {olt.status === 'Online' ? <CheckCircle className={`mr-1 ${smallIconSize}`} /> : <XCircle className={`mr-1 ${smallIconSize}`} />}
                        {t(`fttx_dashboard.olt_status_${olt.status.toLowerCase()}` as any, olt.status)}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-1">
                    <p className="text-xs text-muted-foreground">{t('fttx_dashboard.olt_clients', 'Clients')}: <span className="font-medium text-foreground">{olt.clients} / {olt.capacity}</span></p>
                    <p className="text-xs text-muted-foreground">{t('fttx_dashboard.olt_utilization', 'Utilization')}: <span className="font-medium text-foreground">{olt.utilization}</span></p>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button variant="outline" size="sm" className="w-full text-xs" asChild>
                        <Link href={`/fttx/olts/${olt.id}`}>{t('fttx_dashboard.olt_view_details', 'View Details')}</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground text-center py-4">{t('fttx_dashboard.no_olts_data')}</p>
          )}
           <div className="mt-4 text-right">
            <Button variant="link" size="sm" asChild className="text-xs">
                <Link href="/fttx/olts">{t('fttx_dashboard.view_all_olts_button')}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ONx Status Overview Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Wifi className={`${iconSize} text-primary`} />
              {t('fttx_dashboard.onx_status_title', 'ONx Status Overview')}
            </CardTitle>
             <CardDescription className="text-xs">
              {t('fttx_dashboard.onx_status_desc', 'Summary of Optical Network Unit/Terminal statuses.')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center space-x-3 rounded-md border p-3">
                <Users className={`${smallIconSize} text-muted-foreground`} />
                <div>
                  <p className="text-xs text-muted-foreground">{t('fttx_dashboard.total_onxs')}</p>
                  <p className="text-sm font-semibold">{fttxDashboardData.onxStats.total.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 rounded-md border p-3">
                <CheckCircle className={`${smallIconSize} text-green-500`} />
                <div>
                  <p className="text-xs text-muted-foreground">{t('fttx_dashboard.onxs_online')}</p>
                  <p className="text-sm font-semibold">{fttxDashboardData.onxStats.online.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 rounded-md border p-3">
                <XCircle className={`${smallIconSize} text-red-500`} />
                <div>
                  <p className="text-xs text-muted-foreground">{t('fttx_dashboard.onxs_offline')}</p>
                  <p className="text-sm font-semibold">{fttxDashboardData.onxStats.offline.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 rounded-md border p-3">
                <AlertCircle className={`${smallIconSize} text-yellow-500`} />
                <div>
                  <p className="text-xs text-muted-foreground">{t('fttx_dashboard.onxs_non_provisioned')}</p>
                  <p className="text-sm font-semibold">{fttxDashboardData.onxStats.nonProvisioned.toLocaleString()}</p>
                </div>
              </div>
            </div>
             <div className="mt-4 text-right">
               <Button variant="link" size="sm" asChild className="text-xs">
                  <Link href="/fttx/onxs">{t('fttx_dashboard.view_all_onxs_button', 'View All ONXs (Not Implemented)')}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ONx Light Levels Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Signal className={`${iconSize} text-primary`} />
              {t('fttx_dashboard.onx_light_levels_title', 'ONx Light Levels')}
            </CardTitle>
            <CardDescription className="text-xs">
              {t('fttx_dashboard.onx_light_levels_desc', 'Distribution of ONx devices by optical signal strength.')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {fttxDashboardData.onxLightLevels.map(level => {
                const IconComponent = level.icon;
                return (
                  <div key={level.range} className="flex items-center justify-between p-2 border rounded-md">
                    <div className="flex items-center gap-2">
                      <IconComponent className={`${lightLevelIconSize} ${level.color}`} />
                      <span className="text-xs font-medium">{level.range}</span>
                    </div>
                    <span className={`text-xs font-semibold ${level.color}`}>
                      {level.count} {t('fttx_dashboard.onx_light_levels_onxs', 'ONXs')}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
