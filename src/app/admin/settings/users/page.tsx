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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle, ListChecks, Edit, Trash2, Loader2, ShieldCheck, Users as UsersIcon } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/services/supabase/db'; // Import supabase client for auth
import {
  getRoles,
  getPermissions,
  getUserTemplates,
  addUserTemplate,
  updateUserTemplate,
  deleteUserTemplate,
  getUserProfiles,
  updateUserProfile, // Import updateUserProfile
} from '@/services/supabase/users';
import type { Role, Permission, UserTemplate, UserTemplateData, UserProfile } from '@/types/users';

// Schema for User Template Form
const userTemplateFormSchema = z.object({
  template_name: z.string().min(1, "Template name is required."),
  description: z.string().optional(),
  default_role_id: z.string().uuid("Invalid role ID.").nullable().optional(),
  permission_ids: z.array(z.string().uuid()).optional().default([]),
});
type UserTemplateFormValues = z.infer<typeof userTemplateFormSchema>;

// Schema for Add User Form
const addUserFormSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  fullName: z.string().min(1, "Full name is required."),
  roleId: z.string().uuid("Invalid role ID.").nullable().optional(),
});
type AddUserFormValues = z.infer<typeof addUserFormSchema>;


const STATIC_ALL_PERMISSIONS: Permission[] = [
  { id: 'perm_sub_view', slug: 'subscribers.view', group_name: 'Subscribers', created_at: new Date().toISOString(), description: 'Can view subscriber information' },
  { id: 'perm_sub_add', slug: 'subscribers.add', group_name: 'Subscribers', created_at: new Date().toISOString(), description: 'Can add new subscribers' },
  { id: 'perm_sub_edit', slug: 'subscribers.edit', group_name: 'Subscribers', created_at: new Date().toISOString(), description: 'Can edit existing subscribers' },
  { id: 'perm_sub_delete', slug: 'subscribers.delete', group_name: 'Subscribers', created_at: new Date().toISOString(), description: 'Can delete subscribers' },
  { id: 'perm_net_view_olts', slug: 'network.view_olts', group_name: 'Network', created_at: new Date().toISOString(), description: 'Can view OLTs and network status' },
  { id: 'perm_net_manage_olts', slug: 'network.manage_olts', group_name: 'Network', created_at: new Date().toISOString(), description: 'Can manage OLTs (add, edit, delete)' },
  { id: 'perm_fin_view_reports', slug: 'finances.view_reports', group_name: 'Finances', created_at: new Date().toISOString(), description: 'Can view financial reports' },
  { id: 'perm_set_manage_global', slug: 'settings.manage_global', group_name: 'Settings', created_at: new Date().toISOString(), description: 'Can manage global system settings' },
  { id: 'perm_pops_view', slug: 'pops.view', group_name: 'PoPs', created_at: new Date().toISOString(), description: 'Can view Points of Presence' },
  { id: 'perm_pops_add', slug: 'pops.add', group_name: 'PoPs', created_at: new Date().toISOString(), description: 'Can add new PoPs' },
  { id: 'perm_pops_edit', slug: 'pops.edit', group_name: 'PoPs', created_at: new Date().toISOString(), description: 'Can edit PoPs' },
  { id: 'perm_pops_delete', slug: 'pops.delete', group_name: 'PoPs', created_at: new Date().toISOString(), description: 'Can delete PoPs' },
];


export default function UsersPage() {
  const { t } = useLocale();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isUserTemplatesModalOpen, setIsUserTemplatesModalOpen] = React.useState(false);
  const [isAddTemplateModalOpen, setIsAddTemplateModalOpen] = React.useState(false);
  const [editingTemplate, setEditingTemplate] = React.useState<UserTemplate | null>(null);
  const [templateToDelete, setTemplateToDelete] = React.useState<UserTemplate | null>(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = React.useState(false);

  const iconSize = "h-3 w-3";

  const { data: roles = [], isLoading: isLoadingRoles, error: rolesError } = useQuery<Role[], Error>({
    queryKey: ['roles'],
    queryFn: getRoles,
  });

  const { data: allPermissions = [], isLoading: isLoadingPermissions, error: permissionsError } = useQuery<Permission[], Error>({
    queryKey: ['permissions'],
    queryFn: getPermissions,
    initialData: STATIC_ALL_PERMISSIONS,
  });

  const { data: userTemplates = [], isLoading: isLoadingTemplates, error: templatesError } = useQuery<UserTemplate[], Error>({
    queryKey: ['userTemplates'],
    queryFn: getUserTemplates,
  });

  const { data: userProfiles = [], isLoading: isLoadingUserProfiles, error: userProfilesError, refetch: refetchUserProfiles } = useQuery<UserProfile[], Error>({
    queryKey: ['userProfiles'],
    queryFn: getUserProfiles,
  });

  const permissionGroups = React.useMemo(() => 
    Array.from(new Set(allPermissions.map(p => p.group_name || 'Other'))).sort(), 
  [allPermissions]);

  const templateForm = useForm<UserTemplateFormValues>({
    resolver: zodResolver(userTemplateFormSchema),
    defaultValues: {
      template_name: '',
      description: '',
      default_role_id: null,
      permission_ids: [],
    },
  });

  const addUserForm = useForm<AddUserFormValues>({
    resolver: zodResolver(addUserFormSchema),
    defaultValues: {
        email: '',
        password: '',
        fullName: '',
        roleId: null,
    },
  });

  React.useEffect(() => {
    if (isAddTemplateModalOpen && editingTemplate) {
      templateForm.reset({
        template_name: editingTemplate.template_name,
        description: editingTemplate.description || '',
        default_role_id: editingTemplate.default_role_id || null,
        permission_ids: editingTemplate.permissions || [],
      });
    } else if (isAddTemplateModalOpen && !editingTemplate) {
      templateForm.reset({
        template_name: '',
        description: '',
        default_role_id: null,
        permission_ids: [],
      });
    }
  }, [isAddTemplateModalOpen, editingTemplate, templateForm]);

  const addTemplateMutation = useMutation({
    mutationFn: addUserTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userTemplates'] });
      toast({ title: t('settings_users.add_template_success_title'), description: t('settings_users.add_template_success_desc', 'User template "{name}" added.').replace('{name}', templateForm.getValues('template_name'))});
      setIsAddTemplateModalOpen(false);
      setEditingTemplate(null);
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateTemplateMutation = useMutation({
    mutationFn: (data: { templateId: string; templateData: UserTemplateData }) => updateUserTemplate(data.templateId, data.templateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userTemplates'] });
      toast({ title: t('settings_users.update_template_success_title'), description: t('settings_users.update_template_success_desc', 'User template "{name}" updated.').replace('{name}', templateForm.getValues('template_name'))});
      setIsAddTemplateModalOpen(false);
      setEditingTemplate(null);
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: deleteUserTemplate,
    onSuccess: (_, templateId) => {
      queryClient.invalidateQueries({ queryKey: ['userTemplates'] });
      toast({ title: t('settings_users.delete_template_toast_title'), description: `Template deleted.` , variant: 'destructive' });
      setTemplateToDelete(null);
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      setTemplateToDelete(null);
    },
  });

  const addUserMutation = useMutation({
    mutationFn: async (userData: AddUserFormValues) => {
      const { email, password, fullName, roleId } = userData;
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { // This data gets into auth.users.raw_user_meta_data
            full_name: fullName, 
          },
        },
      });

      if (signUpError) throw signUpError;
      if (!signUpData.user) throw new Error("User not created in auth.");

      // The trigger handle_new_user should create the profile.
      // We then update it with roleId and ensure full_name is set if the trigger didn't catch it.
      // A small delay might be needed for the trigger to fire and profile to be created.
      await new Promise(resolve => setTimeout(resolve, 500)); // 0.5s delay

      await updateUserProfile(signUpData.user.id, {
        full_name: fullName,
        role_id: roleId || null,
        email: email // email is now on user_profiles table
      });
      
      return signUpData.user;
    },
    onSuccess: (user) => {
      refetchUserProfiles();
      toast({
        title: t('settings_users.add_user_success_title'),
        description: t('settings_users.add_user_success_desc', 'User {email} created successfully.').replace('{email}', user?.email || ''),
      });
      setIsAddUserModalOpen(false);
      addUserForm.reset();
    },
    onError: (error: any) => {
      toast({
        title: t('settings_users.add_user_error_title'),
        description: error.message || t('settings_users.add_user_error_desc'),
        variant: 'destructive',
      });
    },
  });

  const handleTemplateSubmit = (data: UserTemplateFormValues) => {
    const templateDataToSubmit: UserTemplateData = {
        template_name: data.template_name,
        description: data.description,
        default_role_id: data.default_role_id || null,
        permission_ids: data.permission_ids || [],
    };

    if (editingTemplate) {
      updateTemplateMutation.mutate({ templateId: editingTemplate.id, templateData: templateDataToSubmit });
    } else {
      addTemplateMutation.mutate(templateDataToSubmit);
    }
  };
  
  const onAddUserFormSubmit = (values: AddUserFormValues) => {
    addUserMutation.mutate(values);
  };

  const handleEditTemplate = (template: UserTemplate) => {
    setEditingTemplate(template);
    setIsAddTemplateModalOpen(true);
  }

  const handleDeleteTemplateConfirm = () => {
    if (templateToDelete) {
      deleteTemplateMutation.mutate(templateToDelete.id);
    }
  };

  if (rolesError) return <p>Error loading roles: {rolesError.message}</p>;
  if (permissionsError && !isLoadingPermissions) return <p>Error loading permissions: {permissionsError.message}</p>;
  if (templatesError) return <p>Error loading templates: {templatesError.message}</p>;


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
                  {isLoadingTemplates ? <Skeleton className="h-20 w-full" /> : userTemplates.length > 0 ? (
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
                        {userTemplates.map((template) => {
                          const role = roles.find(r => r.id === template.default_role_id);
                          return (
                            <TableRow key={template.id}>
                              <TableCell className="font-medium text-xs">{template.template_name}</TableCell>
                              <TableCell className="text-muted-foreground text-xs">{template.description || '-'}</TableCell>
                              <TableCell className="text-muted-foreground text-xs">{role ? role.name : '-'}</TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditTemplate(template)}>
                                  <Edit className={iconSize} />
                                </Button>
                               <AlertDialog open={!!templateToDelete && templateToDelete.id === template.id} onOpenChange={(open) => !open && setTemplateToDelete(null)}>
                                  <AlertDialogTrigger asChild>
                                       <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => setTemplateToDelete(template)}>
                                        <Trash2 className={iconSize} />
                                      </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                       <AlertDialogHeader>
                                          <AlertDialogTitle>{t('settings_users.delete_template_confirm_title')}</AlertDialogTitle>
                                          <AlertDialogDescription className="text-xs">
                                              {t('settings_users.delete_template_confirm_desc', 'Are you sure you want to delete the template "{name}"? This action cannot be undone.').replace('{name}', template.template_name)}
                                          </AlertDialogDescription>
                                       </AlertDialogHeader>
                                       <AlertDialogFooter>
                                          <AlertDialogCancel onClick={() => setTemplateToDelete(null)}>{t('settings_users.form_cancel_button')}</AlertDialogCancel>
                                          <AlertDialogAction
                                              className={buttonVariants({ variant: "destructive" })}
                                              onClick={handleDeleteTemplateConfirm}
                                              disabled={deleteTemplateMutation.isPending}
                                          >
                                              {deleteTemplateMutation.isPending && <Loader2 className={`mr-2 ${iconSize} animate-spin`}/>}
                                              {t('settings_users.form_delete_button')}
                                          </AlertDialogAction>
                                       </AlertDialogFooter>
                                  </AlertDialogContent>
                               </AlertDialog>
                              </TableCell>
                            </TableRow>
                          );
                        })}
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

            <Dialog open={isAddUserModalOpen} onOpenChange={setIsAddUserModalOpen}>
                <DialogTrigger asChild>
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                        <PlusCircle className={`mr-2 ${iconSize}`} /> {t('settings_users.add_user_button', 'Add User')}
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-sm">{t('settings_users.add_user_modal_title')}</DialogTitle>
                        <DialogDescriptionComponent className="text-xs">{t('settings_users.add_user_modal_desc')}</DialogDescriptionComponent>
                    </DialogHeader>
                    <Form {...addUserForm}>
                        <form onSubmit={addUserForm.handleSubmit(onAddUserFormSubmit)} className="space-y-4 py-4">
                            <FormField
                                control={addUserForm.control}
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('settings_users.form_fullname_label')}</FormLabel>
                                        <FormControl><Input placeholder={t('settings_users.form_fullname_placeholder')} {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={addUserForm.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('settings_users.form_email_label')}</FormLabel>
                                        <FormControl><Input type="email" placeholder={t('settings_users.form_email_placeholder')} {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={addUserForm.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('settings_users.form_password_label')}</FormLabel>
                                        <FormControl><Input type="password" placeholder={t('settings_users.form_password_placeholder')} {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={addUserForm.control}
                                name="roleId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('settings_users.form_role_label')}</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value || undefined} disabled={isLoadingRoles}>
                                            <FormControl><SelectTrigger><SelectValue placeholder={isLoadingRoles ? t('settings_users.loading_roles_placeholder') : t('settings_users.select_role_placeholder')} /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                <SelectItem value="">{t('settings_users.form_parent_none', 'None')}</SelectItem>
                                                {roles.map(role => (
                                                    <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="outline" disabled={addUserMutation.isPending}>{t('settings_users.form_cancel_button')}</Button>
                                </DialogClose>
                                <Button type="submit" disabled={addUserMutation.isPending}>
                                    {addUserMutation.isPending && <Loader2 className={`mr-2 ${iconSize} animate-spin`} />}
                                    {t('settings_users.form_create_user_button')}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">{t('settings_users.manage_users_title', 'Manage Users')}</CardTitle>
              <CardDescription className="text-xs">{t('settings_users.manage_users_desc', 'View, add, and manage system users and their permissions.')}</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoadingUserProfiles ? <Skeleton className="h-40 w-full" /> : userProfilesError ? <p className="text-destructive">Error: {userProfilesError.message}</p> : userProfiles.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-xs">Full Name</TableHead>
                                <TableHead className="text-xs">Email</TableHead>
                                <TableHead className="text-xs">Role</TableHead>
                                <TableHead className="text-xs text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {userProfiles.map(profile => (
                                <TableRow key={profile.id}>
                                    <TableCell className="text-xs">{profile.full_name || 'N/A'}</TableCell>
                                    <TableCell className="text-xs">{profile.email || 'N/A'}</TableCell>
                                    <TableCell className="text-xs">{profile.role?.name || 'No Role'}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toast({title: "Edit User (WIP)", description: `Editing user ${profile.full_name}`})}>
                                            <Edit className={iconSize} />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <p className="text-muted-foreground text-xs text-center py-4">
                        {t('settings_users.no_users_placeholder', 'No users found. Users are typically added via Supabase Auth and then appear here.')}
                    </p>
                )}
            </CardContent>
          </Card>
        </div>

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
                                name="template_name"
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
                                name="default_role_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('settings_users.template_form_role_label', 'Default Role (Optional)')}</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value || undefined} disabled={isLoadingRoles}>
                                            <FormControl><SelectTrigger><SelectValue placeholder={isLoadingRoles ? t("settings_users.loading_roles_placeholder", "Loading roles...") : t("settings_users.select_role_placeholder", "Select a role")} /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                <SelectItem value="">{t('settings_users.form_parent_none', 'None')}</SelectItem>
                                                {roles.map(role => (
                                                    <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
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
                                {isLoadingPermissions ? <Skeleton className="h-full w-full" /> : permissionGroups.map(group => (
                                    <div key={group} className="mb-3">
                                        <h3 className="text-xs font-semibold mb-1.5 text-muted-foreground">{t(`settings_users.permission_group_${group?.toLowerCase().replace(/\s+/g, '_') || 'other'}` as any, group || 'Other Permissions')}</h3>
                                        <div className="space-y-1.5 pl-2">
                                            {allPermissions.filter(p => (p.group_name || 'Other') === group).map(permission => (
                                                <FormField
                                                    key={permission.id}
                                                    control={templateForm.control}
                                                    name="permission_ids"
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
                                                            <FormLabel className="text-xs font-normal cursor-pointer">
                                                                {permission.description ? `${permission.slug} (${permission.description})` : permission.slug}
                                                            </FormLabel>
                                                        </FormItem>
                                                    )}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </ScrollArea>
                            <FormMessage>{templateForm.formState.errors.permission_ids?.message}</FormMessage>
                        </div>
                        
                        <DialogFooter className="md:col-span-3">
                            <DialogClose asChild>
                                <Button type="button" variant="outline" disabled={templateForm.formState.isSubmitting || addTemplateMutation.isPending || updateTemplateMutation.isPending}>{t('settings_users.form_cancel_button', 'Cancel')}</Button>
                            </DialogClose>
                            <Button type="submit" disabled={templateForm.formState.isSubmitting || addTemplateMutation.isPending || updateTemplateMutation.isPending}>
                                {(templateForm.formState.isSubmitting || addTemplateMutation.isPending || updateTemplateMutation.isPending) && <Loader2 className={`mr-2 ${iconSize} animate-spin`} />}
                                {editingTemplate ? t('settings_users.form_update_template_button', 'Update Template') : t('settings_users.form_save_template_button', 'Save Template')}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    </div>
  );
}

