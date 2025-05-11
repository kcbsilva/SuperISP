// src/app/maps/projects/page.tsx
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { FileCode, PlusCircle } from 'lucide-react'; // Using FileCode as an example icon
import { useLocale } from '@/contexts/LocaleContext';

export default function MapProjectsPage() {
  const { t } = useLocale();
  const iconSize = "h-3 w-3";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold flex items-center gap-2">
            <FileCode className={`${iconSize} text-primary`} />
            {t('maps_elements.projects_page_title', 'Map Projects')}
        </h1>
        <Button className="bg-green-600 hover:bg-green-700 text-white" size="sm">
            <PlusCircle className={`mr-2 ${iconSize}`} /> {t('maps_elements.add_project_button', 'Add Project')}
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-sm">{t('maps_elements.list_title_projects', 'Project List')}</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-center text-muted-foreground py-8 text-xs">
              {t('maps_elements.no_projects_found', 'No projects found. Click "Add Project" to create one.')}
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
