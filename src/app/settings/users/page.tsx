// src/app/settings/users/page.tsx
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { useToast } from '@/hooks/use-toast';

export default function UsersPage() {
  const { t } = useLocale();
  const { toast } = useToast();
  const iconSize = "h-3 w-3";

  const handleAddUser = () => {
    toast({
      title: t('settings_users.add_user_toast_title', 'Add User (Not Implemented)'),
      description: t('settings_users.add_user_toast_desc', 'Functionality to add new users is not yet implemented.'),
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold">{t('sidebar.settings_users', 'Users')}</h1>
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
  );
}
