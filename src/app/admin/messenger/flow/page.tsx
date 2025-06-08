
// src/app/admin/messenger/flow/page.tsx
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Workflow, PlusCircle } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { useToast } from '@/hooks/use-toast';

export default function MessengerFlowPage() {
  const { t } = useLocale();
  const { toast } = useToast();
  const smallIconSize = "h-3 w-3";

  const handleAddFlow = () => {
    toast({
      title: t('messenger_flow.add_flow_title_toast', 'Add Flow (Not Implemented)'),
      description: t('messenger_flow.add_flow_desc_toast', 'Adding messenger flows is not yet implemented.'),
    });
  };

  return (
    <div className="flex flex-col gap-6 p-2 md:p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold flex items-center gap-2">
          <Workflow className={`${smallIconSize} text-primary`} />
          {t('sidebar.messenger_flow', 'Messenger Flows')}
        </h1>
        <Button onClick={handleAddFlow}>
          <PlusCircle className={`mr-2 ${smallIconSize}`} />
          {t('messenger_flow.add_flow_button', 'Add Flow')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{t('messenger_flow.title', 'Manage Messenger Flows')}</CardTitle>
          <CardDescription className="text-xs">{t('messenger_flow.description', 'Define and manage Genkit flows for your messenger bot.')}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            {t('messenger_flow.placeholder', 'Flow list and management tools will be displayed here. (Not Implemented)')}
          </p>
          {/* Placeholder for flow list, add/edit/delete functionality */}
        </CardContent>
      </Card>
    </div>
  );
}
