// src/app/admin/messenger/channels/page.tsx
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Radio, PlusCircle } from 'lucide-react'; // Using Radio icon for channels
import { useLocale } from '@/contexts/LocaleContext';
import { useToast } from '@/hooks/use-toast';

export default function MessengerChannelsPage() {
  const { t } = useLocale();
  const { toast } = useToast();
  const smallIconSize = "h-3 w-3";

  const handleAddChannel = () => {
    toast({
      title: t('messenger_channels.add_channel_title_toast', 'Add Channel (Not Implemented)'),
      description: t('messenger_channels.add_channel_desc_toast', 'Adding messenger channels is not yet implemented.'),
    });
  };

  return (
    <div className="flex flex-col gap-6 p-2 md:p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold flex items-center gap-2">
          <Radio className={`${smallIconSize} text-primary`} />
          {t('sidebar.messenger_channels', 'Messenger Channels')}
        </h1>
        <Button onClick={handleAddChannel}>
          <PlusCircle className={`mr-2 ${smallIconSize}`} />
          {t('messenger_channels.add_channel_button', 'Add Channel')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{t('messenger_channels.title', 'Manage Messenger Channels')}</CardTitle>
          <CardDescription className="text-xs">{t('messenger_channels.description', 'Configure and manage different communication channels (e.g., WhatsApp, Telegram, Web Chat).')}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            {t('messenger_channels.placeholder', 'Channel list and management tools will be displayed here. (Not Implemented)')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
