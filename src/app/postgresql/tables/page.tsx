// src/app/mysql/tables/page.tsx
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table as TableIcon } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';

export default function MysqlTablesPage() {
  const { t } = useLocale();
  const iconSize = "h-3 w-3";

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-base font-semibold">{t('mysql_page.tables_title', 'Tables')}</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <TableIcon className={iconSize} />
            {t('mysql_page.tables_list_title', 'Table List')}
          </CardTitle>
          <CardDescription className="text-xs">
            {t('mysql_page.tables_list_description', 'View and manage tables in the selected database.')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-xs">
            {t('mysql_page.select_database_prompt', 'Please select a database to view its tables.')} {/* Updated placeholder text */}
          </p>
           {/* Placeholder for future table listing UI */}
        </CardContent>
      </Card>
    </div>
  );
}
