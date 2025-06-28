// src/components/settings/users/ListUsers.tsx
'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Edit } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import type { UserProfile, Role } from '@/types/users';

interface ListUsersProps {
  userProfiles: UserProfile[];
  roles: Role[];
  isLoading: boolean;
  error?: string | null;
  onEditClick: (profile: UserProfile) => void;
}

export function ListUsers({
  userProfiles,
  roles,
  isLoading,
  error,
  onEditClick,
}: ListUsersProps) {
  const { t } = useLocale();
  const iconSize = 'h-3 w-3';

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-xs">{t('settings_users.user_table_fullname', 'Full Name')}</TableHead>
          <TableHead className="text-xs">{t('settings_users.user_table_email', 'Email')}</TableHead>
          <TableHead className="text-xs">{t('settings_users.user_table_role', 'Role')}</TableHead>
          <TableHead className="text-xs text-right">{t('settings_users.user_table_actions', 'Actions')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          Array.from({ length: 5 }).map((_, idx) => (
            <TableRow key={idx}>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell><Skeleton className="h-4 w-32" /></TableCell>
              <TableCell><Skeleton className="h-4 w-20" /></TableCell>
              <TableCell className="text-right"><Skeleton className="h-4 w-8 ml-auto" /></TableCell>
            </TableRow>
          ))
        ) : error ? (
          <TableRow>
            <TableCell colSpan={4} className="text-xs text-destructive text-center py-4">
              Error: {error}
            </TableCell>
          </TableRow>
        ) : userProfiles.length > 0 ? (
          userProfiles.map(profile => (
            <TableRow key={profile.id}>
              <TableCell className="text-xs">{profile.full_name || 'N/A'}</TableCell>
              <TableCell className="text-xs">{profile.email || 'N/A'}</TableCell>
              <TableCell className="text-xs">{profile.role?.name || t('settings_users.no_role_assigned')}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEditClick(profile)}>
                  <Edit className={iconSize} />
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} className="text-muted-foreground text-xs text-center py-4">
              {t('settings_users.no_users_placeholder', 'No users found. Users are typically added via Supabase Auth and then appear here.')}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
