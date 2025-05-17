// src/app/mysql/cli/page.tsx
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription, // Although removed from header, kept for completeness
  CardFooter,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Terminal, Play, Loader2, Ban } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { useToast } from '@/hooks/use-toast';
// Removed: import { executeMysqlQuery } from '@/services/mysql/execute-query'; // This is now handled by the API route
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from '@/components/ui/scroll-area';

interface QueryResultDisplay {
  rows?: any[];
  fields?: { name: string; type: number }[];
  rowCount?: number;
  command?: string; // You might want to include the command that was run
  error?: string;
  message?: string; // For general messages from the server
}

export default function MysqlCliPage() {
  const { t } = useLocale();
  const { toast } = useToast();
  const [sqlCommand, setSqlCommand] = React.useState('');
  const [result, setResult] = React.useState<QueryResultDisplay | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const iconSize = "h-2.5 w-2.5"; // Reduced icon size

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
    setResult(null);
    try {
      const response = await fetch('/api/mysql', { // Corrected API endpoint path
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sqlCommand }),
      });

      if (!response.ok) {
        // Handle non-OK responses (e.g., 400, 500 from the API)
        let errorData;
        try {
          errorData = await response.json(); // Attempt to parse JSON error body
        } catch (jsonError) {
          // If response is not JSON, use status text
          errorData = { error: `API Error: ${response.status} ${response.statusText}` };
        }
        setResult({ error: errorData.error || `API Error: ${response.status}` });
        toast({
          title: t('mysql_page.cli_execution_error_title'),
          description: errorData.error || `API Error: ${response.status}`,
          variant: 'destructive',
        });
      } else {
        // Handle successful response
        const queryResult = await response.json();
        setResult(queryResult); // Assuming API returns the result directly
        toast({
          title: t('mysql_page.cli_execution_success_title'),
          description: queryResult.rows && Array.isArray(queryResult.rows) && queryResult.rows.length > 0 // Added Array.isArray check
            ? `${queryResult.rows.length} row(s) returned.`
            : queryResult.rowCount !== undefined
            ? `${queryResult.rowCount} row(s) affected.`
            : queryResult.message || t('mysql_page.cli_execution_success_no_output_toast_desc') // Added message display
        });
      }
    } catch (e: any) {
      // Handle network errors or issues with initial response parsing
      setResult({ error: e.message || t('mysql_page.cli_unexpected_error_desc') });
      toast({
        title: t('mysql_page.cli_execution_error_title'),
        description: e.message || t('mysql_page.cli_unexpected_error_desc'),
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-base font-semibold">{t('mysql_page.cli_title')}</h1>

      <Card>
        <CardHeader>
          {/* CardTitle and CardDescription removed as per earlier request to simplify headers */}
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder={t('mysql_page.cli_placeholder')}
            value={sqlCommand}
            onChange={(e) => setSqlCommand(e.target.value)}
            className="font-mono text-xs h-40"
            disabled={isLoading}
          />
        </CardContent>
        <CardFooter>
          <Button onClick={handleExecuteCommand} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className={`mr-2 ${iconSize} animate-spin`} />
            ) : (
              <Play className={`mr-2 ${iconSize}`} />
            )}
            {isLoading ? t('mysql_page.cli_executing_button') : t('mysql_page.cli_execute_button')}
          </Button>
        </CardFooter>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">{t('mysql_page.cli_results_title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-72 w-full rounded-md border p-3 bg-muted/50">
              {result.error && (
                <div className="text-destructive text-xs font-mono whitespace-pre-wrap">
                  <Ban className={`inline-block mr-2 ${iconSize} mb-0.5`} />Error: {result.error}
                </div>
              )}
              {result.message && ( // Display general messages from the server
                <div className="text-xs font-mono whitespace-pre-wrap text-green-600">
                  <Terminal className={`inline-block mr-2 ${iconSize} mb-0.5`} />{result.message}
                </div>
              )}
              {result.rows && Array.isArray(result.rows) && result.rows.length > 0 && result.fields && ( // Added Array.isArray check
                <Table className="text-xs">
                  <TableHeader>
                    <TableRow>
                      {result.fields.map((field) => (
                        <TableHead key={field.name} className="font-mono text-xs">{field.name}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.rows.map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {result.fields!.map((field) => (
                          <TableCell key={`${rowIndex}-${field.name}`} className="font-mono text-xs">
                            {typeof row[field.name] === 'object' ? JSON.stringify(row[field.name]) : row[field.name]?.toString() ?? 'NULL'}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              {result.rows && Array.isArray(result.rows) && result.rows.length === 0 && !result.error && !result.message && ( // Added Array.isArray check and message check
                <p className="text-muted-foreground text-xs font-mono">
                  {t('mysql_page.cli_command_success_no_rows', {command: result.command || 'Command'})}
                </p>
              )}
               {result.rowCount !== undefined && (!result.rows || !Array.isArray(result.rows) || result.rows.length === 0) && !result.error && !result.message && ( // Added Array.isArray check and message check
                 <p className="text-muted-foreground text-xs font-mono">
                   {result.rowCount} row(s) affected.
                 </p>
               )}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
