// src/app/admin/settings/postgres/sql-cli/page.tsx
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Play, Eraser, Terminal } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { useToast } from '@/hooks/use-toast';

export default function PostgresSqlCliPage() {
  const { t } = useLocale();
  const { toast } = useToast();
  const [sqlQuery, setSqlQuery] = React.useState('');
  const [queryResult, setQueryResult] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const iconSize = "h-3 w-3";

  const handleExecuteQuery = async () => {
    if (!sqlQuery.trim()) {
      toast({
        title: t('postgres_sql_cli.empty_query_title', 'Empty Query'),
        description: t('postgres_sql_cli.empty_query_desc', 'Please enter a SQL query to execute.'),
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setQueryResult(null);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    // Replace with actual API call to execute SQL
    try {
      // const result = await executeSupabaseSql(sqlQuery); // This function would need to be created
      // For now, simulate result
      if (sqlQuery.toLowerCase().startsWith('select')) {
        setQueryResult([{ id: 1, name: 'Sample Data', value: 123 }, { id: 2, name: 'Another Row', value: 456 }]);
      } else {
        setQueryResult({ message: 'Query executed successfully (simulated). Rows affected: 0' });
      }
      toast({
        title: t('postgres_sql_cli.query_executed_title', 'Query Executed (Simulated)'),
        description: t('postgres_sql_cli.query_executed_desc', 'Your SQL query has been processed.'),
      });
    } catch (error: any) {
      setQueryResult({ error: error.message });
      toast({
        title: t('postgres_sql_cli.query_error_title', 'Query Error'),
        description: error.message || t('postgres_sql_cli.query_error_desc', 'An error occurred while executing the query.'),
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  };

  const handleClearQuery = () => {
    setSqlQuery('');
    setQueryResult(null);
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold flex items-center gap-2">
            <Terminal className={`${iconSize} text-primary`} />
            {t('sidebar.settings_postgres_sql_cli', 'PostgreSQL SQL CLI')}
        </h1>
      </div>

      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle className="text-sm">{t('postgres_sql_cli.title', 'SQL Command Line Interface')}</CardTitle>
          <CardDescription className="text-xs">{t('postgres_sql_cli.description', 'Execute SQL queries directly against your PostgreSQL database.')}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4">
          <Textarea
            value={sqlQuery}
            onChange={(e) => setSqlQuery(e.target.value)}
            placeholder={t('postgres_sql_cli.query_placeholder', 'Enter your SQL query here... (e.g., SELECT * FROM subscribers LIMIT 10;)')}
            className="font-mono text-xs flex-1 min-h-[150px]"
            disabled={isLoading}
          />
          <div className="flex items-center gap-2">
            <Button onClick={handleExecuteQuery} disabled={isLoading || !sqlQuery.trim()}>
              <Play className={`mr-2 ${iconSize} ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? t('postgres_sql_cli.executing_button', 'Executing...') : t('postgres_sql_cli.execute_button', 'Execute Query')}
            </Button>
            <Button variant="outline" onClick={handleClearQuery} disabled={isLoading}>
              <Eraser className={`mr-2 ${iconSize}`} />
              {t('postgres_sql_cli.clear_button', 'Clear')}
            </Button>
          </div>
          <div className="mt-4 border rounded-md p-4 bg-muted flex-1 min-h-[150px] overflow-auto">
            <h3 className="text-xs font-semibold mb-2 text-muted-foreground">{t('postgres_sql_cli.results_title', 'Results:')}</h3>
            {queryResult ? (
              <pre className="text-xs whitespace-pre-wrap">
                {JSON.stringify(queryResult, null, 2)}
              </pre>
            ) : (
              <p className="text-xs text-muted-foreground italic">{t('postgres_sql_cli.no_results_placeholder', 'Query results will appear here.')}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
