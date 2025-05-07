// src/app/settings/plans/combos/page.tsx
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';

export default function ComboPlansPage() {
  const { t } = useLocale();
  const iconSize = "h-3 w-3"; // Reduced icon size

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold">{t('settings_plans.combos_page_title', 'Combo Plans')}</h1> {/* Reduced heading size */}
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          <PlusCircle className={`mr-2 ${iconSize}`} /> {t('settings_plans.add_plan_button_combos', 'Add Combo Plan')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{t('settings_plans.existing_plans_title', 'Existing Combo Plans')}</CardTitle> {/* Reduced title size */}
          <CardDescription className="text-xs">{t('settings_plans.existing_plans_description_combos', 'Manage your combo service plans.')}</CardDescription> 
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-xs"> 
            {t('settings_plans.no_plans_found_combos', 'No combo plans configured yet. Click "Add Combo Plan" to create one.')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
