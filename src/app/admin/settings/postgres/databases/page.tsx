// src/app/admin/settings/postgres/databases/page.tsx
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Database, PlusCircle } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';

export default function PostgresDatabasesPage() {
  const { t } = useLocale();
  const iconSize = "h-3 w-3";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold flex items-center gap-2">
            <Database className={`${iconSize} text-primary`} />
            {t('sidebar.settings_postgres_databases', 'PostgreSQL Databases')}
        </h1>
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          <PlusCircle className={`mr-2 ${iconSize}`} /> {t('postgres_databases.add_database_button', 'Add Database')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{t('postgres_databases.list_title', 'Databases')}</CardTitle>
          <CardDescription className="text-xs">{t('postgres_databases.list_description', 'Manage your PostgreSQL databases.')}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-xs">
            {t('postgres_databases.placeholder', 'Database listing and management tools will be displayed here. (Not Implemented)')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
