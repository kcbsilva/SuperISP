// src/app/postgresql/databases/page.tsx
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
} from "@/components/ui/form";
import { Database, PlusCircle, Trash2, Edit, Loader2, RefreshCw } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createDatabase, getDatabases, type DatabaseInfo } from '@/services/postgresql/databases';
import { useQuery, QueryClient, QueryClientProvider, useMutation, type QueryKey } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

const addDatabaseSchema = z.object({
  dbName: z.string().min(1, "Database name is required.").regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/, "Invalid database name. Use letters, numbers, and underscores, starting with a letter or underscore."),
});

type AddDatabaseFormData = z.infer<typeof addDatabaseSchema>;

const queryClient = new QueryClient();

const databasesQueryKey: QueryKey = ['databases'];


function DatabasesPageComponent() {
  const { t } = useLocale();
  const { toast } = useToast();
  const [isAddDbDialogOpen, setIsAddDbDialogOpen] = React.useState(false);
  const iconSize = "h-3 w-3";

  const { data: databases = [], isLoading: isLoadingDatabases, error: databasesError, refetch: refetchDatabases } = useQuery<DatabaseInfo[], Error>({
    queryKey: databasesQueryKey,
    queryFn: getDatabases,
  });

  const addDbForm = useForm<AddDatabaseFormData>({
    resolver: zodResolver(addDatabaseSchema),
    defaultValues: {
      dbName: '',
    },
  });

  const addDatabaseMutation = useMutation<void, Error, string>({
    mutationFn: createDatabase,
    onSuccess: (_, dbName) => {
      queryClient.invalidateQueries({ queryKey: databasesQueryKey });
      toast({
        title: t('postgresql_page.add_db_success_toast_title', 'Database Created'),
        description: t('postgresql_page.add_db_success_toast_desc', 'Database "{dbName}" has been created.').replace('{dbName}', dbName),
      });
      addDbForm.reset();
      setIsAddDbDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: t('postgresql_page.add_db_error_toast_title', 'Error Creating Database'),
        description: error.message || t('postgresql_page.add_db_error_toast_desc', 'Could not create the database.'),
        variant: 'destructive',
      });
    },
  });


  const handleAddDatabaseSubmit = async (data: AddDatabaseFormData) => {
    addDatabaseMutation.mutate(data.dbName);
  };

  const handleEditAction = (dbName?: string) => {
    toast({
      title: `${t('postgresql_page.edit_action', 'Edit')} (Simulated)`,
      description: dbName ? `Action "${t('postgresql_page.edit_action', 'Edit')}" for database "${dbName}" is not yet implemented.` : `Action "${t('postgresql_page.edit_action', 'Edit')}" is not yet implemented.`,
    });
  };

  const handleDeleteAction = (dbName?: string) => {
     toast({
      title: `${t('postgresql_page.delete_action', 'Delete')} (Simulated)`,
      description: dbName ? `Action "${t('postgresql_page.delete_action', 'Delete')}" for database "${dbName}" is not yet implemented.` : `Action "${t('postgresql_page.delete_action', 'Delete')}" is not yet implemented.`,
      variant: 'destructive',
    });
  };

  const handleRefreshDatabases = () => {
    refetchDatabases();
    toast({
        title: t('postgresql_page.refreshing_databases_toast_title', 'Refreshing Databases...'),
        description: t('postgresql_page.refreshing_databases_toast_desc', 'Fetching the latest list of databases.'),
    });
  };


  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold">{t('postgresql_page.databases_title', 'Databases')}</h1>
        <div className="flex items-center gap-2">
            <Button 
                size="sm" 
                variant="outline" 
                onClick={handleRefreshDatabases}
                disabled={isLoadingDatabases || addDatabaseMutation.isPending}
            >
              <RefreshCw className={`mr-2 ${iconSize} ${isLoadingDatabases ? 'animate-spin' : ''}`} />
              {t('postgresql_page.refresh_databases_button', 'Refresh')}
            </Button>
            <Dialog open={isAddDbDialogOpen} onOpenChange={setIsAddDbDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" disabled={addDatabaseMutation.isPending || isLoadingDatabases}>
                  <PlusCircle className={`mr-2 ${iconSize}`} />
                  {t('postgresql_page.add_database_button', 'Add Database')}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-sm">{t('postgresql_page.add_database_dialog_title', 'Add New Database')}</DialogTitle>
                  <DialogDescriptionComponent className="text-xs">
                    {t('postgresql_page.add_database_dialog_description', 'Enter the name for the new PostgreSQL database.')}
                  </DialogDescriptionComponent>
                </DialogHeader>
                <Form {...addDbForm}>
                  <form onSubmit={addDbForm.handleSubmit(handleAddDatabaseSubmit)} className="grid gap-4 py-4">
                    <FormField
                      control={addDbForm.control}
                      name="dbName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('postgresql_page.form_db_name_label', 'Database Name')}</FormLabel>
                          <FormControl>
                            <Input placeholder={t('postgresql_page.form_db_name_placeholder', 'e.g., my_new_app_db')} {...field} disabled={addDatabaseMutation.isPending}/>
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
                        {addDatabaseMutation.isPending ? t('form_saving_button', 'Creating...') : t('postgresql_page.form_create_db_button', 'Create Database')}
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
            {t('postgresql_page.databases_list_title', 'Database List')}
          </CardTitle>
          <CardDescription className="text-xs">
            {t('postgresql_page.databases_list_description', 'View and manage your PostgreSQL databases.')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingDatabases ? (
            <div className="space-y-3">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : databasesError ? (
             <p className="text-center text-destructive py-4 text-xs">{t('postgresql_page.loading_databases_error', 'Error loading databases: {message}').replace('{message}', databasesError.message)}</p>
          ) : databases.length > 0 ? (
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
                  {databases.map((db) => (
                    <tr key={db.datname}>
                      <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-foreground">
                        {db.datname}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-muted-foreground">
                        {db.datdba_owner || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-muted-foreground">
                        {db.encoding_name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-muted-foreground">
                        {db.size_pretty || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium space-x-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditAction(db.datname)}>
                           <Edit className={iconSize} />
                           <span className="sr-only">{t('postgresql_page.edit_action', 'Edit')}</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDeleteAction(db.datname)}>
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

export default function DatabasesPageWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <DatabasesPageComponent />
    </QueryClientProvider>
  );
}
