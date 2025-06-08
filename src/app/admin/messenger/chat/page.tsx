
// src/app/admin/messenger/chat/page.tsx
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { MessageCircle, Send } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function MessengerChatPage() {
  const { t } = useLocale();
  const iconSize = "h-4 w-4";
  const smallIconSize = "h-3 w-3";

  return (
    <div className="flex flex-col h-full gap-6 p-2 md:p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold flex items-center gap-2">
          <MessageCircle className={`${smallIconSize} text-primary`} />
          {t('sidebar.messenger_chat', 'Messenger')}
        </h1>
        {/* Add action buttons here if needed, e.g., for starting new chat, status indicator */}
      </div>

      <Card className="flex-1 flex flex-col">
        <CardHeader className="border-b">
          <CardTitle className="text-sm">{t('messenger_chat.chat_interface_title', 'Chat Interface')}</CardTitle>
          <CardDescription className="text-xs">{t('messenger_chat.chat_interface_description', 'Interact with your messenger bot and view conversations.')}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-0 flex flex-col">
          <ScrollArea className="flex-grow p-4 space-y-4">
            {/* Placeholder for chat messages */}
            <div className="flex items-end gap-2">
              <div className="rounded-lg bg-muted p-3 max-w-[75%]">
                <p className="text-xs text-muted-foreground">{t('messenger_chat.bot_greeting', 'Hello! How can I help you today?')}</p>
              </div>
            </div>
            <div className="flex items-end gap-2 justify-end">
              <div className="rounded-lg bg-primary text-primary-foreground p-3 max-w-[75%]">
                <p className="text-xs">{t('messenger_chat.user_example_query', 'I need help with my internet plan.')}</p>
              </div>
            </div>
             <p className="text-xs text-muted-foreground text-center py-8">
            {t('messenger_chat.placeholder', 'Messenger chat interface will be here.')}
          </p>
          </ScrollArea>
          <div className="border-t p-4">
            <div className="flex items-center gap-2">
              <Input placeholder={t('messenger_chat.type_message_placeholder', 'Type your message...')}/>
              <Button size="icon">
                <Send className={iconSize} />
                <span className="sr-only">{t('messenger_chat.send_button_sr', 'Send')}</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
