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
  AlertDialogTrigger,
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
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle, ListChecks, Edit, Trash2, Loader2, ShieldCheck } from 'lucide-react';
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
  permissions: z.array(z.string()).optional().default([]), // Added permissions
});
type UserTemplateFormData = z.infer<typeof userTemplateSchema>;

interface UserTemplate extends UserTemplateFormData {
  id: string;
  permissions: string[]; // Ensure permissions is always an array
}

const placeholderUserTemplates: UserTemplate[] = [
  { id: 'tpl-admin', templateName: 'Administrator', description: 'Full system access', defaultRole: 'Admin', permissions: ['subscribers_view', 'subscribers_add', 'subscribers_edit', 'subscribers_delete', 'network_view_olts', 'network_manage_olts', 'finances_view_reports', 'settings_manage_global', 'pops_view', 'pops_add', 'pops_edit', 'pops_delete'] },
  { id: 'tpl-support', templateName: 'Support Agent', description: 'Access to tickets and subscriber management', defaultRole: 'Support', permissions: ['subscribers_view', 'subscribers_edit'] },
  { id: 'tpl-tech', templateName: 'Technician', description: 'Access to service calls and network tools', defaultRole: 'Technician', permissions: ['network_view_olts'] },
];

const allPermissions = [
  { id: 'subscribers_view', labelKey: 'settings_users.permission_subscribers_view', group: 'Subscribers' },
  { id: 'subscribers_add', labelKey: 'settings_users.permission_subscribers_add', group: 'Subscribers' },
  { id: 'subscribers_edit', labelKey: 'settings_users.permission_subscribers_edit', group: 'Subscribers' },
  { id: 'subscribers_delete', labelKey: 'settings_users.permission_subscribers_delete', group: 'Subscribers' },
  { id: 'network_view_olts', labelKey: 'settings_users.permission_network_view_olts', group: 'Network' },
  { id: 'network_manage_olts', labelKey: 'settings_users.permission_network_manage_olts', group: 'Network' },
  { id: 'finances_view_reports', labelKey: 'settings_users.permission_finances_view_reports', group: 'Finances' },
  { id: 'settings_manage_global', labelKey: 'settings_users.permission_settings_manage_global', group: 'Settings' },
  { id: 'pops_view', labelKey: 'settings_users.permission_pops_view', group: 'PoPs' },
  { id: 'pops_add', labelKey: 'settings_users.permission_pops_add', group: 'PoPs' },
  { id: 'pops_edit', labelKey: 'settings_users.permission_pops_edit', group: 'PoPs' },
  { id: 'pops_delete', labelKey: 'settings_users.permission_pops_delete', group: 'PoPs' },
];

const permissionGroups = Array.from(new Set(allPermissions.map(p => p.group)));


export default function UsersPage() {
  const { t } = useLocale();
  const { toast } = useToast();
  const [isUserTemplatesModalOpen, setIsUserTemplatesModalOpen] = React.useState(false);
  const [isAddTemplateModalOpen, setIsAddTemplateModalOpen] = React.useState(false);
  const [editingTemplate, setEditingTemplate] = React.useState<UserTemplate | null>(null);
  const [userTemplates, setUserTemplates] = React.useState<UserTemplate[]>(placeholderUserTemplates);

  const iconSize = "h-3 w-3";

  const templateForm = useForm<UserTemplateFormData>({ 
    resolver: zodResolver(userTemplateSchema),
    defaultValues: {
      templateName: '',
      description: '',
      defaultRole: '',
      permissions: [],
    },
  });

  React.useEffect(() => {
    if (isAddTemplateModalOpen && editingTemplate) {
      templateForm.reset({
        templateName: editingTemplate.templateName,
        description: editingTemplate.description || '',
        defaultRole: editingTemplate.defaultRole || '',
        permissions: editingTemplate.permissions || [],
      });
    } else if (isAddTemplateModalOpen && !editingTemplate) {
      templateForm.reset({
        templateName: '',
        description: '',
        defaultRole: '',
        permissions: [],
      });
    }
  }, [isAddTemplateModalOpen, editingTemplate, templateForm]);


  const handleAddUser = () => {
    toast({
      title: t('settings_users.add_user_toast_title', 'Add User (Not Implemented)'),
      description: t('settings_users.add_user_toast_desc', 'Functionality to add new users is not yet implemented.'),
    });
  };

  const handleTemplateSubmit = (data: UserTemplateFormData) => {
    if (editingTemplate) {
        setUserTemplates(prev => prev.map(tpl => tpl.id === editingTemplate.id ? { ...tpl, ...data, permissions: data.permissions || [] } : tpl));
        toast({
            title: t('settings_users.update_template_success_title', 'Template Updated'),
            description: t('settings_users.update_template_success_desc', 'User template "{name}" updated.').replace('{name}', data.templateName),
        });
    } else {
        const newTemplate: UserTemplate = {
            ...data,
            id: `tpl-${Date.now()}`,
            permissions: data.permissions || [],
        };
        setUserTemplates(prev => [newTemplate, ...prev]);
        toast({
            title: t('settings_users.add_template_success_title'),
            description: t('settings_users.add_template_success_desc', 'User template "{name}" added.').replace('{name}', data.templateName),
        });
    }
    templateForm.reset();
    setEditingTemplate(null);
    setIsAddTemplateModalOpen(false);
  };

  const handleEditTemplate = (template: UserTemplate) => {
    setEditingTemplate(template);
    setIsAddTemplateModalOpen(true); 
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
      <h1 className="text-base font-semibold">{t('sidebar.settings_users', 'Users')}</h1>
      <div className="flex flex-col gap-6">
          <div className="flex justify-end items-center gap-2">
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
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditTemplate(template)}>
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
                  <Button size="sm" onClick={() => { setEditingTemplate(null); setIsAddTemplateModalOpen(true); setIsUserTemplatesModalOpen(false); }}>
                    <PlusCircle className={`mr-2 ${iconSize}`} /> {t('settings_users.add_new_template_button', 'Add New Template')}
                  </Button>
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

       {/* Add/Edit Template Dialog */}
        <Dialog open={isAddTemplateModalOpen} onOpenChange={(isOpen) => {
            setIsAddTemplateModalOpen(isOpen);
            if (!isOpen) setEditingTemplate(null); 
        }}>
            <DialogContent className="sm:max-w-2xl"> 
                <DialogHeader>
                    <DialogTitle className="text-sm">{editingTemplate ? t('settings_users.edit_template_modal_title', 'Edit User Template') : t('settings_users.add_template_modal_title', 'Add New User Template')}</DialogTitle>
                     <DialogDescriptionComponent className="text-xs">
                        {editingTemplate ? t('settings_users.edit_template_modal_desc', 'Update the details and permissions for this template.') : t('settings_users.add_template_modal_desc_permissions', 'Define the template details and assign permissions.')}
                    </DialogDescriptionComponent>
                </DialogHeader>
                <Form {...templateForm}>
                    <form onSubmit={templateForm.handleSubmit(handleTemplateSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
                        <div className="md:col-span-1 space-y-4">
                            <FormField
                                control={templateForm.control}
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
                                control={templateForm.control}
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
                                control={templateForm.control}
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
                        </div>

                        <div className="md:col-span-2">
                             <FormLabel className="text-xs font-medium mb-2 block flex items-center gap-2">
                                <ShieldCheck className={`${iconSize} text-primary`} />
                                {t('settings_users.permissions_title', 'Permissions')}
                            </FormLabel>
                            <ScrollArea className="h-[300px] border rounded-md p-3 pr-1">
                                {permissionGroups.map(group => (
                                    <div key={group} className="mb-3">
                                        <h3 className="text-xs font-semibold mb-1.5 text-muted-foreground">{t(`settings_users.permission_group_${group.toLowerCase().replace(/\s+/g, '_')}` as any, group)}</h3>
                                        <div className="space-y-1.5 pl-2">
                                            {allPermissions.filter(p => p.group === group).map(permission => (
                                                <FormField
                                                    key={permission.id}
                                                    control={templateForm.control}
                                                    name="permissions"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                                            <FormControl>
                                                                <Checkbox
                                                                    checked={field.value?.includes(permission.id)}
                                                                    onCheckedChange={(checked) => {
                                                                        return checked
                                                                            ? field.onChange([...(field.value || []), permission.id])
                                                                            : field.onChange(
                                                                                (field.value || []).filter(
                                                                                    (value) => value !== permission.id
                                                                                )
                                                                            );
                                                                    }}
                                                                />
                                                            </FormControl>
                                                            <FormLabel className="text-xs font-normal">
                                                                {t(permission.labelKey, permission.labelKey.split('.').pop()?.replace(/_/g, ' ') || permission.id)}
                                                            </FormLabel>
                                                        </FormItem>
                                                    )}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </ScrollArea>
                            <FormMessage>{templateForm.formState.errors.permissions?.message}</FormMessage>
                        </div>
                        
                        <DialogFooter className="md:col-span-3">
                            <DialogClose asChild>
                                <Button type="button" variant="outline" disabled={templateForm.formState.isSubmitting}>{t('settings_users.form_cancel_button', 'Cancel')}</Button>
                            </DialogClose>
                            <Button type="submit" disabled={templateForm.formState.isSubmitting}>
                                {templateForm.formState.isSubmitting && <Loader2 className={`mr-2 ${iconSize} animate-spin`} />}
                                {templateForm.formState.isSubmitting ? t('settings_users.form_saving_button', 'Saving...') : (editingTemplate ? t('settings_users.form_update_template_button', 'Update Template') : t('settings_users.form_save_template_button', 'Save Template'))}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    </div>
  );
}