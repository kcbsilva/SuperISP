// src/app/postgresql/tables/page.tsx (Placeholder)
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table as TableIcon } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';

export default function TablesPagePlaceholder() {
  const { t } = useLocale();
  const iconSize = "h-3 w-3";

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-base font-semibold">{t('postgresql_page.tables_title', 'Tables')}</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <TableIcon className={iconSize} />
            {t('postgresql_page.tables_list_title', 'Table List')}
          </CardTitle>
          <CardDescription className="text-xs">
            {t('postgresql_page.tables_list_description', 'View and manage tables in the selected database.')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-xs">
            Table management UI for MySQL is not yet implemented. This section will display a list of tables for the selected MySQL database.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
