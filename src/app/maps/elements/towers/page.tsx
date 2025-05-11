// src/app/maps/elements/towers/page.tsx
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { TowerControl, PlusCircle } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';

export default function TowersPage() {
  const { t } = useLocale();
  const iconSize = "h-3 w-3";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold flex items-center gap-2">
            <TowerControl className={`${iconSize} text-primary`} />
            {t('sidebar.maps_elements_towers', 'Towers')}
        </h1>
        <Button className="bg-green-600 hover:bg-green-700 text-white" size="sm">
            <PlusCircle className={`mr-2 ${iconSize}`} /> {t('maps_elements.add_element_button', 'Add Tower')}
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-sm">{t('maps_elements.list_title_towers', 'Tower List')}</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-center text-muted-foreground py-8 text-xs">
              {t('maps_elements.no_towers_found', 'No towers found. Click "Add Tower" to create one.')}
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
