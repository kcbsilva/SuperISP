// src/app/postgresql/tables/page.tsx
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
import { Table as TableIcon, PlusCircle, Trash2, Edit, Eye } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data - replace with actual data fetching
const placeholderDatabases = [
  { id: 'db_nethub', name: 'nethub_main' },
  { id: 'db_logs', name: 'nethub_logs' },
];

const placeholderTables = {
  db_nethub: [
    { id: 'tbl_pops', name: 'pops', schema: 'public', rows: 10, size: '1.2 MB' },
    { id: 'tbl_subscribers', name: 'subscribers', schema: 'public', rows: 1502, size: '25 MB' },
  ],
  db_logs: [
    { id: 'tbl_audit', name: 'audit_log', schema: 'public', rows: 100560, size: '150 MB' },
  ],
};

type DatabaseId = keyof typeof placeholderTables;

export default function TablesPage() {
  const { t } = useLocale();
  const { toast } = useToast();
  const [selectedDatabase, setSelectedDatabase] = React.useState<DatabaseId | ''>('');
  const iconSize = "h-3 w-3";

  const handleAction = (action: string, tableName?: string) => {
    toast({
      title: `${action} (Simulated)`,
      description: tableName ? `Action "${action}" for table "${tableName}" is not yet implemented.` : `Action "${action}" is not yet implemented.`,
    });
  };

  const currentTables = selectedDatabase ? placeholderTables[selectedDatabase] : [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold">{t('postgresql_page.tables_title', 'Tables')}</h1>
        <div className="flex items-center gap-2">
            <Select value={selectedDatabase} onValueChange={(value) => setSelectedDatabase(value as DatabaseId)}>
                <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder={t('postgresql_page.select_database_placeholder', 'Select a Database')} />
                </SelectTrigger>
                <SelectContent>
                    {placeholderDatabases.map(db => (
                        <SelectItem key={db.id} value={db.id}>{db.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Button size="sm" onClick={() => handleAction(t('postgresql_page.add_table_button', 'Add Table'))} disabled={!selectedDatabase}>
              <PlusCircle className={`mr-2 ${iconSize}`} />
              {t('postgresql_page.add_table_button', 'Add Table')}
            </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <TableIcon className={iconSize} />
            {t('postgresql_page.tables_list_title', 'Table List')}
            {selectedDatabase && ` - ${placeholderDatabases.find(db => db.id === selectedDatabase)?.name}`}
          </CardTitle>
          <CardDescription className="text-xs">
            {t('postgresql_page.tables_list_description', 'View and manage tables in the selected database.')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!selectedDatabase ? (
             <p className="text-center text-muted-foreground py-4 text-xs">
              {t('postgresql_page.select_database_prompt', 'Please select a database to view its tables.')}
            </p>
          ) : currentTables.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {t('postgresql_page.table_header_name', 'Name')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {t('postgresql_page.table_header_schema', 'Schema')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {t('postgresql_page.table_header_rows', 'Rows')}
                    </th>
                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {t('postgresql_page.table_header_size', 'Size')}
                    </th>
                    <th scope="col" className="relative px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider w-32">
                      {t('postgresql_page.table_header_actions', 'Actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-background divide-y divide-border">
                  {currentTables.map((table) => (
                    <tr key={table.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-foreground">
                        {table.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-muted-foreground">
                        {table.schema}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-muted-foreground">
                        {table.rows.toLocaleString()}
                      </td>
                       <td className="px-6 py-4 whitespace-nowrap text-xs text-muted-foreground">
                        {table.size}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium space-x-1">
                         <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleAction(t('postgresql_page.view_data_button', 'View Data'), table.name)}>
                           <Eye className={iconSize} />
                           <span className="sr-only">{t('postgresql_page.view_data_button', 'View Data')}</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleAction(t('postgresql_page.edit_action', 'Edit'), table.name)}>
                           <Edit className={iconSize} />
                           <span className="sr-only">{t('postgresql_page.edit_action', 'Edit')}</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleAction(t('postgresql_page.delete_action', 'Delete'), table.name)}>
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
              {t('postgresql_page.no_tables_found', 'No tables found in the selected database.')}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
