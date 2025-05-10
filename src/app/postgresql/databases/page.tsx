// src/app/postgresql/databases/page.tsx
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, PlusCircle, Trash2, Edit } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { useToast } from '@/hooks/use-toast';

// Mock data - replace with actual data fetching
const placeholderDatabases = [
  { id: 'db_nethub', name: 'nethub_main', owner: 'admin_user', encoding: 'UTF8', size: '150 MB' },
  { id: 'db_logs', name: 'nethub_logs', owner: 'log_user', encoding: 'UTF8', size: '500 MB' },
];

export default function DatabasesPage() {
  const { t } = useLocale();
  const { toast } = useToast();
  const iconSize = "h-3 w-3";

  const handleAction = (action: string, dbName?: string) => {
    toast({
      title: `${action} (Simulated)`,
      description: dbName ? `Action "${action}" for database "${dbName}" is not yet implemented.` : `Action "${action}" is not yet implemented.`,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold">{t('postgresql_page.databases_title', 'Databases')}</h1>
        <Button size="sm" onClick={() => handleAction(t('postgresql_page.add_database_button', 'Add Database'))}>
          <PlusCircle className={`mr-2 ${iconSize}`} />
          {t('postgresql_page.add_database_button', 'Add Database')}
        </Button>
      </div>

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
          {placeholderDatabases.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {t('postgresql_page.db_header_name', 'Name')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {t('postgresql_page.db_header_owner', 'Owner')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {t('postgresql_page.db_header_encoding', 'Encoding')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {t('postgresql_page.db_header_size', 'Size')}
                    </th>
                    <th scope="col" className="relative px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider w-28">
                      {t('postgresql_page.db_header_actions', 'Actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-background divide-y divide-border">
                  {placeholderDatabases.map((db) => (
                    <tr key={db.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-foreground">
                        {db.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-muted-foreground">
                        {db.owner}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-muted-foreground">
                        {db.encoding}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-muted-foreground">
                        {db.size}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium space-x-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleAction(t('postgresql_page.edit_action', 'Edit'), db.name)}>
                           <Edit className={iconSize} />
                           <span className="sr-only">{t('postgresql_page.edit_action', 'Edit')}</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleAction(t('postgresql_page.delete_action', 'Delete'), db.name)}>
                           <Trash2 className={iconSize} />
                           <span className="sr-only">{t('postgresql_page.delete_action', 'Delete')}</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4 text-xs">
              {t('postgresql_page.no_databases_found', 'No databases found or unable to connect.')}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
