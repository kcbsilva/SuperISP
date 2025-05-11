// src/app/mysql/cli/page.tsx
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TerminalSquare, Play, Loader2, AlertCircle } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { useToast } from '@/hooks/use-toast';
import { executeMysqlQuery } from '@/services/mysql/execute-query'; // Updated import

interface QueryResult {
  rows?: any[];
  fields?: any[];
  rowCount?: number;
  command?: string;
  error?: string;
}

export default function MysqlCliPage() {
  const { t } = useLocale();
  const { toast } = useToast();
  const [sqlCommand, setSqlCommand] = React.useState('');
  const [queryResult, setQueryResult] = React.useState<QueryResult | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const iconSize = "h-3 w-3";

  const handleExecuteCommand = async () => {
    if (!sqlCommand.trim()) {
      toast({
        title: t('mysql_page.cli_empty_command_title'),
        description: t('mysql_page.cli_empty_command_desc'),
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setQueryResult(null);

    try {
      const result = await executeMysqlQuery(sqlCommand);
      setQueryResult(result);
      if (result.error) {
        toast({
          title: t('mysql_page.cli_execution_error_title'),
          description: result.error,
          variant: 'destructive',
        });
      } else {
         toast({
           title: t('mysql_page.cli_execution_success_title'),
           description: result.rows && result.rows.length > 0
             ? t('mysql_page.cli_execution_success_toast_desc')
             : t('mysql_page.cli_execution_success_no_output_toast_desc'),
         });
      }
    } catch (error: any) {
      console.error("Error executing MySQL command:", error);
      setQueryResult({ error: error.message || t('mysql_page.cli_unexpected_error_desc') });
      toast({
        title: t('mysql_page.cli_execution_error_title'),
        description: error.message || t('mysql_page.cli_unexpected_error_desc'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-base font-semibold">{t('sidebar.mysql_cli', 'MySQL CLI')}</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <TerminalSquare className={iconSize} />
            {t('mysql_page.cli_title', 'SQL Command Line Interface')}
          </CardTitle>
          <CardDescription className="text-xs">
            {t('mysql_page.cli_description', 'Execute SQL commands directly on the MySQL database. Use with caution.')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Textarea
              placeholder={t('mysql_page.cli_placeholder', 'Enter SQL command here (e.g., SELECT * FROM pops;)')}
              value={sqlCommand}
              onChange={(e) => setSqlCommand(e.target.value)}
              className="font-mono text-xs h-32"
              disabled={isLoading}
            />
          </div>
          {queryResult && (
            <div>
              <h3 className="text-xs font-semibold mb-2">{t('mysql_page.cli_results_title', 'Results:')}</h3>
              <div className="bg-muted rounded-md p-3 max-h-60 overflow-auto">
                {queryResult.error ? (
                  <pre className="text-xs text-destructive whitespace-pre-wrap">{queryResult.error}</pre>
                ) : (
                  <pre className="text-xs whitespace-pre-wrap">
                    {queryResult.rows && queryResult.rows.length > 0
                      ? JSON.stringify(queryResult.rows, null, 2)
                      : t('mysql_page.cli_command_success_no_rows', 'Command "{command}" executed successfully. No rows returned.').replace('{command}', queryResult.command || 'SQL')}
                  </pre>
                )}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleExecuteCommand} disabled={isLoading || !sqlCommand.trim()} className="w-full sm:w-auto">
            {isLoading ? (
              <Loader2 className={`mr-2 ${iconSize} animate-spin`} />
            ) : (
              <Play className={`mr-2 ${iconSize}`} />
            )}
            {isLoading ? t('mysql_page.cli_executing_button') : t('mysql_page.cli_execute_button')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
