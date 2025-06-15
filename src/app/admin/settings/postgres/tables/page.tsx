// src/app/admin/settings/postgres/tables/page.tsx
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Table2, PlusCircle } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';

export default function PostgresTablesPage() {
  const { t } = useLocale();
  const iconSize = "h-3 w-3";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold flex items-center gap-2">
            <Table2 className={`${iconSize} text-primary`} />
            {t('sidebar.settings_postgres_tables', 'PostgreSQL Tables')}
        </h1>
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          <PlusCircle className={`mr-2 ${iconSize}`} /> {t('postgres_tables.add_table_button', 'Create Table')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{t('postgres_tables.list_title', 'Tables')}</CardTitle>
          <CardDescription className="text-xs">{t('postgres_tables.list_description', 'Browse and manage tables in your PostgreSQL database.')}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-xs">
            {t('postgres_tables.placeholder', 'Table listing and management tools will be displayed here. (Not Implemented)')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
