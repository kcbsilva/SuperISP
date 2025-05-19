// src/app/settings/plans/tv/page.tsx
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';

export default function TvPlansPage() {
  const { t } = useLocale();
  const iconSize = "h-3 w-3"; // Reduced icon size

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold">{t('settings_plans.tv_page_title', 'TV Plans')}</h1> {/* Reduced heading size */}
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          <PlusCircle className={`mr-2 ${iconSize}`} /> {t('settings_plans.add_plan_button_tv', 'Add TV Plan')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{t('settings_plans.existing_plans_title', 'Existing TV Plans')}</CardTitle> {/* Reduced title size */}
          <CardDescription className="text-xs">{t('settings_plans.existing_plans_description_tv', 'Manage your TV service plans.')}</CardDescription> 
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-xs"> 
            {t('settings_plans.no_plans_found_tv', 'No TV plans configured yet. Click "Add TV Plan" to create one.')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
