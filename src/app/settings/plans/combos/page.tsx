// src/app/settings/plans/combos/page.tsx
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';

export default function ComboPlansPage() {
  const { t } = useLocale();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">{t('settings_plans.combos_page_title', 'Combo Plans')}</h1>
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          <PlusCircle className="mr-2 h-4 w-4" /> {t('settings_plans.add_plan_button_combos', 'Add Combo Plan')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('settings_plans.existing_plans_title', 'Existing Combo Plans')}</CardTitle>
          <CardDescription>{t('settings_plans.existing_plans_description_combos', 'Manage your combo service plans.')}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Placeholder for table or list of combo plans */}
          <p className="text-muted-foreground">
            {t('settings_plans.no_plans_found_combos', 'No combo plans configured yet. Click "Add Combo Plan" to create one.')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
