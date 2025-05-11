// src/app/maps/elements/page.tsx
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocale } from '@/contexts/LocaleContext';
import { GitFork } from 'lucide-react';

export default function MapElementsIndexPage() {
  const { t } = useLocale();
  const iconSize = "h-4 w-4";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold flex items-center gap-2">
            <GitFork className={`${iconSize} text-primary`} />
            {t('sidebar.maps_elements', 'Map Elements')}
        </h1>
      </div>

      <Card>
        <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-sm">{t('maps_elements.select_type_title', 'Select Element Type')}</CardTitle>
        </CardHeader>
        <CardContent> {/* Removed pt-6, CardHeader already provides padding */}
            <p className="text-center text-muted-foreground py-8 text-xs">
              {t('maps_elements.select_type_description', 'Please select a specific map element type from the sidebar to view or manage its items.')}
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
