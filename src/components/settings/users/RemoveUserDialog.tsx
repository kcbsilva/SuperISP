// src/components/settings/users/RemoveUserDialog.tsx
'use client';

import * as React from 'react';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { useLocale } from '@/contexts/LocaleContext';
import { useToast } from '@/hooks/use-toast';
import { deleteUserProfile } from '@/services/postgres/users';
import type { UserProfile } from '@/types/users';

interface RemoveUserDialogProps {
  user: UserProfile;
  onDeleted: () => void;
}

export function RemoveUserDialog({ user, onDeleted }: RemoveUserDialogProps) {
  const { t } = useLocale();
  const { toast } = useToast();
  const iconSize = 'h-3 w-3';

  const [open, setOpen] = React.useState(false);

  const deleteMutation = useMutation({
    mutationFn: async () => {
      return deleteUserProfile(user.id);
    },
    onSuccess: () => {
      toast({
        title: t('settings_users.delete_user_success_title', 'User deleted'),
        description: t('settings_users.delete_user_success_desc', 'The user was successfully deleted.'),
      });
      setOpen(false);
      onDeleted();
    },
    onError: (error: any) => {
      toast({
        title: t('settings_users.delete_user_error_title', 'Error'),
        description: error.message || t('settings_users.delete_user_error_desc'),
        variant: 'destructive',
      });
      setOpen(false);
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-destructive hover:text-destructive"
          onClick={() => setOpen(true)}
        >
          <Trash2 className={iconSize} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t('settings_users.delete_user_confirm_title', 'Delete User')}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs">
            {t('settings_users.delete_user_confirm_desc', 'Are you sure you want to delete {email}? This action cannot be undone.')
              .replace('{email}', user.email)}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('settings_users.form_cancel_button', 'Cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteMutation.mutate()}
            className="bg-destructive text-white hover:bg-destructive/90"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending && <Loader2 className={`mr-2 ${iconSize} animate-spin`} />}
            {t('settings_users.form_delete_button', 'Delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
