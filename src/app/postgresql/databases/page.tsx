// src/app/mysql/databases/page.tsx
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Database, PlusCircle, RefreshCw, Loader2, AlertCircle, Edit, Trash2 } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { listMysqlDatabases, createMysqlDatabase } from '@/services/mysql/list-databases'; // Updated import

interface MysqlDatabase {
  name: string;
  // Add other relevant fields if your service returns them, e.g.,
  // owner?: string;
  // encoding?: string;
  // size?: string;
}

const dbNameSchema = z.object({
  dbName: z.string().min(1, "Database name is required.").regex(/^[a-zA-Z0-9_]+$/, "Database name can only contain letters, numbers, and underscores."),
});
type DbNameFormData = z.infer<typeof dbNameSchema>;

export default function MysqlDatabasesPage() {
  const { t } = useLocale();
  const { toast } = useToast();
  const [databases, setDatabases] = React.useState<MysqlDatabase[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isAddDbDialogOpen, setIsAddDbDialogOpen] = React.useState(false);
  const iconSize = "h-3 w-3";

  const form = useForm<DbNameFormData>({
    resolver: zodResolver(dbNameSchema),
    defaultValues: { dbName: '' },
  });

  const fetchDatabases = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const dbs = await listMysqlDatabases();
      setDatabases(dbs.map(dbName => ({ name: dbName }))); // Adapt if your service returns more fields
    } catch (err: any) {
      console.error("Error fetching MySQL databases:", err);
      setError(t('mysql_page.loading_databases_error', { message: err.message || 'Unknown error' }));
      toast({
        title: t('mysql_page.loading_databases_error', { message: err.message || 'Unknown error' }),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [t, toast]);

  React.useEffect(() => {
    fetchDatabases();
  }, [fetchDatabases]);

  const handleRefresh = () => {
    toast({
      title: t('mysql_page.refreshing_databases_toast_title'),
      description: t('mysql_page.refreshing_databases_toast_desc'),
    });
    fetchDatabases();
  };

  const handleAddDatabaseSubmit = async (data: DbNameFormData) => {
    try {
      await createMysqlDatabase(data.dbName);
      toast({
        title: t('mysql_page.add_db_success_toast_title'),
        description: t('mysql_page.add_db_success_toast_desc', { dbName: data.dbName }),
      });
      form.reset();
      setIsAddDbDialogOpen(false);
      fetchDatabases(); // Refresh list
    } catch (error: any) {
      toast({
        title: t('mysql_page.add_db_error_toast_title'),
        description: error.message || t('mysql_page.add_db_error_toast_desc'),
        variant: 'destructive',
      });
    }
  };

  const handleAction = (action: string, dbName?: string) => {
    toast({
      title: `${action} (Simulated)`,
      description: dbName ? `Action "${action}" for database "${dbName}" is not yet implemented.` : `Action "${action}" is not yet implemented.`,
    });
  };


  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold">{t('mysql_page.databases_title', 'Databases')}</h1>
        <div className="flex items-center gap-2">
          <Button onClick={handleRefresh} disabled={isLoading}>
            {isLoading ? <Loader2 className={`mr-2 ${iconSize} animate-spin`} /> : <RefreshCw className={`mr-2 ${iconSize}`} />}
            {t('mysql_page.refresh_databases_button')}
          </Button>
          <Dialog open={isAddDbDialogOpen} onOpenChange={setIsAddDbDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <PlusCircle className={`mr-2 ${iconSize}`} /> {t('mysql_page.add_database_button')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-sm">{t('mysql_page.add_database_dialog_title')}</DialogTitle>
                <DialogDescription className="text-xs">{t('mysql_page.add_database_dialog_description')}</DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAddDatabaseSubmit)} className="space-y-4 py-4">
                  <FormField
                    control={form.control}
                    name="dbName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('mysql_page.form_db_name_label')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('mysql_page.form_db_name_placeholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="outline" disabled={form.formState.isSubmitting}>{t('form_cancel_button')}</Button>
                    </DialogClose>
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                      {form.formState.isSubmitting && <Loader2 className={`mr-2 ${iconSize} animate-spin`} />}
                      {t('mysql_page.form_create_db_button')}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Database className={iconSize} />
            {t('mysql_page.databases_list_title', 'Database List')}
          </CardTitle>
          <CardDescription className="text-xs">
            {t('mysql_page.databases_list_description', 'View and manage your MySQL databases.')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}
          {error && !isLoading && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertCircle className="h-10 w-10 text-destructive mb-2" />
              <p className="text-sm text-destructive font-medium">{t('mysql_page.loading_databases_error', { message: ''}).split(':')[0]}</p>
              <p className="text-xs text-muted-foreground">{error}</p>
            </div>
          )}
          {!isLoading && !error && databases.length === 0 && (
            <p className="text-center text-muted-foreground py-8 text-xs">
              {t('mysql_page.no_databases_found', 'No databases found or unable to connect. Please check your .env file and ensure the database server is accessible.')}
            </p>
          )}
          {!isLoading && !error && databases.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">{t('mysql_page.db_header_name')}</TableHead>
                    {/* Add other headers if your service provides more data */}
                    {/* <TableHead className="text-xs">{t('mysql_page.db_header_owner')}</TableHead> */}
                    {/* <TableHead className="text-xs">{t('mysql_page.db_header_encoding')}</TableHead> */}
                    {/* <TableHead className="text-xs">{t('mysql_page.db_header_size')}</TableHead> */}
                    <TableHead className="text-right text-xs w-28">{t('mysql_page.db_header_actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {databases.map((db) => (
                    <TableRow key={db.name}>
                      <TableCell className="font-medium text-xs">{db.name}</TableCell>
                      {/* Add other cells if your service provides more data */}
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleAction(t('mysql_page.edit_action'), db.name)}>
                           <Edit className={iconSize} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleAction(t('mysql_page.delete_action'), db.name)}>
                           <Trash2 className={iconSize} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle className="text-sm">{t('mysql_page.backup_restore_title')}</CardTitle>
          <CardDescription className="text-xs">{t('mysql_page.backup_restore_description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-xs">{t('mysql_page.backup_restore_info')}</p>
        </CardContent>
        <CardFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => handleAction(t('mysql_page.create_backup_button'))}>{t('mysql_page.create_backup_button')}</Button>
            <Button variant="outline" size="sm" onClick={() => handleAction(t('mysql_page.restore_backup_button'))}>{t('mysql_page.restore_backup_button')}</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
