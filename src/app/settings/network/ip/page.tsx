// src/app/settings/network/ip/page.tsx
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { PlusCircle, Code } from 'lucide-react'; // Using Code icon for IP
import { useLocale } from '@/contexts/LocaleContext';

export default function NetworkIpPage() {
  const { t } = useLocale();
  const iconSize = "h-2.5 w-2.5"; // Reduced icon size

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold flex items-center gap-2">
            <Code className={`${iconSize} text-primary`} /> {/* Icon added */}
            {t('sidebar.network_ip', 'IPv4/IPv6 Management')}
        </h1>
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          <PlusCircle className={`mr-2 ${iconSize}`} /> {t('network_ip_page.add_ip_block_button', 'Add IP Block')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{t('network_ip_page.existing_blocks_title', 'Existing IP Blocks')}</CardTitle>
          <CardDescription className="text-xs">{t('network_ip_page.existing_blocks_description', 'Manage your allocated IPv4 and IPv6 address blocks.')}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-xs">
            {t('network_ip_page.no_blocks_found', 'No IP blocks configured yet. Click "Add IP Block" to create one.')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
