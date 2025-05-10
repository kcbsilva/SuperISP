// src/app/settings/users/page.tsx
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger, // Ensure this is imported
} from "@/components/ui/alert-dialog"; 
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { PlusCircle, ListChecks, Edit, Trash2, Loader2 } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Schema for User Template
const userTemplateSchema = z.object({
  templateName: z.string().min(1, "Template name is required."),
  description: z.string().optional(),
  defaultRole: z.string().optional(), // Placeholder for now, could be more complex
});
type UserTemplateFormData = z.infer<typeof userTemplateSchema>;

interface UserTemplate extends UserTemplateFormData {
  id: string;
}

const placeholderUserTemplates: UserTemplate[] = [
  { id: 'tpl-admin', templateName: 'Administrator', description: 'Full system access', defaultRole: 'Admin' },
  { id: 'tpl-support', templateName: 'Support Agent', description: 'Access to tickets and subscriber management', defaultRole: 'Support' },
  { id: 'tpl-tech', templateName: 'Technician', description: 'Access to service calls and network tools', defaultRole: 'Technician' },
];


export default function UsersPage() {
  const { t } = useLocale();
  const { toast } = useToast();
  const [isUserTemplatesModalOpen, setIsUserTemplatesModalOpen] = React.useState(false);
  const [isAddTemplateModalOpen, setIsAddTemplateModalOpen] = React.useState(false);
  const [userTemplates, setUserTemplates] = React.useState<UserTemplate[]>(placeholderUserTemplates);

  const iconSize = "h-3 w-3";

  const addTemplateForm = useForm<UserTemplateFormData>({
    resolver: zodResolver(userTemplateSchema),
    defaultValues: {
      templateName: '',
      description: '',
      defaultRole: '',
    },
  });

  const handleAddUser = () => {
    toast({
      title: t('settings_users.add_user_toast_title', 'Add User (Not Implemented)'),
      description: t('settings_users.add_user_toast_desc', 'Functionality to add new users is not yet implemented.'),
    });
  };

  const handleAddTemplateSubmit = (data: UserTemplateFormData) => {
    const newTemplate: UserTemplate = {
      ...data,
      id: `tpl-${Date.now()}`,
    };
    setUserTemplates(prev => [newTemplate, ...prev]);
    toast({
      title: t('settings_users.add_template_success_title'),
      description: t('settings_users.add_template_success_desc', 'User template "{name}" added.').replace('{name}', data.templateName),
    });
    addTemplateForm.reset();
    setIsAddTemplateModalOpen(false);
  };

  const handleEditTemplate = (templateId: string) => {
    const template = userTemplates.find(t => t.id === templateId);
    toast({
      title: t('settings_users.edit_template_toast_title'),
      description: t('settings_users.edit_template_toast_desc', 'Editing template "{name}" is not yet implemented.').replace('{name}', template?.templateName || 'N/A'),
    });
  }

  const handleDeleteTemplate = (templateId: string) => {
     const template = userTemplates.find(t => t.id === templateId);
     setUserTemplates(prev => prev.filter(t => t.id !== templateId));
     toast({
       title: t('settings_users.delete_template_toast_title'),
       description: t('settings_users.delete_template_toast_desc', 'Template "{name}" deleted.').replace('{name}', template?.templateName || 'N/A'),
       variant: 'destructive',
     });
  }


  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold">{t('sidebar.settings_users', 'Users')}</h1>
        <div className="flex items-center gap-2">
          <Dialog open={isUserTemplatesModalOpen} onOpenChange={setIsUserTemplatesModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <ListChecks className={`mr-2 ${iconSize}`} /> {t('settings_users.user_templates_button', 'User Templates')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-sm">{t('settings_users.user_templates_modal_title', 'User Templates')}</DialogTitle>
                <DialogDescriptionComponent className="text-xs">{t('settings_users.user_templates_modal_desc', 'Manage predefined user templates.')}</DialogDescriptionComponent>
              </DialogHeader>
              <div className="mt-4">
                {userTemplates.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">{t('settings_users.template_table_name', 'Template Name')}</TableHead>
                        <TableHead className="text-xs">{t('settings_users.template_table_description', 'Description')}</TableHead>
                        <TableHead className="text-xs">{t('settings_users.template_table_role', 'Default Role')}</TableHead>
                        <TableHead className="text-right w-20 text-xs">{t('settings_users.template_table_actions', 'Actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userTemplates.map((template) => (
                        <TableRow key={template.id}>
                          <TableCell className="font-medium text-xs">{template.templateName}</TableCell>
                          <TableCell className="text-muted-foreground text-xs">{template.description || '-'}</TableCell>
                          <TableCell className="text-muted-foreground text-xs">{template.defaultRole || '-'}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditTemplate(template.id)}>
                              <Edit className={iconSize} />
                            </Button>
                             <AlertDialog>
                                <AlertDialogTrigger asChild>
                                     <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive">
                                      <Trash2 className={iconSize} />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                     <AlertDialogHeader>
                                        <AlertDialogTitle>{t('settings_users.delete_template_confirm_title')}</AlertDialogTitle>
                                        <AlertDialogDescription className="text-xs">
                                            {t('settings_users.delete_template_confirm_desc', 'Are you sure you want to delete the template "{name}"? This action cannot be undone.').replace('{name}', template.templateName)}
                                        </AlertDialogDescription>
                                     </AlertDialogHeader>
                                     <AlertDialogFooter>
                                        <AlertDialogCancel>{t('settings_users.form_cancel_button')}</AlertDialogCancel>
                                        <AlertDialogAction
                                            className={buttonVariants({ variant: "destructive" })}
                                            onClick={() => handleDeleteTemplate(template.id)}
                                        >
                                            {t('settings_users.form_delete_button')}
                                        </AlertDialogAction>
                                     </AlertDialogFooter>
                                </AlertDialogContent>
                             </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center text-muted-foreground py-4 text-xs">{t('settings_users.no_templates_found', 'No user templates found.')}</p>
                )}
              </div>
              <DialogFooter className="mt-4">
                <Dialog open={isAddTemplateModalOpen} onOpenChange={setIsAddTemplateModalOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <PlusCircle className={`mr-2 ${iconSize}`} /> {t('settings_users.add_new_template_button', 'Add New Template')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-sm">{t('settings_users.add_template_modal_title', 'Add New User Template')}</DialogTitle>
                    </DialogHeader>
                    <Form {...addTemplateForm}>
                      <form onSubmit={addTemplateForm.handleSubmit(handleAddTemplateSubmit)} className="grid gap-4 py-4">
                        <FormField
                          control={addTemplateForm.control}
                          name="templateName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('settings_users.template_form_name_label', 'Template Name')}</FormLabel>
                              <FormControl>
                                <Input placeholder={t('settings_users.template_form_name_placeholder', 'e.g., Sales Team')} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={addTemplateForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('settings_users.template_form_description_label', 'Description (Optional)')}</FormLabel>
                              <FormControl>
                                <Input placeholder={t('settings_users.template_form_description_placeholder', 'Brief description of the template')} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={addTemplateForm.control}
                          name="defaultRole"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('settings_users.template_form_role_label', 'Default Role (Optional)')}</FormLabel>
                              <FormControl>
                                <Input placeholder={t('settings_users.template_form_role_placeholder', 'e.g., Editor, Viewer')} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button type="button" variant="outline" disabled={addTemplateForm.formState.isSubmitting}>{t('settings_users.form_cancel_button', 'Cancel')}</Button>
                          </DialogClose>
                          <Button type="submit" disabled={addTemplateForm.formState.isSubmitting}>
                            {addTemplateForm.formState.isSubmitting && <Loader2 className={`mr-2 ${iconSize} animate-spin`} />}
                            {addTemplateForm.formState.isSubmitting ? t('settings_users.form_saving_button', 'Saving...') : t('settings_users.form_save_template_button', 'Save Template')}
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
                 <DialogClose asChild>
                    <Button variant="outline">{t('settings_users.close_button', 'Close')}</Button>
                 </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button onClick={handleAddUser} className="bg-green-600 hover:bg-green-700 text-white">
            <PlusCircle className={`mr-2 ${iconSize}`} /> {t('settings_users.add_user_button', 'Add User')}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{t('settings_users.manage_users_title', 'Manage Users')}</CardTitle>
          <CardDescription className="text-xs">{t('settings_users.manage_users_desc', 'View, add, and manage system users and their permissions.')}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-xs">
            {t('settings_users.no_users_placeholder', 'User management functionality is not yet implemented. This section will display a list of users and allow for role assignments and permission settings.')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
