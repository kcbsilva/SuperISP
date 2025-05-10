// src/app/postgresql/databases/page.tsx (Placeholder)
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Database } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';

export default function DatabasesPagePlaceholder() {
  const { t } = useLocale();
  const iconSize = "h-3 w-3";

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-base font-semibold">{t('postgresql_page.databases_title', 'Databases')}</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Database className={iconSize} />
            {t('postgresql_page.databases_list_title', 'Database List')}
          </CardTitle>
          <CardDescription className="text-xs">
            {t('postgresql_page.databases_list_description', 'View and manage your PostgreSQL databases.')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-xs">
            Database management UI for MySQL is not yet implemented. This section will display a list of MySQL databases.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
