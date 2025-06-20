// src/components/header/user-menu.tsx
'use client';

import * as React from 'react';
import { LogOut, User, UserCircle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/contexts/LocaleContext';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export function UserMenu() {
  const { t } = useLocale();
  const { toast } = useToast();
  const { logout } = useAuth();
  const smallIconSize = 'h-2.5 w-2.5';

  const handleProfileClick = () => {
    toast({
      title: t('header.profile_action_title', 'Profile'),
      description: t('header.profile_action_desc', 'Navigate to profile page (Not Implemented)'),
    });
  };

  const handleLogoutClick = async () => {
    toast({
      title: t('header.logout_action_title', 'Logout'),
      description: t('header.logout_action_desc', 'Logging out...'),
    });
    await logout();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t('header.profile')} className="text-foreground hover:bg-muted/50">
          <User className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="text-xs">{t('header.my_account')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleProfileClick} className="text-xs">
          <UserCircle className={`${smallIconSize} mr-2`} />
          <span>{t('header.profile_menu_item')}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={handleLogoutClick} className="text-xs">
          <LogOut className={`${smallIconSize} mr-2`} />
          <span>{t('header.logout_menu_item')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
