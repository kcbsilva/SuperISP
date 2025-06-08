
// src/app/admin/messenger/configure/page.tsx
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Settings2, Save } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { useToast } from '@/hooks/use-toast';

export default function MessengerConfigurePage() {
  const { t } = useLocale();
  const { toast } = useToast();
  const smallIconSize = "h-3 w-3";

  const handleSaveChanges = () => {
    toast({
      title: t('messenger_configure.save_changes_title_toast', 'Save Changes (Not Implemented)'),
      description: t('messenger_configure.save_changes_desc_toast', 'Saving messenger configuration is not yet implemented.'),
    });
  };

  return (
    <div className="flex flex-col gap-6 p-2 md:p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold flex items-center gap-2">
          <Settings2 className={`${smallIconSize} text-primary`} />
          {t('sidebar.messenger_configure', 'Configure Messenger')}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{t('messenger_configure.title', 'Messenger Bot Configuration')}</CardTitle>
          <CardDescription className="text-xs">{t('messenger_configure.description', 'Set up your AI-powered messenger bot, connect to platforms, and define behaviors.')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h3 className="text-sm font-medium mb-2">{t('messenger_configure.platform_integration_title', 'Platform Integrations')}</h3>
            <p className="text-xs text-muted-foreground">
              {t('messenger_configure.platform_integration_placeholder', 'Connect to WhatsApp, Telegram, Facebook Messenger, etc. (Not Implemented)')}
            </p>
            {/* Placeholder for platform connection toggles/buttons */}
          </section>

          <section>
            <h3 className="text-sm font-medium mb-2">{t('messenger_configure.ai_settings_title', 'AI & Behavior Settings')}</h3>
            <p className="text-xs text-muted-foreground">
              {t('messenger_configure.ai_settings_placeholder', 'Configure Genkit flows, prompts, and automated responses. (Not Implemented)')}
            </p>
            {/* Placeholder for AI model selection, prompt editor links, etc. */}
          </section>
          
           <section>
            <h3 className="text-sm font-medium mb-2">{t('messenger_configure.greeting_message_title', 'Greeting Message')}</h3>
            <p className="text-xs text-muted-foreground">
              {t('messenger_configure.greeting_message_placeholder', 'Set the initial message the bot sends to users. (Not Implemented)')}
            </p>
          </section>

          <div className="flex justify-end pt-4">
            <Button onClick={handleSaveChanges}>
              <Save className={`mr-2 ${smallIconSize}`} />
              {t('messenger_configure.save_changes_button', 'Save Changes')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
