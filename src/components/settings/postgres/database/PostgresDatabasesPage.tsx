// src/components/settings/postgres/databases/PostgresDatabasesPage.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Database } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { ListDatabases } from './ListDatabases';
import { CreateDatabaseModal } from './CreateDatabaseModal';

export default function DatabasesContent() {
  const { t } = useLocale();
  const [isAddOpen, setIsAddOpen] = React.useState(false);

  return (
    <div className="bg-white dark:bg-[--background] rounded-md shadow-sm p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold flex items-center gap-2">
          <Database className="h-4 w-4 text-primary" />
          {t('sidebar.settings_postgres_databases', 'PostgreSQL Databases')}
        </h1>

        <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => setIsAddOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {t('postgres_databases.add_database_button', 'Add Database')}
        </Button>
      </div>

      {/* Table */}
      <ListDatabases />

      {/* Modal */}
      <CreateDatabaseModal open={isAddOpen} onOpenChange={setIsAddOpen} />
    </div>
  );
}
