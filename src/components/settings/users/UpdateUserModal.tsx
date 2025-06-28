// src/components/settings/users/UpdateUserModal.tsx
'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription as DialogDescriptionComponent,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
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
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { useToast } from '@/hooks/use-toast';
import { useLocale } from '@/contexts/LocaleContext';
import { useMutation } from '@tanstack/react-query';
import { updateUserProfile } from '@/services/postgres/users';
import type { Role, UserProfile } from '@/types/users';

const editUserFormSchema = z.object({
  fullName: z.string().min(1, 'Full name is required.'),
  roleId: z.string().uuid('Invalid role ID.').nullable().optional(),
});
type EditUserFormValues = z.infer<typeof editUserFormSchema>;

interface UpdateUserModalProps {
  roles: Role[];
  isLoadingRoles: boolean;
  userProfile: UserProfile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function UpdateUserModal({
  roles,
  isLoadingRoles,
  userProfile,
  open,
  onOpenChange,
  onSuccess,
}: UpdateUserModalProps) {
  const { t } = useLocale();
  const { toast } = useToast();
  const iconSize = 'h-3 w-3';

  const form = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserFormSchema),
    defaultValues: {
      fullName: '',
      roleId: null,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: { userId: string; profileData: EditUserFormValues }) =>
      updateUserProfile(data.userId, data.profileData),
    onSuccess: () => {
      toast({
        title: t('settings_users.update_user_success_title'),
        description: t('settings_users.update_user_success_desc', 'User profile for {name} updated.').replace('{name}', form.getValues('fullName')),
      });
      onOpenChange(false);
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: t('settings_users.update_user_error_title'),
        description: error.message || t('settings_users.update_user_error_desc'),
        variant: 'destructive',
      });
    },
  });

  React.useEffect(() => {
    if (open && userProfile) {
      form.reset({
        fullName: userProfile.full_name || '',
        roleId: userProfile.role_id || null,
      });
    }
  }, [open, userProfile, form]);

  if (!userProfile) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-sm">{t('settings_users.edit_user_modal_title')}</DialogTitle>
          <DialogDescriptionComponent className="text-xs">
            {t('settings_users.edit_user_modal_desc', 'Update user details for {email}. Email and password cannot be changed here.').replace('{email}', userProfile.email)}
          </DialogDescriptionComponent>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => mutation.mutate({ userId: userProfile.id, profileData: values }))}
            className="space-y-4 py-4"
          >
            <FormItem>
              <FormLabel>{t('settings_users.form_email_label')}</FormLabel>
              <FormControl>
                <Input type="email" value={userProfile.email} disabled className="bg-muted" />
              </FormControl>
            </FormItem>
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('settings_users.form_fullname_label')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('settings_users.form_fullname_placeholder')} {...field} />
                  </FormControl>
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
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || undefined}
                    disabled={isLoadingRoles}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            isLoadingRoles
                              ? t('settings_users.loading_roles_placeholder')
                              : t('settings_users.select_role_placeholder')
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={mutation.isPending}>
                  {t('settings_users.form_cancel_button')}
                </Button>
              </DialogClose>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending && <Loader2 className={`mr-2 ${iconSize} animate-spin`} />}
                {t('settings_users.form_update_user_button')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
