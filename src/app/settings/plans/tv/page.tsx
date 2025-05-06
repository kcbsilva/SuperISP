// src/app/settings/plans/tv/page.tsx
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';

export default function TvPlansPage() {
  const { t } = useLocale();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">{t('settings_plans.tv_page_title', 'TV Plans')}</h1>
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          <PlusCircle className="mr-2 h-4 w-4" /> {t('settings_plans.add_plan_button_tv', 'Add TV Plan')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('settings_plans.existing_plans_title', 'Existing TV Plans')}</CardTitle>
          <CardDescription>{t('settings_plans.existing_plans_description_tv', 'Manage your TV service plans.')}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Placeholder for table or list of TV plans */}
          <p className="text-muted-foreground">
            {t('settings_plans.no_plans_found_tv', 'No TV plans configured yet. Click "Add TV Plan" to create one.')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
