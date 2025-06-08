
// src/app/admin/messenger/departments/page.tsx
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Users, PlusCircle } from 'lucide-react'; // Using Users icon for departments
import { useLocale } from '@/contexts/LocaleContext';
import { useToast } from '@/hooks/use-toast';

export default function MessengerDepartmentsPage() {
  const { t } = useLocale();
  const { toast } = useToast();
  const smallIconSize = "h-3 w-3";

  const handleAddDepartment = () => {
    toast({
      title: t('messenger_departments.add_department_title_toast', 'Add Department (Not Implemented)'),
      description: t('messenger_departments.add_department_desc_toast', 'Adding messenger departments is not yet implemented.'),
    });
  };

  return (
    <div className="flex flex-col gap-6 p-2 md:p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold flex items-center gap-2">
          <Users className={`${smallIconSize} text-primary`} />
          {t('sidebar.messenger_departments', 'Messenger Departments')}
        </h1>
        <Button onClick={handleAddDepartment}>
          <PlusCircle className={`mr-2 ${smallIconSize}`} />
          {t('messenger_departments.add_department_button', 'Add Department')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{t('messenger_departments.title', 'Manage Messenger Departments')}</CardTitle>
          <CardDescription className="text-xs">{t('messenger_departments.description', 'Define departments for routing conversations and assigning agents.')}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            {t('messenger_departments.placeholder', 'Department list and management tools will be displayed here. (Not Implemented)')}
          </p>
          {/* Placeholder for department list, add/edit/delete functionality */}
        </CardContent>
      </Card>
    </div>
  );
}
