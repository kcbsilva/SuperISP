// src/components/settings/users/AddUserModal.tsx
'use client';

import * as React from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription as DialogDescriptionComponent,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, PlusCircle } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { useToast } from '@/hooks/use-toast';
import { useLocale } from '@/contexts/LocaleContext';
import { useMutation } from '@tanstack/react-query';
import { createUser } from '@/services/postgres/users';
import type { Role } from '@/types/users';

const addUserFormSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  confirmPassword: z.string().min(1, "Please confirm your password."),
  fullName: z.string().min(1, "Full name is required."),
  roleId: z.string().uuid("Invalid role ID.").nullable().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
type AddUserFormValues = z.infer<typeof addUserFormSchema>;

interface AddUserModalProps {
  roles: Role[];
  isLoadingRoles: boolean;
  onSuccess: () => void;
}

export function AddUserModal({
  roles,
  isLoadingRoles,
  onSuccess,
}: AddUserModalProps) {
  const { t } = useLocale();
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const iconSize = 'h-3 w-3';

  const form = useForm<AddUserFormValues>({
    resolver: zodResolver(addUserFormSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      roleId: null,
    },
  });

  const addUserMutation = useMutation({
    mutationFn: async (userData: AddUserFormValues) => {
      const { email, password, fullName, roleId } = userData;
      return createUser({
        email,
        password,
        full_name: fullName,
        role_id: roleId || null,
      });
    },
    onSuccess: (user) => {
      toast({
        title: t('settings_users.add_user_success_title'),
        description: t('settings_users.add_user_success_desc', 'User {email} created successfully.').replace('{email}', user?.email || ''),
      });
      form.reset();
      setOpen(false);
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: t('settings_users.add_user_error_title'),
        description: error.message || t('settings_users.add_user_error_desc'),
        variant: 'destructive',
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit((values) => addUserMutation.mutate(values))} className="space-y-4 py-4">
            <FormField
              control={form.control}
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
              control={form.control}
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
              control={form.control}
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
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('settings_users.form_confirm_password_label')}</FormLabel>
                  <FormControl><Input type="password" placeholder={t('settings_users.form_confirm_password_placeholder')} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="roleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('settings_users.form_role_label')}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || undefined} disabled={isLoadingRoles}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingRoles ? t('settings_users.loading_roles_placeholder') : t('settings_users.select_role_placeholder')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
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
                <Button type="button" variant="outline" disabled={addUserMutation.isPending}>
                  {t('settings_users.form_cancel_button')}
                </Button>
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
  );
}
