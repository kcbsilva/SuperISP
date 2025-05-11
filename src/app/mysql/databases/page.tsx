// src/app/mysql/databases/page.tsx
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription as DialogDescriptionComponent,
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
} from '@/components/ui/form';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PlusCircle, RefreshCw, Loader2, Trash2, Database } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { listMysqlDatabases, createMysqlDatabase } from '@/services/mysql/list-databases';
import { Skeleton } from '@/components/ui/skeleton';

const addDatabaseSchema = z.object({
  dbName: z.string().min(1, 'Database name is required.').regex(/^[a-zA-Z0-9_]+$/, 'Only alphanumeric characters and underscores are allowed.'),
});
type AddDatabaseFormData = z.infer<typeof addDatabaseSchema>;

const queryClient = new QueryClient();

export default function MysqlDatabasesPageWrapper() {
    return (
        <QueryClientProvider client={queryClient}>
            <MysqlDatabasesPage />
        </QueryClientProvider>
    );
}

function MysqlDatabasesPage() {
  const { t } = useLocale();
  const { toast } = useToast();
  const queryClientReact = useQueryClient();
  const [isAddDbDialogOpen, setIsAddDbDialogOpen] = React.useState(false);
  const iconSize = "h-3 w-3";

  const { data: databases = [], isLoading: isLoadingDatabases, error: databasesError, refetch: refetchDatabases } = useQuery<string[], Error>({
    queryKey: ['mysqlDatabases'],
    queryFn: listMysqlDatabases,
  });

  const addDatabaseMutation = useMutation({
    mutationFn: createMysqlDatabase,
    onSuccess: (_, dbName) => {
      queryClientReact.invalidateQueries({ queryKey: ['mysqlDatabases'] });
      toast({
        title: t('mysql_page.add_db_success_toast_title'),
        description: t('mysql_page.add_db_success_toast_desc', 'Database "{dbName}" has been created.').replace('{dbName}', dbName),
      });
      addDbForm.reset();
      setIsAddDbDialogOpen(false);
    },
    onError: (error: any, dbName) => {
      toast({
        title: t('mysql_page.add_db_error_toast_title'),
        description: error.message || t('mysql_page.add_db_error_toast_desc'),
        variant: 'destructive',
      });
    },
  });

  const addDbForm = useForm<AddDatabaseFormData>({
    resolver: zodResolver(addDatabaseSchema),
    defaultValues: {
      dbName: '',
    },
  });

  const handleAddDatabaseSubmit = (data: AddDatabaseFormData) => {
    addDatabaseMutation.mutate(data.dbName);
  };

  const handleRefreshDatabases = () => {
    refetchDatabases();
    toast({
      title: t('mysql_page.refreshing_databases_toast_title'),
      description: t('mysql_page.refreshing_databases_toast_desc'),
    });
  };

  const handleDeleteDatabase = (dbName: string) => {
    // Placeholder for actual delete functionality
    toast({
        title: 'Delete Database (Not Implemented)',
        description: `Deleting database "${dbName}" is not yet implemented.`,
        variant: 'destructive'
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold">{t('mysql_page.databases_list_title')}</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="default"
            onClick={handleRefreshDatabases}
            disabled={isLoadingDatabases || addDatabaseMutation.isPending}
            className="bg-primary hover:bg-primary/90"
          >
            {isLoadingDatabases ? <Loader2 className={`mr-2 ${iconSize} animate-spin`} /> : <RefreshCw className={`mr-2 ${iconSize}`} />}
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
                <DialogDescriptionComponent className="text-xs">{t('mysql_page.add_database_dialog_description')}</DialogDescriptionComponent>
              </DialogHeader>
              <Form {...addDbForm}>
                <form onSubmit={addDbForm.handleSubmit(handleAddDatabaseSubmit)} className="grid gap-4 py-4">
                  <FormField
                    control={addDbForm.control}
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
                      <Button type="button" variant="outline" disabled={addDatabaseMutation.isPending}>{t('form_cancel_button', 'Cancel')}</Button>
                    </DialogClose>
                    <Button type="submit" disabled={addDatabaseMutation.isPending}>
                      {addDatabaseMutation.isPending && <Loader2 className={`mr-2 ${iconSize} animate-spin`} />}
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
           {/* Removed title and description from here as per previous request to simplify */}
        </CardHeader>
        <CardContent className="pt-0">
          {isLoadingDatabases ? (
            <div className="space-y-3">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : databasesError ? (
            <div className="text-center text-destructive py-4 text-xs">
              {t('mysql_page.loading_databases_error', { message: databasesError.message })}
            </div>
          ) : databases.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12 text-xs"><Database className={iconSize} /></TableHead>
                    <TableHead className="text-xs">{t('mysql_page.db_header_name')}</TableHead>
                    {/* Add other headers if needed, e.g., Owner, Encoding, Size */}
                    <TableHead className="text-right w-28 text-xs">{t('mysql_page.db_header_actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {databases.map((dbName) => (
                    <TableRow key={dbName}>
                      <TableCell><Database className={`${iconSize} text-muted-foreground`} /></TableCell>
                      <TableCell className="font-medium text-xs">{dbName}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => {/* TODO: Implement edit */}}>
                            <Trash2 className={`${iconSize} text-destructive`} />
                            <span className="sr-only">{t('mysql_page.delete_action')}</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4 text-xs">{t('mysql_page.no_databases_found')}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
