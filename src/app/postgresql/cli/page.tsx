// src/app/postgresql/cli/page.tsx
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from '@/components/ui/textarea';
import { TerminalSquare, Send, Loader2, AlertTriangle } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert'; // Import Alert components

export default function PostgreSQLCliPage() {
  const { t } = useLocale();
  const { toast } = useToast();
  const [sqlCommand, setSqlCommand] = React.useState('');
  const [result, setResult] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const iconSize = "h-3 w-3";

  const handleExecuteCommand = async () => {
    if (!sqlCommand.trim()) {
      toast({
        title: t('postgresql_page.cli_empty_command_title', 'Empty Command'),
        description: t('postgresql_page.cli_empty_command_desc', 'Please enter an SQL command to execute.'),
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setResult(null);
    setError(null);

    // Simulate API call / command execution
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Placeholder: In a real app, this would call a server action or API endpoint
    // to securely execute the SQL command against the database.
    // For now, we'll just simulate a successful execution or an error.
    if (sqlCommand.toLowerCase().includes('error')) {
      const errorMessage = t('postgresql_page.cli_simulated_error_desc', 'Simulated error executing command: Invalid syntax near "error".');
      setError(errorMessage);
      toast({
        title: t('postgresql_page.cli_execution_error_title', 'Execution Error'),
        description: errorMessage,
        variant: 'destructive',
      });
    } else {
      const successMessage = t('postgresql_page.cli_simulated_success_desc', 'Command executed successfully (Simulated).\nResult for: {command}').replace('{command}', sqlCommand);
      setResult(successMessage);
      toast({
        title: t('postgresql_page.cli_execution_success_title', 'Command Executed'),
        description: t('postgresql_page.cli_execution_success_toast_desc', 'SQL command processed.'),
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-base font-semibold">{t('sidebar.postgresql_cli', 'PostgreSQL CLI')}</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <TerminalSquare className={iconSize} />
            {t('postgresql_page.cli_title', 'SQL Command Line Interface')}
          </CardTitle>
          <CardDescription className="text-xs">
            {t('postgresql_page.cli_description', 'Execute SQL commands directly on the PostgreSQL database. Use with caution.')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder={t('postgresql_page.cli_placeholder', 'Enter SQL command here (e.g., SELECT * FROM pops;)')}
            value={sqlCommand}
            onChange={(e) => setSqlCommand(e.target.value)}
            rows={10}
            className="font-mono text-xs"
            disabled={isLoading}
          />
          <Button onClick={handleExecuteCommand} disabled={isLoading || !sqlCommand.trim()}>
            {isLoading ? (
              <Loader2 className={`mr-2 ${iconSize} animate-spin`} />
            ) : (
              <Send className={`mr-2 ${iconSize}`} />
            )}
            {isLoading ? t('postgresql_page.cli_executing_button', 'Executing...') : t('postgresql_page.cli_execute_button', 'Execute Command')}
          </Button>

          {result && (
            <div className="mt-4">
              <h3 className="text-xs font-semibold mb-1">{t('postgresql_page.cli_results_title', 'Results:')}</h3>
              <pre className="bg-muted p-3 rounded-md text-xs max-h-60 overflow-auto">{result}</pre>
            </div>
          )}
          {error && (
            <Alert variant="destructive" className="mt-4">
               <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-xs">{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
